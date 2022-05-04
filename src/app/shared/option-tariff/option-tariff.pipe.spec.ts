import { OptionPipe } from './option-tariff.pipe';

describe('OptionPipe', () => {
  let pipe: OptionPipe;
  const fakeLocations = {
    stationTranslationDtos: [
      {
        languageCode: 'ua',
        name: 'fake'
      },
      {
        languageCode: 'en',
        name: 'fake'
      }
    ],
    courierTranslationDtos: [
      {
        languageCode: 'ua',
        name: 'fake'
      },
      {
        languageCode: 'en',
        name: 'fake'
      }
    ],
    status: 'fake'
  };

  beforeEach(() => {
    pipe = new OptionPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty array if no items given', () => {
    const items = null;

    const filtered = pipe.transform(items, ['all'], ['status']);

    expect(filtered).toEqual([-1]);
  });

  it('should return items if no value is given', () => {
    const items = [];
    items.push(fakeLocations);

    const filtered = pipe.transform(items, ['all'], null);

    expect(filtered).toEqual(items);
  });

  it('should filter correctly', () => {
    const items = [];

    items.push(fakeLocations);

    const filtered = pipe.transform(items, ['fake', 'fake', 'fake'], ['status', 'courierTranslationDtos', 'stationTranslationDtos']);

    expect(filtered.length).toBe(1);
  });
});
