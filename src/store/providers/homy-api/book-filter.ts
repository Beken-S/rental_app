import { Filter } from '../../domain/filter';

export interface BookFilter extends Filter<string | number> {
  checkInDate: number;
  checkOutDate: number;
}
