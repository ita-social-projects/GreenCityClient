import { TestBed } from '@angular/core/testing';

import { CronService } from './cron.service';

describe('CronService', () => {
  let service: CronService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CronService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should throw an error when input is invalid', () => {
    expect(() => service.descript('70 * * * *')).toThrow(new Error('Value out of range!'));
    expect(() => service.descript('* 25 * * *')).toThrow(new Error('Value out of range!'));
    expect(() => service.descript('* * 33 * *')).toThrow(new Error('Value out of range!'));
    expect(() => service.descript('* * * 14 *')).toThrow(new Error('Value out of range!'));
    expect(() => service.descript('* * * * 9')).toThrow(new Error('Value out of range!'));

    expect(() => service.descript('* * * 5-2 *')).toThrow(new Error('Unsupported or invalid cron expression!'));
    expect(() => service.descript('* * * * SUND')).toThrow(new Error('Unsupported or invalid cron expression!'));
    expect(() => service.descript('* * * JNR *')).toThrow(new Error('Unsupported or invalid cron expression!'));
    expect(() => service.descript('* a * JNR *')).toThrow(new Error('Unsupported or invalid cron expression!'));
  });

  it('should descript cron strings correctly', () => {
    expect(service.descript('* * * * *')).toBe('at every minute');
    expect(service.descript('10 * * * *')).toBe('at minute 10');
    expect(service.descript('10,11 * * * *')).toBe('at minute 10 and 11');
    expect(service.descript('10,11,15 * * * *')).toBe('at minute 10, 11 and 15');
    expect(service.descript('3-20 * * * *')).toBe('at every minute from 3 through 20');

    expect(service.descript('10 11 * * *')).toBe('at 11:10');
    expect(service.descript('10,11 22 * * *')).toBe('at minute 10 and 11 past hour 22');
    expect(service.descript('10-31 22 * * *')).toBe('at every minute from 10 through 31 past hour 22');
    expect(service.descript('10-31 2,14,22 * * *')).toBe('at every minute from 10 through 31 past hour 2, 14 and 22');
    expect(service.descript('10-31 2-17 * * *')).toBe('at every minute from 10 through 31 past every hour from 2 through 17');

    expect(service.descript('* * 1 * *')).toBe('at every minute on day-of-month 1');
    expect(service.descript('* * 1,2,5 * *')).toBe('at every minute on day-of-month 1, 2 and 5');
    expect(service.descript('* * 1-25 * *')).toBe('at every minute on every day-of-month from 1 through 25');

    expect(service.descript('* * 1-25 * 0')).toBe('at every minute on every day-of-month from 1 through 25 and on Sun');
    expect(service.descript('* * 1,5 * 7')).toBe('at every minute on day-of-month 1 and 5 and on Sun');
    expect(service.descript('* * 15 * 3-7')).toBe('at every minute on day-of-month 15 and on every day-of-week from Wed through Sun');
    expect(service.descript('* * 15 * SAT')).toBe('at every minute on day-of-month 15 and on Sat');
    expect(service.descript('* * 15 * MON-THU')).toBe('at every minute on day-of-month 15 and on every day-of-week from Mon through Thu');

    expect(service.descript('* * * 1 *')).toBe('at every minute in Jan');
    expect(service.descript('* * * JAN *')).toBe('at every minute in Jan');
    expect(service.descript('* * * JAN,SEP *')).toBe('at every minute in Jan and Sep');
    expect(service.descript('* * * JAN-SEP *')).toBe('at every minute in every month from Jan through Sep');
    expect(service.descript('* * * 2-5 *')).toBe('at every minute in every month from Feb through May');
    expect(service.descript('* * * 2,5,12 *')).toBe('at every minute in Feb, May and Dec');

    expect(service.descript('* * 31 1 1-5')).toBe(
      'at every minute on day-of-month 31 and on every day-of-week from Mon through Fri in Jan'
    );
    expect(service.descript('10 15 5-7 1,9,11 0')).toBe('at 15:10 on every day-of-month from 5 through 7 and on Sun in Jan, Sep and Nov');
    expect(service.descript('10 * * * *')).toBe('at minute 10');
    expect(service.descript('10 11,22 * * *')).toBe('at minute 10 past hour 11 and 22');
    expect(service.descript('* 11 * * *')).toBe('at every minute past hour 11');
    expect(service.descript('3,4 11 * * *')).toBe('at minute 3 and 4 past hour 11');
    expect(service.descript('3-20 11 * * *')).toBe('at every minute from 3 through 20 past hour 11');
  });

  it('should descript cron strings correctly with uk locale', () => {
    service.setLocale('uk');
    expect(service.descript('* * * * *')).toBe('щохвилини');
    expect(service.descript('10 * * * *')).toBe('кожну 10 хвилину');
    expect(service.descript('10,11 * * * *')).toBe('кожну 10 та 11 хвилину');
    expect(service.descript('10,11,15 * * * *')).toBe('кожну 10, 11 та 15 хвилину');
    expect(service.descript('3-20 * * * *')).toBe('щохвилини з 3 до 20');

    expect(service.descript('10 11 * * *')).toBe('о 11:10');
    expect(service.descript('10,11 22 * * *')).toBe('кожну 10 та 11 хвилину після 22 години');
    expect(service.descript('10-31 22 * * *')).toBe('щохвилини з 10 до 31 після 22 години');
    expect(service.descript('10-31 2,14,22 * * *')).toBe('щохвилини з 10 до 31 після 2, 14 та 22 години');
    expect(service.descript('10-31 2-17 * * *')).toBe('щохвилини з 10 до 31 щогодини з 2 до 17');

    expect(service.descript('* * 1 * *')).toBe('щохвилини у 1 день місяця');
    expect(service.descript('* * 1,2,5 * *')).toBe('щохвилини у 1, 2 та 5 день місяця');
    expect(service.descript('* * 1-25 * *')).toBe('щохвилини щодня з 1 до 25 дня місяця');

    expect(service.descript('* * 1-25 * 0')).toBe('щохвилини щодня з 1 до 25 дня місяця та у Нд');
    expect(service.descript('* * 1,5 * 7')).toBe('щохвилини у 1 та 5 день місяця та у Нд');
    expect(service.descript('* * 15 * 3-7')).toBe('щохвилини у 15 день місяця та щодня з Ср до Нд');
    expect(service.descript('* * 15 * SAT')).toBe('щохвилини у 15 день місяця та у Сб');
    expect(service.descript('* * 15 * MON-THU')).toBe('щохвилини у 15 день місяця та щодня з Пн до Чт');

    expect(service.descript('* * * 1 *')).toBe('щохвилини у Січ');
    expect(service.descript('* * * JAN *')).toBe('щохвилини у Січ');
    expect(service.descript('* * * JAN,SEP *')).toBe('щохвилини у Січ та Вер');
    expect(service.descript('* * * JAN-SEP *')).toBe('щохвилини щомісяця з Січ до Вер');
    expect(service.descript('* * * 2-5 *')).toBe('щохвилини щомісяця з Лют до Трав');
    expect(service.descript('* * * 2,5,12 *')).toBe('щохвилини у Лют, Трав та Груд');
  });
});
