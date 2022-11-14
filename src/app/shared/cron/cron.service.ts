import { Injectable } from '@angular/core';

import enLocale from './locales/en.json';
import ukLocale from './locales/uk.json';

type Locales = 'en' | 'uk';

const isNumber = (val: string) => !isNaN(Number(val));
const inRange = (num: number, a: number, b: number) => a <= num && num <= b;

const replaceAll = (str: string, value: string, replacement: any) => str.replace(new RegExp(value, 'g'), replacement);

const removeMultipleSpaces = (str: string) => {
  let res = str;
  while (res.includes('  ')) {
    res = res.replace('  ', ' ');
  }
  return res;
};

const format = (str: string, ...replacements: any[]) => {
  let res = str;
  replacements.forEach((rep) => {
    res = res.replace('%s', rep);
  });
  return res;
};

const daysOfWeekAliases = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const monthsAliases = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

@Injectable({
  providedIn: 'root'
})
export class CronService {
  currentLocale: Locales = 'en';
  locales = {
    en: enLocale,
    uk: ukLocale
  };

  rangeValidators = {
    minute: (min: number) => inRange(min, 0, 59),
    hour: (hour: number) => inRange(hour, 0, 23),
    dayOfMonth: (day: number) => inRange(day, 1, 31),
    month: (month: number) => inRange(month, 1, 12),
    dayOfWeek: (day: number) => inRange(day, 0, 7)
  };

  private paramsFormatters = {
    default: {
      every: () => [``],
      value: (val) => [val],
      list: (vals) => [this.formatList(vals)],
      range: (vals) => vals
    },
    month: {
      every: () => [``],
      value: (val) => this.mapMonthsTranslations(val),
      list: (vals) => [this.formatList(this.mapMonthsTranslations(...vals))],
      range: (vals) => this.mapMonthsTranslations(...vals)
    },
    dayOfWeek: {
      every: () => [``],
      value: (val) => this.mapDaysOfWeekTranslations(val),
      list: (vals) => [this.formatList(this.mapDaysOfWeekTranslations(...vals))],
      range: (vals) => this.mapDaysOfWeekTranslations(...vals)
    }
  };

  public setLocale(locale: string) {
    const available = Object.keys(this.locales);
    if (!available.includes(locale)) {
      throw new Error(`Locale ${locale} is not available. List of available locales: ${available.join(', ')}.`);
    }
    this.currentLocale = locale as Locales;
  }

  private formatList(values: any[]) {
    return `${values.slice(0, -1).join(', ')} ${this.locales[this.currentLocale].parts.and} ${values[values.length - 1]}`;
  }
  private mapMonthsTranslations = (...months: number[]) => months.map((mon) => this.locales[this.currentLocale].months[mon - 1]);
  private mapDaysOfWeekTranslations = (...days: number[]) => days.map((day) => this.locales[this.currentLocale].daysOfWeek[day - 1]);

  public parsePart(part: string, validateRange: (val: number) => boolean) {
    // Every value
    if (part === '*') {
      return { type: 'every', value: null };
    }
    // Single value
    if (isNumber(part)) {
      const num = parseInt(part, 10);
      if (!validateRange(num)) {
        throw new Error('Value out of range!');
      }
      return { type: 'value', value: num };
    }
    // List of values
    if (part.split(',').every((val) => isNumber(val))) {
      return {
        type: 'list',
        value: part.split(',').map((val) => {
          const num = parseInt(val, 10);
          if (!validateRange(num)) {
            throw new Error('Value out of range!');
          }
          return num;
        })
      };
    }
    // Values from range
    if (part.split('-').length === 2 && part.split('-').every((bound) => isNumber(bound))) {
      const [from, to] = part.split('-').map((bound) => parseInt(bound, 10));
      if (from > to) {
        throw new Error('Unsupported or invalid cron expression!');
      }
      if (!validateRange(from) || !validateRange(to)) {
        throw new Error('Value out of range!');
      }
      return {
        type: 'range',
        value: [from, to]
      };
    }
    throw new Error('Unsupported or invalid cron expression!');
  }

  private getTimePart(min: string, hour: string) {
    const parsedMin = this.parsePart(min, this.rangeValidators.minute);
    const parsedHour = this.parsePart(hour, this.rangeValidators.hour);
    if (parsedMin.type === 'value' && parsedHour.type === 'value') {
      return format(this.locales[this.currentLocale].parts.specificTime, parsedHour.value, parsedMin.value);
    }
    const minPart = format(
      this.locales[this.currentLocale].parts.minute[parsedMin.type],
      ...this.paramsFormatters.default[parsedMin.type](parsedMin.value)
    );
    const hourPart = format(
      this.locales[this.currentLocale].parts.hour[parsedHour.type],
      ...this.paramsFormatters.default[parsedHour.type](parsedHour.value)
    );
    return `${minPart} ${hourPart}`;
  }

  private getMonthPart(month: string) {
    // To deal with months aliases (JAN, FEB, MAR, etc.)
    let monthsNum = month;
    monthsAliases.forEach((mon, idx) => {
      monthsNum = replaceAll(monthsNum, mon, idx + 1);
    });
    const { type, value } = this.parsePart(monthsNum, this.rangeValidators.month);
    return format(this.locales[this.currentLocale].parts.month[type], ...this.paramsFormatters.month[type](value));
  }

  private getDayOfMonthPart(dayOfMonth: string) {
    const { type, value } = this.parsePart(dayOfMonth, this.rangeValidators.dayOfMonth);
    return format(this.locales[this.currentLocale].parts.dayOfMonth[type], ...this.paramsFormatters.default[type](value));
  }

  private getDayOfWeekPart(dayOfWeek: string) {
    // To deal with days-of-week aliases (MON, TUE, WED, etc.)
    let dayOfWeekNum = dayOfWeek;
    daysOfWeekAliases.forEach((day, idx) => {
      dayOfWeekNum = replaceAll(dayOfWeekNum, day, idx + 1);
    });
    const { type, value } = this.parsePart(dayOfWeekNum, this.rangeValidators.dayOfWeek);
    // To deal with Sunday (can be either 0 or 7)
    const mappedValue = Array.of(value)
      .flat()
      .map((val) => (val === 0 ? 7 : val));
    return format(this.locales[this.currentLocale].parts.dayOfWeek[type], ...this.paramsFormatters.dayOfWeek[type](mappedValue));
  }

  private getDayPart(dayOfMonth: string, dayOfWeek: string) {
    const dayOfMonthPart = this.getDayOfMonthPart(dayOfMonth);
    const dayOfWeekPart = this.getDayOfWeekPart(dayOfWeek);
    const andPart = dayOfMonth !== '*' && dayOfWeek !== '*' ? this.locales[this.currentLocale].parts.and : '';
    return `${dayOfMonthPart} ${andPart} ${dayOfWeekPart}`;
  }

  public descript(cron: string, locale?: string) {
    if (locale) {
      this.setLocale(locale);
    }
    const [min, hour, dayOfMonth, month, dayOfWeek] = cron.split(' ');
    const timePart = this.getTimePart(min, hour);
    const dayPart = this.getDayPart(dayOfMonth, dayOfWeek);
    const monthPart = this.getMonthPart(month);
    return removeMultipleSpaces(`${timePart} ${dayPart} ${monthPart}`).trim();
  }
}
