import { renderBlock } from './lib.js';

export interface ISearchFormData {
  city: string;
  checkInDate: Date;
  checkOutDate: Date;
  price: number;
}

export function searchHandler(): void {
  const searchFrom = document.getElementById('search-form');
  const searchFormData =
    searchFrom instanceof HTMLFormElement ? new FormData(searchFrom) : null;

  if (searchFormData == null) return;

  const city = searchFormData.get('city').toString();

  const checkInDateValue = searchFormData.get('checkIn');
  const checkInDate = parseDate(checkInDateValue);

  const checkOutDateValue = searchFormData.get('checkOut');
  const checkOutDate = parseDate(checkOutDateValue);

  const price = Number(searchFormData.get('price'));

  search({
    city,
    checkInDate,
    checkOutDate,
    price,
  });
}

export function search(data: ISearchFormData): void {
  console.log(data);
}

export function parseDate(date: FormDataEntryValue): Date {
  const dateString = date.toString();
  const [year, month, day] = dateString.split('-').map((el) => Number(el));
  return new Date(year, month, day);
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
  const maxDate = getMaxDate(todayDate, TWO_MONTH);

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

  function getMaxDate(date: Date, monthLimit: number, day?: number): Date {
    if (!day) day = 0;
    const copyDate = new Date(date);
    copyDate.setMonth(copyDate.getMonth() + monthLimit);
    copyDate.setDate(day);

    return copyDate;
  }

  function getDateString(date: Date): string {
    const YEAR_LENGTH = 4;
    const MONTH_LENGTH = 2;
    const DAY_LENGTH = 2;

    const year = String(date.getFullYear()).padStart(YEAR_LENGTH, '0');
    const month = String(date.getMonth() + 1).padStart(MONTH_LENGTH, '0');
    const day = String(date.getDate()).padStart(DAY_LENGTH, '0');

    return `${year}-${month}-${day}`;
  }

  function addDays(date: Date, countDays: number): Date {
    const copyDate = new Date(date);
    copyDate.setDate(copyDate.getDate() + countDays);

    return copyDate;
  }
}
