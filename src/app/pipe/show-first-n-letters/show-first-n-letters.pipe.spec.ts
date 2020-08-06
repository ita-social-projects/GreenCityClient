import { ShowFirstNLettersPipe } from './show-first-n-letters.pipe';

describe('ShowFirstNLettersPipe', () => {
  it('create an instance', () => {
    const pipe = new ShowFirstNLettersPipe();
    expect(pipe).toBeTruthy();
  });
});
