import { SearchPipe } from './search-tariff.pipe';

describe('SearchPipe', () => {
  let pipe: SearchPipe;
  const fakeLocations = {
    regionTranslationDtos: [
      {
        languageCode: 'ua',
        regionName: 'fake'
      },
      {
        languageCode: 'en',
        regionName: 'fake'
      }
    ]
  };

  beforeEach(() => {
    pipe = new SearchPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty array if no items given', () => {
    const items = null;

    const filtered = pipe.transform(items, ['Усі'], ['regionTranslationDtos']);

    expect(filtered).toEqual(null);
  });

  it('should return items if no value is given', () => {
    const items = [];
    items.push(fakeLocations);

    const filtered = pipe.transform(items, ['Усі'], null);

    expect(filtered).toEqual(items);
  });

  it('should filter correctly', () => {
    const items = [];
    items.push(fakeLocations);

    const filtered = pipe.transform(items, ['fake'], ['regionTranslationDtos']);

    expect(filtered.length).toBe(1);
  });
});
