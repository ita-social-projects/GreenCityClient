import { FirstStringWordPipe } from './first-string-word.pipe';

describe('FirstStringWordPipe', () => {
  const pipe = new FirstStringWordPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('transforms "Firstname Lastname" to "Firstname"', () => {
    expect(pipe.transform('Firstname Lastname')).toBe('Firstname');
  });
});
