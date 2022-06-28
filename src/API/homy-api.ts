import { Params } from '../params.js';
import { IPlace, isIPlace, isIPlaceArray } from '../places.js';

export type SourceHomyAPI = 'Homy-API';

export interface HomyAPISearchParameters {
  coordinates: string;
  checkInDate: number;
  checkOutDate: number;
  maxPrice?: number;
}

export class HomyAPI {
  _API_URL = 'http://localhost:3030';
  _PLACES = '/places';

  private _getUrlPlaceWithParams(
    params: Params<number | string, number | string>
  ): string {
    return `${this._API_URL}${this._PLACES}${params.queryString}`;
  }

  private _getUrlPlaceById(
    id: string,
    params?: Params<number | string, number | string>
  ): string {
    return `${this._API_URL}${this._PLACES}/${id}${
      params != null ? params.queryString : ''
    }`;
  }

  private _checkResponse(response: Response): void {
    if (!response.ok)
      throw new Error(
        `Something went wrong. Response status:${response.status}`
      );
  }

  private _addSource(data: IPlace | IPlace[]): void {
    const source: SourceHomyAPI = 'Homy-API';

    if (Array.isArray(data)) {
      data.forEach((item) => (item.source = source));
    } else {
      data.source = source;
    }
  }

  async get(id: string): Promise<IPlace | Error> {
    try {
      const response = await fetch(this._getUrlPlaceById(id));

      this._checkResponse(response);

      const data = await response.json();

      if (!isIPlace(data)) {
        return new Error(`Type is not Place. Received data: ${data}`);
      }

      this._addSource(data);

      return data;
    } catch (error) {
      console.error(error);
    }
  }

  async search(parameters: HomyAPISearchParameters): Promise<IPlace[] | Error> {
    try {
      const params = new Params();

      Object.keys(parameters).forEach((key) =>
        params.set(key, parameters[key])
      );

      const response = await fetch(this._getUrlPlaceWithParams(params));

      this._checkResponse(response);

      const data = await response.json();

      if (!isIPlaceArray(data)) {
        return new Error(`Type is not Place. Received data: ${data}`);
      }

      this._addSource(data);

      return data;
    } catch (error) {
      console.error(error);
    }
  }

  async book(
    id: string,
    checkInDate: number,
    checkOutDate: number
  ): Promise<IPlace | Error> {
    try {
      const params = new Params();

      params.set('checkInDate', checkInDate);
      params.set('checkOutDate', checkOutDate);
      const response = await fetch(this._getUrlPlaceById(id, params), {
        method: 'PATCH',
      });

      this._checkResponse(response);

      const data = await response.json();

      if (!isIPlace(data)) {
        return new Error(`Type is not Place. Received data: ${data}`);
      }

      this._addSource(data);

      return data;
    } catch (error) {
      console.log(error);
    }
  }
}
