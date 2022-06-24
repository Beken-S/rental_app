import { renderBlock } from './lib.js';
import { addDays } from './helpers/add-days.js';
import { getDateFromCurrent } from './helpers/get-date-from-current.js';
import { getDateString } from './helpers/get-date-string.js';
import { fetchFoundPlaces } from './places.js';
import { renderSearchResultsBlock } from './search-results.js';
import { SearchFormId } from './types/types.js';
import { Timer } from './timer.js';

export interface ISearchFormData {
  city: string;
  coordinates: string;
  checkIn: number;
  checkOut: number;
  price?: number;
}

export function isISearchFromData(
  object: Partial<ISearchFormData>
): object is ISearchFormData {
  return (
    'city' in object &&
    'coordinates' in object &&
    'checkIn' in object &&
    'checkOut' in object
  );
}

export function getSearchFormData(id: string): ISearchFormData {
  const searchForm = document.getElementById(id);

  if (!(searchForm instanceof HTMLFormElement)) return;

  const formValues = new FormData(searchForm).entries();
  const formData: Partial<ISearchFormData> = {};

  for (const [key, value] of formValues) {
    switch (key) {
      case 'checkIn':
      case 'checkOut':
        formData[key] = new Date(value.toString()).getTime();
        break;
      case 'price':
        formData[key] = value != '' ? Number(value.toString()) : null;
        break;
      default:
        formData[key] = value.toString();
    }
  }

  if (isISearchFromData(formData)) return formData;
}

export async function searchPlaceHandler(
  event: Event,
  timer?: Timer
): Promise<void> {
  event.preventDefault();

  const fromId: SearchFormId = 'search-form';
  const { coordinates, checkIn, checkOut, price } = getSearchFormData(fromId);

  const places = await fetchFoundPlaces(coordinates, checkIn, checkOut, price);

  renderSearchResultsBlock(places);
  if (timer.id != null) timer.stop();
  timer.start(3e5);
}

export function renderSearchFormBlock(
  checkInDate?: Date,
  checkOutDate?: Date,
  timer?: Timer
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
          <!--<div class="providers">
            <label><input type="checkbox" name="provider" value="homy" checked /> Homy</label>
            <label><input type="checkbox" name="provider" value="flat-rent" checked /> FlatRent</label>
          </div>--!>
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
            <input id="max-price" type="text" value="" name="price" class="max-price" />
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
  searchForm.addEventListener('submit', (event) =>
    searchPlaceHandler(event, timer)
  );
}
