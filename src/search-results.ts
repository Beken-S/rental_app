import { renderBlock } from './lib.js';
import { IPlace } from './places.js';
import { isFavoriteItem } from './store/favorites-items.js';
import { toggleFavorite } from './toggle-favorite.js';
import { toBook } from './to-book.js';
import { renderToast } from './lib.js';
import { ToBookIdPrefix, ToggleIdPrefix } from './types/types.js';
import { ISource } from './sources.js';

export function renderSearchStubBlock() {
  renderBlock(
    'search-results-block',
    `
    <div class="before-results-block">
      <img src="img/start-search.png" />
      <p>Чтобы начать поиск, заполните форму и&nbsp;нажмите "Найти"</p>
    </div>
    `
  );
}

export function renderEmptyOrErrorSearchBlock(reasonMessage) {
  renderBlock(
    'search-results-block',
    `
    <div class="no-results-block">
      <img src="img/no-results.png" />
      <p>${reasonMessage}</p>
    </div>
    `
  );
}

export function getSearchResultsMarkup(places: IPlace[]) {
  let markup = '';

  places.forEach((place) => {
    const { id, name, description, remoteness, image, price, source } = place;
    const toggleIdPrefix: ToggleIdPrefix = 'toggle-';
    const toggleId = `${toggleIdPrefix}${source}_${id}`;
    const toBookIdPrefix: ToBookIdPrefix = 'to-book-';
    const toBookId = `${toBookIdPrefix}${source}_${id}`;
    markup += `
      <li class="result">
        <div class="result-container">
          <div class="result-img-container">
            <div
              id=${toggleId}
              class="favorites ${isFavoriteItem(toggleId) ? 'active' : ''}"
            ></div>
            <img class="result-img" src="${image}" alt="">
          </div>
          <div class="result-info">
            <div class="result-info--header">
              <p>${name}</p>
              <p class="price">${price}&#8381;</p>
            </div>
            <div class="result-info--map">
              <i class="map-icon"></i>
              ${remoteness != null ? remoteness : '-'}км от вас
            </div>
            <div class="result-info--descr">${description}</div>
            <div class="result-info--footer">
              <div>
                <button id="${toBookId}">Забронировать</button>
              </div>
            </div>
          </div>
        </div>
      </li>
    `;
  });

  return markup;
}

export function renderSearchResultsBlock(places: IPlace[], sources: ISource[]) {
  renderBlock(
    'search-results-block',
    `
    <div class="search-results-header">
        <p>Результаты поиска</p>
        <div class="search-results-filter">
            <span><i class="icon icon-filter"></i> Сортировать:</span>
            <select>
                <option selected="">Сначала дешёвые</option>
                <option selected="">Сначала дорогие</option>
                <option>Сначала ближе</option>
            </select>
        </div>
    </div>
    <ul class="results-list">
      ${getSearchResultsMarkup(places)}
    </ul>
    `
  );

  const favoritesButtons = document.querySelectorAll('.favorites');
  favoritesButtons.forEach((button) => {
    button.addEventListener('click', (event) => toggleFavorite(event, sources));
  });

  const toBookButtons = document.querySelectorAll(
    '.result-info--footer button'
  );
  toBookButtons.forEach((button) => {
    button.addEventListener('click', (event) => toBook(event, sources));
  });
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
      type: 'error',
    },
    {
      name: 'Закрыть',
      handler: () => {
        console.log('Уведомление закрыто');
      },
    }
  );
}
