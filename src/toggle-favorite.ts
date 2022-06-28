import { ISource } from './sources.js';
import {
  getFavoritesItems,
  addFavoriteItem,
  removeFavoriteItem,
  updateFavoritesItemsAmount,
} from './store/favorites-items.js';
import { Active } from './types/types.js';

export async function toggleFavorite(
  event: Event,
  sources: ISource[]
): Promise<void> {
  const target = event.target;
  const toggleClass: Active = 'active';

  if (!(target instanceof Element)) return;

  const store = getFavoritesItems();
  if (store == null) {
    await addFavoriteItem(target.id, {}, sources);
    target.classList.add(toggleClass);
    updateFavoritesItemsAmount();
  } else if (store[target.id] != null) {
    removeFavoriteItem(target.id, store);
    target.classList.remove(toggleClass);
    updateFavoritesItemsAmount();
  } else {
    await addFavoriteItem(target.id, store, sources);
    target.classList.add(toggleClass);
    updateFavoritesItemsAmount();
  }
}
