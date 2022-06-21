import { FIND_PLACE } from './API/index.js';
import { Params } from './params.js';

export interface IPlace {
  image: string;
  name: string;
  price: number;
  description: string;
  remoteness: number;
  bookedDates: number[];
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

    const response = await fetch(FIND_PLACE(params), {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    });

    if (!response.ok)
      throw new Error(
        `Something went wrong. Response status:${response.status}`
      );

    const data = (await response.json()) as IPlace[];
    return data;
  } catch (error) {
    console.error(error);
  }
}
