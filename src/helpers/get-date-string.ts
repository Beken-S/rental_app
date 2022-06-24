export function getDateString(date: Date): string {
  const YEAR_LENGTH = 4;
  const MONTH_LENGTH = 2;
  const DAY_LENGTH = 2;

  const year = String(date.getFullYear()).padStart(YEAR_LENGTH, '0');
  const month = String(date.getMonth() + 1).padStart(MONTH_LENGTH, '0');
  const day = String(date.getDate()).padStart(DAY_LENGTH, '0');

  return `${year}-${month}-${day}`;
}
