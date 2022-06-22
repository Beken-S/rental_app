import {
  getFavoritesItems,
  addFavoriteItem,
  removeFavoriteItem,
  updateFavoritesItemsAmount,
} from './store/favorites-items.js';
import { Active } from './types/types.js';

export async function toggleFavorite(event: Event): Promise<void> {
  const target = event.target;
  const toggleClass: Active = 'active';

  if (!(target instanceof Element)) return;

  const store = getFavoritesItems();
  if (store == null) {
    await addFavoriteItem(target.id, {});
    target.classList.add(toggleClass);
    updateFavoritesItemsAmount();
  } else if (store[target.id] != null) {
    removeFavoriteItem(target.id, store);
    target.classList.remove(toggleClass);
    updateFavoritesItemsAmount();
  } else {
    await addFavoriteItem(target.id, store);
    target.classList.add(toggleClass);
    updateFavoritesItemsAmount();
  }
}
