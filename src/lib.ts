import { Active, SelectOption, ToggleIdPrefix } from './types/types.js';
import { store } from './store/store.js';
import { getSearchFormData } from './search-form.js';
import { SearchFormId, ToBookIdPrefix } from './types/types.js';
import { deletePrefix } from './helpers/delete-prefix.js';
import { Providers } from './store/domain/providers.js';
import { FlatRentProvider } from './store/providers/flat-rent-sdk/flat-rent-sdk-provider.js';
import { HomyProvider } from './store/providers/homy-api/homy-api-provider.js';
import { renderUserBlock } from './user.js';
import { BookResponse } from './store/domain/book-response.js';
import { renderSearchResultsList } from './search-results.js';
import { Message, MessageType } from './types/message.js';
import { Action } from './types/action.js';

export function renderBlock(elementId: string, html: string): void {
  const element = document.getElementById(elementId);

  if (element instanceof Element) element.innerHTML = html;
}

export function renderToast(message: Message | null, action: Action | null) {
  let messageText = '';

  if (message != null) {
    messageText = `
      <div id="info-block" class="info-block ${message.type}">
        <p>${message.text}</p>
        <button id="toast-main-action">${action?.name || 'Закрыть'}</button>
      </div>
    `;
  }

  renderBlock('toast-block', messageText);

  const button = document.getElementById('toast-main-action');
  if (button != null) {
    button.onclick = function () {
      if (action != null && action.handler != null) {
        action.handler();
      }
      renderToast(null, null);
    };
  }
}

export async function toggleFavorite(event: Event): Promise<void> {
  const target = event.target;
  const toggleClass: Active = 'active';
  const prefix: ToggleIdPrefix = 'toggle-';

  if (!(target instanceof Element)) return;
  const id = deletePrefix(target.id, prefix);

  const favoriteItems = store.favoriteItems;
  if (favoriteItems[id] != null) {
    removeFavoriteItem(id);
    target.classList.remove(toggleClass);
    updateFavoritesItemsAmount();
  } else {
    await addFavoriteItem(id);
    target.classList.add(toggleClass);
    updateFavoritesItemsAmount();
  }
}

export async function toBook(event: Event): Promise<void> {
  try {
    const target = event.target;

    if (!(target instanceof Element)) return;
    const prefix: ToBookIdPrefix = 'to-book-';

    const [providerName, originalId] = deletePrefix(target.id, prefix).split(
      '-'
    );

    if (providerName == null || originalId == null) {
      throw new Error(`Invalid id: ${target.id}`);
    }

    const fromId: SearchFormId = 'search-form';
    const formData = getSearchFormData(fromId);

    if (formData == null) return;

    const { filter, providers } = formData;

    const provider = providers.find((provider) => {
      switch (providerName) {
        case Providers.HomyAPI:
          return provider instanceof HomyProvider;
        case Providers.FlatRentSDK:
          return provider instanceof FlatRentProvider;
        default:
          return null;
      }
    });

    if (provider == null) return;

    const result = await provider.book(originalId, filter);

    if (result === BookResponse.success) {
      renderToast(
        {
          text: 'Бронирование прошло успешно.',
          type: MessageType.Success,
        },
        {
          name: 'Ok',
          handler: () => {
            console.log('Уведомление закрыто');
          },
        }
      );
    } else {
      renderToast(
        {
          text: 'Произошла ошибка при бронировании.',
          type: MessageType.Error,
        },
        {
          name: 'Ok',
          handler: () => {
            console.log('Уведомление закрыто');
          },
        }
      );
    }
  } catch (error) {
    console.error(error);
  }
}

export async function addFavoriteItem(id: string): Promise<void> {
  try {
    const fromId: SearchFormId = 'search-form';
    const formData = getSearchFormData(fromId);

    if (formData == null) return;

    const { providers } = formData;
    const [providerName, originalId] = id.split('-');

    if (providerName == null || originalId == null) {
      throw new Error(`Invalid id: ${id}`);
    }

    const provider = providers.find((provider) => {
      switch (providerName) {
        case Providers.HomyAPI:
          return provider instanceof HomyProvider;
        case Providers.FlatRentSDK:
          return provider instanceof FlatRentProvider;
        default:
          return null;
      }
    });

    if (provider == null) return;

    const place = await provider.get(originalId);

    if (place == null) return;

    store.addFavoriteItems(place);
  } catch (error) {
    console.error(error);
  }
}

export function removeFavoriteItem(id: string) {
  try {
    store.removeFavoriteItem(id);
  } catch (error) {
    console.error(error);
  }
}

export function updateFavoritesItemsAmount(): void {
  renderUserBlock();
}

export function isFavoriteItem(id: string): boolean {
  const prefix: ToggleIdPrefix = 'toggle-';
  const placeId = deletePrefix(id, prefix);
  const favoriteItems = store.favoriteItems;

  return favoriteItems[placeId] != null ? true : false;
}

export function sortSearchResult(event: Event): void {
  const target = event.target;

  if (!(target instanceof HTMLSelectElement)) return;

  switch (target.value) {
    case SelectOption.Descending:
      store.sortSearchResultByDescendingPrice();
      renderSearchResultsList();
      break;
    case SelectOption.Ascending:
      store.sortSearchResultByAscendingPrice();
      renderSearchResultsList();
      break;
    case SelectOption.Closer:
      store.sortSearchResultByCloser();
      renderSearchResultsList();
      break;
    default:
  }
}

export function bookTimeLimitHandler(): void {
  const toBookButtons = document.querySelectorAll(
    '.result-info--footer button'
  );
  toBookButtons.forEach((button) =>
    button.setAttribute('disabled', 'disabled')
  );

  renderToast(
    {
      text: 'Пожалуйста обновите результаты поиска.',
      type: MessageType.Error,
    },
    {
      name: 'Закрыть',
      handler: () => {
        console.log('Уведомление закрыто');
      },
    }
  );
}
