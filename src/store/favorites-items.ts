import { fetchPlace } from '../places.js';
import { isEmptyObject } from '../helpers/is-empty.js';
import { FavoritesItemsKey, FavoritesAmountKey } from '../types/types.js';
import { renderUserBlock, getUserData } from '../user.js';

export interface IFavoriteItem {
  id: number;
  name: string;
  image: string;
}

export interface IFavoriteItemsStore {
  [key: string]: IFavoriteItem;
}

export function isIFavoriteItem(object: unknown): object is IFavoriteItem {
  if (object != null && typeof object === 'object') {
    return 'id' in object && 'name' in object && 'image' in object;
  }
  return false;
}

export function isIFavoriteItemsStore(
  object: unknown
): object is IFavoriteItemsStore {
  if (isEmptyObject(object)) return true;

  if (object != null && typeof object === 'object') {
    const keys = Object.keys(object);
    for (const key of keys) {
      if (!isIFavoriteItem(object[key])) return false;
    }
    return true;
  }
  return false;
}

export function getFavoritesItems(): IFavoriteItemsStore | null {
  const key: FavoritesItemsKey = 'favoriteItems';
  const storageValue = localStorage.getItem(key);

  if (storageValue == null) return;

  const favoriteItems: unknown = JSON.parse(storageValue);

  if (isIFavoriteItemsStore(favoriteItems)) return favoriteItems;
}

export function getFavoritesItemsCount(): number | null {
  const key: FavoritesItemsKey = 'favoriteItems';
  const storageValue = localStorage.getItem(key);
  if (storageValue == null) return;

  const favoriteItems: unknown = JSON.parse(storageValue);

  if (isIFavoriteItemsStore(favoriteItems)) {
    return Object.keys(favoriteItems).length;
  }
}

export async function addFavoriteItem(
  targetId: string,
  store: IFavoriteItemsStore
): Promise<void> {
  const key: FavoritesItemsKey = 'favoriteItems';
  const matchResult = targetId.match(/\d*$/);

  if (matchResult != null && matchResult[0] !== '') {
    const placeId = Number(matchResult[0]);
    const { id, name, image } = await fetchPlace(placeId);
    store[targetId] = {
      id,
      name,
      image,
    };
    localStorage.setItem(key, JSON.stringify(store));
  }
}

export function removeFavoriteItem(
  targetId: string,
  store: IFavoriteItemsStore
) {
  const key: FavoritesItemsKey = 'favoriteItems';
  delete store[targetId];
  localStorage.setItem(key, JSON.stringify(store));
}

export function isFavoriteItem(id: string): boolean {
  const store = getFavoritesItems();
  if (store[id] != null) return true;
  return false;
}

export function getFavoritesItemsAmount(): number | null {
  const key: FavoritesAmountKey = 'favoritesAmount';
  const storageValue = localStorage.getItem(key);
  const favoriteAmount: unknown =
    storageValue != null && JSON.parse(storageValue);

  if (typeof favoriteAmount === 'number' && !isNaN(favoriteAmount))
    return favoriteAmount;
}

export function updateFavoritesItemsAmount(): void {
  const keyAmount: FavoritesAmountKey = 'favoritesAmount';
  const favoriteItemsCount = getFavoritesItemsCount();
  const { username, avatarUrl } = getUserData();
  localStorage.setItem(keyAmount, JSON.stringify(favoriteItemsCount));

  renderUserBlock(username, avatarUrl, favoriteItemsCount);
}
