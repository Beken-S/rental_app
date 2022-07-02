export interface Place {
  id: number;
  name: string;
  description: string;
  bookedDates: number[];
  price: number;
  image: string;
  remoteness: number;
}

export function isPlace(object: unknown): object is Place {
  const fields = [
    'id',
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

export function isPlaceArray(array: unknown): array is Place[] {
  if (Array.isArray(array)) {
    return array.every((item) => isPlace(item));
  }

  return false;
}
