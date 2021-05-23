import { ShowFirstNLettersPipe } from './show-first-n-letters.pipe';

describe('ShowFirstNLettersPipe', () => {
  const showFirstNLettersPipe = new ShowFirstNLettersPipe();

  it('create an instance', () => {
    const pipe = new ShowFirstNLettersPipe();
    expect(showFirstNLettersPipe).toBeTruthy();
  });

  it('should transform', () => {
    expect(showFirstNLettersPipe.transform('abcdefgh', 3, '...')).toBe('abc...');
  });

  it('should transform', () => {
    expect(showFirstNLettersPipe.transform('abcdefgh', 30, '...')).toBe('abcdefgh');
  });
});
