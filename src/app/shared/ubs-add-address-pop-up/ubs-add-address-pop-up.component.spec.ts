import { MatSnackBarComponent } from 'src/app/main/component/errors/mat-snack-bar/mat-snack-bar.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UBSAddAddressPopUpComponent } from './ubs-add-address-pop-up.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
// import { DropdownModule } from 'angular-bootstrap-md';
import { Language } from 'src/app/main/i18n/Language';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { OrderService } from 'src/app/ubs/ubs/services/order.service';
import { Address, KyivNamesEnum } from 'src/app/ubs/ubs/models/ubs.interface';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { GoogleScript } from 'src/assets/google-script/google-script';
import { LocationService } from '@global-service/location/location.service';
import { UserOwnAuthService } from '@global-service/auth/user-own-auth.service';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { ADDRESSESMOCK } from 'src/app/ubs/mocks/address-mock';
import { ubsOrderServiseMock } from 'src/app/ubs/mocks/order-data-mock';
import { Store } from '@ngrx/store';

describe('UBSAddAddressPopUpComponent', () => {
  let component: UBSAddAddressPopUpComponent;
  let fixture: ComponentFixture<UBSAddAddressPopUpComponent>;
  let orderService: OrderService;
  const MatSnackBarMock: MatSnackBarComponent = jasmine.createSpyObj('MatSnackBarComponent', ['openSnackBar']);
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
    addressRegionDistrictList: ADDRESSESMOCK.DISTRICTSKYIVMOCK,
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

  const fakeMatDialogRef = jasmine.createSpyObj(['close']);

  const fakeLocalStorageService = jasmine.createSpyObj('LocalStorageService', [
    'getCurrentLanguage',
    'languageBehaviourSubject',
    'getUserId',
    'getLocations'
  ]);
  fakeLocalStorageService.getCurrentLanguage = () => Language.UA as Language;
  fakeLocalStorageService.languageBehaviourSubject = new BehaviorSubject(Language.UA);

  const fakeGoogleScript = jasmine.createSpyObj('GoogleScript', ['load']);
  fakeGoogleScript.load.and.returnValue(of());

  const fakeLocationServiceMock = jasmine.createSpyObj('locationService', [
    'getDistrictAuto',
    'getFullAddressList',
    'getSearchAddress',
    'getRequest'
  ]);
  fakeLocationServiceMock.getDistrictAuto = () => ADDRESSESMOCK.PLACESTREETUK.address_components[1].long_name;
  fakeLocationServiceMock.getFullAddressList = () => of([]);
  fakeLocalStorageService.getSearchAddress = () => ADDRESSESMOCK.SEARCHADDRESS;
  fakeLocalStorageService.getRequest = () => ADDRESSESMOCK.GOOGLEREQUEST;

  const fakeLanguageServiceMock = jasmine.createSpyObj('languageService', ['getLangValue']);
  fakeLanguageServiceMock.getLangValue = (valUa: string, valEn: string) => {
    return valUa;
  };

  const storeMock = jasmine.createSpyObj('Store', ['select', 'dispatch']);
  storeMock.select.and.returnValue(of({ order: ubsOrderServiseMock }));

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        // DropdownModule,
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
        { provide: GoogleScript, useValue: fakeGoogleScript },
        { provide: LocationService, useValue: fakeLocationServiceMock },
        { provide: LanguageService, useValue: fakeLanguageServiceMock },
        { provide: Store, useValue: storeMock },

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
    expect(component.currentLanguage).toBe(Language.UA);
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
    component.currentLanguage = Language.UA;
    component.setPredictCities();
    expect(component.cityPredictionList).toBe(null);
    expect(spy).toHaveBeenCalledWith(searchAddress, Language.UK);
  });

  it('method setPredictCities should call method for predicting cities in en', () => {
    component.cityEn.setValue('Kyiv');
    const searchAddress = `Kyiv region, City, ${component.cityEn.value}`;
    const spy = spyOn(component, 'inputCity');
    component.currentLanguage = Language.EN;
    component.setPredictCities();
    expect(component.cityPredictionList).toBe(null);
    expect(spy).toHaveBeenCalledWith(searchAddress, Language.EN);
  });

  it('method inputCity should invoke getPlacePredictions', () => {
    component.autocompleteService = { getPlacePredictions: (a, b) => {} } as any;
    spyOn(component.autocompleteService, 'getPlacePredictions').and.callThrough();
    const fakesearchAddress = `Kyiv, Kyiv`;
    component.inputCity(fakesearchAddress, Language.EN);
    expect(component.autocompleteService.getPlacePredictions).toHaveBeenCalled();
  });

  // it('method getPlacePredictions should form prediction list for Kyiv region', () => {
  //   component.autocompleteService = { getPlacePredictions: () => {} } as any;
  //   spyOn(component.autocompleteService, 'getPlacePredictions').and.callFake((request, callback) => {
  //     callback(ADDRESSESMOCK.KYIVREGIONSLIST, status as any);
  //   });
  //   const fakesearchAddress = `Київська область, Ше`;
  //   component.inputCity(fakesearchAddress, Language.UK);
  //   expect(component.cityPredictionList).toEqual(ADDRESSESMOCK.KYIVREGIONSLIST);
  // });

  it('method onCitySelected should invoke method setValueOfCity 2 times', () => {
    const spy = spyOn(component, 'setValueOfCity');
    component.onCitySelected(ADDRESSESMOCK.KYIVREGIONSLIST[0]);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('method onCitySelected should invoke methods to set value of city', () => {
    const spy = spyOn(component, 'setValueOfCity');
    component.onCitySelected(ADDRESSESMOCK.KYIVREGIONSLIST[0]);
    expect(spy).toHaveBeenCalledWith(ADDRESSESMOCK.KYIVREGIONSLIST[0], component.city, Language.UK);
    expect(spy).toHaveBeenCalledWith(ADDRESSESMOCK.KYIVREGIONSLIST[0], component.cityEn, Language.EN);
  });

  it('method onCitySelected should invoke getDetails', () => {
    component.placeService = { getDetails: (a, b) => {} } as any;
    spyOn(component.placeService, 'getDetails').and.callThrough();
    component.setValueOfCity(ADDRESSESMOCK.KYIVREGIONSLIST[0], component.city, Language.UK);
    expect(component.placeService.getDetails).toHaveBeenCalled();
  });

  it('method onCitySelected should get details for selected city in en', () => {
    const selectedCity = ADDRESSESMOCK.KYIVCITYLIST[0];
    component.cityEn.setValue('');

    const placeServiceMock = jasmine.createSpyObj('placeService', ['getDetails']);
    placeServiceMock.getDetails.and.callFake((request, callback) => {
      callback(ADDRESSESMOCK.PLACECITYEN, status);
    });
    component.placeService = placeServiceMock;
    component.setValueOfCity(selectedCity, component.cityEn, Language.EN);

    expect(placeServiceMock.getDetails).toHaveBeenCalled();
    expect(component.cityEn.value).toEqual(ADDRESSESMOCK.PLACECITYEN.name);
  });

  it('method onCitySelected should get details for selected city in uk', () => {
    component.placeService = { getDetails: () => {} } as any;
    spyOn(component.placeService, 'getDetails').and.callFake((request, callback) => {
      callback(ADDRESSESMOCK.PLACEKYIVUK, status as any);
    });
    component.setValueOfCity(ADDRESSESMOCK.KYIVCITYLIST[0], component.city, Language.UK);
    expect(component.city.value).toEqual(ADDRESSESMOCK.PLACEKYIVUK.name);
  });

  it('method onCitySelected should set isDistrictKyiv if city is not Kyiv', () => {
    component.placeService = { getDetails: () => {} } as any;
    spyOn(component.placeService, 'getDetails').and.callFake((request, callback) => {
      callback(ADDRESSESMOCK.PLACECITYUK, status as any);
    });
    component.setValueOfCity(ADDRESSESMOCK.KYIVCITYLIST[0], component.city, Language.UK);
    expect(component.city.value).toEqual(ADDRESSESMOCK.PLACECITYUK.name);
  });

  it('method setPredictStreets should call method for predicting streets in ua', () => {
    component.city.setValue('Київ');
    component.street.setValue('Ломо');
    const searchAddress = `${component.city.value}, ${component.street.value}`;
    const spy = spyOn(component, 'inputAddress');
    component.currentLanguage = Language.UA;
    component.setPredictStreets();
    expect(component.streetPredictionList).toBe(null);
    expect(spy).toHaveBeenCalledWith(searchAddress, Language.UK);
  });

  it('method setPredictStreets should call method for predicting streets in en', () => {
    component.cityEn.setValue('Kyiv');
    component.streetEn.setValue('Lomo');
    const searchAddress = `${component.cityEn.value}, ${component.streetEn.value}`;
    const spy = spyOn(component, 'inputAddress');
    component.currentLanguage = Language.EN;
    component.setPredictStreets();
    expect(component.streetPredictionList).toBe(null);
    expect(spy).toHaveBeenCalledWith(searchAddress, Language.EN);
  });

  it('method inputAddress should invoke getPlacePredictions', () => {
    component.autocompleteService = { getPlacePredictions: (a, b) => {} } as any;
    spyOn(component.autocompleteService, 'getPlacePredictions').and.callThrough();
    const fakesearchAddress = `Kyiv, Lomo`;
    component.inputAddress(fakesearchAddress, Language.EN);
    expect(component.autocompleteService.getPlacePredictions).toHaveBeenCalled();
  });

  // it('method getPlacePredictions should form prediction street list for Kyiv city', () => {
  //   component.city.setValue(`Київ`);
  //   component.autocompleteService = { getPlacePredictions: () => {} } as any;
  //   spyOn(component.autocompleteService, 'getPlacePredictions').and.callFake((request, callback) => {
  //     callback(ADDRESSESMOCK.STREETSKYIVCITYLIST, status as any);
  //   });
  //   const fakesearchAddress = `Київ, Сі`;
  //   component.inputAddress(fakesearchAddress, Language.UK);
  //   expect(component.streetPredictionList).toEqual(ADDRESSESMOCK.STREETSKYIVCITYLIST);
  // });
  // it('method getPlacePredictions should form prediction street list for Kyiv region', () => {
  //   const result = ADDRESSESMOCK.STREETSKYIVREGIONLIST;
  //   component.city.setValue('Щасливе');
  //   component.autocompleteService = { getPlacePredictions: () => {} } as any;
  //   spyOn(component.autocompleteService, 'getPlacePredictions').and.callFake((request, callback) => {
  //     callback(ADDRESSESMOCK.STREETSKYIVREGIONLIST, status as any);
  //   });

  //   const fakesearchAddress = 'Щасливе, Не';
  //   component.inputAddress(fakesearchAddress, Language.UK);
  //   expect(component.streetPredictionList).toEqual(result);
  // });

  it('method onStreetSelected should invoke method setValueOfStreet 2 times', () => {
    const spy = spyOn(component, 'setValueOfStreet');
    component.onStreetSelected(ADDRESSESMOCK.STREETSKYIVREGIONLIST[0]);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('method onStreetSelected should invoke methods to set value of street', () => {
    const spy = spyOn(component, 'setValueOfStreet');
    component.onStreetSelected(ADDRESSESMOCK.STREETSKYIVREGIONLIST[0]);
    expect(spy).toHaveBeenCalledWith(ADDRESSESMOCK.STREETSKYIVREGIONLIST[0], component.street, Language.UK);
    expect(spy).toHaveBeenCalledWith(ADDRESSESMOCK.STREETSKYIVREGIONLIST[0], component.streetEn, Language.EN);
  });

  it('method onStreetSelected should set housePredictionList and placeId null', () => {
    component.placeService = { getDetails: () => {}, textSearch: () => {} } as any;
    spyOn(component.placeService, 'getDetails').and.callFake((request, callback) => {
      callback(ADDRESSESMOCK.PLACESTREETEN, status as any);
    });
    component.onStreetSelected(ADDRESSESMOCK.STREETSKYIVREGIONLIST[0]);
    expect(component.houseNumber.value).toBe('');
    expect(component.housePredictionList).toBeNull();
    expect(component.placeId).toBeNull();
  });

  it('method onStreetSelected should invoke getDetails', () => {
    component.placeService = { getDetails: (a, b) => {} } as any;
    spyOn(component.placeService, 'getDetails').and.callThrough();
    component.setValueOfStreet(ADDRESSESMOCK.STREETSKYIVREGIONLIST[0], component.street, Language.UK);
    expect(component.placeService.getDetails).toHaveBeenCalled();
  });

  it('method onStreetSelected should get details for selected street in en', () => {
    const spy = spyOn(component, 'setDistrictAuto');
    component.placeService = { getDetails: () => {}, textSearch: () => {} } as any;
    spyOn(component.placeService, 'getDetails').and.callFake((request, callback) => {
      callback(ADDRESSESMOCK.PLACESTREETEN, status as any);
    });
    component.setValueOfStreet(ADDRESSESMOCK.STREETSKYIVCITYLIST[0], component.streetEn, Language.EN);
    expect(component.streetEn.value).toEqual(ADDRESSESMOCK.PLACESTREETEN.name);
    expect(component.formattedAddress).toEqual(ADDRESSESMOCK.PLACESTREETEN.formatted_address);
    expect(spy).toHaveBeenCalledWith(ADDRESSESMOCK.PLACESTREETEN, component.districtEn, Language.EN);
  });

  it('method onStreetSelected should get details for selected street in uk', () => {
    const spy = spyOn(component, 'setDistrictAuto');
    component.placeService = { getDetails: () => {} } as any;
    spyOn(component.placeService, 'getDetails').and.callFake((request, callback) => {
      callback(ADDRESSESMOCK.PLACESTREETUK, status as any);
    });
    component.setValueOfStreet(ADDRESSESMOCK.STREETSKYIVCITYLIST[0], component.street, Language.UK);
    expect(component.street.value).toEqual(ADDRESSESMOCK.PLACESTREETUK.name);
    expect(spy).toHaveBeenCalledWith(ADDRESSESMOCK.PLACESTREETUK, component.district, Language.UK);
  });

  it('method setDistrictAuto should set district value in uk', () => {
    const result = ADDRESSESMOCK.PLACESTREETUK.address_components[1].long_name;
    component.setDistrictAuto(ADDRESSESMOCK.PLACESTREETUK, component.district, Language.UK);
    expect(component.district.value).toEqual(result);
  });

  it('method setDistrictAuto should set district value in en', () => {
    const result = ADDRESSESMOCK.PLACESTREETUK.address_components[1].long_name;
    component.setDistrictAuto(ADDRESSESMOCK.PLACESTREETEN, component.districtEn, Language.EN);
    expect(component.districtEn.value).toEqual(result);
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

  // it('method setPredictHouseNumbers should set place id and isHouseSelected', () => {
  //   const houseValue = { value: '1A' };
  //   spyOn(houseValue.value, 'toLowerCase').and.returnValue('1a');
  //   component.houseNumber.setValue(houseValue.value);
  //   component.autocompleteService = { getPlacePredictions: () => {} } as any;
  //   spyOn(component.autocompleteService, 'getPlacePredictions').and.callFake((request, callback) => {
  //     callback(ADDRESSESMOCK.STREETSKYIVREGIONLIST, status as any);
  //   });
  //   component.setPredictHouseNumbers();
  //   expect(component.isHouseSelected).toBeFalsy();
  // });

  it('method onHouseSelected should set place id and isHouseSelected', () => {
    component.onHouseSelected(ADDRESSESMOCK.STREETSKYIVREGIONLIST[0]);
    expect(component.addAddressForm.get('searchAddress').value).toBe('вулиця Незалежності, Щасливе, Київська область, Україна');
    expect(component.placeId).toBe('1111');
    expect(component.isHouseSelected).toBeTruthy();
  });

  it('should cleanup form fields on city value change', () => {
    component.ngOnInit();
    const cityControl = component.addAddressForm.get('city');
    cityControl.setValue('new city');
    expect(component.addAddressForm.get('addressComment').value).toBe('');
    expect(component.addAddressForm.get('districtEn').value).toBe('');
    expect(component.addAddressForm.get('district').value).toBe('');
    expect(component.addAddressForm.get('entranceNumber').value).toBe('');
    expect(component.addAddressForm.get('houseCorpus').value).toBe('');
    expect(component.addAddressForm.get('houseNumber').value).toBe('');
    expect(component.addAddressForm.get('street').value).toBe('');
    expect(component.addAddressForm.get('streetEn').value).toBe('');
    expect(component.streetPredictionList).toBeNull();
    expect(component.cityPredictionList).toBeNull();
    expect(component.housePredictionList).toBeNull();
    expect(component.placeId).toBeNull();
  });

  it('should assign districtList correctly when edit is true', () => {
    component.data.edit = true;
    component.ngOnInit();
    const expectedDistricts = fakeAddress.addressRegionDistrictList.map((district) => {
      return {
        nameUa: `${district.nameUa} район`,
        nameEn: `${district.nameEn} district`
      };
    });
    expect(component.districtList).toEqual(expectedDistricts);
  });

  it('should set predictions for regions', () => {
    spyOn(component, 'inputRegion');
    component.currentLanguage = Language.UA;
    component.addAddressForm.get('region').setValue(KyivNamesEnum.KyivRegionUa);
    component.setPredictRegions();
    expect(component.inputRegion).toHaveBeenCalledWith(KyivNamesEnum.KyivRegionUa, Language.UK);

    component.currentLanguage = Language.EN;
    component.addAddressForm.get('regionEn').setValue(KyivNamesEnum.KyivRegionEn);
    component.setPredictRegions();
    expect(component.inputRegion).toHaveBeenCalledWith(KyivNamesEnum.KyivRegionEn, Language.EN);
  });

  it('should set predictions for cities', () => {
    spyOn(component, 'inputCity');

    component.currentLanguage = Language.UA;
    component.addAddressForm.get('region').setValue(KyivNamesEnum.KyivRegionUa);
    component.addAddressForm.get('city').setValue(KyivNamesEnum.KyivUa);
    component.setPredictCities();
    expect(component.inputCity).toHaveBeenCalledWith(`${KyivNamesEnum.KyivRegionUa}, місто, ${KyivNamesEnum.KyivUa}`, Language.UK);

    component.currentLanguage = Language.EN;
    component.addAddressForm.get('regionEn').setValue(KyivNamesEnum.KyivRegionEn);
    component.addAddressForm.get('cityEn').setValue(KyivNamesEnum.KyivEn);
    component.setPredictCities();
    expect(component.inputCity).toHaveBeenCalledWith(`${KyivNamesEnum.KyivRegionEn}, City, ${KyivNamesEnum.KyivEn}`, Language.EN);
  });
});
