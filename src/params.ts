export class Params<
  K extends number | string,
  V extends number | string
> extends Map<K, V> {
  constructor() {
    super();
  }

  get queryString(): string {
    const params = super.entries();
    const paramStrings: string[] = [];

    for (const [key, value] of params) {
      paramStrings.push(`${key}=${value}`);
    }

    return `?${paramStrings.join('&')}`;
  }
}
