import { MaxTextLengthPipe } from './max-text-length.pipe';

describe('MaxTextLengthPipe', () => {
  const pipe = new MaxTextLengthPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('transform', () => {
    it(`textName less than MaxTextLengthPipe`, () => {
      const result = pipe.transform('lessThan15');
      expect(result).toBe('lessThan15');
    });

    it(`textName more than MaxTextLengthPipe`, () => {
      const result = pipe.transform('moreThanFifteen!!!');
      expect(result).toBe('moreThanFifteen...');
    });
  });
});
