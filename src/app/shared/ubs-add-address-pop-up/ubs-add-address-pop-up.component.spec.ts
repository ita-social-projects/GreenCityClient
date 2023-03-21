import { MatSnackBarComponent } from 'src/app/main/component/errors/mat-snack-bar/mat-snack-bar.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UBSAddAddressPopUpComponent } from './ubs-add-address-pop-up.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of, Subject } from 'rxjs';
import { DropdownModule } from 'angular-bootstrap-md';
import { Language } from 'src/app/main/i18n/Language';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { OrderService } from 'src/app/ubs/ubs/services/order.service';
import { Address } from 'src/app/ubs/ubs/models/ubs.interface';
import { Locations } from 'src/assets/locations/locations';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { GoogleScript } from 'src/assets/google-script/google-script';
import { ToFirstCapitalLetterService } from '../to-first-capital-letter/to-first-capital-letter.service';

describe('UBSAddAddressPopUpComponent', () => {
  let component: UBSAddAddressPopUpComponent;
  let fixture: ComponentFixture<UBSAddAddressPopUpComponent>;
  let orderService: OrderService;

  const fakeAddress = {
    id: 1,
    city: 'Київ',
    cityEn: 'Kyiv',
    district: 'Оболонський',
    districtEn: 'Obolonskyi',
    region: 'Київська область',
    regionEn: 'Kyiv region',
    entranceNumber: 13,
    street: 'fake street UA',
    streetEn: 'fake street EN',
    houseCorpus: 12,
    houseNumber: 11,
    addressComment: 'fakeComment',
    actual: true,
    searchAddress: 'fakeStreet, fakeNumber, fakeCity, fakeRegion',
    coordinates: {
      latitude: 123,
      longitude: 456
    }
  };
  const fakeInitData = {
    edit: true,
    address: fakeAddress
  };

  const status = 'OK';

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

  const fakeLocationsMockUk = jasmine.createSpyObj('Locations', ['getRegions', 'getRegionsKyiv']);
  fakeLocationsMockUk.getRegions.and.returnValue(fakeDistricts);
  fakeLocationsMockUk.getRegionsKyiv.and.returnValue(fakeDictrictsKyiv);

  const fakeMatDialogRef = jasmine.createSpyObj(['close']);

  const fakeLocalStorageService = jasmine.createSpyObj('LocalStorageService', ['getCurrentLanguage', 'languageBehaviourSubject']);
  fakeLocalStorageService.getCurrentLanguage = () => 'ua' as Language;
  fakeLocalStorageService.languageBehaviourSubject = new BehaviorSubject('ua');

  const fakeGoogleScript = jasmine.createSpyObj('GoogleScript', ['load']);
  fakeGoogleScript.load.and.returnValue(of());

  const fakeConvFirstLetterServ = jasmine.createSpyObj('ToFirstCapitalLetterService', ['convFirstLetterToCapital']);
  fakeConvFirstLetterServ.convFirstLetterToCapital.and.returnValue(streetPlaceResultUk.address_components[1].long_name);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        DropdownModule,
        MatAutocompleteModule,
        TranslateModule.forRoot()
      ],
      declarations: [UBSAddAddressPopUpComponent],
      providers: [
        OrderService,
        { provide: MatDialogRef, useValue: fakeMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: fakeInitData },
        { provide: MatSnackBarComponent, useValue: {} },
        { provide: LocalStorageService, useValue: fakeLocalStorageService },
        { provide: Locations, useValue: fakeLocationsMockUk },
        { provide: GoogleScript, useValue: fakeGoogleScript },
        { provide: ToFirstCapitalLetterService, useValue: fakeConvFirstLetterServ }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UBSAddAddressPopUpComponent);
    component = fixture.componentInstance;
    const spy = spyOn(component as any, 'initGoogleAutocompleteServices');
    fixture.detectChanges();
    spy.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deleteAddress', () => {
    component.isDisabled = true;
    orderService = TestBed.inject(OrderService);
    spyOn(orderService, 'deleteAddress').and.returnValue(of(true));
    component.deleteAddress();
    expect((component as any).orderService.deleteAddress).toHaveBeenCalledTimes(1);
    expect(component.isDisabled).toBeFalsy();
  });

  it('method ngOnInit should init form and invoke methods', () => {
    component.ngOnInit();
    expect(component.addAddressForm).toBeTruthy();
    expect(component.currentLanguage).toBe('ua');
    expect(component.bigRegions).toEqual([{ regionName: 'Київська область', lang: 'ua' }]);
    expect(component.regionsKyiv).toBe(fakeDictrictsKyiv);
    expect(component.regions).toBe(fakeDistricts);
  });

  it('the form should include address data when address is editing', () => {
    component.data.edit = true;
    component.ngOnInit();
    expect(component.region.value).toEqual(fakeAddress.region);
    expect(component.regionEn.value).toEqual(fakeAddress.regionEn);
    expect(component.city.value).toEqual(fakeAddress.city);
    expect(component.cityEn.value).toEqual(fakeAddress.cityEn);
    expect(component.district.value).toEqual(fakeAddress.district);
    expect(component.districtEn.value).toEqual(fakeAddress.districtEn);
    expect(component.street.value).toEqual(fakeAddress.street);
    expect(component.streetEn.value).toEqual(fakeAddress.streetEn);
    expect(component.houseNumber.value).toEqual(fakeAddress.houseNumber);
    expect(component.houseCorpus.value).toEqual(fakeAddress.houseCorpus);
    expect(component.entranceNumber.value).toEqual(fakeAddress.entranceNumber);
    expect(component.addressComment.value).toEqual(fakeAddress.addressComment);
  });

  it('the form should be empty (exept of region value) when user adds new address', () => {
    component.data.edit = false;
    component.ngOnInit();
    expect(component.region.value).toEqual(component.bigRegionsList[0].regionName);
    expect(component.regionEn.value).toEqual(component.bigRegionsList[1].regionName);
    expect(component.city.value).toEqual(null);
    expect(component.cityEn.value).toEqual(null);
    expect(component.district.value).toEqual('');
    expect(component.districtEn.value).toEqual('');
    expect(component.street.value).toEqual('');
    expect(component.streetEn.value).toEqual('');
    expect(component.houseNumber.value).toEqual('');
    expect(component.houseCorpus.value).toEqual('');
    expect(component.entranceNumber.value).toEqual('');
    expect(component.addressComment.value).toEqual('');
  });

  it('if value of city was changed other fields should be empty', fakeAsync(() => {
    component.ngOnInit();
    component.city.setValue('Київ');
    component.city.updateValueAndValidity({ emitEvent: true });
    tick();
    fixture.detectChanges();
    expect(component.street.value).toBe('');
    expect(component.streetEn.value).toBe('');
    expect(component.houseNumber.value).toBe('');
    expect(component.houseCorpus.value).toBe('');
    expect(component.entranceNumber.value).toBe('');
    expect(component.district.value).toBe('');
    expect(component.districtEn.value).toBe('');
    expect(component.streetPredictionList).toBe(null);
    expect(component.cityPredictionList).toBe(null);
  }));

  it('method ngAfterViewInit should invoke methods', () => {
    component.ngAfterViewInit();
    expect((component as any).initGoogleAutocompleteServices).toHaveBeenCalledTimes(1);
  });

  it('method setPredictCities should call method for predicting cities in ua', () => {
    component.city.setValue('Київ');
    const searchAddress = `Київська область, місто, ${component.city.value}`;
    const spy = spyOn(component, 'inputCity');
    component.currentLanguage = 'ua';
    component.setPredictCities();
    expect(component.cityPredictionList).toBe(null);
    expect(spy).toHaveBeenCalledWith(searchAddress, 'uk');
  });

  it('method setPredictCities should call method for predicting cities in en', () => {
    component.cityEn.setValue('Kyiv');
    const searchAddress = `Kyiv Oblast, City,${component.cityEn.value}`;
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
    component.autocompleteService = { getPlacePredictions: () => {} } as any;
    spyOn(component.autocompleteService, 'getPlacePredictions').and.callFake((request, callback) => {
      callback(predictionListKyivRegion, status as any);
    });
    const fakesearchAddress = `Київська область, Ше`;
    component.inputCity(fakesearchAddress, component.languages.uk);
    expect(component.cityPredictionList).toEqual(predictionListKyivRegion);
  });

  it('method onCitySelected should invoke method setValueOfCity 2 times', () => {
    const spy = spyOn(component, 'setValueOfCity');
    component.onCitySelected(predictionListKyivRegion[0]);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('method onCitySelected should invoke methods to set value of city', () => {
    const spy = spyOn(component, 'setValueOfCity');
    component.onCitySelected(predictionListKyivRegion[0]);
    expect(spy).toHaveBeenCalledWith(predictionListKyivRegion[0], component.city, component.languages.uk);
    expect(spy).toHaveBeenCalledWith(predictionListKyivRegion[0], component.cityEn, component.languages.en);
  });

  it('method onCitySelected should invoke getDetails', () => {
    component.placeService = { getDetails: (a, b) => {} } as any;
    spyOn(component.placeService, 'getDetails').and.callThrough();
    component.setValueOfCity(predictionListKyivRegion[0], component.city, component.languages.uk);
    expect(component.placeService.getDetails).toHaveBeenCalled();
  });

  it('method onCitySelected should get details for selected city in en', () => {
    component.placeService = { getDetails: () => {} } as any;
    spyOn(component.placeService, 'getDetails').and.callFake((request, callback) => {
      callback(cityPlaceResultEn, status as any);
    });
    component.setValueOfCity(predictionListKyivCity[0], component.cityEn, component.languages.en);
    expect(component.cityEn.value).toEqual(cityPlaceResultEn.name);
  });

  it('method onCitySelected should get details for selected city in uk', () => {
    component.placeService = { getDetails: () => {} } as any;
    spyOn(component.placeService, 'getDetails').and.callFake((request, callback) => {
      callback(placeResultKyivUk, status as any);
    });
    component.setValueOfCity(predictionListKyivCity[0], component.city, component.languages.uk);
    expect(component.city.value).toEqual(placeResultKyivUk.name);
    expect(component.isDistrict).toEqual(true);
  });

  it('method onCitySelected should set isDistrict if city is not Kyiv', () => {
    component.placeService = { getDetails: () => {} } as any;
    spyOn(component.placeService, 'getDetails').and.callFake((request, callback) => {
      callback(cityPlaceResultUk, status as any);
    });
    component.setValueOfCity(predictionListKyivCity[0], component.city, component.languages.uk);
    expect(component.city.value).toEqual(cityPlaceResultUk.name);
    expect(component.isDistrict).toEqual(false);
  });

  it('method setPredictStreets should call method for predicting streets in ua', () => {
    component.city.setValue('Київ');
    component.street.setValue('Ломо');
    const searchAddress = `${component.city.value}, ${component.street.value}`;
    const spy = spyOn(component, 'inputAddress');
    component.currentLanguage = 'ua';
    component.setPredictStreets();
    expect(component.streetPredictionList).toBe(null);
    expect(spy).toHaveBeenCalledWith(searchAddress, 'uk');
  });

  it('method setPredictStreets should call method for predicting streets in en', () => {
    component.cityEn.setValue('Kyiv');
    component.streetEn.setValue('Lomo');
    const searchAddress = `${component.cityEn.value}, ${component.streetEn.value}`;
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
    component.city.setValue(`Київ`);
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
    component.city.setValue(`Щасливе`);
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
    expect(spy).toHaveBeenCalledWith(streetPredictionKyivRegion[0], component.street, component.languages.uk);
    expect(spy).toHaveBeenCalledWith(streetPredictionKyivRegion[0], component.streetEn, component.languages.en);
  });

  it('method onStreetSelected should invoke getDetails', () => {
    component.placeService = { getDetails: (a, b) => {} } as any;
    spyOn(component.placeService, 'getDetails').and.callThrough();
    component.setValueOfStreet(streetPredictionKyivRegion[0], component.street, component.languages.uk);
    expect(component.placeService.getDetails).toHaveBeenCalled();
  });

  it('method onStreetSelected should get details for selected street in en', () => {
    component.isDistrict = true;
    const spy = spyOn(component, 'setDistrictAuto');
    component.placeService = { getDetails: () => {} } as any;
    spyOn(component.placeService, 'getDetails').and.callFake((request, callback) => {
      callback(streetPlaceResultEn, status as any);
    });
    component.setValueOfStreet(streetPredictionKyivCity[0], component.streetEn, component.languages.en);
    expect(component.streetEn.value).toEqual(streetPlaceResultEn.name);
    expect(component.formattedAddress).toEqual(streetPlaceResultEn.formatted_address);
    expect(spy).toHaveBeenCalledWith(streetPlaceResultEn, component.districtEn, component.languages.en);
  });

  it('method onStreetSelected should get details for selected street in uk', () => {
    component.isDistrict = true;
    const spy = spyOn(component, 'setDistrictAuto');
    component.placeService = { getDetails: () => {} } as any;
    spyOn(component.placeService, 'getDetails').and.callFake((request, callback) => {
      callback(streetPlaceResultUk, status as any);
    });
    component.setValueOfStreet(streetPredictionKyivCity[0], component.street, component.languages.uk);
    expect(component.street.value).toEqual(streetPlaceResultUk.name);
    expect(spy).toHaveBeenCalledWith(streetPlaceResultUk, component.district, component.languages.uk);
  });

  it('method setDistrictAuto should set district value in uk', () => {
    const result = streetPlaceResultUk.address_components[1].long_name;
    component.setDistrictAuto(streetPlaceResultUk, component.district, component.languages.uk);
    expect(component.district.value).toEqual(result);
  });

  it('method setDistrictAuto should set district value in en', () => {
    const result = streetPlaceResultUk.address_components[1].long_name;
    component.setDistrictAuto(streetPlaceResultEn, component.districtEn, component.languages.en);
    expect(component.districtEn.value).toEqual(result);
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
    expect(component.district.value).toEqual(fakeDictrictsKyiv[1].name);
  });

  it('method setDistrict should set district value in Kyiv region', () => {
    component.setDistrict('1');
    expect(component.district.value).toEqual(fakeDistricts[1].name);
  });

  it('method onNoClick should invoke destroyRef.close()', () => {
    component.onNoClick();
    expect(fakeMatDialogRef.close).toHaveBeenCalled();
  });

  it('component function addAdress should set updatedAddresses from via orderService', () => {
    const response: { addressList: Address[] } = { addressList: [] };
    orderService = TestBed.inject(OrderService);
    spyOn(orderService, 'addAdress').and.returnValue(of(response));
    spyOn(orderService, 'updateAdress').and.returnValue(of(response));
    component.addAdress();
    fixture.detectChanges();
    expect(component.updatedAddresses).toEqual(response.addressList);
  });

  it('destroy Subject should be closed after ngOnDestroy()', () => {
    // @ts-ignore
    component.destroy = new Subject<boolean>();
    // @ts-ignore
    spyOn(component.destroy, 'unsubscribe');
    component.ngOnDestroy();
    // @ts-ignore
    expect(component.destroy.unsubscribe).toHaveBeenCalledTimes(1);
  });
});
