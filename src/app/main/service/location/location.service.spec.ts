import { TestBed } from '@angular/core/testing';
import { LocationService } from './location.service';
import { ADDRESSESMOCK } from 'src/app/ubs/mocks/address-mock';
import { of } from 'rxjs';

describe('LocationService', () => {
  let locations;

  const placeDetailsEn = {
    address_components: [{ long_name: 'Name of District' }]
  };

  const mockHousePredictions = [
    { description: 'street , 2, Kyiv, Ukraine', structured_formatting: { main_text: 'street, 2' } },
    { description: 'street , 2A, Kyiv, Ukraine', structured_formatting: { main_text: 'street, 2A' } },
    { description: 'street , 21, Kyiv', structured_formatting: { main_text: 'street, 1' } }
  ];

  const mockAutocompleteService = { getPlacePredictions: (a, b) => {} } as any;
  mockAutocompleteService.getPlacePredictions = () => of(mockHousePredictions, 'OK' as any);
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

  it('should get auto district for en lang', () => {
    const convertedAddress = locations.getDistrictAuto(placeDetailsEn, 'en');
    expect(convertedAddress).toBe('Name of district');
    expect(convertedAddress).toContain('district');
  });

  it('should call convFirstLetterToCapital on getDistrictAuto', () => {
    const spy = spyOn(locations, 'convFirstLetterToCapital');
    locations.getDistrictAuto(placeDetailsEn, 'en');
    expect(spy).toHaveBeenCalledWith('Name of District');
  });

  it('should get auto district undefined if getDistrict is null', () => {
    const placeDetails = {
      address_components: [{ long_name: 'Назва' }]
    };
    const convertedAddress = locations.getDistrictAuto(placeDetails, 'ua');
    expect(convertedAddress).toBeUndefined();
  });

  it('should convert value that only first letter will be capital letter', () => {
    const convertedAddress = locations.convFirstLetterToCapital('Name of District');
    expect(convertedAddress).toBe('Name of district');
  });

  it('should convert value that only first letter will be capital letter', () => {
    const convertedAddress = locations.convFirstLetterToCapital('Name of District');
    expect(convertedAddress).toBe('Name of district');
  });

  it('should call getRequest on getFullAddressList', () => {
    const spy = spyOn(locations, 'getRequest');
    locations.getFullAddressList(ADDRESSESMOCK.SEARCHADDRESS, mockAutocompleteService, 'en');
    expect(spy).toHaveBeenCalled();
  });

  it('should return place prediction list on getFullAddressList', () => {
    locations.getFullAddressList(ADDRESSESMOCK.SEARCHADDRESS, mockAutocompleteService, 'en').subscribe((predictions) => {
      const result = predictions;
      expect(result[0].description).toBe('street , 2, Kyiv, Ukraine');
      expect(result[0].description).toContain(ADDRESSESMOCK.SEARCHADDRESS.street);
      expect(result[0].description).toContain(ADDRESSESMOCK.SEARCHADDRESS.city);
      expect(result[0].structured_formatting.main_text).toBe('2');
    });
  });

  it('should return search address format value on getSearchAddress', () => {
    const convertedAddress = locations.getSearchAddress('Kyiv', 'street', '2');
    expect(convertedAddress).toEqual(ADDRESSESMOCK.SEARCHADDRESS);
  });

  it('should return city request value on getRequest', () => {
    const cityRequest = locations.getRequest('вулиця Київська, 2 Київ, Україна', 'ua', '(cities)');
    expect(cityRequest).toEqual(ADDRESSESMOCK.GOOGLEREQUEST);
  });
});
