function dayOfYear(date: string): number {
  let [year, month, day] = date.split('-').map((item) => Number(item));
  let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
    daysInMonth[1] = 29;
  }

  for (let i = 0; i < month - 1; i++) {
    day += daysInMonth[i];
  }
  return day;
}

console.log(dayOfYear('2019-02-10'));
