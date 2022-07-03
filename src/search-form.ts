import { renderBlock } from './lib.js';
import { addDays } from './helpers/add-days.js';
import { getDateFromCurrent } from './helpers/get-date-from-current.js';
import { getDateString } from './helpers/get-date-string.js';
import { renderSearchResultsBlock } from './search-results.js';
import { SearchFormId } from './types/types.js';
import { Provider } from './store/domain/provider.js';
import { HomyProvider } from './store/providers/homy-api/homy-api-provider.js';
import { Providers } from './store/domain/providers.js';
import { FlatRentProvider } from './store/providers/flat-rent-sdk/flat-rent-sdk-provider.js';
import { getCoordinates } from './helpers/get-coordinates.js';
import { SearchFilter } from './store/domain/search-filter.js';
import { Place } from './store/domain/place.js';
import { store } from './store/store.js';
import { timer } from './timer.js';

export interface SearchFormData {
  filter: SearchFilter;
  providers: Provider[];
}

export function getSearchFormData(id: string): SearchFormData | null {
  const form = document.getElementById(id);

  if (!(form instanceof HTMLFormElement)) return null;

  const formData = new FormData(form);
  const formCoordinates = formData.get('coordinates');

  if (formCoordinates == null) return null;

  const coordinates = getCoordinates(formCoordinates.toString());

  if (coordinates == null) return null;

  const providersNameList = formData.getAll('provider');
  const providers: Provider[] = [];

  for (const name of providersNameList) {
    if (name === Providers.HomyAPI) {
      providers.push(new HomyProvider());
    }
    if (name === Providers.FlatRentSDK) {
      providers.push(new FlatRentProvider(coordinates));
    }
  }

  const city = formData.get('city');
  const checkIn = formData.get('checkIn');
  const checkOut = formData.get('checkOut');
  const price = formData.get('price');

  if (checkIn == null || checkOut == null) return null;

  const filter: SearchFilter = {
    checkInDate: new Date(checkIn.toString()),
    checkOutDate: new Date(checkOut.toString()),
    coordinates: coordinates.join(','),
  };

  if (city != null) filter.city = city.toString();
  if (price != '' && price != null)
    filter.priceLimit = Number(price.toString());

  return { filter, providers };
}

export async function search(data: SearchFormData): Promise<void> {
  const { providers, filter } = data;
  const searchResults = await Promise.all(
    providers.map((provider) => provider.search(filter))
  );

  const places: Place[] = [];
  places.concat(...searchResults);

  store.searchResult = places;
  store.sortSearchResultByDescendingPrice();
}

export async function searchPlaceHandler(event: Event): Promise<void> {
  event.preventDefault();
  const formId: SearchFormId = 'search-form';
  const formData = getSearchFormData(formId);

  if (formData == null) return;

  await search(formData);

  renderSearchResultsBlock();
  if (timer.id != null) timer.stop();
  timer.start(3e5);
}

export function checkProviderHandler(
  checkbox: HTMLInputElement,
  checkboxes: NodeListOf<Element>
): void {
  for (const checkbox of checkboxes) {
    if (checkbox instanceof HTMLInputElement && checkbox.checked) return;
  }
  checkbox.checked = !checkbox.checked;
}

export function renderSearchFormBlock(
  checkInDate?: Date,
  checkOutDate?: Date
): void {
  const ONE_DAY = 1;
  const TWO_DAY = 2;
  const TWO_MONTH = 2;
  const nowDate = new Date();
  const todayDate = new Date(
    nowDate.getFullYear(),
    nowDate.getMonth(),
    nowDate.getDate()
  );

  const minDate = todayDate;
  const maxDate = getDateFromCurrent(todayDate, TWO_MONTH);

  const isCheckInDateValid = checkInDate && checkInDate >= minDate;
  const isCheckOutDateValid = checkOutDate && checkOutDate <= maxDate;

  const defaultCheckInDate = addDays(todayDate, ONE_DAY);
  const defaultCheckOutDate = isCheckInDateValid
    ? addDays(checkInDate, TWO_DAY)
    : addDays(defaultCheckInDate, TWO_DAY);

  const minDateStr = getDateString(minDate);
  const maxDateStr = getDateString(maxDate);
  const checkInDateStr = isCheckInDateValid
    ? getDateString(checkInDate)
    : getDateString(defaultCheckInDate);
  const checkOutDateStr = isCheckOutDateValid
    ? getDateString(checkOutDate)
    : getDateString(defaultCheckOutDate);

  renderBlock(
    'search-form-block',
    `
    <form id="search-form">
      <fieldset class="search-fieldset">
        <div class="row">
          <div>
            <label for="city">Город</label>
            <input id="city" type="text" value="Санкт-Петербург" name="city"/>
            <input type="hidden" value="59.9386,30.3141" name="coordinates" />
          </div>
          <div class="providers">
            <label>
              <input
                type="checkbox"
                name="provider"
                value="${Providers.HomyAPI}"
                checked
              />
              Homy
            </label>
            <label>
              <input
                type="checkbox"
                name="provider"
                value="${Providers.FlatRentSDK}"
                checked
              />
              FlatRent
            </label>
          </div>
        </div>
        <div class="row">
          <div>
            <label for="check-in-date">Дата заезда</label>
            <input
              id="check-in-date"
              type="date"
              value="${checkInDateStr}"
              min="${minDateStr}"
              max="${maxDateStr}"
              name="checkIn"
            />
          </div>
          <div>
            <label for="check-out-date">Дата выезда</label>
            <input
              id="check-out-date"
              type="date"
              value="${checkOutDateStr}"
              min="${minDateStr}"
              max="${maxDateStr}"
              name="checkOut"
            />
          </div>
          <div>
            <label for="max-price">Макс. цена суток</label>
            <input
              id="max-price"
              type="text"
              value=""
              name="price"
              class="max-price"
            />
          </div>
          <div>
            <button class="search-form-button">Найти</button>
          </div>
        </div>
      </fieldset>
    </form>
    `
  );

  const searchForm = document.getElementById('search-form');
  if (searchForm instanceof HTMLFormElement) {
    searchForm.addEventListener('submit', searchPlaceHandler);
  }

  const checkboxProvider = document.querySelectorAll('input[name="provider"]');

  checkboxProvider.forEach((checkbox) =>
    checkbox.addEventListener('click', (event) => {
      const target = event.target;
      if (target instanceof HTMLInputElement) {
        checkProviderHandler(target, checkboxProvider);
      }
    })
  );
}
