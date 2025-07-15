import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { IMaskModule } from 'angular-imask';
import { of, throwError } from 'rxjs';
import { Address, UserProfile } from 'src/app/ubs/ubs-admin/models/ubs-admin.interface';
import { ClientProfileService } from '../../services/client-profile.service';
import { UbsUserProfilePageComponent } from './ubs-user-profile-page.component';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { LanguageService } from 'src/app/shared/i18n/language.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LocationService } from '@ubs/ubs-user/services/location/location.service';
import { ADDRESSESMOCK } from 'src/app/ubs/mocks/address-mock';
import { ubsOrderServiseMock } from 'src/app/ubs/mocks/order-data-mock';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AddressInputComponent } from '@ubs/shared/components/address-input/address-input.component';
import { InputGoogleAutocompleteComponent } from 'src/app/shared/components/input-google-autocomplete/input-google-autocomplete.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { LangValueDirective } from 'src/app/shared/directives/lang-value/lang-value.directive';
import { JwtService } from 'src/app/shared/services/jwt/jwt.service';
import { MatSnackBarService } from '@global-service/mat-snack-bar/mat-snack-bar.service';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { UserOwnAuthService } from '@auth-service/user-own-auth.service';
import { CreateAddress } from 'src/app/store/actions/order.actions';
import { Store } from '@ngrx/store';

describe('UbsUserProfilePageComponent', () => {
  const userProfileDataMock: UserProfile = {
    addressDto: [
      {
        id: 2276,
        cityUk: 'Kyiv',
        cityEn: 'Kyiv',
        districtUk: 'Troeshchina',
        districtEn: 'Troeshchina',
        entranceNumber: '65',
        houseCorpus: '3',
        houseNumber: '8',
        actual: false,
        regionUk: 'Kyiv',
        regionEn: 'Kyiv',
        coordinates: { latitude: 0, longitude: 0 },
        streetUk: 'Jhohn Lenon',
        streetEn: 'Jhohn Lenon',
        placeId: null,
        searchAddress: null,
        isHouseSelected: true,
        addressRegionDistrictList: null
      }
    ],
    recipientEmail: 'blackstar@gmail.com',
    alternateEmail: 'blackStar@gmail.com',
    recipientName: 'Black',
    recipientPhone: '+380972333333',
    recipientSurname: 'Star',
    hasPassword: true,
    botList: [
      {
        link: 'ling to viber',
        type: 'viber'
      },
      {
        link: 'link to telegram',
        type: 'telegram'
      }
    ]
  };
  const savedUserAddressMock = [...userProfileDataMock.addressDto];
  const userEmptyProfileDataMock: UserProfile = {
    addressDto: [],
    recipientEmail: 'emptyuser@example.com',
    alternateEmail: null,
    recipientName: 'Empty',
    recipientPhone: null,
    recipientSurname: null,
    hasPassword: true,
    botList: [],
    telegramIsNotify: false
  };

  let component: UbsUserProfilePageComponent;
  let fixture: ComponentFixture<UbsUserProfilePageComponent>;
  const clientProfileServiceMock: jasmine.SpyObj<ClientProfileService> = jasmine.createSpyObj('ClientProfileService', {
    getDataClientProfile: of(userProfileDataMock),
    postDataClientProfile: of({})
  });
  const snackBarMock: jasmine.SpyObj<MatSnackBarService> = jasmine.createSpyObj('MatSnackBarService', ['openSnackBar']);
  const dialogMock = {
    open: () => {}
  };

  const fakeLocalStorageService = jasmine.createSpyObj('LocalStorageService', [
    'getCurrentLanguage',
    'languageBehaviourSubject',
    'getLocations',
    'getAccessToken',
    'getUserId',
    'clear'
  ]);
  fakeLocalStorageService.getCurrentLanguage = () => 'ua';
  fakeLocalStorageService.languageBehaviourSubject = new BehaviorSubject('ua');
  fakeLocalStorageService.getLocations = () => [];
  fakeLocalStorageService.getAccessToken = () => 'token';
  fakeLocalStorageService.getUserId = () => 1;

  const languageServiceMock = jasmine.createSpyObj('languageService', ['getLangValue', 'getCurrentLanguage', 'getCurrentLangObs']);
  languageServiceMock.getLangValue = (valUa: string | AbstractControl, valEn: string | AbstractControl) => valUa;
  languageServiceMock.getCurrentLanguage = () => 'ua';
  languageServiceMock.getCurrentLangObs = () => of('ua');

  const fakeLocationServiceMock = jasmine.createSpyObj('locationService', [
    'getDistrictAuto',
    'convFirstLetterToCapital',
    'getFullAddressList',
    'getSearchAddress',
    'getRequest',
    'appendDistrictLabel'
  ]);
  fakeLocationServiceMock.getDistrictAuto = () => `Holosiivs'kyi district`;
  fakeLocationServiceMock.convFirstLetterToCapital = () => `Troeshchina`;
  fakeLocationServiceMock.getFullAddressList = () => of([]);
  fakeLocalStorageService.getSearchAddress = () => ADDRESSESMOCK.SEARCHADDRESS;
  fakeLocalStorageService.getRequest = () => ADDRESSESMOCK.GOOGLEREQUEST;

  const storeMock = jasmine.createSpyObj('Store', ['select', 'dispatch']);
  storeMock.select.and.returnValue(of({ order: ubsOrderServiseMock }));

  const jwtServiceMock = jasmine.createSpyObj('JwtService', ['getUserRole', 'getEmailFromAccessToken']);
  jwtServiceMock.getUserRole = () => 'fakeRole';
  jwtServiceMock.getEmailFromAccessToken = () => 'fakeEmail';
  jwtServiceMock.userRole$ = new BehaviorSubject('fakeRole');

  const initialState = { order: { ubsOrderServiseMock } };

  const routerMock = jasmine.createSpyObj('Router', ['navigateByUrl']);
  routerMock.navigateByUrl.and.returnValue(Promise.resolve(true));

  const userOwnAuthServiceMock = {
    isLoginUserSubject: new BehaviorSubject(true)
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UbsUserProfilePageComponent, AddressInputComponent, InputGoogleAutocompleteComponent, LangValueDirective],
      providers: [
        { provide: MatDialog, useValue: dialogMock },
        { provide: MatDialogRef, useValue: {} },
        { provide: ClientProfileService, useValue: clientProfileServiceMock },
        { provide: MatSnackBarService, useValue: snackBarMock },
        { provide: LocalStorageService, useValue: fakeLocalStorageService },
        { provide: LanguageService, useValue: languageServiceMock },
        { provide: LocationService, useValue: fakeLocationServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: UserOwnAuthService, useValue: userOwnAuthServiceMock },
        provideMockStore({ initialState })
      ],
      imports: [
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        IMaskModule,
        HttpClientTestingModule,
        MatAutocompleteModule,
        MatSelectModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    userProfileDataMock.addressDto = [...savedUserAddressMock];

    const predictionList = [
      { description: 'Place 1', place_id: '1' },
      { description: 'Place 2', place_id: '2' }
    ];

    class MockLatLng {
      private _lat: number;
      private _lng: number;

      constructor(lat: number, lng: number) {
        this._lat = lat;
        this._lng = lng;
      }

      lat(): number {
        return this._lat;
      }

      lng(): number {
        return this._lng;
      }
    }

    class MockAutocompleteSessionToken {}

    (window as any).google = {
      maps: {
        LatLng: MockLatLng,
        places: {
          AutocompleteSessionToken: MockAutocompleteSessionToken,
          AutocompleteService: class {
            getPlacePredictions(request, callback) {
              return Promise.resolve(callback(predictionList, 'OK'));
            }
          }
        },
        Geocoder: class {
          geocode(params) {
            return Promise.resolve({
              results: [{ geometry: { location: { lat: () => 123, lng: () => 456 } } }]
            });
          }
        }
      }
    };

    fixture = TestBed.createComponent(UbsUserProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getUserData method should be called on init', () => {
    const userSpy = spyOn(component, 'getUserData');
    component.ngOnInit();
    expect(userSpy).toHaveBeenCalled();
  });

  it('userInit should set fetching to false', () => {
    component.userInit();
    expect(component.isFetching).toBeFalse();
  });

  it('should call "goToTelegramUrl" correctly', () => {
    const goToTelegramSpy = spyOn(component, 'goToTelegramUrl');
    goToTelegramSpy();
    expect(goToTelegramSpy).toHaveBeenCalled();
  });

  it('if post data set isFetching === false', () => {
    clientProfileServiceMock.postDataClientProfile(userProfileDataMock).subscribe((data) => {
      expect(component.isFetching).toBeFalsy();
    });
  });

  it('method getUserData should call method userInit', () => {
    spyOn(component, 'userInit');
    component.getUserData();
    expect(component.userInit).toHaveBeenCalled();
  });

  it('method getUserData should fill savedUserAddresses array with addressDTO values', () => {
    component.getUserData();
    expect(component.savedUserAddresses).toEqual(component.userProfile.addressDto);
  });

  it('method onCancel should be called by clicking cancel button', fakeAsync(() => {
    component.isEditing = true;
    fixture.detectChanges();
    const spy = spyOn(component, 'onCancel');
    const cancelButton = fixture.debugElement.query(By.css('.submit-btns .ubs-secondary-global-button')).nativeElement;
    cancelButton.click();
    tick(500);
    expect(spy).toHaveBeenCalled();
  }));

  it('method openDeleteProfileDialog should be calls by clicking delete button', fakeAsync(() => {
    spyOn(component, 'openDeleteProfileDialog');
    const deleteButton = fixture.debugElement.query(By.css('.header-buttons .ubs-danger-global-button')).nativeElement;
    deleteButton.click();
    tick(500);
    expect(component.openDeleteProfileDialog).toHaveBeenCalled();
  }));

  it('method onCancel should call userInit method', () => {
    component.isEditing = true;
    const spy = spyOn(component, 'userInit');
    component.onCancel();
    expect(spy).toHaveBeenCalled();
  });

  it('after method onCancel is called temporary address holders should be cleared and addressDTO equals savedUserAddresses', () => {
    const mockTempAddedAddressHolder = [
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
    const mockTempRemovedAddressHolder = [
      {
        id: 2,
        actual: false,
        regionEn: 'Kyiv city',
        regionUk: 'місто Київ',
        cityUk: 'Київ',
        cityEn: 'Kyiv',
        streetUk: 'вулиця Степана Бандери',
        streetEn: 'Stepana Bandery street',
        districtEn: 'Kyiv city',
        districtUk: 'місто Київ',
        houseNumber: '1',
        entranceNumber: '2',
        houseCorpus: '1',
        addressComment: '',
        placeId: 'id',
        coordinates: {
          latitude: 54.12,
          longitude: 54.11
        }
      }
    ];
    component.tempAddedAddressHolder = mockTempAddedAddressHolder;
    component.tempRemovedAddressHolder = mockTempRemovedAddressHolder;
    component.isEditing = true;

    component.onCancel();

    expect(component.tempAddedAddressHolder.length).toEqual(0);
    expect(component.tempRemovedAddressHolder.length).toEqual(0);
    expect(component.userProfile.addressDto).toEqual(component.savedUserAddresses);
  });

  it('method onCancel should set isEditing false', () => {
    component.isEditing = true;
    component.onCancel();
    expect(component.isEditing).toBeFalsy();
  });

  it('method openDeleteAddressDialog has to open popup', () => {
    const matDialogRefMock = {
      afterClosed: () => of(null)
    };
    spyOn(dialogMock, 'open').and.returnValue(matDialogRefMock as any);
    spyOn(matDialogRefMock, 'afterClosed').and.callThrough();
    component.openDeleteAddressDialog(component.userForm.controls.address.get('0'));

    expect(dialogMock.open).toHaveBeenCalled();
    expect(matDialogRefMock.afterClosed).toHaveBeenCalled();
  });

  it('openAddAddressDialog should save address locally if dialog returns a value', () => {
    const mockTempAddedAddressHolder = [
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

    const dialogRefSpyObj = jasmine.createSpyObj({
      afterClosed: of({ value: mockTempAddedAddressHolder[0] })
    });
    dialogRefSpyObj.componentInstance = { body: '' };
    const dialogSpy = spyOn(TestBed.inject(MatDialog), 'open').and.returnValue(dialogRefSpyObj);

    component.openAddAdressDialog();

    expect(component.tempAddedAddressHolder.length).toBe(1);
    expect(component.tempAddedAddressHolder).toContain(mockTempAddedAddressHolder[0]);
    expect(dialogSpy).toHaveBeenCalled();
  });

  it('method openChangePasswordDialog should calls by clicking open button', fakeAsync(() => {
    spyOn(component, 'openChangePasswordDialog');
    const openButton = fixture.debugElement.query(By.css('.header-buttons .ubs-secondary-global-button')).nativeElement;
    openButton.click();
    tick();
    expect(component.openChangePasswordDialog).toHaveBeenCalled();
  }));

  it('method openChangePasswordDialog has to open popup', () => {
    spyOn(dialogMock, 'open').and.callFake(() => {});
    component.openChangePasswordDialog();
    expect(dialogMock.open).toHaveBeenCalled();
  });

  it('spiner has to be defined if (isFetching === true)', fakeAsync(() => {
    component.isFetching = true;
    fixture.detectChanges();
    flush();
    const spiner = fixture.debugElement.query(By.css('app-spinner')).nativeElement;
    expect(spiner).toBeDefined();
  }));

  it('method onEdit should get data and invoke methods', fakeAsync(() => {
    component.isEditing = false;
    component.isFetching = true;
    const spy = spyOn(component, 'focusOnFirst');
    component.onEdit();
    expect(component.isEditing).toEqual(true);
    expect(component.isFetching).toEqual(false);
    tick(500);
    expect(spy).toHaveBeenCalled();
  }));

  it('should call the focus event', () => {
    const input = document.createElement('input');
    spyOn(document, 'getElementById').and.returnValue(input);
    spyOn(input, 'focus');
    component.focusOnFirst();
    expect(input.focus).toHaveBeenCalled();
  });

  it('method onSubmit has to be called by clicking submit button', fakeAsync(() => {
    component.isEditing = true;
    fixture.detectChanges();
    if (component.userForm.value.valid) {
      const spy = spyOn(component, 'onSubmit');
      const deleteButton = fixture.debugElement.query(By.css('.submit-btns .ubs-primary-global-button')).nativeElement;
      deleteButton.click();
      expect(spy).toHaveBeenCalled();
    }
    tick(500);
  }));

  it('method onSubmit should return submitData without alternative email ', () => {
    const submitData = {
      addressDto: [
        {
          ...component.userForm.value.address[0],
          ...userProfileDataMock.addressDto[0]
        }
      ],
      recipientEmail: component.userForm.value.recipientEmail,
      recipientName: component.userForm.value.recipientName,
      recipientPhone: component.userForm.value.recipientPhone,
      recipientSurname: component.userForm.value.recipientSurname,
      hasPassword: true
    };
    component.toggleAlternativeEmail();
    component.onSubmit();
    expect(submitData).not.toEqual(userProfileDataMock);
  });

  it('should call saveAddedAddresses and deleteChosenAddresses when form is valid', () => {
    const saveSpy = spyOn(component, 'saveAddedAddresses');
    const deleteSpy = spyOn(component, 'deleteChosenAddresses');

    component.userForm = new FormGroup({
      recipientName: new FormControl('Name'),
      recipientSurname: new FormControl('Surname'),
      recipientEmail: new FormControl('some@gmail.com', [Validators.required]),
      alternateEmail: new FormControl(''),
      recipientPhone: new FormControl('1234567890'),
      address: new FormArray([])
    });

    component.userProfile = {
      recipientName: 'Name',
      recipientSurname: 'Surname',
      recipientEmail: 'some@gmail.com',
      recipientPhone: '+380923473666',
      alternateEmail: '',
      addressDto: [],
      telegramIsNotify: true,
      hasPassword: true
    };

    expect(component.userForm.valid).toBeTrue();

    component.onSubmit();

    expect(saveSpy).toHaveBeenCalled();
    expect(deleteSpy).toHaveBeenCalled();
  });

  it('should set isEditing to true when user form is invalid', () => {
    component.userForm = new FormGroup({
      recipientName: new FormControl(''),
      recipientSurname: new FormControl(''),
      recipientEmail: new FormControl(null, [Validators.required]),
      alternateEmail: new FormControl(''),
      recipientPhone: new FormControl(''),
      address: new FormArray([])
    });

    expect(component.userForm.valid).toBeFalse();

    component.onSubmit();

    expect(component.isEditing).toBeTruthy();
  });

  it('on saveAddedAddresses method CreateAddress shouldnt be called if tempAddedAddressHolder is empty', () => {
    component.tempAddedAddressHolder.length = 0;
    const store = TestBed.inject(Store) as MockStore;
    const dispatchSpy = spyOn(store, 'dispatch');

    component.saveAddedAddresses();

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should toggle alternativeEmail state', () => {
    component.toggleAlternativeEmail();
    expect(component.toggleAlternativeEmail).toBeTruthy();
    expect(component.alternativeEmailDisplay).toBe(true);
  });

  it('method toggleAlternativeEmail should toggle input for alternative email', () => {
    component.alternativeEmailDisplay = true;
    component.toggleAlternativeEmail();
    expect(component.alternativeEmailDisplay).toBeFalsy();
  });

  it('should add +380 to the value of recipientPhone', () => {
    component.userProfile = userEmptyProfileDataMock;
    component.userInit();
    component.onPhoneFocus();

    expect(component.recipientPhone.value).toBe('+380');
  });

  it('should clear the value of recipientPhone', () => {
    component.userProfile = userEmptyProfileDataMock;
    component.userInit();
    component.recipientPhone.setValue('+380');
    component.onPhoneBlur();

    expect(component.recipientPhone.value).toBe('');
    expect(component.recipientPhone.untouched).toBe(true);
  });

  it('should confirm validators and data from userInit form data', () => {
    component.userProfile = { ...userProfileDataMock };
    component.userInit();

    expect(component.userForm).toBeTruthy();
    expect(component.userForm instanceof FormGroup).toBe(true);
    expect(component.isFetching).toBe(false);

    const addressFormArray = component.userForm.get('address') as FormArray;
    expect(addressFormArray).toBeTruthy();
    expect(addressFormArray instanceof FormArray).toBe(true);
    expect(addressFormArray.length).toBe(userProfileDataMock.addressDto.length);
    expect(addressFormArray.value).toEqual(userProfileDataMock.addressDto);

    const recipientNameControl = component.recipientName;
    expect(recipientNameControl.value).toBe(userProfileDataMock.recipientName);
    recipientNameControl.setValue('');
    expect(recipientNameControl.hasError('required')).toBeTrue();
    recipientNameControl.setValue('Invalid$Name');
    expect(recipientNameControl.hasError('pattern')).toBeTrue();
    recipientNameControl.setValue('a'.repeat(31));
    expect(recipientNameControl.hasError('maxlength')).toBeTrue();
    recipientNameControl.setValue(userProfileDataMock.recipientName);
    expect(recipientNameControl.valid).toBeTrue();

    const recipientSurnameControl = component.recipientSurname;
    expect(recipientSurnameControl.value).toBe(userProfileDataMock.recipientSurname);
    recipientSurnameControl.setValue('Invalid$Surname');
    expect(recipientSurnameControl.hasError('pattern')).toBeTrue();
    recipientSurnameControl.setValue('a'.repeat(31));
    expect(recipientSurnameControl.hasError('maxlength')).toBeTrue();
    recipientSurnameControl.setValue(userProfileDataMock.recipientSurname);
    expect(recipientSurnameControl.valid).toBeTrue();

    const recipientEmailControl = component.userForm.get('recipientEmail');
    expect(recipientEmailControl.value).toBe(userProfileDataMock.recipientEmail);
    recipientEmailControl.setValue('');
    expect(recipientEmailControl.hasError('required')).toBeTrue();
    recipientEmailControl.setValue('invalid-email');
    expect(recipientEmailControl.hasError('pattern')).toBeTrue();
    recipientEmailControl.setValue(userProfileDataMock.recipientEmail);
    expect(recipientEmailControl.valid).toBeTrue();
    recipientEmailControl.setValue('');

    const alternateEmailControl = component.alternateEmail;
    expect(alternateEmailControl.value).toBe(userProfileDataMock.alternateEmail);
    alternateEmailControl.setValue('invalid-alt-email');
    expect(alternateEmailControl.hasError('pattern')).toBeTrue();
    alternateEmailControl.setValue(userProfileDataMock.alternateEmail);
    expect(alternateEmailControl.valid).toBeTrue();

    const recipientPhoneControl = component.recipientPhone;
    expect(recipientPhoneControl.value).toBe(userProfileDataMock.recipientPhone);
    expect(recipientPhoneControl.validator).toBeTruthy();

    recipientPhoneControl.setValue('123');
    expect(recipientPhoneControl.invalid).toBeTrue();
    recipientPhoneControl.setValue(userProfileDataMock.recipientPhone);
    expect(recipientPhoneControl.valid).toBeTrue();

    component.userProfile = { ...userEmptyProfileDataMock };
    component.userInit();

    expect(component.userForm).toBeTruthy();
    expect(component.userForm instanceof FormGroup).toBe(true);
    expect(component.isFetching).toBe(false);

    const emptyAddressFormArray = component.userForm.get('address') as FormArray;
    expect(emptyAddressFormArray).toBeTruthy();
    expect(emptyAddressFormArray instanceof FormArray).toBe(true);
    expect(emptyAddressFormArray.length).toBe(userEmptyProfileDataMock.addressDto.length);
    expect(emptyAddressFormArray.value).toEqual(userEmptyProfileDataMock.addressDto);

    expect(component.recipientName.value).toBe(userEmptyProfileDataMock.recipientName);
    expect(component.recipientSurname.value).toBe(userEmptyProfileDataMock.recipientSurname);
    expect(component.userForm.get('recipientEmail').value).toBe(userEmptyProfileDataMock.recipientEmail);

    expect(component.alternateEmail.value).toBe(userEmptyProfileDataMock.alternateEmail);
    expect(component.recipientPhone.value).toBe('');
    expect(component.userForm.get('telegramIsNotify').value).toBe(userEmptyProfileDataMock.telegramIsNotify);

    expect(recipientEmailControl.hasError('required')).toBeTrue();
  });

  it('method deleteAddress should populate tempRemovedAddressHolder if chosen address wasnt newly added in this edit', () => {
    const addressToDelete = userProfileDataMock.addressDto[0];
    component.deleteAddress(addressToDelete);
    expect(component.tempRemovedAddressHolder).toContain(addressToDelete);
  });

  it('deleteAddress should remove chosen address from tempAdded if it was added in this edit, and shouldnt populate tempRemoved', () => {
    const mockTempAddedAddressHolder = [
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
    component.tempAddedAddressHolder = mockTempAddedAddressHolder;
    component.tempRemovedAddressHolder.length = 0;
    const addressToDelete = {
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
    };

    component.deleteAddress(addressToDelete);

    expect(component.tempAddedAddressHolder).not.toContain(addressToDelete);
    expect(component.tempRemovedAddressHolder.length).toEqual(0);
  });

  it('after deleteAddress method call chosen address shouldnt be seen on the page', () => {
    const addressToDelete = userProfileDataMock.addressDto[0];

    component.deleteAddress(addressToDelete);

    expect(component.userProfile.addressDto).not.toContain(addressToDelete);
  });

  it('saveAddedAddresses method should save localy added addresses and clear tempAddedAddressHolder', () => {
    const store = TestBed.inject(Store) as MockStore;
    const dispatchSpy = spyOn(store, 'dispatch');
    const mockTempAddedAddressHolder = [
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
    component.tempAddedAddressHolder = [...mockTempAddedAddressHolder];

    component.saveAddedAddresses();

    expect(dispatchSpy).toHaveBeenCalledWith(CreateAddress({ address: mockTempAddedAddressHolder[0], hideSuccessPopup: true }));
    expect(component.tempAddedAddressHolder.length).toEqual(0);
  });

  it('on deleteChosenAddresses method deleteAddress on the orderService shouldnt be called if tempRemovedAddressHolder is empty', () => {
    component.tempRemovedAddressHolder.length = 0;
    const orderSpy = spyOn(component['orderService'], 'deleteAddress');

    component.saveAddedAddresses();

    expect(orderSpy).not.toHaveBeenCalled();
  });

  it('on deleteChosenAddresses method orderService should show snackBar error on error thrown', () => {
    const mockTempRemovedAddressHolder = [
      {
        id: 2,
        actual: false,
        regionEn: 'Kyiv city',
        regionUk: 'місто Київ',
        cityUk: 'Київ',
        cityEn: 'Kyiv',
        streetUk: 'вулиця Степана Бандери',
        streetEn: 'Stepana Bandery street',
        districtEn: 'Kyiv city',
        districtUk: 'місто Київ',
        houseNumber: '1',
        entranceNumber: '2',
        houseCorpus: '1',
        addressComment: '',
        placeId: 'id',
        coordinates: {
          latitude: 54.12,
          longitude: 54.11
        }
      }
    ];
    component.tempRemovedAddressHolder = [...mockTempRemovedAddressHolder];
    const orderSpy = spyOn(component['orderService'], 'deleteAddress').and.returnValue(throwError(() => new Error()));
    snackBarMock.openSnackBar.calls.reset();

    component.deleteChosenAddresses();

    expect(orderSpy).toHaveBeenCalledTimes(1);
    expect(snackBarMock.openSnackBar).toHaveBeenCalledWith('error');
  });

  it('deleteChosenAddresses method should delete address and clear tempRemovedAddressHolder', () => {
    const mockTempRemovedAddressHolder = [
      {
        id: 2,
        actual: false,
        regionEn: 'Kyiv city',
        regionUk: 'місто Київ',
        cityUk: 'Київ',
        cityEn: 'Kyiv',
        streetUk: 'вулиця Степана Бандери',
        streetEn: 'Stepana Bandery street',
        districtEn: 'Kyiv city',
        districtUk: 'місто Київ',
        houseNumber: '1',
        entranceNumber: '2',
        houseCorpus: '1',
        addressComment: '',
        placeId: 'id',
        coordinates: {
          latitude: 54.12,
          longitude: 54.11
        }
      }
    ];
    component.tempRemovedAddressHolder = [...mockTempRemovedAddressHolder];
    spyOn(component['orderService'], 'deleteAddress').and.returnValue(of({ addressList: [] }));

    component.deleteChosenAddresses();

    expect(component.tempRemovedAddressHolder.length).toBe(0);
  });

  describe('Testing controls for the form:', () => {
    const personalInfoControls = ['recipientName', 'recipientSurname', 'recipientEmail', 'recipientPhone'];
    const controls = ['name', 'surename', 'email', 'phone'];

    for (let i = 0; i < personalInfoControls.length; i++) {
      it(`should create form with ${i + 1}-st formControl: ${personalInfoControls[i]}`, () => {
        expect(component.userForm.contains(personalInfoControls[i])).toBeTruthy();
      });
    }

    for (let i = 0; i < personalInfoControls.length; i++) {
      it(`${controls[i]} field should be required`, () => {
        const control = component.userForm.get(personalInfoControls[i]);
        control.setValue(userProfileDataMock[personalInfoControls[i]]);
        expect(control.valid).toBeTruthy();
      });
    }
  });

  describe('onSwitchChanged method', () => {
    it('should toggle telegramIsNotify and call goToTelegramUrl when id is telegramNotification', () => {
      spyOn(component, 'goToTelegramUrl');
      component.onSwitchChanged();

      expect(component.goToTelegramUrl).toHaveBeenCalled();
    });
  });

  describe('onSubmit method - Specific Local Mocked Test', () => {
    beforeEach(() => {
      clientProfileServiceMock.postDataClientProfile.calls.reset();
      snackBarMock.openSnackBar.calls.reset();
      clientProfileServiceMock.getDataClientProfile.calls.reset();
    });

    it('should submit updated user profile data correctly and show success snackbar', fakeAsync(() => {
      const initialUserProfile: UserProfile = {
        addressDto: [
          {
            id: 1,
            cityUk: 'Kyiv',
            cityEn: 'Kyiv',
            districtUk: 'Shevchenkivskyi',
            districtEn: 'Shevchenkivskyi',
            entranceNumber: '1',
            houseCorpus: 'A',
            houseNumber: '10',
            actual: true,
            regionUk: 'Kyiv',
            regionEn: 'Kyiv',
            coordinates: { latitude: 50.45, longitude: 30.52 },
            streetUk: 'Khreschatyk',
            streetEn: 'Khreschatyk',
            placeId: 'xyz123',
            searchAddress: 'Khreschatyk st, Kyiv',
            isHouseSelected: true,
            addressRegionDistrictList: null
          }
        ],
        recipientEmail: 'initial@example.com',
        alternateEmail: 'old_alt@example.com',
        recipientName: 'OldName',
        recipientPhone: '+380991112233',
        recipientSurname: 'OldSurname',
        hasPassword: true,
        botList: [],
        telegramIsNotify: false
      };

      const expectedDataSentToService: UserProfile = {
        addressDto: [
          {
            id: 1,
            cityUk: 'Kyiv',
            cityEn: 'Kyiv',
            districtUk: 'UpdatedShevchenkivskyi',
            districtEn: 'Shevchenkivskyi',
            entranceNumber: '1',
            houseCorpus: 'A',
            houseNumber: '10',
            actual: true,
            regionUk: 'Kyiv',
            regionEn: 'Kyiv',
            coordinates: { latitude: 50.45, longitude: 30.52 },
            streetUk: 'Khreschatyk',
            streetEn: 'Khreschatyk',
            placeId: 'xyz123'
          }
        ],
        recipientEmail: 'updated@example.com',
        alternateEmail: undefined,
        recipientName: 'UpdatedName',
        recipientPhone: '+380679876543',
        recipientSurname: 'UpdatedSurname',
        hasPassword: true,
        telegramIsNotify: true
      };

      const mockServiceResponse: UserProfile = {
        ...expectedDataSentToService,
        alternateEmail: null,
        botList: []
      };

      clientProfileServiceMock.getDataClientProfile.and.returnValue(of(initialUserProfile));

      component.getUserData();
      fixture.detectChanges();
      tick();

      const addressFormArray = component.userForm.get('address') as FormArray;
      const addressControl = addressFormArray.at(0) as FormControl;

      expect(addressControl).toBeTruthy();

      const updatedAddressValue: Address = {
        ...initialUserProfile.addressDto[0],
        districtUk: 'UpdatedShevchenkivskyi'
      };
      addressControl.setValue(updatedAddressValue);
      addressControl.markAsDirty();

      component.userForm.get('recipientEmail').setValue(expectedDataSentToService.recipientEmail);

      if (component.userForm.contains('alternateEmail')) {
        component.alternateEmail.setValue(null);
        component.userForm.removeControl('alternateEmail');
      }

      component.recipientName.setValue(expectedDataSentToService.recipientName);
      component.recipientPhone.setValue(expectedDataSentToService.recipientPhone);
      component.recipientSurname.setValue(expectedDataSentToService.recipientSurname);
      component.userForm.get('telegramIsNotify').setValue(expectedDataSentToService.telegramIsNotify);

      component.userForm.markAllAsTouched();
      component.userForm.markAsDirty();
      fixture.detectChanges();

      expect(component.userForm.valid).toBeTrue();

      clientProfileServiceMock.postDataClientProfile.and.returnValue(of(mockServiceResponse));
      snackBarMock.openSnackBar.calls.reset();

      component.onSubmit();

      expect(component.isEditing).toBeFalse();

      expect(clientProfileServiceMock.postDataClientProfile).toHaveBeenCalledTimes(1);
      const submittedArgs = clientProfileServiceMock.postDataClientProfile.calls.mostRecent().args[0];

      const cleanedSubmittedArgs: UserProfile = { ...submittedArgs };

      if (cleanedSubmittedArgs.addressDto && cleanedSubmittedArgs.addressDto.length > 0) {
        const cleanedAddress = { ...cleanedSubmittedArgs.addressDto[0] };
        delete cleanedAddress.searchAddress;
        delete cleanedAddress.isHouseSelected;
        delete cleanedAddress.addressRegionDistrictList;
        cleanedSubmittedArgs.addressDto = [cleanedAddress];
      }

      if (cleanedSubmittedArgs.alternateEmail === null) {
        delete cleanedSubmittedArgs.alternateEmail;
      } else if (cleanedSubmittedArgs.alternateEmail === '') {
        delete cleanedSubmittedArgs.alternateEmail;
      }

      delete cleanedSubmittedArgs.botList;

      tick();

      expect(component.isFetching).toBeFalse();
      expect(component.userProfile).toEqual(mockServiceResponse);

      expect(snackBarMock.openSnackBar).toHaveBeenCalledWith('savedChangesToUserProfile');
      expect(snackBarMock.openSnackBar).toHaveBeenCalledTimes(1);
    }));

    xit('should handle submission error and reset fetching state, showing error snackbar', fakeAsync(() => {
      const testUserProfileForError: UserProfile = {
        addressDto: [],
        recipientEmail: 'error_test@example.com',
        alternateEmail: null,
        recipientName: 'ErrorName',
        recipientPhone: '+380501234567',
        recipientSurname: 'ErrorSurname',
        hasPassword: true,
        botList: [],
        telegramIsNotify: false
      };
      const mockError = new Error('Failed to save profile on server.');

      clientProfileServiceMock.getDataClientProfile.and.returnValue(of(testUserProfileForError));
      component.getUserData();
      component.userForm.markAsDirty();
      component.isEditing = true;
      fixture.detectChanges();

      clientProfileServiceMock.postDataClientProfile.and.returnValue(throwError(() => mockError));
      snackBarMock.openSnackBar.calls.reset();

      component.onSubmit();

      expect(clientProfileServiceMock.postDataClientProfile).toHaveBeenCalledTimes(1);

      tick();
      flush();

      expect(component.isFetching).toBeFalse();
      expect(snackBarMock.openSnackBar).toHaveBeenCalledWith('error');
      expect(snackBarMock.openSnackBar).toHaveBeenCalledTimes(2);
      expect(component.userProfile).toEqual(testUserProfileForError);
    }));

    it('should not submit if the form is invalid', fakeAsync(() => {
      const invalidUserProfile: UserProfile = {
        addressDto: [],
        recipientEmail: 'invalid-email',
        alternateEmail: null,
        recipientName: '',
        recipientPhone: null,
        recipientSurname: null,
        hasPassword: true,
        botList: [],
        telegramIsNotify: false
      };
      clientProfileServiceMock.getDataClientProfile.and.returnValue(of(invalidUserProfile));
      component.getUserData();
      component.userForm.markAsDirty();
      component.isEditing = true;
      fixture.detectChanges();

      component.recipientName.setValue('');
      component.userEmail = 'not-an-email';

      expect(component.userForm.valid).toBeFalse();

      clientProfileServiceMock.postDataClientProfile.calls.reset();
      snackBarMock.openSnackBar.calls.reset();

      component.onSubmit();

      expect(clientProfileServiceMock.postDataClientProfile).not.toHaveBeenCalled();
      expect(component.isFetching).toBeFalse();
      expect(component.isEditing).toBeTrue();
    }));
  });

  describe('signOut', () => {
    it('should clear user role, navigate, update login status, clear local storage, and dispatch Redux actions', fakeAsync(() => {
      const userLoginSubjectSpy = spyOn(component['userOwnAuthService'].isLoginUserSubject, 'next');
      jwtServiceMock.userRole$.next('user');

      component.signOut();
      tick();

      expect(jwtServiceMock.userRole$.value).toBe('');
      expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/');
      expect(userLoginSubjectSpy).toHaveBeenCalledWith(false);
      expect(fakeLocalStorageService.clear).toHaveBeenCalledTimes(1);
    }));
  });
});
