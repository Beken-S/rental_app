export interface SearchFilter {
  checkInDate: Date;
  checkOutDate: Date;
  priceLimit?: number;
  city?: string;
  coordinates?: string;
}

export function isSearchFilter(object: unknown): object is SearchFilter {
  const fields = ['coordinates', 'checkInDate', 'checkOutDate'];

  if (typeof object === 'object' && object != null) {
    return fields.every((field) => field in object);
  }

  return false;
}
