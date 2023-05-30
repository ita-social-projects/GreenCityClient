import { MatSnackBarComponent } from 'src/app/main/component/errors/mat-snack-bar/mat-snack-bar.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UBSAddAddressPopUpComponent } from './ubs-add-address-pop-up.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { DropdownModule } from 'angular-bootstrap-md';
import { Language } from 'src/app/main/i18n/Language';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { OrderService } from 'src/app/ubs/ubs/services/order.service';
import { Address } from 'src/app/ubs/ubs/models/ubs.interface';
import { Locations } from 'src/assets/locations/locations';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { GoogleScript } from 'src/assets/google-script/google-script';
import { LocationService } from '@global-service/location/location.service';
import { UserOwnAuthService } from '@global-service/auth/user-own-auth.service';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { ADRESSESMOCK } from 'src/app/ubs/mocks/address-mock';

describe('UBSAddAddressPopUpComponent', () => {
  let component: UBSAddAddressPopUpComponent;
  let fixture: ComponentFixture<UBSAddAddressPopUpComponent>;
  let orderService: OrderService;
  let MatSnackBarMock: MatSnackBarComponent;

  MatSnackBarMock = jasmine.createSpyObj('MatSnackBarComponent', ['openSnackBar']);
  MatSnackBarMock.openSnackBar = (type: string) => {};

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

  const fakeLocationsMockUk = jasmine.createSpyObj('Locations', ['getRegions', 'getRegionsKyiv']);
  fakeLocationsMockUk.getRegions.and.returnValue(ADRESSESMOCK.DISTRICTSMOCK);
  fakeLocationsMockUk.getRegionsKyiv.and.returnValue(ADRESSESMOCK.DISTRICTSKYIVMOCK);

  const fakeMatDialogRef = jasmine.createSpyObj(['close']);

  const fakeLocalStorageService = jasmine.createSpyObj('LocalStorageService', [
    'getCurrentLanguage',
    'languageBehaviourSubject',
    'getUserId'
  ]);
  fakeLocalStorageService.getCurrentLanguage = () => 'ua' as Language;
  fakeLocalStorageService.languageBehaviourSubject = new BehaviorSubject('ua');

  const fakeGoogleScript = jasmine.createSpyObj('GoogleScript', ['load']);
  fakeGoogleScript.load.and.returnValue(of());

  const fakeLocationServiceMock = jasmine.createSpyObj('locationService', ['getDistrictAuto', 'getFullAddressList']);
  fakeLocationServiceMock.getDistrictAuto = () => ADRESSESMOCK.PLACESTREETUK.address_components[1].long_name;
  fakeLocationServiceMock.getFullAddressList = () => [];

  const fakeLanguageServiceMock = jasmine.createSpyObj('languageService', ['getLangValue']);
  fakeLanguageServiceMock.getLangValue = (valUa: string, valEn: string) => {
    return valUa;
  };

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
        { provide: MatSnackBarComponent, useValue: MatSnackBarMock },
        { provide: LocalStorageService, useValue: fakeLocalStorageService },
        { provide: Locations, useValue: fakeLocationsMockUk },
        { provide: GoogleScript, useValue: fakeGoogleScript },
        { provide: LocationService, useValue: fakeLocationServiceMock },
        { provide: LanguageService, useValue: fakeLanguageServiceMock },
        UserOwnAuthService
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
    expect(component.regionsKyiv).toBe(ADRESSESMOCK.DISTRICTSKYIVMOCK);
    expect(component.regions).toBe(ADRESSESMOCK.DISTRICTSMOCK);
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
      callback(ADRESSESMOCK.KYIVREGIONSLIST, status as any);
    });
    const fakesearchAddress = `Київська область, Ше`;
    component.inputCity(fakesearchAddress, component.languages.uk);
    expect(component.cityPredictionList).toEqual(ADRESSESMOCK.KYIVREGIONSLIST);
  });

  it('method onCitySelected should invoke method setValueOfCity 2 times', () => {
    const spy = spyOn(component, 'setValueOfCity');
    component.onCitySelected(ADRESSESMOCK.KYIVREGIONSLIST[0]);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('method onCitySelected should invoke methods to set value of city', () => {
    const spy = spyOn(component, 'setValueOfCity');
    component.onCitySelected(ADRESSESMOCK.KYIVREGIONSLIST[0]);
    expect(spy).toHaveBeenCalledWith(ADRESSESMOCK.KYIVREGIONSLIST[0], component.city, component.languages.uk);
    expect(spy).toHaveBeenCalledWith(ADRESSESMOCK.KYIVREGIONSLIST[0], component.cityEn, component.languages.en);
  });

  it('method onCitySelected should invoke getDetails', () => {
    component.placeService = { getDetails: (a, b) => {} } as any;
    spyOn(component.placeService, 'getDetails').and.callThrough();
    component.setValueOfCity(ADRESSESMOCK.KYIVREGIONSLIST[0], component.city, component.languages.uk);
    expect(component.placeService.getDetails).toHaveBeenCalled();
  });

  it('method onCitySelected should get details for selected city in en', () => {
    component.placeService = { getDetails: () => {} } as any;
    spyOn(component.placeService, 'getDetails').and.callFake((request, callback) => {
      callback(ADRESSESMOCK.PLACECITYEN, status as any);
    });
    component.setValueOfCity(ADRESSESMOCK.KYIVCITYLIST[0], component.cityEn, component.languages.en);
    expect(component.cityEn.value).toEqual(ADRESSESMOCK.PLACECITYEN.name);
  });

  it('method onCitySelected should get details for selected city in uk', () => {
    component.placeService = { getDetails: () => {} } as any;
    spyOn(component.placeService, 'getDetails').and.callFake((request, callback) => {
      callback(ADRESSESMOCK.PLACEKYIVUK, status as any);
    });
    component.setValueOfCity(ADRESSESMOCK.KYIVCITYLIST[0], component.city, component.languages.uk);
    expect(component.city.value).toEqual(ADRESSESMOCK.PLACEKYIVUK.name);
    expect(component.isDistrict).toEqual(true);
  });

  it('method onCitySelected should set isDistrict if city is not Kyiv', () => {
    component.placeService = { getDetails: () => {} } as any;
    spyOn(component.placeService, 'getDetails').and.callFake((request, callback) => {
      callback(ADRESSESMOCK.PLACECITYUK, status as any);
    });
    component.setValueOfCity(ADRESSESMOCK.KYIVCITYLIST[0], component.city, component.languages.uk);
    expect(component.city.value).toEqual(ADRESSESMOCK.PLACECITYUK.name);
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
      callback(ADRESSESMOCK.STREETSKYIVCITYLIST, status as any);
    });
    const fakesearchAddress = `Київ, Сі`;
    component.inputAddress(fakesearchAddress, component.languages.uk);
    expect(component.streetPredictionList).toEqual(ADRESSESMOCK.STREETSKYIVCITYLIST);
  });

  it('method getPlacePredictions should form prediction street list for Kyiv region', () => {
    component.isDistrict = false;
    const result = [ADRESSESMOCK.STREETSKYIVREGIONLIST[0]];
    component.city.setValue(`Щасливе`);
    component.autocompleteService = { getPlacePredictions: () => {} } as any;
    spyOn(component.autocompleteService, 'getPlacePredictions').and.callFake((request, callback) => {
      callback(ADRESSESMOCK.STREETSKYIVREGIONLIST, status as any);
    });

    const fakesearchAddress = `Щасливе, Не`;
    component.inputAddress(fakesearchAddress, component.languages.uk);
    expect(component.streetPredictionList).toEqual(result);
  });

  it('method onStreetSelected should invoke method setValueOfStreet 2 times', () => {
    const spy = spyOn(component, 'setValueOfStreet');
    component.onStreetSelected(ADRESSESMOCK.STREETSKYIVREGIONLIST[0]);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('method onStreetSelected should invoke methods to set value of street', () => {
    const spy = spyOn(component, 'setValueOfStreet');
    component.onStreetSelected(ADRESSESMOCK.STREETSKYIVREGIONLIST[0]);
    expect(spy).toHaveBeenCalledWith(ADRESSESMOCK.STREETSKYIVREGIONLIST[0], component.street, component.languages.uk);
    expect(spy).toHaveBeenCalledWith(ADRESSESMOCK.STREETSKYIVREGIONLIST[0], component.streetEn, component.languages.en);
  });

  it('method onStreetSelected should set housePredictionList and placeId null', () => {
    component.placeService = { getDetails: () => {}, textSearch: () => {} } as any;
    spyOn(component.placeService, 'getDetails').and.callFake((request, callback) => {
      callback(ADRESSESMOCK.PLACESTREETEN, status as any);
    });
    component.onStreetSelected(ADRESSESMOCK.STREETSKYIVREGIONLIST[0]);
    expect(component.houseNumber.value).toBe('');
    expect(component.housePredictionList).toBeNull();
    expect(component.placeId).toBeNull();
  });

  it('method onStreetSelected should invoke getDetails', () => {
    component.placeService = { getDetails: (a, b) => {} } as any;
    spyOn(component.placeService, 'getDetails').and.callThrough();
    component.setValueOfStreet(ADRESSESMOCK.STREETSKYIVREGIONLIST[0], component.street, component.languages.uk);
    expect(component.placeService.getDetails).toHaveBeenCalled();
  });

  it('method onStreetSelected should get details for selected street in en', () => {
    component.isDistrict = true;
    const spy = spyOn(component, 'setDistrictAuto');
    component.placeService = { getDetails: () => {}, textSearch: () => {} } as any;
    spyOn(component.placeService, 'getDetails').and.callFake((request, callback) => {
      callback(ADRESSESMOCK.PLACESTREETEN, status as any);
    });
    component.setValueOfStreet(ADRESSESMOCK.STREETSKYIVCITYLIST[0], component.streetEn, component.languages.en);
    expect(component.streetEn.value).toEqual(ADRESSESMOCK.PLACESTREETEN.name);
    expect(component.formattedAddress).toEqual(ADRESSESMOCK.PLACESTREETEN.formatted_address);
    expect(spy).toHaveBeenCalledWith(ADRESSESMOCK.PLACESTREETEN, component.districtEn, component.languages.en);
  });

  it('method onStreetSelected should get details for selected street in uk', () => {
    component.isDistrict = true;
    const spy = spyOn(component, 'setDistrictAuto');
    component.placeService = { getDetails: () => {} } as any;
    spyOn(component.placeService, 'getDetails').and.callFake((request, callback) => {
      callback(ADRESSESMOCK.PLACESTREETUK, status as any);
    });
    component.setValueOfStreet(ADRESSESMOCK.STREETSKYIVCITYLIST[0], component.street, component.languages.uk);
    expect(component.street.value).toEqual(ADRESSESMOCK.PLACESTREETUK.name);
    expect(spy).toHaveBeenCalledWith(ADRESSESMOCK.PLACESTREETUK, component.district, component.languages.uk);
  });

  it('method setDistrictAuto should set district value in uk', () => {
    const result = ADRESSESMOCK.PLACESTREETUK.address_components[1].long_name;
    component.setDistrictAuto(ADRESSESMOCK.PLACESTREETUK, component.district, component.languages.uk);
    expect(component.district.value).toEqual(result);
  });

  it('method setDistrictAuto should set district value in en', () => {
    const result = ADRESSESMOCK.PLACESTREETUK.address_components[1].long_name;
    component.setDistrictAuto(ADRESSESMOCK.PLACESTREETEN, component.districtEn, component.languages.en);
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
    expect(component.district.value).toEqual(ADRESSESMOCK.DISTRICTSKYIVMOCK[1].name);
  });

  it('method setDistrict should set district value in Kyiv region', () => {
    component.setDistrict('1');
    expect(component.district.value).toEqual(ADRESSESMOCK.DISTRICTSMOCK[1].name);
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

  it('method setPredictHouseNumbers should set place id and isHouseSelected', () => {
    const houseValue = { value: '1A' };
    spyOn(houseValue.value, 'toLowerCase').and.returnValue('1a');
    component.houseNumber.setValue(houseValue.value);
    component.autocompleteService = { getPlacePredictions: () => {} } as any;
    spyOn(component.autocompleteService, 'getPlacePredictions').and.callFake((request, callback) => {
      callback(ADRESSESMOCK.STREETSKYIVREGIONLIST, status as any);
    });
    component.setPredictHouseNumbers();
    expect(component.isHouseSelected).toBeFalsy();
  });

  it('method onHouseSelected should set place id and isHouseSelected', () => {
    component.onHouseSelected(ADRESSESMOCK.STREETSKYIVREGIONLIST[0]);
    expect(component.addAddressForm.get('searchAddress').value).toBe('вулиця Незалежності, Щасливе, Київська область, Україна');
    expect(component.placeId).toBe('1111');
    expect(component.isHouseSelected).toBeTruthy();
  });
});
