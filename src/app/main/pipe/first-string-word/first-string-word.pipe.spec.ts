import { FirstStringWordPipe } from './first-string-word.pipe';

describe('FirstStringWordPipe', () => {
  let pipe: FirstStringWordPipe;

  beforeEach(() => {
    pipe = new FirstStringWordPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('transforms "Firstname Lastname" to "Firstname"', () => {
    const name = 'Firstname Lastname';
    const result = pipe.transform(name);
    expect(result).toBe('Firstname');
  });
});
