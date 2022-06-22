import { renderSearchFormBlock, searchPlaceHandler } from './search-form.js';
import { renderSearchStubBlock } from './search-results.js';
import { renderUserBlock, getUserData } from './user.js';
import { renderToast } from './lib.js';
import { getFavoritesItemsAmount } from './store/favorites-items.js';

localStorage.setItem(
  'user',
  JSON.stringify({ username: 'test', avatarUrl: '/img/avatar.png' })
);

window.addEventListener('DOMContentLoaded', () => {
  const { username, avatarUrl } = getUserData();
  const favoriteItemsAmount = getFavoritesItemsAmount();
  renderUserBlock(username, avatarUrl, favoriteItemsAmount);
  renderSearchFormBlock();
  renderSearchStubBlock();
  renderToast(
    {
      text: 'Это пример уведомления. Используйте его при необходимости',
      type: 'success',
    },
    {
      name: 'Понял',
      handler: () => {
        console.log('Уведомление закрыто');
      },
    }
  );

  const searchForm = document.getElementById('search-form');
  searchForm.addEventListener('submit', searchPlaceHandler);
});
