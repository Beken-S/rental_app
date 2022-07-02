import { Place } from './place.js';
import { SearchFilter } from './search-filter.js';
import { BookResponse } from './book-response.js';
import { BookFilter } from './book-filter.js';

export interface Provider {
  get(id: string): Promise<Place>;
  search(filter: SearchFilter): Promise<Place[]>;
  book(id: string, filter: BookFilter): Promise<BookResponse>;
}
