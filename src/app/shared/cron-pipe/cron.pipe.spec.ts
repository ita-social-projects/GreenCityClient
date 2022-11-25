import { CronPipe } from './cron.pipe';
import { CronService } from '../cron/cron.service';

describe('CronPipe', () => {
  let pipe;

  const cronServiceMock = {
    descript(cron, locale) {
      const output = {
        en: {
          '10 15 5-7 1,9,11 0': 'at 15:10 on every day-of-month from 5 through 7 and on Sun in Jan, Sep and Nov',
          '10 * * * *': 'at minute 10',
          '10 11,22 * * *': 'at minute 10 past hour 11 and 22'
        },
        uk: {
          '10 15 5-7 1,9,11 0': 'о 15:10 щодня з 5 до 7 дня місяця та у Нд у Січ, Вер та Лист',
          '10 * * * *': 'кожну 10 хвилину',
          '10 11,22 * * *': 'кожну 10 хвилину після 11 та 22 години'
        }
      };
      return output[locale][cron];
    }
  };

  beforeEach(async () => {
    pipe = new CronPipe(cronServiceMock as CronService);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform cron string correctly', () => {
    expect(pipe.transform('10 15 5-7 1,9,11 0')).toBe('at 15:10 on every day-of-month from 5 through 7 and on Sun in Jan, Sep and Nov');
    expect(pipe.transform('10 * * * *')).toBe('at minute 10');
    expect(pipe.transform('10 11,22 * * *')).toBe('at minute 10 past hour 11 and 22');
  });

  it('should transform cron string correctly for ua translation', () => {
    expect(pipe.transform('10 15 5-7 1,9,11 0', 'ua')).toBe('о 15:10 щодня з 5 до 7 дня місяця та у Нд у Січ, Вер та Лист');
    expect(pipe.transform('10 * * * *', 'ua')).toBe('кожну 10 хвилину');
    expect(pipe.transform('10 11,22 * * *', 'ua')).toBe('кожну 10 хвилину після 11 та 22 години');
  });
});
