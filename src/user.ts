import { renderBlock } from './lib.js';

export function renderUserBlock(
  username: string,
  linkToAvatar: string,
  favoriteItemsAmount: number
) {
  const hasFavoriteItems = favoriteItemsAmount < 1 ? false : true;
  const favoritesCaption = hasFavoriteItems
    ? favoriteItemsAmount
    : 'ничего нет';

  renderBlock(
    'user-block',
    `
      <div class="header-container">
        <img class="avatar" src="${linkToAvatar}" alt="${username}" />
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
