import { RepeatPipe } from './repeat.pipe';

describe('RepeatPipe', () => {
  it('create an instance', () => {
    const pipe = new RepeatPipe();
    expect(pipe).toBeTruthy();
  });

  it('returns an array with provided length filled with null', () => {
    const pipe = new RepeatPipe();
    expect(pipe.transform(0)).toEqual([]);
    expect(pipe.transform(5)).toEqual([null, null, null, null, null]);
  });

  it('returns an empty array if wrong length provided', () => {
    const pipe = new RepeatPipe();
    expect(pipe.transform(-3)).toEqual([]);
    expect(pipe.transform('2' as any)).toEqual([]);
    expect(pipe.transform({} as any)).toEqual([]);
  });
});
