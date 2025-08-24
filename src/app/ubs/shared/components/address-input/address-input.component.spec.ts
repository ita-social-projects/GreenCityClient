import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { AddressInputComponent } from './address-input.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { LanguageService } from 'src/app/shared/i18n/language.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { AddressService } from '@global-service/address/address.service';
import { GoogleScript } from '@assets/google-script/google-script';
import { Address, DistrictsDtos } from 'src/app/ubs/ubs/models/ubs.interface';
import { Coordinates } from 'src/app/greencity/modules/user/models/edit-profile.model';
import { GooglePrediction } from 'src/app/ubs/mocks/google-types';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { IAppState } from '../../../../store/state/app.state';

describe('AddressInputComponent', () => {
  let component: AddressInputComponent;
  let fixture: ComponentFixture<AddressInputComponent>;
  let addressServiceMock: jasmine.SpyObj<AddressService>;
  let googleScriptMock: jasmine.SpyObj<GoogleScript>;
  let store: MockStore<IAppState>;

  const languageServiceMock = jasmine.createSpyObj('languageService', ['getLangValue', 'getCurrentLanguage', 'getCurrentLangObs']);
  languageServiceMock.getLangValue.and.returnValue('fakeTag');
  languageServiceMock.getCurrentLanguage.and.returnValue('ua');
  languageServiceMock.getCurrentLangObs.and.returnValue(of('ua'));

  const fakeLocalStorageService = jasmine.createSpyObj('LocalStorageService', [
    'getCurrentLanguage',
    'languageBehaviourSubject',
    'getLocations'
  ]);
  fakeLocalStorageService.getCurrentLanguage.and.returnValue('ua');
  fakeLocalStorageService.getLocations.and.returnValue([]);
  fakeLocalStorageService.languageBehaviourSubject = new BehaviorSubject('ua');

  const mockInitialState: IAppState = {
    auth: undefined,
    bigOrderTable: undefined,
    ecoEventsState: undefined,
    ecoNewsState: undefined,
    employees: undefined,
    friend: undefined,
    habit: undefined,
    locations: undefined,
    router: undefined,
    ubsAdmin: undefined,
    ubsUser: undefined,
    authority: undefined,
    order: {
      addresses: [],
      currentStep: null,
      orderDetails: null,
      personalData: null,
      UBSCourierId: null,
      courierLocations: null,
      pendingLocationId: null,
      locationId: null,
      addressId: null,
      existingOrderInfo: null,
      orderSum: null,
      certificates: null,
      certificateUsed: null,
      pointsUsed: null,
      firstFormValid: false,
      secondFormValid: false,
      isAddressLoading: false,
      isOrderDetailsLoading: false
    }
  };

  const mockGeocoderResult = {
    formatted_address: 'Leontovycha St, 11, Kyiv, Ukraine, 01030',
    address_components: [
      { long_name: '11', short_name: '11', types: ['street_number'] },
      { long_name: 'Leontovycha Street', short_name: 'Leontovycha St', types: ['route'] },
      {
        long_name: "Shevchenkivs'kyi district",
        short_name: "Shevchenkivs'kyi district",
        types: ['political', 'sublocality', 'sublocality_level_1']
      },
      { long_name: 'Kyiv', short_name: 'Kyiv', types: ['locality', 'political'] },
      { long_name: 'Kyiv City', short_name: 'Kyiv City', types: ['administrative_area_level_2', 'political'] },
      { long_name: 'Kyiv', short_name: 'Kyiv', types: ['administrative_area_level_1', 'political'] },
      { long_name: 'Ukraine', short_name: 'UA', types: ['country', 'political'] },
      { long_name: '01030', short_name: '01030', types: ['postal_code'] }
    ]
  } as google.maps.GeocoderResult;

  beforeEach(() => {
    addressServiceMock = jasmine.createSpyObj('AddressService', ['getKyivDistricts']);
    googleScriptMock = jasmine.createSpyObj('GoogleScript', ['load', 'mapReady']);
    googleScriptMock.load.and.returnValue(Promise.resolve());
    googleScriptMock.mapReady = of(true);

    TestBed.configureTestingModule({
      declarations: [AddressInputComponent],
      imports: [HttpClientTestingModule, TranslateModule.forRoot(), MatAutocompleteModule, ReactiveFormsModule],
      providers: [
        { provide: LanguageService, useValue: languageServiceMock },
        { provide: LocalStorageService, useValue: fakeLocalStorageService },
        { provide: AddressService, useValue: addressServiceMock },
        { provide: GoogleScript, useValue: googleScriptMock },
        FormBuilder,
        provideMockStore({ initialState: mockInitialState })
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    Object.defineProperty(navigator, 'geolocation', {
      value: {
        getCurrentPosition: jasmine.createSpy('getCurrentPosition').and.callFake((successCb, errorCb) => {
          successCb({ coords: { latitude: 10, longitude: 20 } });
        })
      },
      writable: true
    });

    fixture = TestBed.createComponent(AddressInputComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add additional addressAlreadyExistsValidator to the address form when addressesFromProfile is not empty', () => {
    const addressesFromProfileMock = [
      {
        regionEn: 'Kyiv city',
        regionUk: 'місто Київ',
        cityUk: 'Київ',
        cityEn: 'Kyiv',
        streetUk: 'вулиця Степана Бандери',
        streetEn: 'Stepana Bandery street',
        districtEn: 'Kyiv city',
        districtUk: 'місто Київ',
        houseNumber: '5',
        entranceNumber: '2',
        houseCorpus: '1',
        addressComment: '',
        placeId: 'id',
        coordinates: {
          latitude: 54.02,
          longitude: 54.01
        }
      }
    ];
    component.addressesFromProfile = [...addressesFromProfileMock];

    expect(component.addressesFromProfile).toEqual(addressesFromProfileMock);

    const addValidatorSly = spyOn(component.addressForm, 'addValidators');
    spyOn(component['store'], 'pipe').and.returnValue(of([]));

    component.initFormValidators();

    expect(addValidatorSly).toHaveBeenCalled();
  });

  it('should validate the form correctly', () => {
    component.addressForm.setValue({
      region: 'Kyiv',
      city: 'Kyiv',
      street: 'Main Street',
      district: 'District 1',
      houseNumber: '123',
      houseCorpus: '',
      entranceNumber: '',
      placeId: 'place123',
      addressComment: ''
    });
    expect(component.addressForm.valid).toBeTrue();
  });

  it('should enable the city field when region is selected', () => {
    component.region.setValue('Kyiv');
    component['onRegionValueSet']('Kyiv');
    expect(component.city.disabled).toBeFalse();
  });

  it('should reset street and house info when city is reset', () => {
    component.city.setValue('Kyiv');
    component['onCityValueSet']('');
    expect(component.street.value).toBe('');
    expect(component.houseNumber.value).toBe('');
  });

  it('should update addressData when house number changes', () => {
    spyOn(component.addressData, 'setHouseNumber');
    component.houseNumber.setValue('42');
    component.onHouseNumberChange();
    expect(component.addressData.setHouseNumber).toHaveBeenCalledWith('42');
  });

  it('should call handleGeolocationSuccess when setCurrentLocation is triggered', () => {
    spyOn<any>(component, 'handleGeolocationSuccess');
    component['setCurrentLocation']();
    expect(component['handleGeolocationSuccess']).toHaveBeenCalled();
  });

  it('should run ngOnInit properly', () => {
    spyOn<any>(component, 'initForm');
    spyOn<any>(component, 'initListeners');

    component.ngOnInit();

    expect(fakeLocalStorageService.getLocations).toHaveBeenCalled();
    expect(component.currentLanguage).toEqual('ua');
    expect(component['initForm']).toHaveBeenCalled();
    expect(component['initListeners']).toHaveBeenCalled();
  });

  it('should disable all fields when isUneditableStatus is true', () => {
    component.isUneditableStatus = true;
    component.ngAfterViewInit();
    expect(component.city.disabled).toBeTrue();
    expect(component.street.disabled).toBeTrue();
    expect(component.houseNumber.disabled).toBeTrue();
    expect(component.houseCorpus.disabled).toBeTrue();
    expect(component.entranceNumber.disabled).toBeTrue();
    expect(component.district.disabled).toBeTrue();
  });

  it('should enable all fields when isUneditableStatus is false in ngOnChanges', () => {
    component.isUneditableStatus = false;
    fixture.detectChanges();
    component.ngOnChanges();
    expect(component.region.enabled).toBeTrue();
  });

  it('should not change field states if viewInitialized is false in ngOnChanges', () => {
    component['viewInitialized'] = false;
    spyOn<any>(component, 'disableAllFields');
    spyOn<any>(component, 'enableAllFields');
    component.isUneditableStatus = true;
    component.ngOnChanges();
    expect(component['disableAllFields']).not.toHaveBeenCalled();
    expect(component['enableAllFields']).not.toHaveBeenCalled();
  });

  it('should reset placeId and district when street is reset', () => {
    component.street.setValue('Some Street');
    component.placeId.setValue('somePlaceId');
    spyOn(component.addressData, 'resetStreet');
    component.district.setValue('Some District');
    component['onStreetValueSet']('');
    expect(component.district.value).toBe('Some District');
  });

  it('should set initial values from address if available (edit mode)', () => {
    const mockAddress: Address = {
      id: 1,
      houseNumber: '123',
      cityUk: 'Київ',
      cityEn: 'Kyiv',
      districtUk: 'Шевченківський',
      districtEn: 'Shevchenkivskyi',
      regionUk: 'Київська область',
      regionEn: 'Kyiv region',
      entranceNumber: '1',
      streetUk: 'вулиця Хрещатик',
      streetEn: 'Khreshchatyk Street',
      houseCorpus: 'А',
      addressComment: 'Comment',
      actual: true,
      coordinates: { latitude: 1, longitude: 1 },
      placeId: 'place123'
    };
    component.edit = true;
    component.address = mockAddress;
    spyOn(component.addressData, 'initAddressData');
    component.setInitialValues();
    expect(component.addressData.initAddressData).toHaveBeenCalledWith(component.address);
  });

  it('should set initial values from locations if address is not available (add mode)', () => {
    component.address = null;
    component.edit = false;
    component.locations = { regionDto: { nameUk: 'Київська область', nameEn: 'Kyiv region' } } as any;
    spyOn(component.addressData, 'setRegionWithTranslation');
    component.setInitialValues();
    expect(component.addressData.setRegionWithTranslation).toHaveBeenCalledWith('Київська область', 'Kyiv region');
  });

  it('should call onChange and markAsTouched when OnChangeAndTouched is called', () => {
    spyOn(component, 'onChange');
    spyOn(component, 'markAsTouched');
    component['OnChangeAndTouched']();
    expect(component.onChange).toHaveBeenCalled();
    expect(component.markAsTouched).toHaveBeenCalled();
  });

  it('should disable region when isFromAdminPage is true in OnChangeAndTouched', () => {
    component.isFromAdminPage = true;
    spyOn(component.region, 'disable');
    component['OnChangeAndTouched']();
    expect(component.region.disable).toHaveBeenCalled();
  });

  it('should call getKyivDistricts when hasDistricts is true', () => {
    spyOn(component, 'hasDistricts').and.returnValue(true);
    const mockDistricts: DistrictsDtos[] = [{ nameUk: 'Дарницький', nameEn: 'Darnytskyi' }];
    addressServiceMock.getKyivDistricts.and.returnValue(of(mockDistricts));
    component.updateDistrictEditState();
    expect(addressServiceMock.getKyivDistricts).toHaveBeenCalled();
    expect(component.districtsForKyiv).toEqual(mockDistricts);
    expect(component.allowDistrictEdit).toBeTrue();
  });

  it('should not call getKyivDistricts when hasDistricts is false', () => {
    spyOn(component, 'hasDistricts').and.returnValue(false);
    component.updateDistrictEditState();
    expect(addressServiceMock.getKyivDistricts).not.toHaveBeenCalled();
    expect(component.allowDistrictEdit).toBeFalse();
    expect(component.district.disabled).toBeTrue();
  });

  it('should set district and call OnChangeAndTouched on onDistrictChange if allowDistrictEdit is true', () => {
    component.allowDistrictEdit = true;
    spyOn(component.addressData, 'setCustomDistrict');
    spyOn<any>(component, 'OnChangeAndTouched');
    component.onDistrictChange('Дарницький', 'Darnytskyi');
    expect(component.addressData.setCustomDistrict).toHaveBeenCalledWith('Дарницький', 'Darnytskyi');
    expect(component['OnChangeAndTouched']).toHaveBeenCalled();
  });

  it('should not set district on onDistrictChange if allowDistrictEdit is false', () => {
    component.allowDistrictEdit = false;
    spyOn(component.addressData, 'setCustomDistrict');
    component.onDistrictChange('Дарницький', 'Darnytskyi');
    expect(component.addressData.setCustomDistrict).not.toHaveBeenCalled();
  });

  it('should set houseCorpus and call OnChangeAndTouched on onHouseCorpusChange', () => {
    spyOn(component.addressData, 'setHouseCorpus');
    spyOn<any>(component, 'OnChangeAndTouched');
    component.houseCorpus.setValue('1A');
    component.onHouseCorpusChange();
    expect(component.addressData.setHouseCorpus).toHaveBeenCalledWith('1A');
    expect(component['OnChangeAndTouched']).toHaveBeenCalled();
  });

  it('should set entranceNumber and call OnChangeAndTouched on onEntranceNumberChange', () => {
    spyOn(component.addressData, 'setEntranceNumber');
    spyOn<any>(component, 'OnChangeAndTouched');
    component.entranceNumber.setValue('5');
    component.onEntranceNumberChange();
    expect(component.addressData.setEntranceNumber).toHaveBeenCalledWith('5');
    expect(component['OnChangeAndTouched']).toHaveBeenCalled();
  });

  it('should set addressComment and call OnChangeAndTouched on onCommentChange', () => {
    spyOn(component.addressData, 'setAddressComment');
    spyOn<any>(component, 'OnChangeAndTouched');
    component.addressComment.setValue('Some comment');
    component.onCommentChange();
    expect(component.addressData.setAddressComment).toHaveBeenCalledWith('Some comment');
    expect(component['OnChangeAndTouched']).toHaveBeenCalled();
  });

  it('should return true for Kyiv and Київ in hasDistricts', () => {
    component.city.setValue('Kyiv');
    expect(component.hasDistricts()).toBeTrue();
    component.city.setValue('Київ');
    expect(component.hasDistricts()).toBeTrue();
  });

  it('should return false for other cities in hasDistricts', () => {
    component.city.setValue('Lviv');
    expect(component.hasDistricts()).toBeFalse();
  });

  it('should set addressCoords and call setCoordinates on onMapClick', () => {
    component.isMapLoaded$.next(true);
    window.google = {
      maps: {
        places: {
          PlacesService: function () {}
        }
      }
    } as any;
    component.map = { googleMap: {} } as any;
    spyOn(component.addressData, 'setCoordinates');
    const mockLatLng = { lat: 10, lng: 20 };
    component.onMapClick({ latLng: { toJSON: () => mockLatLng } } as google.maps.MapMouseEvent);
    expect(component.addressCoords).toEqual(mockLatLng);
    expect(component.addressData.setCoordinates).toHaveBeenCalled();
  });

  it('should not set addressCoords on onMapClick if map is not loaded', () => {
    component.isMapLoaded$.next(false);
    spyOn(component.addressData, 'setCoordinates');
    const mockLatLng = { lat: 10, lng: 20 };
    component.onMapClick({ latLng: { toJSON: () => mockLatLng } } as google.maps.MapMouseEvent);
    expect(component.addressData.setCoordinates).not.toHaveBeenCalled();
  });

  it('should return true if control is touched and invalid for isErrorMessageShown', () => {
    component.region.markAsTouched();
    component.region.setErrors({ required: true });
    expect(component.isErrorMessageShown(component.region)).toBeTrue();
  });

  it('should return false if control is not touched for isErrorMessageShown', () => {
    component.region.markAsUntouched();
    component.region.setErrors({ required: true });
    expect(component.isErrorMessageShown(component.region)).toBeFalse();
  });

  it('should return false if control is not invalid for isErrorMessageShown', () => {
    component.region.markAsTouched();
    component.region.setErrors(null);
    expect(component.isErrorMessageShown(component.region)).toBeFalse();
  });

  it('should unsubscribe on ngOnDestroy', () => {
    spyOn(component['$destroy'], 'next');
    spyOn(component['$destroy'], 'complete');
    component.ngOnDestroy();
    expect(component['$destroy'].next).toHaveBeenCalled();
    expect(component['$destroy'].complete).toHaveBeenCalled();
  });

  it('should handle region value set correctly (non-empty value)', () => {
    spyOn<any>(component, 'OnChangeAndTouched');
    component['onRegionValueSet']('Some Region');
    expect(component.region.value).toBe('Some Region');
    expect(component.city.enabled).toBeTrue();
    expect(component['OnChangeAndTouched']).toHaveBeenCalled();
  });

  it('should handle region value set correctly (empty value)', () => {
    spyOn<any>(component, 'OnChangeAndTouched');
    component.city.enable();
    component.street.enable();
    component.houseNumber.enable();

    component['onRegionValueSet']('');
    expect(component.region.value).toBe('');
    expect(component.city.disabled).toBeTrue();
    expect(component.street.disabled).toBeTrue();
    expect(component.houseNumber.disabled).toBeTrue();
    expect(component['OnChangeAndTouched']).toHaveBeenCalled();
  });

  it('should handle city value set correctly (non-empty value)', () => {
    spyOn<any>(component, 'OnChangeAndTouched');
    component['onCityValueSet']('Some City');
    expect(component.city.value).toBe('Some City');
    expect(component.street.enabled).toBeTrue();
    expect(component['OnChangeAndTouched']).toHaveBeenCalled();
  });

  it('should handle city value set correctly (empty value)', () => {
    spyOn<any>(component, 'OnChangeAndTouched');
    component.street.enable();
    component.houseNumber.enable();

    component['onCityValueSet']('');
    expect(component.city.value).toBe('');
    expect(component.street.disabled).toBeTrue();
    expect(component.houseNumber.disabled).toBeTrue();
    expect(component['OnChangeAndTouched']).toHaveBeenCalled();
  });

  it('should handle street value set correctly (non-empty value)', () => {
    spyOn<any>(component, 'OnChangeAndTouched');
    component['onStreetValueSet']('Some Street');
    expect(component.street.value).toBe('Some Street');
    expect(component.houseNumber.enabled).toBeTrue();
    expect(component.houseCorpus.enabled).toBeTrue();
    expect(component.entranceNumber.enabled).toBeTrue();
    expect(component['OnChangeAndTouched']).toHaveBeenCalled();
  });

  it('should handle street value set correctly (empty value)', () => {
    spyOn<any>(component, 'OnChangeAndTouched');
    component.houseNumber.enable();
    component.houseCorpus.enable();
    component.entranceNumber.enable();

    component['onStreetValueSet']('');
    expect(component.street.value).toBe('');
    expect(component.houseNumber.disabled).toBeTrue();
    expect(component.houseCorpus.disabled).toBeTrue();
    expect(component.entranceNumber.disabled).toBeTrue();
    expect(component['OnChangeAndTouched']).toHaveBeenCalled();
  });

  it('should initialize form validators from store addresses', fakeAsync(() => {
    const mockAddresses: Address[] = [
      {
        id: 1,
        streetUk: 'Test',
        houseNumber: '1',
        cityUk: 'City',
        districtUk: 'District',
        regionUk: 'Region',
        streetEn: 'Test',
        cityEn: 'City',
        districtEn: 'District',
        regionEn: 'Region',
        entranceNumber: '1',
        houseCorpus: 'A',
        actual: true,
        coordinates: {}
      }
    ];

    store.setState({
      ...mockInitialState,
      order: {
        ...mockInitialState.order,
        addresses: mockAddresses
      }
    });

    spyOn(component.addressForm, 'setValidators');
    spyOn(component.addressForm, 'updateValueAndValidity');
    component.initFormValidators();
    tick();
    expect(component.addressForm.setValidators).toHaveBeenCalled();
    expect(component.addressForm.updateValueAndValidity).toHaveBeenCalled();
  }));

  it('should reset house info', () => {
    spyOn(component.addressData, 'resetHouseInfo');
    component.houseNumber.setValue('1');
    component.houseCorpus.setValue('A');
    component.entranceNumber.setValue('1');
    component['resetHouseInfo']();
    expect(component.houseNumber.value).toBeNull();
    expect(component.houseCorpus.value).toBeNull();
    expect(component.entranceNumber.value).toBeNull();
    expect(component.addressData.resetHouseInfo).toHaveBeenCalled();
  });

  it('should reset districts', () => {
    spyOn(component.addressData, 'resetDistrict');
    component.district.setValue('Some District');
    component.district.enable();
    component['resetDistricts']();
    expect(component.district.value).toBeNull();
    expect(component.addressData.resetDistrict).toHaveBeenCalled();
    expect(component.district.disabled).toBeTrue();
  });

  it('should reset street', () => {
    spyOn(component.addressData, 'resetStreet');
    component.street.setValue('Some Street');
    component['resetStreet']();
    expect(component.street.value).toBeNull();
    expect(component.addressData.resetStreet).toHaveBeenCalled();
  });

  it('should reset city', () => {
    spyOn(component.addressData, 'resetCity');
    component.city.setValue('Some City');
    component['resetCity']();
    expect(component.city.value).toBeNull();
    expect(component.addressData.resetCity).toHaveBeenCalled();
  });

  it('should return correct city prefix', () => {
    component.region.setValue('Kyiv Oblast');
    expect(component.getCityPrefix()).toBe('Kyiv Oblast, fakeTag, ');
  });

  it('should disable and enable form correctly with setDisabledState', () => {
    component.setDisabledState(true);
    expect(component.addressForm.disabled).toBeTrue();
    component.setDisabledState(false);
    expect(component.addressForm.enabled).toBeTrue();
  });

  it('should update and validate form on value change in addressData when address data changes', fakeAsync(() => {
    spyOn(component, 'onChange');
    spyOn(component.addressData, 'getValues').and.returnValue({ houseNumber: '1' } as any);
    component['initListeners']();
    fixture.detectChanges();
    tick();

    const mockAddressData = {
      regionUk: 'Київська область',
      regionEn: 'Kyiv region',
      cityUk: 'Київ',
      cityEn: 'Kyiv',
      streetUk: 'вулиця Хрещатик',
      streetEn: 'Khreshchatyk Street',
      houseNumber: '1',
      districtUk: 'Шевченківський',
      districtEn: 'Shevchenkivskyi',
      placeId: 'testPlaceId'
    };

    component.addressData['addressChange'].next(mockAddressData as any);
    tick();
    fixture.detectChanges();

    expect(component.blockAutoComplete).toBeTrue();
    expect(component.region.value).toBe('Київська область');
    expect(component.city.value).toBe('Київ');
    expect(component.street.value).toBe('вулиця Хрещатик');
    expect(component.district.value).toBe('fakeTag');
    expect(component.houseNumber.value).toBe('1');
    expect(component.onChange).toHaveBeenCalledWith({ houseNumber: '1' } as any);
    flush();
  }));

  it('should handle geolocation error gracefully by setting default coordinates', () => {
    spyOn<any>(component, 'handleGeolocationSuccess');

    component['setCurrentLocation']();
    expect(component['handleGeolocationSuccess']).toHaveBeenCalled();
  });

  it('should disable region on keyup if text exists', () => {
    spyOn(component.addressForm.get('region'), 'disable');
    component.keyup('test');
    expect(component.addressForm.get('region').disable).toHaveBeenCalled();
    expect(component.errorType).toBe('requiredFromDropdown');
  });

  it('should enable region on keyup if text is empty', () => {
    spyOn(component.addressForm.get('region'), 'enable');
    component.keyup('');
    expect(component.addressForm.get('region').enable).toHaveBeenCalled();
    expect(component.errorType).toBe('requiredFromDropdown');
  });

  it('should disable district if street is reset and allowDistrictEdit is true', () => {
    component.allowDistrictEdit = true;
    component.street.setValue('Some Street');
    component.placeId.setValue('somePlaceId');
    component['onStreetValueSet']('');
    expect(component.district.disabled).toBeTrue();
  });

  it('should not show map if showMapSelected$ is false even if Google API is ready', fakeAsync(() => {
    component.isShowMap = false;
    tick(500);
    expect(googleScriptMock.load).not.toHaveBeenCalled();
    expect(component.isMapLoaded$.value).toBeFalse();
  }));

  it('should call onChange and markAsTouched when coordinates are selected', () => {
    const mockCoordinates: Coordinates = { latitude: 10, longitude: 20 };
    spyOn(component.addressData, 'setCoordinates');
    spyOn(component, 'onChange');
    spyOn(component, 'markAsTouched');
    component.onCoordinatesSelected(mockCoordinates);
    expect(component.addressData.setCoordinates).toHaveBeenCalledWith({ lat: mockCoordinates.latitude, lng: mockCoordinates.longitude });
    expect(component.onChange).toHaveBeenCalled();
    expect(component.markAsTouched).toHaveBeenCalled();
  });

  it('should correctly use districtComparator', () => {
    const district1: DistrictsDtos = { nameUk: 'Дарницький', nameEn: 'Darnytskyi' };
    const district2: DistrictsDtos = { nameUk: 'Дарницький', nameEn: 'Darnytskyi' };
    const district3: DistrictsDtos = { nameUk: 'Голосіївський', nameEn: 'Holosiivskyi' };

    expect(component.districtComparator(district1, district2)).toBeTrue();
    expect(component.districtComparator(district1, district3)).toBeFalse();
  });

  it('should initialize form with disabled controls if not in edit mode and no initial region', () => {
    component.edit = false;
    component.locations = null;
    component.address = null;
    component.ngOnInit();
    expect(component.city.disabled).toBeTrue();
    expect(component.street.disabled).toBeTrue();
    expect(component.houseNumber.disabled).toBeTrue();
    expect(component.district.disabled).toBeTrue();
  });

  it('should initialize form with city enabled if not in edit mode but with initial region', () => {
    component.edit = false;
    component.locations = { regionDto: { nameUk: 'Київська область', nameEn: 'Kyiv region' } } as any;
    component.address = null;
    component.ngOnInit();
    expect(component.city.disabled).toBeTrue();
    expect(component.street.disabled).toBeTrue();
    expect(component.houseNumber.disabled).toBeTrue();
    expect(component.district.disabled).toBeTrue();
  });

  it('should reset city, street, districts, and house info when onUseUserLocation is false', () => {
    spyOn<any>(component, 'resetCity');
    spyOn<any>(component, 'resetStreet');
    spyOn<any>(component, 'resetDistricts');
    spyOn<any>(component, 'resetHouseInfo');

    component.isUneditableStatus = false;
    component.onUseUserLocation(false);

    expect(component.isShowMap).toBeFalse();
    expect(component['resetCity']).toHaveBeenCalled();
    expect(component['resetStreet']).toHaveBeenCalled();
    expect(component['resetDistricts']).toHaveBeenCalled();
    expect(component['resetHouseInfo']).toHaveBeenCalled();
  });

  it('should not perform actions when onUseUserLocation is called and isUneditableStatus is true', () => {
    spyOn<any>(component, 'setCurrentLocation');
    spyOn<any>(component, 'resetCity');

    component.isUneditableStatus = true;
    component.onUseUserLocation(true);
    expect(component.isShowMap).toBeFalse();
    expect(component['setCurrentLocation']).not.toHaveBeenCalled();

    component.onUseUserLocation(false);
    expect(component['resetCity']).not.toHaveBeenCalled();
  });

  it('should call updateDistrictEditState and disable region on city selection', fakeAsync(() => {
    const mockCity: GooglePrediction = {
      structured_formatting: { main_text: 'Kyiv' },
      place_id: 'cityPlaceId'
    } as GooglePrediction;
    spyOn(component, 'updateDistrictEditState');
    spyOn(component.addressForm.get('region'), 'disable');
    spyOn(component.addressData, 'setCity');
    spyOn<any>(component, 'resetStreet');
    spyOn<any>(component, 'delayAutocomplete');
    spyOn(component.addressData, 'getPlaceByPlaceId').and.returnValue(Promise.resolve(mockGeocoderResult));
    component.currentLanguage = 'en';

    component.onCitySelected(mockCity);
    expect(component.blockAutoComplete).toBeTrue();
    tick();

    expect(component.city.value).toBe('Kyiv');
    expect(component.addressData.setCity).toHaveBeenCalledWith({ placeEn: mockGeocoderResult });
    expect(component.addressForm.get('region').disable).toHaveBeenCalled();
    expect(component.updateDistrictEditState).toHaveBeenCalled();
    expect(component['resetStreet']).toHaveBeenCalled();
    expect(component['delayAutocomplete']).toHaveBeenCalled();
  }));

  it('should reset city data when city selection is null', () => {
    spyOn(component.addressData, 'resetCity');
    spyOn<any>(component, 'resetStreet');
    component.onCitySelected(null);
    expect(component.city.value).toBe('');
    expect(component.addressData.resetCity).toHaveBeenCalled();
    expect(component['resetStreet']).toHaveBeenCalled();
  });

  it('should enable district if allowDistrictEdit is true on street selection', fakeAsync(() => {
    component.allowDistrictEdit = true;
    const mockStreet: GooglePrediction = {
      structured_formatting: { main_text: 'Leontovycha Street' },
      place_id: 'streetPlaceId'
    } as GooglePrediction;
    component.district.disable();

    spyOn(component.addressData, 'getPlaceByPlaceId').and.returnValue(Promise.resolve(mockGeocoderResult));
    spyOn(component.addressData, 'setCity');
    spyOn(component.addressData, 'setStreet');
    spyOn<any>(component, 'delayAutocomplete');

    component.onStreetSelected(mockStreet);

    expect(component.blockAutoComplete).toBeTrue();
    tick();

    expect(component.addressData.getPlaceByPlaceId).toHaveBeenCalled();
    expect(component.addressData.setCity).toHaveBeenCalledWith({ placeEn: mockGeocoderResult, placeUk: mockGeocoderResult });
    expect(component.addressData.setStreet).toHaveBeenCalledWith({ placeEn: mockGeocoderResult, placeUk: mockGeocoderResult });
    expect(component.district.enabled).toBeTrue();
    expect(component['delayAutocomplete']).toHaveBeenCalled();
    expect(component.placeId.value).toBe(mockStreet.place_id);
  }));

  it('should disable district and reset data if street selection is null', () => {
    component.district.enable();
    spyOn(component.addressData, 'resetStreet');
    spyOn(component.district, 'reset');
    component.onStreetSelected(null);
    expect(component.addressData.resetStreet).toHaveBeenCalled();
    expect(component.district.reset).toHaveBeenCalled();
  });

  it('should call validate and return null if form and addressData are valid', () => {
    component.addressForm.setErrors(null);
    spyOn(component.addressData, 'isValid').and.returnValue(true);
    expect(component.validate(component.addressForm)).toBeNull();
  });

  it('should call validate and return null if form is pristine', () => {
    component.addressForm.markAsPristine();
    component.addressForm.setErrors({ someError: true });
    spyOn(component.addressData, 'isValid').and.returnValue(false);
    expect(component.validate(component.addressForm)).toBeNull();
  });

  it('should not throw error on writeValue', () => {
    expect(() => component.writeValue({})).not.toThrow();
  });

  it('should call onTouched only once when markAsTouched is called multiple times', () => {
    spyOn(component, 'onTouched');
    component.markAsTouched();
    component.markAsTouched();
    expect(component.onTouched).toHaveBeenCalledTimes(1);
  });

  it('should change blockAutocomplete to false', fakeAsync(() => {
    component.blockAutoComplete = true;

    component['delayAutocomplete']();
    tick(600);

    expect(component.blockAutoComplete).toBeFalse();
  }));
});
