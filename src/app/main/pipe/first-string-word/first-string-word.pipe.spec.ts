import { FirstStringWordPipe } from './first-string-word.pipe';

describe('FirstStringWordPipe', () => {
  it('create an instance', () => {
    const pipe = new FirstStringWordPipe();
    expect(pipe).toBeTruthy();
  });
});
