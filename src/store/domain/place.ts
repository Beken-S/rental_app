export class Place {
  constructor(
    private readonly provider: string,
    public readonly originalId: string,
    public readonly name: string,
    public readonly description: string,
    public readonly bookedDates: number[],
    public readonly price: number,
    public readonly image: string,
    public readonly remoteness: number
  ) {}

  get id() {
    return `${this.provider}-${this.originalId}`;
  }

  public isProviderBy(providerName: string): boolean {
    return this.provider === providerName;
  }
}

export interface IPlace {
  provider: string;
  originalId: string;
  name: string;
  description: string;
  bookedDates: number[];
  price: number;
  image: string;
  remoteness: number;
}

export function isIPlace(object: unknown): object is IPlace {
  const fields = [
    'provider',
    'originalId',
    'name',
    'description',
    'bookedDates',
    'price',
    'image',
    'remoteness',
  ];

  if (typeof object === 'object') {
    return fields.every((field) => field in object);
  }

  return false;
}
