import { CronPipe } from './cron.pipe';

describe('CronPipe', () => {
  it('create an instance', () => {
    const pipe = new CronPipe();
    expect(pipe).toBeTruthy();
  });
});
