import { PhoneNumberTreatPipe } from './phone-number-treat.pipe';

describe('PhoneNumberTreatPipe', () => {
  it('create an instance', () => {
    const pipe = new PhoneNumberTreatPipe();
    expect(pipe).toBeTruthy();
  });

  it('transform', () => {
    const pipe = new PhoneNumberTreatPipe();
    const res = pipe.transform('123456789', '380');
    expect(res).toBe('+380 12 345 67 89');
  });
});
