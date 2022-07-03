import { Coordinates } from '../store/providers/flat-rent-sdk/flat-rent-sdk';

export function getCoordinates(coordinates: string): Coordinates | null {
  const result = coordinates.split(',').map((coordinate) => Number(coordinate));
  if (result.length === 2) {
    const coordinate1 = result[0];
    const coordinate2 = result[1];
    if (coordinate1 != null && coordinate2 != null) {
      return [coordinate1, coordinate2];
    }
  }
  return null;
}
