export interface BookFilter {
  checkInDate: Date;
  checkOutDate: Date;
}

export function isBookFilter(object: unknown): object is BookFilter {
  const fields = ['checkInDate', 'checkOutDate'];

  if (typeof object === 'object') {
    return fields.every((field) => field in object);
  }

  return false;
}
