import { TestBed } from '@angular/core/testing';
import { CronService } from '../cron/cron.service';
import { CronPipe } from './cron.pipe';

describe('CronPipe', () => {
  let pipe;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [CronService]
    });
    const cronService = TestBed.inject(CronService);
    pipe = new CronPipe(cronService);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform cron string correctly', () => {
    expect(pipe.transform('10 15 5-7 1,9,11 0')).toBe('at 15:10 on every day-of-month from 5 through 7 and on Sun in Jan, Sep and Nov');
    expect(pipe.transform('10 * * * *')).toBe('at minute 10');
    expect(pipe.transform('10 11,22 * * *')).toBe('at minute 10 past hour 11 and 22');
  });
});
