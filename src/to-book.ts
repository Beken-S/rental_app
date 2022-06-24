import { renderToast } from './lib.js';
import { fetchBookPlace } from './places.js';
import { getSearchFormData } from './search-form.js';
import { SearchFormId } from './types/types.js';

export async function toBook(event: Event): Promise<void> {
  try {
    const target = event.target;

    if (!(target instanceof Element)) return;

    const matchResult = target.id.match(/\d*$/);

    if (matchResult == null || matchResult[0] === '') return;

    const targetId = Number(matchResult[0]);

    const fromId: SearchFormId = 'search-form';
    const { checkIn, checkOut } = getSearchFormData(fromId);

    const { name } = await fetchBookPlace(targetId, checkIn, checkOut);

    renderToast(
      {
        text: `Вы успешно забронировали ${name}.`,
        type: 'success',
      },
      {
        name: 'Ok',
        handler: () => {
          console.log('Уведомление закрыто');
        },
      }
    );
  } catch (error) {
    renderToast(
      {
        text: 'Произошла ошибка при бронировании.',
        type: 'error',
      },
      {
        name: 'Ok',
        handler: () => {
          console.log('Уведомление закрыто');
        },
      }
    );
  }
}
