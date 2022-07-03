import { BookFilter } from '../../domain/book-filter.js';
import { BookResponse } from '../../domain/book-response.js';
import { Place } from '../../domain/place.js';
import { Provider } from '../../domain/provider.js';
import { SearchFilter } from '../../domain/search-filter.js';
import {
  Coordinates,
  FlatRentSdk,
  IFlatRentSearchParameters,
  IFormattedFlatRentPlace,
} from './flat-rent-sdk.js';

export class FlatRentProvider implements Provider {
  public static provider = 'flatRent';
  private static sdk = new FlatRentSdk();

  constructor(private readonly coordinates: Coordinates) {}

  public async get(id: string): Promise<Place | void> {
    try {
      const response = await FlatRentProvider.sdk.get(id);

      if (response == null) {
        throw new Error(`No place found with this id=${id}`);
      }

      return this._convertToPlace(response);
    } catch (error) {
      console.error(error);
    }
  }

  public async search(filter: SearchFilter): Promise<Place[]> {
    try {
      const parameters = this._convertToIFlatRentSearchParameters(filter);

      if (parameters == null) throw new Error('Wrong parameters.');

      const response = await FlatRentProvider.sdk.search(parameters);

      if (response instanceof Error) throw response;

      return response.map((item) => this._convertToPlace(item));
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  public async book(id: string, filter: BookFilter): Promise<BookResponse> {
    try {
      const { checkInDate, checkOutDate } = filter;
      await FlatRentProvider.sdk.book(id, checkInDate, checkOutDate);

      return BookResponse.success;
    } catch (error) {
      return BookResponse.failure;
    }
  }

  private _convertToPlace(flatRentPlace: IFormattedFlatRentPlace): Place {
    const { id, title, details, bookedDates, photos, coordinates, totalPrice } =
      flatRentPlace;

    const image = photos[0] != null ? photos[0] : '';

    return new Place(
      FlatRentProvider.provider,
      id,
      title,
      details,
      bookedDates,
      totalPrice,
      image,
      this._calcRemoteness(coordinates)
    );
  }

  private _convertToIFlatRentSearchParameters(
    filter: SearchFilter
  ): IFlatRentSearchParameters | void {
    try {
      const { city, checkInDate, checkOutDate, priceLimit } = filter;

      if (city == null) throw new Error('Missing city field.');

      const searchParameters: IFlatRentSearchParameters = {
        city,
        checkInDate,
        checkOutDate,
      };

      if (priceLimit != null) filter.priceLimit = priceLimit;

      return searchParameters;
    } catch (error) {
      console.error(error);
    }
  }

  private _calcRemoteness(coordinates: Coordinates): number {
    const EARTH_RADIUS = 6372795;

    // Координаты точек в радианах
    const lat1 = (this.coordinates[0] * Math.PI) / 180;
    const long1 = (this.coordinates[1] * Math.PI) / 180;
    const lat2 = (coordinates[0] * Math.PI) / 180;
    const long2 = (coordinates[1] * Math.PI) / 180;

    // Косинусы и синусу и разница долгот
    const deltaLong = long1 - long2;
    const cosLat1 = Math.cos(lat1);
    const cosLat2 = Math.cos(lat2);
    const sinLat1 = Math.sin(lat1);
    const sinLat2 = Math.sin(lat2);
    const cosDeltaLong = Math.cos(deltaLong);
    const sinDeltaLong = Math.sin(deltaLong);

    // Вычисления длины большого круга
    const y = Math.sqrt(
      Math.pow(cosLat2 * sinDeltaLong, 2) +
        Math.pow(cosLat1 * sinLat2 - cosLat2 * sinLat1 * cosDeltaLong, 2)
    );
    const x = sinLat1 * sinLat2 + cosLat1 * cosLat2 * cosDeltaLong;
    const ad = Math.atan2(y, x);
    const remoteness = (ad * EARTH_RADIUS) / 1000;

    return Number(remoteness.toFixed(2));
  }
}
