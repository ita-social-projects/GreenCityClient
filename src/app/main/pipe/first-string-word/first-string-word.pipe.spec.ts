import { FirstStringWordPipe } from './first-string-word.pipe';

describe('FirstStringWordPipe', () => {
  const FirstLettersPipe = new FirstStringWordPipe();

  it('create an instance', () => {
    const pipe = new FirstStringWordPipe();
    expect(FirstLettersPipe).toBeTruthy();
  });

  it('should transform', () => {
    expect(FirstLettersPipe.transform('FirstName Lastname')).toBe('FirstName');
  });
  it('should transform', () => {
    expect(FirstLettersPipe.transform('Username Userlastname')).toBe('Username');
  });

  it('should transform empty line', () => {
    expect(FirstLettersPipe.transform('')).toBe('');
  });

  it('transforms "Firstname Lastname" to "Firstname"', () => {
    const name = 'Firstname Lastname';
    const pipe = new FirstStringWordPipe();
    const result = pipe.transform(name);
    expect(result).toBe('Firstname');
  });
});
