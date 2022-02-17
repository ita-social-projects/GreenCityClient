import { MaxImageNamePipe } from './max-image-name.pipe';

describe('MaxImageNamePipe', () => {
  const pipe = new MaxImageNamePipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('transform', () => {
    it(`imageName less than maxImgNameLength`, () => {
      const result = pipe.transform('lessThan15');
      expect(result).toBe('lessThan15');
    });

    it(`imageName more than maxImgNameLength`, () => {
      const result = pipe.transform('moreThanFifteen!!!');
      expect(result).toBe('moreThanFifteen...');
    });
  });
});
