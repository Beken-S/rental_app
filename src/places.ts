import { PLACE_WITH_PARAMS, PLACE_BY_ID } from './API/index.js';
import { Params } from './params.js';
import { checkResponseOk } from './helpers/check-response-ok.js';

export interface IPlace {
  id: number;
  name: string;
  description: string;
  remoteness: number;
  bookedDates: number[];
  price: number;
  image: string;
}

export function isIPlace(object: unknown): object is IPlace {
  if (object != null && typeof object === 'object') {
    const fields = [
      'id',
      'name',
      'description',
      'remoteness',
      'bookedDates',
      'price',
      'image',
    ];
    let isIPlace = true;
    fields.forEach((field) => {
      if (!(field in object)) isIPlace = false;
    });
    return isIPlace;
  }
}

export interface IShowPlace {
  (error?: Error, places?: IPlace[]): void;
}

export function showPlace(error?: Error, places?: IPlace[]): void {
  if (error == null && places != null) {
    console.log(places);
  } else {
    console.error(error);
  }
}

export async function fetchFoundPlaces(
  coordinates: string,
  checkInDate: number,
  checkOutDate: number,
  maxPrice?: number
): Promise<IPlace[]> {
  try {
    const params = new Params();

    params.set('coordinates', coordinates);
    params.set('checkInDate', checkInDate);
    params.set('checkOutDate', checkOutDate);
    maxPrice != null && params.set('maxPrice', maxPrice);

    const response = await fetch(PLACE_WITH_PARAMS(params));

    checkResponseOk(response);

    const data = (await response.json()) as IPlace[];
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function fetchPlace(id: number): Promise<IPlace> {
  try {
    const response = await fetch(PLACE_BY_ID(id));

    checkResponseOk(response);

    const data = await response.json();

    if (isIPlace(data)) return data;

    throw new Error(`Type is not Place. Received data: ${data}`);
  } catch (error) {
    console.error(error);
  }
}

export async function fetchBookPlace(
  id: number,
  checkInDate: number,
  checkOutDate: number
): Promise<IPlace | null> {
  try {
    const params = new Params();

    params.set('checkInDate', checkInDate);
    params.set('checkOutDate', checkOutDate);
    const response = await fetch(PLACE_BY_ID(id, params), {
      method: 'PATCH',
    });

    if (!response.ok) return;

    const data = await response.json();

    if (isIPlace(data)) return data;

    throw new Error(`Type is not Place. Received data: ${data}`);
  } catch (error) {
    console.log(error);
  }
}
