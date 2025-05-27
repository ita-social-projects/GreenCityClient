import { UnderscoreToSpacePipe } from './underscore-to-space.pipe';

describe('UnderscoreToSpacePipe', () => {
  let pipe: UnderscoreToSpacePipe;

  beforeEach(() => {
    pipe = new UnderscoreToSpacePipe();
  });

  it('should replace underscores with spaces', () => {
    expect(pipe.transform('point_of_interest')).toBe('point of interest');
    expect(pipe.transform('hello_world_do_I_convert')).toBe('hello world do I convert');
  });

  it('should return empty string if value is falsy', () => {
    expect(pipe.transform('')).toBe('');
    expect(pipe.transform(null as any)).toBe('');
    expect(pipe.transform(undefined as any)).toBe('');
  });

  it('should return original string if no underscores', () => {
    expect(pipe.transform('hello')).toBe('hello');
  });
});
