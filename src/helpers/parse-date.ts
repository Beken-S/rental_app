export function parseDate(date: FormDataEntryValue): Date {
  const dateString = date.toString();
  const [year, month, day] = dateString.split('-').map((el) => Number(el));
  return new Date(year, month, day);
}
