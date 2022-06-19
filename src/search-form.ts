import { renderBlock } from './lib.js';
import { IPlace, IShowPlace, showPlace } from './place.js';
import { parseDate } from './helpers/parse-date.js';
import { addDays } from './helpers/add-days.js';
import { getDateFromCurrent } from './helpers/get-date-from-current.js';
import { getDateString } from './helpers/get-date-string.js';

export interface ISearchFormData {
  city: string;
  checkInDate: Date;
  checkOutDate: Date;
  price: number;
}

export function search(data: ISearchFormData, callback: IShowPlace): void {
  console.log(data);
  const error = Math.random() < 0.5 ? new Error('test error') : null;
  const places: IPlace[] = error == null ? [] : null;

  setTimeout(callback, 2000, error, places);
}

export function searchHandler(): void {
  const searchForm = document.getElementById('search-form') as HTMLFormElement;

  if (searchForm == null) return;

  const city = searchForm.get('city').toString();

  const checkInDateValue = searchForm.get('checkIn');
  const checkInDate = parseDate(checkInDateValue);

  const checkOutDateValue = searchForm.get('checkOut');
  const checkOutDate = parseDate(checkOutDateValue);

  const price = Number(searchForm.get('price'));

  search(
    {
      city,
      checkInDate,
      checkOutDate,
      price,
    },
    showPlace
  );
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
            <input type="hidden" disabled value="59.9386,30.3141" />
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
            <div><button>Найти</button></div>
          </div>
        </div>
      </fieldset>
    </form>
    `
  );
}
