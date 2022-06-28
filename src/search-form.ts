import { renderBlock } from './lib.js';
import { addDays } from './helpers/add-days.js';
import { getDateFromCurrent } from './helpers/get-date-from-current.js';
import { getDateString } from './helpers/get-date-string.js';
import { renderSearchResultsBlock } from './search-results.js';
import { SearchFormId } from './types/types.js';
import { Timer } from './timer.js';
import {
  IFlatRentSearchParameters,
  IFormattedFlatRentPlace,
} from './SDK/flat-rent-sdk.js';
import { HomyAPISearchParameters } from './API/homy-api.js';
import {
  ISource,
  SourceName,
  isHomyAPISource,
  isFlatRentSource,
  createSource,
} from './sources.js';
import { IPlace } from './places.js';

export type SearchParameters =
  | HomyAPISearchParameters
  | IFlatRentSearchParameters;

export function isHomyAPISearchParameters(
  parameters: SearchParameters
): parameters is HomyAPISearchParameters {
  return 'coordinates' in parameters;
}

export function isIFlatRentSearchParameters(
  parameters: SearchParameters
): parameters is IFlatRentSearchParameters {
  return 'city' in parameters;
}

export interface ISearchFormData {
  city: string;
  coordinates: string;
  checkIn: number;
  checkOut: number;
  price?: number;
  sources: ISource[];
}

export function isISearchFromData(
  object: Partial<ISearchFormData>
): object is ISearchFormData {
  return (
    'city' in object &&
    'coordinates' in object &&
    'checkIn' in object &&
    'checkOut' in object &&
    'sources' in object
  );
}

export function getSearchFormData(id: string): ISearchFormData | null {
  const searchForm = document.getElementById(id);

  if (!(searchForm instanceof HTMLFormElement)) return;

  const formValues = new FormData(searchForm).entries();
  const formData: Partial<ISearchFormData> = {};
  const sources: ISource[] = [];

  for (const [key, value] of formValues) {
    switch (key) {
      case 'checkIn':
      case 'checkOut':
        formData[key] = new Date(value.toString()).getTime();
        break;
      case 'price':
        formData[key] = value != '' ? Number(value.toString()) : null;
        break;
      case 'provider':
        if (value === 'Homy-API' || value === 'Flat-Rent-SDK') {
          sources.push(createSource(value));
          formData['sources'] = sources;
        }
        break;
      default:
        formData[key] = value.toString();
    }
  }

  if (isISearchFromData(formData)) return formData;
}

export function convertFlatRentToIPlace(
  data: IFormattedFlatRentPlace | IFormattedFlatRentPlace[]
): IPlace | IPlace[] {
  const convert = (data: IFormattedFlatRentPlace) => {
    const { id, title, details, photos, bookedDates, totalPrice } = data;
    const source: SourceName = 'Flat-Rent-SDK';
    return {
      id,
      source,
      bookedDates,
      name: title,
      description: details,
      price: totalPrice,
      image: photos[0],
    };
  };

  if (Array.isArray(data)) return data.map(convert);

  return convert(data);
}

export async function searchInSource(
  source: ISource,
  parameters: SearchParameters
): Promise<IPlace[] | null> {
  if (isHomyAPISource(source) && isHomyAPISearchParameters(parameters)) {
    const data = await source.api.search(parameters);

    if (data instanceof Error) {
      console.error(data.message);
      return;
    }

    return data;
  }

  if (isFlatRentSource(source) && isIFlatRentSearchParameters(parameters)) {
    const data = await source.api.search(parameters);

    if (data instanceof Error) {
      console.error(data.message);
      return;
    }

    const convertedData = convertFlatRentToIPlace(data);

    if (!Array.isArray(convertedData)) return;

    return convertedData;
  }
}

export async function searchPlaceHandler(
  event: Event,
  timer?: Timer
): Promise<void> {
  event.preventDefault();

  const fromId: SearchFormId = 'search-form';
  const { city, coordinates, checkIn, checkOut, price, sources } =
    getSearchFormData(fromId);

  let places: IPlace[] = [];

  for (const source of sources) {
    let parameters: SearchParameters;

    switch (source.name) {
      case 'Homy-API': {
        parameters = {
          coordinates,
          checkInDate: checkIn,
          checkOutDate: checkOut,
        };

        if (price != null) parameters.maxPrice = price;

        break;
      }
      case 'Flat-Rent-SDK': {
        parameters = {
          city,
          checkInDate: new Date(checkIn),
          checkOutDate: new Date(checkOut),
          priceLimit: price,
        };
        break;
      }
      default:
    }

    const searchResult = await searchInSource(source, parameters);
    if (searchResult != null) places = [...places, ...searchResult];
  }

  renderSearchResultsBlock(places, sources);
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
  timer?: Timer,
  checkInDate?: Date,
  checkOutDate?: Date
): void {
  const ONE_DAY = 1;
  const TWO_DAY = 2;
  const TWO_MONTH = 2;
  const homy: SourceName = 'Homy-API';
  const flatRent: SourceName = 'Flat-Rent-SDK';

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
            <label><input type="checkbox" name="provider" value="${homy}" checked /> Homy</label>
            <label><input type="checkbox" name="provider" value="${flatRent}" checked /> FlatRent</label>
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
