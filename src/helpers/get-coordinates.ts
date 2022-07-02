import { Coordinates } from '../store/providers/flat-rent-sdk/flat-rent-sdk';

export function getCoordinates(coordinates: string): Coordinates | null {
  const result = coordinates.split(',').map((coordinate) => Number(coordinate));
  if (result.length === 2 && result.every((coordinate) => !isNaN(coordinate))) {
    return [result[0], result[1]];
  }
}
