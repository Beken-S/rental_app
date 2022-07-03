import { Place } from './place.js';
import { SearchFilter } from './search-filter.js';
import { BookResponse } from './book-response.js';

export interface Provider {
  get(id: string): Promise<Place | void>;
  search(filter: SearchFilter): Promise<Place[]>;
  book(id: string, filter: SearchFilter): Promise<BookResponse>;
}
