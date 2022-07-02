import { renderBlock } from './lib.js';
import { store } from './store/store.js';

export function renderUserBlock() {
  const { username, avatarUrl } = store.user;
  const favoriteItemsAmount = store.favoriteAmount;
  const hasFavoriteItems = favoriteItemsAmount < 1 ? false : true;
  const favoritesCaption = hasFavoriteItems
    ? favoriteItemsAmount
    : 'ничего нет';
  renderBlock(
    'user-block',
    `
      <div class="header-container">
        <img class="avatar" src="${avatarUrl}" alt="${username}" />
        <div class="info">
            <p class="name">${username}</p>
            <p class="fav">
              <i
                class="heart-icon${hasFavoriteItems ? ' active' : ''}"
              ></i>${favoritesCaption}
            </p>
        </div>
      </div>
    `
  );
}
