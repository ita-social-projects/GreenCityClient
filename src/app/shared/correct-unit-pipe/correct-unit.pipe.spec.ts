import { CorrectUnitPipe } from './correct-unit.pipe';

describe('CorrectUnitPipe', () => {
  let pipe;

  beforeEach(() => {
    pipe = new CorrectUnitPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should use correct unit form for 21,31... with Ukrainian language', () => {
    expect(pipe.transform('profile.elements', 21, 'ua')).toBe('profile.elements.singular');
  });

  it('should use correct unit form for 2,3,4  with Ukrainian language', () => {
    expect(pipe.transform('profile.elements', 2, 'ua')).toBe('profile.elements.plural.units-2-3-4');
  });

  it('should use correct unit form for plural values with Ukrainian language', () => {
    expect(pipe.transform('profile.elements', 25, 'ua')).toBe('profile.elements.plural.units-more-5');
  });

  it('should use correct unit form for plural values with English language', () => {
    expect(pipe.transform('profile.elements', 25, 'en')).toBe('profile.elements.plural');
  });

  it('should use correct unit form for singular values with English language', () => {
    expect(pipe.transform('profile.elements', 1, 'en')).toBe('profile.elements.singular');
  });
});
