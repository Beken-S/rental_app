export interface IPlace {
  id: string;
  name: string;
  description: string;
  bookedDates: number[];
  price: number;
  image: string;
  source?: string;
  remoteness?: number;
}

export function isIPlace(object: unknown): object is IPlace {
  if (object != null && typeof object === 'object') {
    const fields = [
      'id',
      'name',
      'description',
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

export function isIPlaceArray(array: unknown): array is IPlace[] {
  if (Array.isArray(array)) {
    return array.every((item) => isIPlace(item));
  }
  return false;
}
