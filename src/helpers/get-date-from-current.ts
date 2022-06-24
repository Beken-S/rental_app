export function getDateFromCurrent(
  date: Date,
  monthLimit: number,
  day?: number
): Date {
  if (!day) day = 0;
  const copyDate = new Date(date);
  copyDate.setMonth(copyDate.getMonth() + monthLimit);
  copyDate.setDate(day);

  return copyDate;
}
