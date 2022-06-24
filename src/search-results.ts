import { renderBlock } from './lib.js';
import { IPlace } from './places.js';
import { isFavoriteItem } from './store/favorites-items.js';
import { toggleFavorite } from './toggle-favorite.js';
import { toBook } from './to-book.js';
import { renderToast } from './lib.js';

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
    const toggleId = `toggle-${place.id}`;
    const toBookId = `to-book-${place.id}`;
    markup += `
      <li class="result">
        <div class="result-container">
          <div class="result-img-container">
            <div
              id=${toggleId}
              class="favorites ${isFavoriteItem(toggleId) ? 'active' : ''}"
            ></div>
            <img class="result-img" src="${place.image}" alt="">
          </div>
          <div class="result-info">
            <div class="result-info--header">
              <p>${place.name}</p>
              <p class="price">${place.price}&#8381;</p>
            </div>
            <div class="result-info--map">
              <i class="map-icon"></i>
              ${place.remoteness}км от вас
            </div>
            <div class="result-info--descr">${place.description}</div>
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

export function renderSearchResultsBlock(places: IPlace[]) {
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
    button.addEventListener('click', toggleFavorite);
  });

  const toBookButtons = document.querySelectorAll(
    '.result-info--footer button'
  );
  toBookButtons.forEach((button) => {
    button.addEventListener('click', toBook);
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
