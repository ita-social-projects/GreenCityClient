import { FirstStringWordPipe } from './first-string-word.pipe';

describe('FirstStringWordPipe', () => {
  const pipe = new FirstStringWordPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should display only first name in user name', () => {
    const name = 'Firstname Lastname';
    const result = pipe.transform(name);
    expect(result).toBe('Firstname');
  });
});
