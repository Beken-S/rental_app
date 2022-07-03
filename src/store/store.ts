import { Place, isIPlace } from './domain/place.js';
import { User } from './domain/user.js';

export interface FavoriteItems {
  [key: string]: Place;
}

export class Store {
  private _favoriteAmount = 0;
  private _favoriteItems: FavoriteItems = {};
  private _searchResult: Place[] = [];

  constructor(private _user: User) {
    this.readFavoriteItemsFromLocalStorage();
    this.updateFavoriteAmount();
    localStorage.setItem('user', JSON.stringify(this._user));
  }

  public get user(): User {
    return this._user;
  }

  public get favoriteItems(): FavoriteItems {
    return this._favoriteItems;
  }

  public set favoriteItems(items: FavoriteItems) {
    this._favoriteItems = items;
    this.updateFavoriteAmount();
    localStorage.setItem('favoriteItems', JSON.stringify(this._favoriteItems));
  }

  public get favoriteAmount(): number {
    return this._favoriteAmount;
  }

  public addFavoriteItems(place: Place) {
    this._favoriteItems = { ...this._favoriteItems, [place.id]: place };
    this.updateFavoriteAmount();
    localStorage.setItem('favoriteItems', JSON.stringify(this._favoriteItems));
  }

  public removeFavoriteItem(id: string) {
    delete this._favoriteItems[id];
    this.updateFavoriteAmount();
    localStorage.setItem('favoriteItems', JSON.stringify(this._favoriteItems));
  }

  private updateFavoriteAmount() {
    this._favoriteAmount = Object.keys(this._favoriteItems).length;
    localStorage.setItem(
      'favoriteAmount',
      JSON.stringify(this._favoriteAmount)
    );
  }

  private readFavoriteItemsFromLocalStorage(): void {
    const storageItem = localStorage.getItem('favoriteItems');

    if (storageItem == null) return;

    const favoriteItems = JSON.parse(storageItem);

    if (favoriteItems != null && typeof favoriteItems == 'object') {
      const acc: FavoriteItems = {};

      this._favoriteItems = Object.keys(favoriteItems).reduce((acc, key) => {
        const item = favoriteItems[key];

        if (isIPlace(item)) {
          const {
            provider,
            originalId,
            name,
            description,
            bookedDates,
            price,
            image,
            remoteness,
          } = item;

          const place = new Place(
            provider,
            originalId,
            name,
            description,
            bookedDates,
            price,
            image,
            remoteness
          );
          acc[place.id] = place;
        }
        return acc;
      }, acc);
    } else {
      this._favoriteItems = {};
      localStorage.setItem(
        'favoriteItems',
        JSON.stringify(this._favoriteItems)
      );
    }
  }

  public get searchResult(): Place[] {
    return this._searchResult;
  }

  public set searchResult(places: Place[]) {
    this._searchResult = places;
  }

  public sortSearchResultByDescendingPrice() {
    this._searchResult = this._searchResult.sort((a, b) => {
      if (a.price < b.price) return 1;
      if (a.price > b.price) return -1;
      return 0;
    });
  }

  public sortSearchResultByAscendingPrice() {
    this._searchResult = this._searchResult.sort((a, b) => {
      if (a.price < b.price) return -1;
      if (a.price > b.price) return 1;
      return 0;
    });
  }

  public sortSearchResultByCloser() {
    this._searchResult = this._searchResult.sort((a, b) => {
      if (a.remoteness < b.remoteness) return -1;
      if (a.remoteness > b.remoteness) return 1;
      return 0;
    });
  }
}

export const store = new Store({
  username: 'Test',
  avatarUrl: '/img/avatar.png',
});
