import { Params } from '../params.js';

export const API = 'http://localhost:3030';
export const PLACES = '/places';
export const FIND_PLACE = (
  params: Params<number | string, number | string>
) => {
  return `${API}${PLACES}${params.queryString}`;
};
