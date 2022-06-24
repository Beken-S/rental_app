import { Params } from '../params.js';

export enum Methods {
  GET,
  POST,
  PATCH,
}
export const API = 'http://localhost:3030';
export const PLACES = '/places';
export const PLACE_WITH_PARAMS = (
  params: Params<number | string, number | string>
) => {
  return `${API}${PLACES}${params.queryString}`;
};
export const PLACE_BY_ID = (
  id: number,
  params?: Params<number | string, number | string>
) => {
  return `${API}${PLACES}/${id}${params != null ? params.queryString : ''}`;
};
