export function addDays(date: Date, countDays: number): Date {
  const copyDate = new Date(date);
  copyDate.setDate(copyDate.getDate() + countDays);

  return copyDate;
}
