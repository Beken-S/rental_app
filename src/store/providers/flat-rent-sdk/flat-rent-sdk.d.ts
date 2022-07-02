export type Coordinates = [number, number];
export type BackendPort = 3040;
export type FlatRentDBLocalStorageKey = 'flat-rent-db';

export function cloneDate(date: Date): Date;
export function addDays(data: Date, days: number);

export interface IFlatRentPlace {
  id: string;
  title: string;
  details: string;
  photos: string[];
  coordinates: Coordinates;
  bookedDates: number[];
  price: number;
}

export interface IFormattedFlatRentPlace extends Omit<IFlatRentPlace, 'price'> {
  totalPrice: number;
}

export interface IFlatRentSearchParameters {
  city: string;
  checkInDate: Date;
  checkOutDate: Date;
  priceLimit: number;
}

export class FlatRentSdk {
  public get(id: string): Promise<IFormattedFlatRentPlace | null>;
  public search(
    parameters: IFlatRentSearchParameters
  ): Promise<IFormattedFlatRentPlace[] | Error>;
  public book(
    flatId: string,
    checkInDate: Date,
    checkOutDate: Date
  ): Promise<number | Error>;
  private _assertDatesAreCorrect(checkInDate: Date, checkOutDate: Date): void;
  private _resetTime(data: Date): void;
  private _calculateDifferenceInDays(startDate: Date, endDate: Date): number;
  private _generateDateRange(from: Date, to: Date): Date[];
  private _generateTransactionId(): number;
  private _areAllDatesAvailable(
    flat: IFlatRentPlace,
    dateRange: Date[]
  ): boolean;
  private _formatFlatObject(
    flat: IFlatRentPlace,
    nightNumber: number
  ): IFormattedFlatRentPlace;
  private _readDatabase(): IFlatRentPlace[] | null;
  private _writeDatabase(database: IFlatRentPlace[]): void;
  private _syncDatabase(database: IFlatRentPlace[]): void;
}
