import { renderBlock } from './lib.js';
import { UserKey } from './types/types.js';

export interface IUser {
  username: string;
  avatarUrl: string;
}

export function isUser(object: unknown): object is IUser {
  if (object != null && typeof object === 'object') {
    return 'username' in object && 'avatarUrl' in object;
  }
  return false;
}

export function getUserData(): IUser | null {
  const key: UserKey = 'user';
  const storageValue: unknown = JSON.parse(localStorage.getItem(key));

  if (isUser(storageValue)) return storageValue;
}

export function renderUserBlock(
  username: string,
  linkToAvatar: string,
  favoriteItemsAmount = 0
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
