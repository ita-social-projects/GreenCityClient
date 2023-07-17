import { TestBed } from '@angular/core/testing';
import { Locations } from '../locations/locations';

describe('Locations', () => {
  let locations;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [],
      imports: []
    });
    locations = TestBed.inject(Locations);
  });

  it('should be created', () => {
    expect(locations).toBeTruthy();
  });

  it('should return list of cities in en', () => {
    const result = locations.getCity('en');
    expect(result).toEqual(locations.citiesEn);
  });

  it('should return list of cities in ua', () => {
    const result = locations.getCity('ua');
    expect(result).toEqual(locations.cities);
  });

  it('should return list of regions in en', () => {
    const result = locations.getRegions('en');
    expect(result).toEqual(locations.regionsEn);
  });

  it('should return list of regions in ua', () => {
    const result = locations.getRegions('ua');
    expect(result).toEqual(locations.regions);
  });

  it('should return list of big regions in en', () => {
    const result = locations.getBigRegions('en');
    expect(result).toEqual(locations.bigRegionsEn);
  });

  it('should return list of big regions in ua', () => {
    const result = locations.getBigRegions('ua');
    expect(result).toEqual(locations.bigRegions);
  });
});
