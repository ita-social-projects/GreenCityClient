import { TestBed } from '@angular/core/testing';
import { LocationService } from './location.service';

describe('LocationService', () => {
  let locations;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [],
      imports: []
    });
    locations = TestBed.inject(LocationService);
  });

  it('should be created', () => {
    expect(locations).toBeTruthy();
  });

  it('should get auto district', () => {
    const placeDetails = {
      address_components: [{ long_name: 'Name of District' }]
    };
    const convertedAddress = locations.getDistrictAuto(placeDetails, 'en');
    expect(convertedAddress).toBe('Name of district');
  });

  it('should convert value that only first letter will be capital letter', () => {
    const convertedAddress = locations.convFirstLetterToCapital('Name of District');
    expect(convertedAddress).toBe('Name of district');
  });

  it('should add House Number To Address', () => {
    const convertedAddress = locations.addHouseNumToAddress('Skovorody street, Kyiv, Ukraine', 2);
    expect(convertedAddress).toBe('Skovorody street, 2, Kyiv, Ukraine');
  });
});
