export abstract class HTTPHelper {
  public static async fetchAsJson<Response>(
    input: RequestInfo,
    init?: RequestInit
  ): Promise<Response | Error> {
    try {
      const response = await fetch(input, init);

      if (!response.ok) {
        const errorMessage = await response.text();
        return new Error(errorMessage);
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.error(error);
    }
  }
  public static getQueryString(params: object) {
    return (
      '?' +
      Object.keys(params)
        .map((key) => `${key}=${params[key]}`)
        .join('&')
    );
  }
}
