import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { UbsAdminAddressDetailsComponent } from './ubs-admin-address-details.component';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { LocationService } from '@global-service/location/location.service';
import { OrderInfoMockedData } from '../../services/orderInfoMock';
import { OrderStatus } from 'src/app/ubs/ubs/order-status.enum';
import { ADDRESSESMOCK } from 'src/app/ubs/mocks/address-mock';
import { of } from 'rxjs';
import { Language } from 'src/app/main/i18n/Language';
import { KyivNamesEnum } from 'src/app/ubs/ubs/models/ubs.interface';
import { ubsOrderServiseMock } from 'src/app/ubs/mocks/order-data-mock';
import { Store } from '@ngrx/store';

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
    addressDistrictEng: new FormControl(`Holosiivs'kyi district`),
    addressRegionDistrictList: new FormControl(ADDRESSESMOCK.DISTRICTSKYIVMOCK)
  });

  const status = 'OK';

  const fakeLocalStorageService = jasmine.createSpyObj('LocalStorageService', ['getCurrentLanguage', 'languageBehaviourSubject']);
  fakeLocalStorageService.getCurrentLanguage = () => 'ua';
  fakeLocalStorageService.languageBehaviourSubject = new BehaviorSubject('ua');

  const languageServiceMock = jasmine.createSpyObj('languageService', ['getLangValue']);
  languageServiceMock.getLangValue = (valUa: string | AbstractControl, valEn: string | AbstractControl) => {
    return valUa;
  };

  const fakeLocationServiceMock = jasmine.createSpyObj('locationService', [
    'getDistrictAuto',
    'getFullAddressList',
    'getSearchAddress',
    'getRequest',
    'appendDistrictLabel'
  ]);
  fakeLocationServiceMock.getDistrictAuto = () => ADDRESSESMOCK.PLACESTREETUK.address_components[1].long_name;
  fakeLocationServiceMock.getFullAddressList = () => of([]);
  fakeLocalStorageService.getSearchAddress = () => ADDRESSESMOCK.SEARCHADDRESS;
  fakeLocalStorageService.getRequest = () => ADDRESSESMOCK.GOOGLEREQUEST;

  const storeMock = jasmine.createSpyObj('Store', ['select', 'dispatch']);
  storeMock.select.and.returnValue(of({ order: ubsOrderServiseMock }));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminAddressDetailsComponent],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [
        { provide: LocalStorageService, useValue: fakeLocalStorageService },
        { provide: LanguageService, useValue: languageServiceMock },
        { provide: LocationService, useValue: fakeLocationServiceMock },
        { provide: Store, useValue: storeMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminAddressDetailsComponent);
    component = fixture.componentInstance;
    component.generalInfo = OrderInfoMockedData as any;
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
    expect(component.currentLanguage).toBe(Language.UA);
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
    component.inputCity(fakesearchAddress, Language.EN);
    expect(component.autocompleteService.getPlacePredictions).toHaveBeenCalled();
  });

  it('method onDefineOrderStatus', () => {
    const spy = spyOn(component, 'ngOnInit');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should set isStatus to false when orderStatus is not "CANCELED"', () => {
    component.generalInfo.orderStatus = OrderStatus.CANCELED;
    component.isStatus = false;
    component.ngOnInit();
    expect(component.isStatus).toBe(true);
  });

  it('should set isStatus to true when orderStatus is "CANCELED"', () => {
    component.generalInfo.orderStatus = 'DONE';
    component.isStatus = false;
    component.ngOnInit();
    expect(component.isStatus).toBe(false);
  });

  it('method getPlacePredictions should form prediction list for Kyiv region', () => {
    component.addressRegionEng.setValue(`Kyivs'ka oblast`);
    component.autocompleteService = { getPlacePredictions: () => {} } as any;
    spyOn(component.autocompleteService, 'getPlacePredictions').and.callFake((request, callback) => {
      callback(ADDRESSESMOCK.KYIVREGIONSLIST, status as any);
    });
    const fakesearchAddress = `Київська область, Ше`;
    component.inputCity(fakesearchAddress, Language.UK);
    expect(component.cityPredictionList).toEqual(ADDRESSESMOCK.KYIVREGIONSLIST);
  });

  it('method getPlacePredictions should form prediction list for Kyiv city', () => {
    const result = [ADDRESSESMOCK.KYIVCITYLIST[0]];
    component.addressRegionEng.setValue(`Kyiv`);
    component.autocompleteService = { getPlacePredictions: () => {} } as any;
    spyOn(component.autocompleteService, 'getPlacePredictions').and.callFake((request, callback) => {
      callback(ADDRESSESMOCK.KYIVCITYLIST, status as any);
    });

    const fakesearchAddress = `Київ`;
    component.inputCity(fakesearchAddress, Language.UK);
    expect(component.cityPredictionList).toEqual(result);
  });

  it('method onCitySelected should invoke method setValueOfCity 2 times', () => {
    const spy = spyOn(component, 'setValueOfCity');
    component.onCitySelected(ADDRESSESMOCK.KYIVREGIONSLIST[0]);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('method onCitySelected should invoke methods to set value of city', () => {
    const spy = spyOn(component, 'setValueOfCity');
    component.onCitySelected(ADDRESSESMOCK.KYIVREGIONSLIST[0]);
    expect(spy).toHaveBeenCalledWith(ADDRESSESMOCK.KYIVREGIONSLIST[0], component.addressCity, Language.UK);
    expect(spy).toHaveBeenCalledWith(ADDRESSESMOCK.KYIVREGIONSLIST[0], component.addressCityEng, Language.EN);
  });

  it('method onCitySelected should invoke getDetails', () => {
    component.placeService = { getDetails: (a, b) => {} } as any;
    spyOn(component.placeService, 'getDetails').and.callThrough();
    component.setValueOfCity(ADDRESSESMOCK.KYIVREGIONSLIST[0], component.addressCity, Language.UK);
    expect(component.placeService.getDetails).toHaveBeenCalled();
  });

  it('method onCitySelected should get details for selected city in en', () => {
    component.placeService = { getDetails: () => {} } as any;
    spyOn(component.placeService, 'getDetails').and.callFake((request, callback) => {
      callback(ADDRESSESMOCK.PLACECITYEN, status as any);
    });
    component.setValueOfCity(ADDRESSESMOCK.KYIVCITYLIST[0], component.addressCityEng, Language.EN);
    expect(component.addressCityEng.value).toEqual(ADDRESSESMOCK.PLACECITYEN.name);
  });

  it('method onCitySelected should get details for selected city in uk', () => {
    component.placeService = { getDetails: () => {} } as any;
    spyOn(component.placeService, 'getDetails').and.callFake((request, callback) => {
      callback(ADDRESSESMOCK.PLACEKYIVUK, status as any);
    });
    component.setValueOfCity(ADDRESSESMOCK.KYIVCITYLIST[0], component.addressCity, Language.UK);
    expect(component.addressCity.value).toEqual(ADDRESSESMOCK.PLACEKYIVUK.name);
  });

  it('method onCitySelected should set isDistrictKyiv if city is not Kyiv', () => {
    component.placeService = { getDetails: () => {} } as any;
    spyOn(component.placeService, 'getDetails').and.callFake((request, callback) => {
      callback(ADDRESSESMOCK.PLACECITYUK, status as any);
    });
    component.setValueOfCity(ADDRESSESMOCK.KYIVCITYLIST[0], component.addressCity, Language.UK);
    expect(component.addressCity.value).toEqual(ADDRESSESMOCK.PLACECITYUK.name);
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
    component.inputAddress(fakesearchAddress, Language.EN);
    expect(component.autocompleteService.getPlacePredictions).toHaveBeenCalled();
  });

  it('method onStreetSelected should invoke method setValueOfStreet 2 times', () => {
    const spy = spyOn(component, 'setValueOfStreet');
    component.onStreetSelected(ADDRESSESMOCK.STREETSKYIVREGIONLIST[0]);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('method onStreetSelected should invoke methods to set value of street', () => {
    const spy = spyOn(component, 'setValueOfStreet');
    component.onStreetSelected(ADDRESSESMOCK.STREETSKYIVREGIONLIST[0]);
    expect(spy).toHaveBeenCalledWith(ADDRESSESMOCK.STREETSKYIVREGIONLIST[0], component.addressStreet, Language.UK);
    expect(spy).toHaveBeenCalledWith(ADDRESSESMOCK.STREETSKYIVREGIONLIST[0], component.addressStreetEng, Language.EN);
  });

  it('method onStreetSelected should invoke getDetails', () => {
    component.placeService = { getDetails: (a, b) => {} } as any;
    spyOn(component.placeService, 'getDetails').and.callThrough();
    component.setValueOfStreet(ADDRESSESMOCK.STREETSKYIVREGIONLIST[0], component.addressStreet, Language.UK);
    component.setValueOfStreet(ADDRESSESMOCK.STREETSKYIVREGIONLIST[0], component.addressStreetEng, Language.EN);
    expect(component.placeService.getDetails).toHaveBeenCalled();
  });

  it('method onStreetSelected should get details for selected street in en', () => {
    const spy = spyOn(component, 'setDistrictAuto');
    component.placeService = { getDetails: () => {} } as any;
    spyOn(component.placeService, 'getDetails').and.callFake((request, callback) => {
      callback(ADDRESSESMOCK.PLACESTREETEN, status as any);
    });
    component.setValueOfStreet(ADDRESSESMOCK.STREETSKYIVCITYLIST[0], component.addressStreetEng, Language.EN);
    expect(component.addressStreetEng.value).toEqual(ADDRESSESMOCK.PLACESTREETEN.name);
    expect(spy).toHaveBeenCalledWith(ADDRESSESMOCK.PLACESTREETEN, component.addressDistrictEng, Language.EN);
  });

  it('method onStreetSelected should get details for selected street in uk', () => {
    const spy = spyOn(component, 'setDistrictAuto');
    component.placeService = { getDetails: () => {} } as any;
    spyOn(component.placeService, 'getDetails').and.callFake((request, callback) => {
      callback(ADDRESSESMOCK.PLACESTREETUK, status as any);
    });
    component.setValueOfStreet(ADDRESSESMOCK.STREETSKYIVCITYLIST[0], component.addressStreet, Language.UK);
    expect(component.addressStreet.value).toEqual(ADDRESSESMOCK.PLACESTREETUK.name);
    expect(spy).toHaveBeenCalledWith(ADDRESSESMOCK.PLACESTREETUK, component.addressDistrict, Language.UK);
  });

  it('method setDistrictAuto should set district value in uk', () => {
    const result = ADDRESSESMOCK.PLACESTREETUK.address_components[1].long_name;
    component.setDistrictAuto(ADDRESSESMOCK.PLACESTREETUK, component.addressDistrict, Language.UK);
    expect(component.addressDistrict.value).toEqual(result);
  });

  it('method setDistrictAuto should set district value in en', () => {
    const result = ADDRESSESMOCK.PLACESTREETUK.address_components[1].long_name;
    component.setDistrictAuto(ADDRESSESMOCK.PLACESTREETEN, component.addressDistrictEng, Language.EN);
    expect(component.addressDistrictEng.value).toEqual(result);
  });

  it('should return ua value by getLangValue', () => {
    const value = component.getLangValue('value', 'enValue');
    expect(value).toBe('value');
  });

  it('should return ua value by getLangControl', () => {
    const value = component.getLangControl(component.addressCity, component.addressCityEng);
    expect(value).toEqual(component.addressCity);
  });

  it('should retrieve districts for a city', () => {
    const districtsMock = ADDRESSESMOCK.DISTRICTSKYIVMOCK;
    spyOn((component as any).orderService, 'findAllDistricts').and.returnValue(of(districtsMock));
    component.getDistrictsForCity();

    expect(component.districts).toEqual(ADDRESSESMOCK.DISTRICTSKYIVMOCK);
  });

  it('should not retrieve districts for a city if orderService returns an empty list', () => {
    spyOn((component as any).orderService, 'findAllDistricts').and.returnValue(of([]));
    component.getDistrictsForCity();

    expect(component.districts).toEqual([]);
  });
});
