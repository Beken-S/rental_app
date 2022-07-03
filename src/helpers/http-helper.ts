import { Filter } from '../store/domain/filter';

export abstract class HTTPHelper {
  public static async fetchAsJson<Response>(
    input: RequestInfo,
    init?: RequestInit
  ): Promise<Response | Error> {
    try {
      const response = await fetch(input, init);

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      const data = await response.json();

      return data;
    } catch (error) {
      if (error instanceof Error) return error;
      return new Error(`Unknown error: ${error}`);
    }
  }
  public static getQueryString(params: Filter<string | number | undefined>) {
    return (
      '?' +
      Object.keys(params)
        .map((key) => {
          return params[key] != undefined ? `${key}=${params[key]}` : '';
        })
        .join('&')
    );
  }
}
