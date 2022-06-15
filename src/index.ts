import { renderSearchFormBlock, searchHandler } from './search-form.js';
import { renderSearchStubBlock } from './search-results.js';
import { renderUserBlock, getUserData, getFavoritesAmount } from './user.js';
import { renderToast } from './lib.js';

window.addEventListener('DOMContentLoaded', () => {
  const { username, avatarUrl } = getUserData();
  const favoritesAmount = getFavoritesAmount();
  renderUserBlock(username, avatarUrl, favoritesAmount);
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
  searchHandler();
});
