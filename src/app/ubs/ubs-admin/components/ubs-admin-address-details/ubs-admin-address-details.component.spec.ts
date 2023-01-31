import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UbsAdminAddressDetailsComponent } from './ubs-admin-address-details.component';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Locations } from 'src/assets/locations/locations';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { of } from 'rxjs';

describe('UbsAdminAddressDetailsComponent', () => {
  let component: UbsAdminAddressDetailsComponent;

  let fixture: ComponentFixture<UbsAdminAddressDetailsComponent>;

  const FormGroupMock = new FormGroup({
    addressRegion: new FormControl('місто Київ'),
    addressRegionEng: new FormControl('Kyiv'),
    addressCity: new FormControl('Київ'),
    addressCityEng: new FormControl('Kyiv'),
    addressStreet: new FormControl('вулиця Михайла Ломоносова'),
    addressStreetEng: new FormControl('Mykhaila Lomonosova Street'),
    addressHouseNumber: new FormControl('12'),
    addressHouseCorpus: new FormControl('2'),
    addressEntranceNumber: new FormControl('5'),
    addressDistrict: new FormControl('Голосіївський район'),
    addressDistrictEng: new FormControl(`Holosiivs'kyi district`)
  });

  const status = 'OK';

  const fakeRegions = [
    { name: 'Київська область', key: 1 },
    { name: 'місто Київ', key: 2 }
  ];

  const fakeDistricts = [
    { name: 'Бориспільський', key: 1 },
    { name: 'Броварський', key: 2 },
    { name: 'Бучанський', key: 3 }
  ];

  const fakeDictrictsKyiv = [
    { name: 'Голосіївський район', key: 1 },
    { name: 'Дарницький район', key: 2 },
    { name: 'Деснянський район', key: 3 }
  ];

  const predictionListKyivRegion = [
    {
      description: 'Шевченкове, Київська область',
      matched_substrings: [
        { length: 1, offset: 1 },
        { length: 1, offset: 1 }
      ],
      place_id: '1111',
      reference: '1111',
      structured_formatting: {
        main_text: 'Шевченкове',
        main_text_matched_substrings: [{ length: 1, offset: 1 }],
        secondary_text: 'Київська область',
        secondary_text_matched_substrings: [{ length: 1, offset: 1 }]
      },
      terms: [
        { offset: 1, value: 'Шевченкове' },
        { offset: 1, value: 'Київська область' }
      ],
      types: ['locality', 'political', 'geocode']
    },
    {
      description: 'Шевченківка, Київська область',
      matched_substrings: [
        { length: 1, offset: 1 },
        { length: 1, offset: 1 }
      ],
      place_id: '2222',
      reference: '2222',
      structured_formatting: {
        main_text: 'Шевченківка',
        main_text_matched_substrings: [{ length: 1, offset: 1 }],
        secondary_text: 'Київська область',
        secondary_text_matched_substrings: [{ length: 1, offset: 1 }]
      },
      terms: [
        { offset: 1, value: 'Шевченківка' },
        { offset: 1, value: 'Київська область' }
      ],
      types: ['locality', 'political', 'geocode']
    }
  ];

  const predictionListKyivCity = [
    {
      description: 'Київ, місто Київ',
      matched_substrings: [
        { length: 1, offset: 1 },
        { length: 1, offset: 1 }
      ],
      place_id: 'ChIJBUVa4U7P1EAR_kYBF9IxSXY',
      reference: '1111',
      structured_formatting: {
        main_text: 'Київ',
        main_text_matched_substrings: [{ length: 1, offset: 1 }],
        secondary_text: 'місто Київ',
        secondary_text_matched_substrings: [{ length: 1, offset: 1 }]
      },
      terms: [
        { offset: 1, value: 'Київ' },
        { offset: 1, value: 'місто Київ' }
      ],
      types: ['locality', 'political', 'geocode']
    },
    {
      description: 'Київ, Миколаївська область',
      matched_substrings: [
        { length: 1, offset: 1 },
        { length: 1, offset: 1 }
      ],
      place_id: '2222',
      reference: '2222',
      structured_formatting: {
        main_text: 'Київ',
        main_text_matched_substrings: [{ length: 1, offset: 1 }],
        secondary_text: 'Миколаївська область',
        secondary_text_matched_substrings: [{ length: 1, offset: 1 }]
      },
      terms: [
        { offset: 1, value: 'Київ' },
        { offset: 1, value: 'Миколаївська область' }
      ],
      types: ['locality', 'political', 'geocode']
    }
  ];

  const placeResultKyivUk = {
    address_components: [
      { long_name: 'Київ', short_name: 'Київ', types: ['locality', 'political'] },
      { long_name: 'місто Київ', short_name: 'місто Київ', types: ['administrative_area_level_2', 'political'] }
    ],
    formatted_address: 'Київ, Україна, 02000',
    name: 'Київ',
    place_id: 'ChIJBUVa4U7P1EAR_kYBF9IxSXY'
  };

  const cityPlaceResultUk = {
    address_components: [
      { long_name: 'Шевченкове', short_name: 'Шевченкове', types: ['locality', 'political'] },
      { long_name: 'Київська область', short_name: 'Київська область', types: ['administrative_area_level_2', 'political'] }
    ],
    formatted_address: 'Шевченкове, Київська область, Україна, 02000',
    name: 'Шевченкове',
    place_id: '111'
  };

  const cityPlaceResultEn = {
    address_components: [
      { long_name: 'Kyiv', short_name: 'Kyiv', types: ['locality', 'political'] },
      { long_name: 'Kyiv City', short_name: 'Kyiv City', types: ['administrative_area_level_2', 'political'] }
    ],
    formatted_address: 'Kyiv, Ukraine, 02000',
    name: 'Kyiv',
    place_id: 'ChIJBUVa4U7P1EAR_kYBF9IxSXY'
  };

  const streetPredictionKyivCity = [
    {
      description: 'вулиця Ломоносова, Київ, Україна',
      matched_substrings: [
        { length: 1, offset: 1 },
        { length: 1, offset: 1 }
      ],
      place_id:
        'EixNeWtoYWlsYSBMb21vbm9zb3ZhIFN0LCBLeWl2LCBVa3JhaW5lLCAwMjAwMCIuKiwKFAoSCb9RPBbdyNRAEb8pDeFisJyLEhQKEgkFRVrhTs_UQBH-RgEX0jFJdg',
      reference: '1111',
      structured_formatting: {
        main_text: 'вулиця Ломоносова',
        main_text_matched_substrings: [{ length: 1, offset: 1 }],
        secondary_text: 'Київ, Україна',
        secondary_text_matched_substrings: [{ length: 1, offset: 1 }]
      },
      terms: [
        { offset: 1, value: 'вулиця Ломоносова' },
        { offset: 1, value: 'Київ' }
      ],
      types: ['route', 'geocode']
    },
    {
      description: 'вулиця Січневого повстання, Київ, Україна',
      matched_substrings: [
        { length: 1, offset: 1 },
        { length: 1, offset: 1 }
      ],
      place_id: '2222',
      reference: '2222',
      structured_formatting: {
        main_text: 'вулиця Січневого повстання',
        main_text_matched_substrings: [{ length: 1, offset: 1 }],
        secondary_text: 'Київ, Україна',
        secondary_text_matched_substrings: [{ length: 1, offset: 1 }]
      },
      terms: [
        { offset: 1, value: 'вулиця Січневого повстання' },
        { offset: 1, value: 'Київ' }
      ],
      types: ['route', 'geocode']
    }
  ];

  const streetPredictionKyivRegion = [
    {
      description: 'вулиця Незалежності, Щасливе, Київська область, Україна',
      matched_substrings: [
        { length: 1, offset: 1 },
        { length: 1, offset: 1 }
      ],
      place_id: '1111',
      reference: '1111',
      structured_formatting: {
        main_text: 'вулиця Незалежності',
        main_text_matched_substrings: [{ length: 1, offset: 1 }],
        secondary_text: 'Щасливе, Київська область, Україна',
        secondary_text_matched_substrings: [{ length: 1, offset: 1 }]
      },
      terms: [
        { offset: 1, value: 'вулиця Незалежності' },
        { offset: 1, value: 'Щасливе' }
      ],
      types: ['route', 'geocode']
    },
    {
      description: 'вулиця Незалежності, Щасливе, Миколаївська область, Україна',
      matched_substrings: [
        { length: 1, offset: 1 },
        { length: 1, offset: 1 }
      ],
      place_id: '2222',
      reference: '2222',
      structured_formatting: {
        main_text: 'вулиця Незалежності',
        main_text_matched_substrings: [{ length: 1, offset: 1 }],
        secondary_text: 'Щасливе, Миколаївська область, Україна',
        secondary_text_matched_substrings: [{ length: 1, offset: 1 }]
      },
      terms: [
        { offset: 1, value: 'вулиця Незалежності' },
        { offset: 1, value: 'Щасливе' }
      ],
      types: ['route', 'geocode']
    }
  ];

  const streetPlaceResultUk = {
    address_components: [
      { long_name: 'вулиця Ломоносова', short_name: 'вулиця Ломоносова', types: ['locality', 'political'] },
      { long_name: 'Голосіївський район', short_name: 'Голосіївський район', types: ['administrative_area_level_2', 'political'] },
      { long_name: 'місто Київ', short_name: 'місто Київ', types: ['administrative_area_level_2', 'political'] }
    ],
    formatted_address: 'вулиця Ломоносова, Київ, Україна, 02000',
    name: 'вулиця Ломоносова',
    place_id:
      'EixNeWtoYWlsYSBMb21vbm9zb3ZhIFN0LCBLeWl2LCBVa3JhaW5lLCAwMjAwMCIuKiwKFAoSCb9RPBbdyNRAEb8pDeFisJyLEhQKEgkFRVrhTs_UQBH-RgEX0jFJdg'
  };

  const streetPlaceResultEn = {
    address_components: [
      { long_name: 'Lomonosova street', short_name: 'Lomonosova street', types: ['locality', 'political'] },
      { long_name: `Holosiivs'kyi district`, short_name: `Holosiivs'kyi district`, types: ['administrative_area_level_2', 'political'] },
      { long_name: 'Kyiv', short_name: 'Kyiv', types: ['administrative_area_level_2', 'political'] }
    ],
    formatted_address: 'вулиця Ломоносова, Київ, Україна, 02000',
    name: 'вулиця Ломоносова',
    place_id:
      'EixNeWtoYWlsYSBMb21vbm9zb3ZhIFN0LCBLeWl2LCBVa3JhaW5lLCAwMjAwMCIuKiwKFAoSCb9RPBbdyNRAEb8pDeFisJyLEhQKEgkFRVrhTs_UQBH-RgEX0jFJdg'
  };

  const fakeLocalStorageService = jasmine.createSpyObj('LocalStorageService', ['getCurrentLanguage', 'languageBehaviourSubject']);
  fakeLocalStorageService.getCurrentLanguage = () => 'ua';
  fakeLocalStorageService.languageBehaviourSubject = new BehaviorSubject('ua');

  const fakeLocationsMockUk = jasmine.createSpyObj('Locations', ['getBigRegions', 'getRegions', 'getRegionsKyiv']);
  fakeLocationsMockUk.getBigRegions.and.returnValue(fakeRegions);
  fakeLocationsMockUk.getRegions.and.returnValue(fakeDistricts);
  fakeLocationsMockUk.getRegionsKyiv.and.returnValue(fakeDictrictsKyiv);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminAddressDetailsComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: LocalStorageService, useValue: fakeLocalStorageService },
        { provide: Locations, useValue: fakeLocationsMockUk }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminAddressDetailsComponent);
    component = fixture.componentInstance;
    component.addressExportDetailsDto = FormGroupMock;
    const spy = spyOn(component as any, 'initGoogleAutocompleteServices');
    fixture.detectChanges();
    spy.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change pageOpen', () => {
    component.pageOpen = true;
    const spy = spyOn(component, 'loadData');
    component.openDetails();
    expect(component.pageOpen).toBe(false);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should change pageOpen and load data', () => {
    component.pageOpen = false;
    const spy = spyOn(component, 'loadData');
    component.openDetails();
    expect(component.pageOpen).toBe(true);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('method loadData should get data', () => {
    component.addressCity.setValue('Київ');
    component.loadData();
    expect(component.currentLanguage).toBe('ua');
    expect(component.isDistrict).toBe(true);
    expect(component.regions).toBe(fakeRegions);
    expect(component.districtsKyiv).toBe(fakeDictrictsKyiv);
    expect(component.districts).toBe(fakeDistricts);
  });

  it('if value of region was changed other fields should be empty', fakeAsync(() => {
    component.loadData();
    component.addressRegion.setValue('Київська область');
    component.addressRegion.updateValueAndValidity({ emitEvent: true });
    tick();
    fixture.detectChanges();
    expect(component.addressCity.value).toBe('');
    expect(component.addressCityEng.value).toBe('');
    expect(component.addressStreet.value).toBe('');
    expect(component.addressStreetEng.value).toBe('');
    expect(component.addressHouseNumber.value).toBe('');
    expect(component.addressHouseCorpus.value).toBe('');
    expect(component.addressEntranceNumber.value).toBe('');
    expect(component.addressDistrict.value).toBe('');
    expect(component.addressDistrictEng.value).toBe('');
    expect(component.streetPredictionList).toBe(null);
    expect(component.cityPredictionList).toBe(null);
    expect((component as any).initGoogleAutocompleteServices).toHaveBeenCalledTimes(1);
  }));

  it('if value of city was changed other fields should be empty', fakeAsync(() => {
    component.loadData();
    component.addressCity.setValue('Щасливе');
    component.addressCity.updateValueAndValidity({ emitEvent: true });
    tick();
    fixture.detectChanges();
    expect(component.addressStreet.value).toBe('');
    expect(component.addressStreetEng.value).toBe('');
    expect(component.addressHouseNumber.value).toBe('');
    expect(component.addressHouseCorpus.value).toBe('');
    expect(component.addressEntranceNumber.value).toBe('');
    expect(component.addressDistrict.value).toBe('');
    expect(component.addressDistrictEng.value).toBe('');
    expect(component.streetPredictionList).toBe(null);
    expect((component as any).initGoogleAutocompleteServices).toHaveBeenCalledTimes(1);
  }));

  it('method setRegionValue should set addressRegion value', () => {
    const event = { target: { value: '0: Київська область' } };
    component.regions = fakeRegions;
    component.setRegionValue(event as any);
    expect(component.addressRegion.value).toBe('Київська область');
  });

  it('method setPredictCities should call method for predicting cities in ua', () => {
    component.addressRegion.setValue('місто Київ');
    component.addressCity.setValue('Київ');
    const searchAddress = `${component.addressRegion.value}, ${component.addressCity.value}`;
    const spy = spyOn(component, 'inputCity');
    component.currentLanguage = 'ua';
    component.setPredictCities();
    expect(component.cityPredictionList).toBe(null);
    expect(spy).toHaveBeenCalledWith(searchAddress, 'uk');
  });

  it('method setPredictCities should call method for predicting cities in en', () => {
    component.addressRegionEng.setValue('Kyiv');
    component.addressCityEng.setValue('Kyiv');
    const searchAddress = `${component.addressRegionEng.value},${component.addressCityEng.value}`;
    const spy = spyOn(component, 'inputCity');
    component.currentLanguage = 'en';
    component.setPredictCities();
    expect(component.cityPredictionList).toBe(null);
    expect(spy).toHaveBeenCalledWith(searchAddress, 'en');
  });

  it('method inputCity should invoke getPlacePredictions', () => {
    component.autocompleteService = { getPlacePredictions: (a, b) => {} } as any;
    spyOn(component.autocompleteService, 'getPlacePredictions').and.callThrough();
    const fakesearchAddress = `Kyiv, Kyiv`;
    component.inputCity(fakesearchAddress, component.languages.en);
    expect(component.autocompleteService.getPlacePredictions).toHaveBeenCalled();
  });

  it('method getPlacePredictions should form prediction list for Kyiv region', () => {
    component.addressRegionEng.setValue(`Kyivs'ka oblast`);
    component.autocompleteService = { getPlacePredictions: () => {} } as any;
    spyOn(component.autocompleteService, 'getPlacePredictions').and.callFake((request, callback) => {
      callback(predictionListKyivRegion, status as any);
    });
    const fakesearchAddress = `Київська область, Ше`;
    component.inputCity(fakesearchAddress, component.languages.uk);
    expect(component.cityPredictionList).toEqual(predictionListKyivRegion);
  });

  it('method getPlacePredictions should form prediction list for Kyiv city', () => {
    const result = [predictionListKyivCity[0]];
    component.addressRegionEng.setValue(`Kyiv`);
    component.autocompleteService = { getPlacePredictions: () => {} } as any;
    spyOn(component.autocompleteService, 'getPlacePredictions').and.callFake((request, callback) => {
      callback(predictionListKyivCity, status as any);
    });

    const fakesearchAddress = `Київ`;
    component.inputCity(fakesearchAddress, component.languages.uk);
    expect(component.cityPredictionList).toEqual(result);
  });

  it('method onCitySelected should invoke method setValueOfCity 2 times', () => {
    const spy = spyOn(component, 'setValueOfCity');
    component.onCitySelected(predictionListKyivRegion[0]);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('method onCitySelected should invoke methods to set value of city', () => {
    const spy = spyOn(component, 'setValueOfCity');
    component.onCitySelected(predictionListKyivRegion[0]);
    expect(spy).toHaveBeenCalledWith(predictionListKyivRegion[0], component.addressCity, component.languages.uk);
    expect(spy).toHaveBeenCalledWith(predictionListKyivRegion[0], component.addressCityEng, component.languages.en);
  });

  it('method onCitySelected should invoke getDetails', () => {
    component.placeService = { getDetails: (a, b) => {} } as any;
    spyOn(component.placeService, 'getDetails').and.callThrough();
    component.setValueOfCity(predictionListKyivRegion[0], component.addressCity, component.languages.uk);
    expect(component.placeService.getDetails).toHaveBeenCalled();
  });

  it('method onCitySelected should get details for selected city in en', () => {
    component.placeService = { getDetails: () => {} } as any;
    spyOn(component.placeService, 'getDetails').and.callFake((request, callback) => {
      callback(cityPlaceResultEn, status as any);
    });
    component.setValueOfCity(predictionListKyivCity[0], component.addressCityEng, component.languages.en);
    expect(component.addressCityEng.value).toEqual(cityPlaceResultEn.name);
  });

  it('method onCitySelected should get details for selected city in uk', () => {
    component.placeService = { getDetails: () => {} } as any;
    spyOn(component.placeService, 'getDetails').and.callFake((request, callback) => {
      callback(placeResultKyivUk, status as any);
    });
    component.setValueOfCity(predictionListKyivCity[0], component.addressCity, component.languages.uk);
    expect(component.addressCity.value).toEqual(placeResultKyivUk.name);
    expect(component.isDistrict).toEqual(true);
  });

  it('method onCitySelected should set isDistrict if city is not Kyiv', () => {
    component.placeService = { getDetails: () => {} } as any;
    spyOn(component.placeService, 'getDetails').and.callFake((request, callback) => {
      callback(cityPlaceResultUk, status as any);
    });
    component.setValueOfCity(predictionListKyivCity[0], component.addressCity, component.languages.uk);
    expect(component.addressCity.value).toEqual(cityPlaceResultUk.name);
    expect(component.isDistrict).toEqual(false);
  });

  it('method setPredictStreets should call method for predicting streets in ua', () => {
    component.addressCity.setValue('Київ');
    component.addressStreet.setValue('Ломо');
    const searchAddress = `${component.addressCity.value}, ${component.addressStreet.value}`;
    const spy = spyOn(component, 'inputAddress');
    component.currentLanguage = 'ua';
    component.setPredictStreets();
    expect(component.streetPredictionList).toBe(null);
    expect(spy).toHaveBeenCalledWith(searchAddress, 'uk');
  });

  it('method setPredictStreets should call method for predicting streets in en', () => {
    component.addressCityEng.setValue('Kyiv');
    component.addressStreetEng.setValue('Lomo');
    const searchAddress = `${component.addressCityEng.value}, ${component.addressStreetEng.value}`;
    const spy = spyOn(component, 'inputAddress');
    component.currentLanguage = 'en';
    component.setPredictStreets();
    expect(component.streetPredictionList).toBe(null);
    expect(spy).toHaveBeenCalledWith(searchAddress, 'en');
  });

  it('method inputAddress should invoke getPlacePredictions', () => {
    component.autocompleteService = { getPlacePredictions: (a, b) => {} } as any;
    spyOn(component.autocompleteService, 'getPlacePredictions').and.callThrough();
    const fakesearchAddress = `Kyiv, Lomo`;
    component.inputAddress(fakesearchAddress, component.languages.en);
    expect(component.autocompleteService.getPlacePredictions).toHaveBeenCalled();
  });

  it('method getPlacePredictions should form prediction street list for Kyiv city', () => {
    component.isDistrict = true;
    component.addressCity.setValue(`Київ`);
    component.autocompleteService = { getPlacePredictions: () => {} } as any;
    spyOn(component.autocompleteService, 'getPlacePredictions').and.callFake((request, callback) => {
      callback(streetPredictionKyivCity, status as any);
    });
    const fakesearchAddress = `Київ, Сі`;
    component.inputAddress(fakesearchAddress, component.languages.uk);
    expect(component.streetPredictionList).toEqual(streetPredictionKyivCity);
  });

  it('method getPlacePredictions should form prediction street list for Kyiv region', () => {
    component.isDistrict = false;
    const result = [streetPredictionKyivRegion[0]];
    component.addressCity.setValue(`Щасливе`);
    component.autocompleteService = { getPlacePredictions: () => {} } as any;
    spyOn(component.autocompleteService, 'getPlacePredictions').and.callFake((request, callback) => {
      callback(streetPredictionKyivRegion, status as any);
    });

    const fakesearchAddress = `Щасливе, Не`;
    component.inputAddress(fakesearchAddress, component.languages.uk);
    expect(component.streetPredictionList).toEqual(result);
  });

  it('method onStreetSelected should invoke method setValueOfStreet 2 times', () => {
    const spy = spyOn(component, 'setValueOfStreet');
    component.onStreetSelected(streetPredictionKyivRegion[0]);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('method onStreetSelected should invoke methods to set value of street', () => {
    const spy = spyOn(component, 'setValueOfStreet');
    component.onStreetSelected(streetPredictionKyivRegion[0]);
    expect(spy).toHaveBeenCalledWith(streetPredictionKyivRegion[0], component.addressStreet, component.languages.uk);
    expect(spy).toHaveBeenCalledWith(streetPredictionKyivRegion[0], component.addressStreetEng, component.languages.en);
  });

  it('method onStreetSelected should invoke getDetails', () => {
    component.placeService = { getDetails: (a, b) => {} } as any;
    spyOn(component.placeService, 'getDetails').and.callThrough();
    component.setValueOfStreet(streetPredictionKyivRegion[0], component.addressStreet, component.languages.uk);
    expect(component.placeService.getDetails).toHaveBeenCalled();
  });

  it('method onStreetSelected should get details for selected street in en', () => {
    component.isDistrict = true;
    const spy = spyOn(component, 'setDistrictAuto');
    component.placeService = { getDetails: () => {} } as any;
    spyOn(component.placeService, 'getDetails').and.callFake((request, callback) => {
      callback(streetPlaceResultEn, status as any);
    });
    component.setValueOfStreet(streetPredictionKyivCity[0], component.addressStreetEng, component.languages.en);
    expect(component.addressStreetEng.value).toEqual(streetPlaceResultEn.name);
    expect(spy).toHaveBeenCalledWith(streetPlaceResultEn, component.addressDistrictEng, component.languages.en);
  });

  it('method onStreetSelected should get details for selected street in uk', () => {
    component.isDistrict = true;
    const spy = spyOn(component, 'setDistrictAuto');
    component.placeService = { getDetails: () => {} } as any;
    spyOn(component.placeService, 'getDetails').and.callFake((request, callback) => {
      callback(streetPlaceResultUk, status as any);
    });
    component.setValueOfStreet(streetPredictionKyivCity[0], component.addressStreet, component.languages.uk);
    expect(component.addressStreet.value).toEqual(streetPlaceResultUk.name);
    expect(spy).toHaveBeenCalledWith(streetPlaceResultUk, component.addressDistrict, component.languages.uk);
  });

  it('method setDistrictAuto should set district value in uk', () => {
    const result = streetPlaceResultUk.address_components[1].long_name;
    component.setDistrictAuto(streetPlaceResultUk, component.addressDistrict, component.languages.uk);
    expect(component.addressDistrict.value).toEqual(result);
  });

  it('method setDistrictAuto should set district value in en', () => {
    const result = streetPlaceResultEn.address_components[1].long_name;
    component.setDistrictAuto(streetPlaceResultEn, component.addressDistrictEng, component.languages.en);
    expect(component.addressDistrictEng.value).toEqual(result);
  });

  it('method onDistrictSelected should invoke method for setting district value in Kyiv city', () => {
    component.isDistrict = true;
    const event = { target: { value: '1: Дарницький район' } };
    const spy = spyOn(component, 'setKyivDistrict');
    component.onDistrictSelected(event as any);
    expect(spy).toHaveBeenCalledWith('1');
  });

  it('method onDistrictSelected should invoke method for setting district value in Kyiv region', () => {
    component.isDistrict = false;
    const event = { target: { value: '1: Броварський' } };
    const spy = spyOn(component, 'setDistrict');
    component.onDistrictSelected(event as any);
    expect(spy).toHaveBeenCalledWith('1');
  });

  it('method setKyivDistrict should set district value in Kyiv city', () => {
    component.setKyivDistrict('1');
    expect(component.addressDistrict.value).toEqual(fakeDictrictsKyiv[1].name);
  });

  it('method setDistrict should set district value in Kyiv region', () => {
    component.setDistrict('1');
    expect(component.addressDistrict.value).toEqual(fakeDistricts[1].name);
  });
});
