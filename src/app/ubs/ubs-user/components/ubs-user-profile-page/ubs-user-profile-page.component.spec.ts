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
import { CreateAddress, UpdateAddress } from 'src/app/store/actions/order.actions';
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
  fakeLocalStorageService.getCurrentLanguage = () => 'uk';
  fakeLocalStorageService.languageBehaviourSubject = new BehaviorSubject('uk');
  fakeLocalStorageService.getLocations = () => [];
  fakeLocalStorageService.getAccessToken = () => 'token';
  fakeLocalStorageService.getUserId = () => 1;

  const languageServiceMock = jasmine.createSpyObj('languageService', ['getLangValue', 'getCurrentLanguage', 'getCurrentLangObs']);
  languageServiceMock.getLangValue = (valUa: string | AbstractControl, valEn: string | AbstractControl) => valUa;
  languageServiceMock.getCurrentLanguage = () => 'uk';
  languageServiceMock.getCurrentLangObs = () => of('uk');

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
    component.recipientName.setValue('ValidName');
    component.recipientSurname.setValue('ValidSurname');
    component.userForm.get('recipientEmail').setValue('valid@example.com');
    component.userForm.markAsDirty();
    fixture.detectChanges();
    const spy = spyOn(component, 'onSubmit');
    const submitButton = fixture.debugElement.query(By.css('.submit-btns .ubs-primary-global-button')).nativeElement;
    expect(submitButton.disabled).toBeFalse();

    submitButton.click();
    tick(500);

    expect(spy).toHaveBeenCalled();
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
      address: new FormArray([]),
      telegramIsNotify: new FormControl(false)
    });

    component.userProfile = {
      recipientName: 'Name',
      recipientSurname: 'Surname',
      recipientEmail: 'some@gmail.com',
      recipientPhone: '+380923473666',
      alternateEmail: '',
      addressDto: [],
      telegramIsNotify: false,
      hasPassword: true
    };

    component.savedTelegramIsNotify = false;

    component.userForm.markAsDirty();

    expect(component.userForm.valid).toBeTrue();

    clientProfileServiceMock.postDataClientProfile.and.returnValue(of(component.userProfile));

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
      address: new FormArray([]),
      telegramIsNotify: new FormControl(false)
    });

    component.userProfile = {
      recipientName: '',
      recipientSurname: '',
      recipientEmail: '',
      recipientPhone: '',
      alternateEmail: '',
      addressDto: [],
      telegramIsNotify: false,
      hasPassword: true
    };

    component.savedTelegramIsNotify = false;
    component.isEditing = false;

    expect(component.userForm.valid).toBeFalse();

    component.onSubmit();

    expect(component.userForm.get('recipientEmail').touched).toBeTrue();
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

  it('should open telegram bot URL in new window', () => {
    const windowOpenSpy = spyOn(window, 'open');
    component.telegramBotURL = 'https://t.me/testbot';
    component.goToTelegramUrl();
    expect(windowOpenSpy).toHaveBeenCalledWith('https://t.me/testbot', '_blank');
  });

  it('should set telegram bot URL in setUrlToBot', () => {
    component.userProfile = {
      ...userProfileDataMock,
      botList: [{ link: 'https://t.me/bot123', type: 'telegram' }]
    };
    component.setUrlToBot();
    expect(component.telegramBotURL).toBe('https://t.me/bot123');
  });

  it('should handle empty botList in setUrlToBot', () => {
    component.userProfile = { ...userProfileDataMock, botList: [] };
    component.setUrlToBot();
    expect(component.telegramBotURL).toBeUndefined();
  });

  it('should set savedTelegramIsNotify from response in getUserData', () => {
    const mockProfileWithTelegram = { ...userProfileDataMock, telegramIsNotify: true };
    clientProfileServiceMock.getDataClientProfile.and.returnValue(of(mockProfileWithTelegram));

    component.savedTelegramIsNotify = false;
    component.getUserData();

    expect(component.savedTelegramIsNotify).toBe(true);
  });

  it('should set savedTelegramIsNotify to false when response has false value', () => {
    const mockProfileWithoutTelegram = { ...userProfileDataMock, telegramIsNotify: false };
    clientProfileServiceMock.getDataClientProfile.and.returnValue(of(mockProfileWithoutTelegram));

    component.savedTelegramIsNotify = true;
    component.getUserData();

    expect(component.savedTelegramIsNotify).toBe(false);
  });

  describe('isSubmitBtnDisabled method', () => {
    it('should return true when userForm is not initialized', () => {
      component.userForm = null;

      const result = component.isSubmitBtnDisabled();

      expect(result).toBeTrue();
    });

    it('should return true when userForm is undefined', () => {
      component.userForm = undefined;

      const result = component.isSubmitBtnDisabled();

      expect(result).toBeTrue();
    });

    it('should return false when telegramIsNotify switch changed from false to true', () => {
      component.userInit();
      component.savedTelegramIsNotify = false;
      component.userForm.get('telegramIsNotify').setValue(true);

      const result = component.isSubmitBtnDisabled();

      expect(result).toBeFalse();
    });

    it('should return false when telegramIsNotify switch changed from true to false', () => {
      component.userInit();
      component.savedTelegramIsNotify = true;
      component.userForm.get('telegramIsNotify').setValue(false);

      const result = component.isSubmitBtnDisabled();

      expect(result).toBeFalse();
    });

    it('should return true when form is invalid', () => {
      component.userInit();
      component.savedTelegramIsNotify = false;
      component.userForm.get('telegramIsNotify').setValue(false);
      component.recipientName.setValue('');

      const result = component.isSubmitBtnDisabled();

      expect(result).toBeTrue();
    });

    it('should return true when form is pristine (unchanged)', () => {
      component.userInit();
      component.savedTelegramIsNotify = false;
      component.userForm.get('telegramIsNotify').setValue(false);
      component.userForm.markAsPristine();

      const result = component.isSubmitBtnDisabled();

      expect(result).toBeTrue();
    });

    it('should return false when form is valid and dirty', () => {
      component.userInit();
      component.savedTelegramIsNotify = false;
      component.userForm.get('telegramIsNotify').setValue(false);
      component.recipientName.setValue('ValidName');
      component.userForm.markAsDirty();

      const result = component.isSubmitBtnDisabled();

      expect(result).toBeFalse();
    });

    it('should return true when switches are the same and form is pristine', () => {
      component.userInit();
      component.savedTelegramIsNotify = true;
      component.userForm.get('telegramIsNotify').setValue(true);
      component.userForm.markAsPristine();

      const result = component.isSubmitBtnDisabled();

      expect(result).toBeTrue();
    });

    it('should handle undefined savedTelegramIsNotify as false', () => {
      component.userInit();
      component.savedTelegramIsNotify = undefined;
      component.userForm.get('telegramIsNotify').setValue(true);

      const result = component.isSubmitBtnDisabled();

      expect(result).toBeFalse();
    });

    it('should handle null telegramIsNotify form value as false', () => {
      component.userInit();
      component.savedTelegramIsNotify = true;
      component.userForm.get('telegramIsNotify').setValue(null);

      const result = component.isSubmitBtnDisabled();

      expect(result).toBeFalse();
    });

    it('should handle truthy telegramIsNotify value correctly with !! operator', () => {
      component.userInit();
      component.savedTelegramIsNotify = false;
      component.userForm.get('telegramIsNotify').setValue(1);

      const result = component.isSubmitBtnDisabled();

      expect(result).toBeFalse();
    });

    it('should handle falsy telegramIsNotify value correctly with !! operator', () => {
      component.userInit();
      component.savedTelegramIsNotify = true;
      component.userForm.get('telegramIsNotify').setValue(0);

      const result = component.isSubmitBtnDisabled();

      expect(result).toBeFalse();
    });

    it('should handle empty string as falsy with !! operator', () => {
      component.userInit();
      component.savedTelegramIsNotify = true;
      component.userForm.get('telegramIsNotify').setValue('');

      const result = component.isSubmitBtnDisabled();

      expect(result).toBeFalse();
    });
  });

  describe('onSubmit method - phone value handling', () => {
    beforeEach(() => {
      clientProfileServiceMock.postDataClientProfile.calls.reset();
      snackBarMock.openSnackBar.calls.reset();
    });

    it('should set phoneValue to null when recipientPhone is empty string', fakeAsync(() => {
      component.userInit();
      component.savedTelegramIsNotify = false;

      component.recipientName.setValue('ValidName');
      component.recipientSurname.setValue('ValidSurname');
      component.userForm.get('recipientEmail').setValue('valid@example.com');
      component.recipientPhone.setValue('');

      component.userForm.markAsDirty();

      const mockResponse = { ...userProfileDataMock, recipientPhone: null };
      clientProfileServiceMock.postDataClientProfile.and.returnValue(of(mockResponse));

      component.onSubmit();
      tick();

      expect(clientProfileServiceMock.postDataClientProfile).toHaveBeenCalled();
      const submittedData = clientProfileServiceMock.postDataClientProfile.calls.mostRecent().args[0];
      expect(submittedData.recipientPhone).toBeUndefined();
    }));

    it('should set phoneValue to null when recipientPhone equals phonePrefix', fakeAsync(() => {
      component.userInit();
      component.savedTelegramIsNotify = false;

      component.recipientName.setValue('ValidName');
      component.recipientSurname.setValue('ValidSurname');
      component.userForm.get('recipientEmail').setValue('valid@example.com');
      component.recipientPhone.setValue('+380');

      component.recipientPhone.clearValidators();
      component.recipientPhone.updateValueAndValidity();

      component.userForm.markAsDirty();

      const mockResponse = { ...userProfileDataMock, recipientPhone: null };
      clientProfileServiceMock.postDataClientProfile.and.returnValue(of(mockResponse));

      component.onSubmit();
      tick();

      expect(clientProfileServiceMock.postDataClientProfile).toHaveBeenCalled();
      const submittedData = clientProfileServiceMock.postDataClientProfile.calls.mostRecent().args[0];
      expect(submittedData.recipientPhone).toBeUndefined();
    }));

    it('should set phoneValue to null when recipientPhone is only spaces', fakeAsync(() => {
      component.userInit();
      component.savedTelegramIsNotify = false;

      component.recipientName.setValue('ValidName');
      component.recipientSurname.setValue('ValidSurname');
      component.userForm.get('recipientEmail').setValue('valid@example.com');
      component.recipientPhone.setValue('   ');

      component.recipientPhone.clearValidators();
      component.recipientPhone.updateValueAndValidity();

      component.userForm.markAsDirty();

      const mockResponse = { ...userProfileDataMock, recipientPhone: null };
      clientProfileServiceMock.postDataClientProfile.and.returnValue(of(mockResponse));

      component.onSubmit();
      tick();

      expect(clientProfileServiceMock.postDataClientProfile).toHaveBeenCalled();
      const submittedData = clientProfileServiceMock.postDataClientProfile.calls.mostRecent().args[0];
      expect(submittedData.recipientPhone).toBeUndefined();
    }));

    it('should trim and keep phoneValue when it has valid phone number', fakeAsync(() => {
      component.userInit();
      component.savedTelegramIsNotify = false;

      component.recipientName.setValue('ValidName');
      component.recipientSurname.setValue('ValidSurname');
      component.userForm.get('recipientEmail').setValue('valid@example.com');
      component.recipientPhone.setValue('  +380991234567  ');

      component.userForm.markAsDirty();

      const expectedProfile = { ...userProfileDataMock, recipientPhone: '+380991234567' };
      clientProfileServiceMock.postDataClientProfile.and.returnValue(of(expectedProfile));

      component.onSubmit();
      tick();

      expect(clientProfileServiceMock.postDataClientProfile).toHaveBeenCalled();
      const submittedData = clientProfileServiceMock.postDataClientProfile.calls.mostRecent().args[0];
      expect(submittedData.recipientPhone).toBe('+380991234567');
    }));

    it('should handle null recipientPhone value', fakeAsync(() => {
      component.userInit();
      component.savedTelegramIsNotify = false;

      component.recipientName.setValue('ValidName');
      component.recipientSurname.setValue('ValidSurname');
      component.userForm.get('recipientEmail').setValue('valid@example.com');
      component.recipientPhone.setValue(null);

      component.recipientPhone.clearValidators();
      component.recipientPhone.updateValueAndValidity();

      component.userForm.markAsDirty();

      const mockResponse = { ...userProfileDataMock, recipientPhone: null };
      clientProfileServiceMock.postDataClientProfile.and.returnValue(of(mockResponse));

      component.onSubmit();
      tick();

      expect(clientProfileServiceMock.postDataClientProfile).toHaveBeenCalled();
      const submittedData = clientProfileServiceMock.postDataClientProfile.calls.mostRecent().args[0];
      expect(submittedData.recipientPhone).toBeUndefined();
    }));

    it('should set phoneValue to null when recipientPhone is phonePrefix with spaces', fakeAsync(() => {
      component.userInit();
      component.savedTelegramIsNotify = false;

      component.recipientName.setValue('ValidName');
      component.recipientSurname.setValue('ValidSurname');
      component.userForm.get('recipientEmail').setValue('valid@example.com');
      component.recipientPhone.setValue('  +380  ');

      component.recipientPhone.clearValidators();
      component.recipientPhone.updateValueAndValidity();

      component.userForm.markAsDirty();

      const mockResponse = { ...userProfileDataMock, recipientPhone: null };
      clientProfileServiceMock.postDataClientProfile.and.returnValue(of(mockResponse));

      component.onSubmit();
      tick();

      expect(clientProfileServiceMock.postDataClientProfile).toHaveBeenCalled();
      const submittedData = clientProfileServiceMock.postDataClientProfile.calls.mostRecent().args[0];
      expect(submittedData.recipientPhone).toBeUndefined();
    }));
  });

  describe('onSubmit method - form patching and error handling', () => {
    beforeEach(() => {
      clientProfileServiceMock.postDataClientProfile.calls.reset();
      snackBarMock.openSnackBar.calls.reset();
    });

    it('should patch form with response data after successful submit', fakeAsync(() => {
      component.userInit();
      component.savedTelegramIsNotify = false;
      component.recipientName.setValue('UpdatedName');
      component.userForm.markAsDirty();

      const mockResponse: UserProfile = {
        ...userProfileDataMock,
        recipientEmail: 'updated@example.com',
        alternateEmail: 'alt@example.com',
        recipientName: 'UpdatedName',
        recipientSurname: 'UpdatedSurname',
        recipientPhone: '+380991234567',
        telegramIsNotify: true
      };

      clientProfileServiceMock.postDataClientProfile.and.returnValue(of(mockResponse));

      component.onSubmit();
      tick();

      expect(component.userForm.get('recipientEmail').value).toBe('updated@example.com');
      expect(component.userForm.get('alternateEmail').value).toBe('alt@example.com');
      expect(component.userForm.get('recipientName').value).toBe('UpdatedName');
      expect(component.userForm.get('recipientSurname').value).toBe('UpdatedSurname');
      expect(component.userForm.get('recipientPhone').value).toBe('+380991234567');
      expect(component.userForm.get('telegramIsNotify').value).toBe(true);
    }));

    it('should set alternateEmail to null when response has null alternateEmail', fakeAsync(() => {
      component.userInit();
      component.savedTelegramIsNotify = false;
      component.recipientName.setValue('Test');
      component.userForm.markAsDirty();

      const mockResponse: UserProfile = {
        ...userProfileDataMock,
        alternateEmail: null
      };

      clientProfileServiceMock.postDataClientProfile.and.returnValue(of(mockResponse));

      component.onSubmit();
      tick();

      expect(component.userForm.get('alternateEmail').value).toBeNull();
    }));

    it('should set recipientSurname to null when response has null recipientSurname', fakeAsync(() => {
      component.userInit();
      component.savedTelegramIsNotify = false;
      component.recipientName.setValue('Test');
      component.userForm.markAsDirty();

      const mockResponse: UserProfile = {
        ...userProfileDataMock,
        recipientSurname: null
      };

      clientProfileServiceMock.postDataClientProfile.and.returnValue(of(mockResponse));

      component.onSubmit();
      tick();

      expect(component.userForm.get('recipientSurname').value).toBeNull();
    }));

    it('should set recipientPhone to empty string when response has null recipientPhone', fakeAsync(() => {
      component.userInit();
      component.savedTelegramIsNotify = false;
      component.recipientName.setValue('Test');
      component.userForm.markAsDirty();

      const mockResponse: UserProfile = {
        ...userProfileDataMock,
        recipientPhone: null
      };

      clientProfileServiceMock.postDataClientProfile.and.returnValue(of(mockResponse));

      component.onSubmit();
      tick();

      expect(component.userForm.get('recipientPhone').value).toBe('');
    }));

    it('should convert telegramIsNotify to boolean with !! operator', fakeAsync(() => {
      component.userInit();
      component.savedTelegramIsNotify = false;
      component.recipientName.setValue('Test');
      component.userForm.markAsDirty();

      const mockResponse: UserProfile = {
        ...userProfileDataMock,
        telegramIsNotify: false as any
      };

      clientProfileServiceMock.postDataClientProfile.and.returnValue(of(mockResponse));

      component.onSubmit();
      tick();

      expect(component.userForm.get('telegramIsNotify').value).toBe(false);
    }));

    it('should mark form as pristine after successful submit', fakeAsync(() => {
      component.userInit();
      component.savedTelegramIsNotify = false;
      component.recipientName.setValue('Test');
      component.userForm.markAsDirty();

      clientProfileServiceMock.postDataClientProfile.and.returnValue(of(userProfileDataMock));

      component.onSubmit();
      tick();

      expect(component.userForm.pristine).toBeTrue();
    }));

    it('should mark form as untouched after successful submit', fakeAsync(() => {
      component.userInit();
      component.savedTelegramIsNotify = false;
      component.recipientName.setValue('Test');
      component.userForm.markAsDirty();
      component.userForm.markAllAsTouched();

      clientProfileServiceMock.postDataClientProfile.and.returnValue(of(userProfileDataMock));

      component.onSubmit();
      tick();

      expect(component.userForm.untouched).toBeTrue();
    }));

    it('should show success snackbar after successful submit', fakeAsync(() => {
      component.userInit();
      component.savedTelegramIsNotify = false;
      component.recipientName.setValue('Test');
      component.userForm.markAsDirty();

      clientProfileServiceMock.postDataClientProfile.and.returnValue(of(userProfileDataMock));
      snackBarMock.openSnackBar.calls.reset();

      component.onSubmit();
      tick();

      expect(snackBarMock.openSnackBar).toHaveBeenCalledWith('savedChangesToUserProfile');
    }));

    it('should set isFetching to false on submit error', fakeAsync(() => {
      component.userInit();
      component.savedTelegramIsNotify = false;
      component.recipientName.setValue('Test');
      component.userForm.markAsDirty();

      clientProfileServiceMock.postDataClientProfile.and.returnValue(throwError(() => new Error('Server error')));

      component.onSubmit();
      tick();

      expect(component.isFetching).toBeFalse();
    }));

    it('should set isEditing to true on submit error', fakeAsync(() => {
      component.userInit();
      component.savedTelegramIsNotify = false;
      component.recipientName.setValue('Test');
      component.userForm.markAsDirty();
      component.isEditing = false;

      clientProfileServiceMock.postDataClientProfile.and.returnValue(throwError(() => new Error('Server error')));

      component.onSubmit();
      tick();

      expect(component.isEditing).toBeTrue();
    }));

    it('should show error snackbar on submit error', fakeAsync(() => {
      component.userInit();
      component.savedTelegramIsNotify = false;
      component.recipientName.setValue('Test');
      component.userForm.markAsDirty();

      clientProfileServiceMock.postDataClientProfile.and.returnValue(throwError(() => new Error('Server error')));
      snackBarMock.openSnackBar.calls.reset();

      component.onSubmit();
      tick();

      expect(snackBarMock.openSnackBar).toHaveBeenCalledWith('error');
    }));

    it('should set alternativeEmailDisplay to false after successful submit', fakeAsync(() => {
      component.userInit();
      component.savedTelegramIsNotify = false;
      component.recipientName.setValue('Test');
      component.userForm.markAsDirty();
      component.alternativeEmailDisplay = true;

      clientProfileServiceMock.postDataClientProfile.and.returnValue(of(userProfileDataMock));

      component.onSubmit();
      tick();

      expect(component.alternativeEmailDisplay).toBeFalse();
    }));

    it('should mark all invalid controls as touched when form is invalid', () => {
      component.userInit();
      component.savedTelegramIsNotify = false;

      component.recipientName.setValue('');
      component.userForm.get('recipientEmail').setValue('invalid-email');

      component.onSubmit();

      expect(component.recipientName.touched).toBeTrue();
      expect(component.userForm.get('recipientEmail').touched).toBeTrue();
    });

    it('should iterate through all form controls when form is invalid', () => {
      component.userInit();
      component.savedTelegramIsNotify = false;

      component.recipientName.setValue('');
      component.recipientSurname.setValue('Invalid$$$');
      component.userForm.get('recipientEmail').setValue('invalid');

      component.onSubmit();

      Object.keys(component.userForm.controls).forEach((key) => {
        const control = component.userForm.get(key);
        if (control?.invalid) {
          expect(control.touched).toBeTrue();
        }
      });
    });

    it('should not mark valid controls as touched when form is invalid', () => {
      component.userInit();
      component.savedTelegramIsNotify = false;

      component.recipientName.setValue('');
      component.recipientPhone.setValue('+380991234567');

      component.onSubmit();

      expect(component.recipientName.touched).toBeTrue();
      expect(component.recipientPhone.touched).toBeFalse();
    });

    it('should handle control being null or undefined in forEach loop', () => {
      component.userInit();
      component.savedTelegramIsNotify = false;

      component.recipientName.setValue('');

      spyOn(component.userForm, 'get').and.returnValue(null);

      expect(() => component.onSubmit()).not.toThrow();
    });

    describe('onSubmit method - additional coverage', () => {
      beforeEach(() => {
        clientProfileServiceMock.postDataClientProfile.calls.reset();
        snackBarMock.openSnackBar.calls.reset();
      });

      it('should correctly evaluate currentSwitch with !! operator when telegramIsNotify is true', fakeAsync(() => {
        component.userInit();
        component.savedTelegramIsNotify = false;
        component.userForm.get('telegramIsNotify').setValue(true);
        component.recipientName.setValue('Test');
        component.userForm.markAsDirty();

        const mockResponse = { ...userProfileDataMock, telegramIsNotify: true };
        clientProfileServiceMock.postDataClientProfile.and.returnValue(of(mockResponse));

        component.onSubmit();
        tick();

        const submittedData = clientProfileServiceMock.postDataClientProfile.calls.mostRecent().args[0];
        expect(submittedData.telegramIsNotify).toBe(true);
      }));

      it('should correctly evaluate currentSwitch with !! operator when telegramIsNotify is false', fakeAsync(() => {
        component.userInit();
        component.savedTelegramIsNotify = true;
        component.userForm.get('telegramIsNotify').setValue(false);
        component.recipientName.setValue('Test');
        component.userForm.markAsDirty();

        const mockResponse = { ...userProfileDataMock, telegramIsNotify: false };
        clientProfileServiceMock.postDataClientProfile.and.returnValue(of(mockResponse));

        component.onSubmit();
        tick();

        const submittedData = clientProfileServiceMock.postDataClientProfile.calls.mostRecent().args[0];
        expect(submittedData.telegramIsNotify).toBe(false);
      }));

      it('should trim phoneValue with leading and trailing spaces', fakeAsync(() => {
        component.userInit();
        component.savedTelegramIsNotify = false;
        component.userForm.get('telegramIsNotify').setValue(false);
        component.recipientName.setValue('Test');
        component.recipientPhone.setValue('  +380991234567  ');
        component.userForm.markAsDirty();

        clientProfileServiceMock.postDataClientProfile.and.returnValue(of(userProfileDataMock));

        component.onSubmit();
        tick();

        const submittedData = clientProfileServiceMock.postDataClientProfile.calls.mostRecent().args[0];
        expect(submittedData.recipientPhone).toBe('+380991234567');
      }));

      it('should set phoneValue to null when it is empty after trim', fakeAsync(() => {
        component.userInit();
        component.savedTelegramIsNotify = false;
        component.userForm.get('telegramIsNotify').setValue(false);
        component.recipientName.setValue('Test');
        component.recipientPhone.setValue('   ');
        component.recipientPhone.clearValidators();
        component.recipientPhone.updateValueAndValidity();
        component.userForm.markAsDirty();

        clientProfileServiceMock.postDataClientProfile.and.returnValue(of(userProfileDataMock));

        component.onSubmit();
        tick();

        const submittedData = clientProfileServiceMock.postDataClientProfile.calls.mostRecent().args[0];
        expect(submittedData.recipientPhone).toBeUndefined();
      }));

      it('should set phoneValue to null when it equals phonePrefix after trim', fakeAsync(() => {
        component.userInit();
        component.savedTelegramIsNotify = false;
        component.userForm.get('telegramIsNotify').setValue(false);
        component.recipientName.setValue('Test');
        component.recipientPhone.setValue('+380');
        component.recipientPhone.clearValidators();
        component.recipientPhone.updateValueAndValidity();
        component.userForm.markAsDirty();

        clientProfileServiceMock.postDataClientProfile.and.returnValue(of(userProfileDataMock));

        component.onSubmit();
        tick();

        const submittedData = clientProfileServiceMock.postDataClientProfile.calls.mostRecent().args[0];
        expect(submittedData.recipientPhone).toBeUndefined();
      }));

      it('should patch recipientEmail from response', fakeAsync(() => {
        component.userInit();
        component.savedTelegramIsNotify = false;
        component.userForm.get('telegramIsNotify').setValue(false);
        component.recipientName.setValue('Test');
        component.userForm.markAsDirty();

        const mockResponse = {
          ...userProfileDataMock,
          recipientEmail: 'newemail@example.com'
        };
        clientProfileServiceMock.postDataClientProfile.and.returnValue(of(mockResponse));

        component.onSubmit();
        tick();

        expect(component.userForm.get('recipientEmail').value).toBe('newemail@example.com');
      }));

      it('should patch recipientPhone to empty string when response has null', fakeAsync(() => {
        component.userInit();
        component.savedTelegramIsNotify = false;
        component.userForm.get('telegramIsNotify').setValue(false);
        component.recipientName.setValue('Test');
        component.userForm.markAsDirty();

        const mockResponse = {
          ...userProfileDataMock,
          recipientPhone: null
        };
        clientProfileServiceMock.postDataClientProfile.and.returnValue(of(mockResponse));

        component.onSubmit();
        tick();

        expect(component.userForm.get('recipientPhone').value).toBe('');
      }));

      it('should patch recipientPhone with actual value when response has phone', fakeAsync(() => {
        component.userInit();
        component.savedTelegramIsNotify = false;
        component.userForm.get('telegramIsNotify').setValue(false);
        component.recipientName.setValue('Test');
        component.userForm.markAsDirty();

        const mockResponse = {
          ...userProfileDataMock,
          recipientPhone: '+380501234567'
        };
        clientProfileServiceMock.postDataClientProfile.and.returnValue(of(mockResponse));

        component.onSubmit();
        tick();

        expect(component.userForm.get('recipientPhone').value).toBe('+380501234567');
      }));

      it('should show savedChangesToUserProfile snackbar on successful submit', fakeAsync(() => {
        component.userInit();
        component.savedTelegramIsNotify = false;
        component.userForm.get('telegramIsNotify').setValue(false);
        component.recipientName.setValue('Test');
        component.userForm.markAsDirty();

        clientProfileServiceMock.postDataClientProfile.and.returnValue(of(userProfileDataMock));
        snackBarMock.openSnackBar.calls.reset();

        component.onSubmit();
        tick();

        expect(snackBarMock.openSnackBar).toHaveBeenCalledWith('savedChangesToUserProfile');
        expect(snackBarMock.openSnackBar).toHaveBeenCalledTimes(1);
      }));

      it('should iterate through all form controls and get each control when form is invalid', () => {
        component.userInit();
        component.savedTelegramIsNotify = false;
        component.userForm.get('telegramIsNotify').setValue(false);

        component.recipientName.setValue('');
        component.userForm.get('recipientEmail').setValue('invalid');

        const getCalls: string[] = [];
        const originalGet = component.userForm.get.bind(component.userForm);
        spyOn(component.userForm, 'get').and.callFake((key: string) => {
          getCalls.push(key);
          return originalGet(key);
        });

        component.onSubmit();

        const allKeys = Object.keys(component.userForm.controls);
        allKeys.forEach((key) => {
          expect(getCalls).toContain(key);
        });
      });

      it('should mark invalid controls as touched in forEach loop', () => {
        component.userInit();
        component.savedTelegramIsNotify = false;
        component.userForm.get('telegramIsNotify').setValue(false);

        component.recipientName.setValue('');
        component.userForm.get('recipientEmail').setValue('invalid-email');

        component.recipientName.markAsUntouched();
        component.userForm.get('recipientEmail').markAsUntouched();

        component.onSubmit();

        expect(component.recipientName.touched).toBeTrue();
        expect(component.userForm.get('recipientEmail').touched).toBeTrue();
      });

      it('should not mark valid controls as touched in forEach loop', () => {
        component.userInit();
        component.savedTelegramIsNotify = false;
        component.userForm.get('telegramIsNotify').setValue(false);

        component.recipientName.setValue('');
        component.recipientSurname.setValue('ValidSurname');
        component.recipientPhone.setValue('+380991234567');

        component.recipientName.markAsUntouched();
        component.recipientSurname.markAsUntouched();
        component.recipientPhone.markAsUntouched();

        component.onSubmit();

        expect(component.recipientName.touched).toBeTrue();
        expect(component.recipientSurname.touched).toBeFalse();
        expect(component.recipientPhone.touched).toBeFalse();
      });

      it('should handle control?.invalid check with null control', () => {
        component.userInit();
        component.savedTelegramIsNotify = false;
        component.userForm.get('telegramIsNotify').setValue(false);

        component.recipientName.setValue('');

        let callCount = 0;
        const originalGet = component.userForm.get.bind(component.userForm);
        spyOn(component.userForm, 'get').and.callFake((key: string) => {
          callCount++;
          if (callCount === 2) {
            return null;
          }
          return originalGet(key);
        });

        expect(() => component.onSubmit()).not.toThrow();
      });

      it('should use ?? operator to default recipientPhone to empty string', fakeAsync(() => {
        component.userInit();
        component.savedTelegramIsNotify = false;
        component.userForm.get('telegramIsNotify').setValue(false);
        component.recipientName.setValue('Test');
        component.userForm.markAsDirty();

        const mockResponse = {
          ...userProfileDataMock,
          recipientPhone: undefined as any
        };
        clientProfileServiceMock.postDataClientProfile.and.returnValue(of(mockResponse));

        component.onSubmit();
        tick();

        expect(component.userForm.get('recipientPhone').value).toBe('');
      }));

      it('should trim recipientPhone before checking if it equals phonePrefix', fakeAsync(() => {
        component.userInit();
        component.savedTelegramIsNotify = false;
        component.userForm.get('telegramIsNotify').setValue(false);
        component.recipientName.setValue('Test');
        component.recipientPhone.setValue('  +380  ');
        component.recipientPhone.clearValidators();
        component.recipientPhone.updateValueAndValidity();
        component.userForm.markAsDirty();

        clientProfileServiceMock.postDataClientProfile.and.returnValue(of(userProfileDataMock));

        component.onSubmit();
        tick();

        const submittedData = clientProfileServiceMock.postDataClientProfile.calls.mostRecent().args[0];
        expect(submittedData.recipientPhone).toBeUndefined();
      }));
    });
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
    it('should toggle telegramIsNotify and call goToTelegramUrl when newValue is true', () => {
      const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(true) });
      spyOn(TestBed.inject(MatDialog), 'open').and.returnValue(dialogRefSpyObj as any);
      spyOn(component, 'goToTelegramUrl');

      component.userProfile = {
        recipientName: 'Test',
        recipientSurname: 'User',
        recipientEmail: 'test@example.com',
        recipientPhone: '+380991234567',
        alternateEmail: '',
        addressDto: [],
        telegramIsNotify: false,
        hasPassword: true,
        botList: [{ link: 'https://t.me/testbot', type: 'telegram' }]
      };

      component.userInit();
      component.savedTelegramIsNotify = false;
      component.isEditing = true;

      component.onSwitchChanged(true);

      expect(component.goToTelegramUrl).toHaveBeenCalled();
      expect(component.userProfile.telegramIsNotify).toBeTrue();
      expect(component.userForm.get('telegramIsNotify')?.value).toBeTrue();
    });

    it('should not call goToTelegramUrl when user cancels', () => {
      const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(false) });
      spyOn(TestBed.inject(MatDialog), 'open').and.returnValue(dialogRefSpyObj as any);
      spyOn(component, 'goToTelegramUrl');

      component.userProfile = {
        recipientName: 'Test',
        recipientSurname: 'User',
        recipientEmail: 'test@example.com',
        recipientPhone: '+380991234567',
        alternateEmail: '',
        addressDto: [],
        telegramIsNotify: false,
        hasPassword: true,
        botList: [{ link: 'https://t.me/testbot', type: 'telegram' }]
      };

      component.userInit();
      component.savedTelegramIsNotify = false;
      component.isEditing = true;

      const initialValue = component.userProfile.telegramIsNotify;

      component.onSwitchChanged(true);

      expect(component.goToTelegramUrl).not.toHaveBeenCalled();
      expect(component.userProfile.telegramIsNotify).toBe(initialValue);
      expect(component.userForm.get('telegramIsNotify')?.value).toBe(initialValue);
    });

    it('should disable telegram notifications when newValue is false', () => {
      component.userProfile = {
        recipientName: 'Test',
        recipientSurname: 'User',
        recipientEmail: 'test@example.com',
        recipientPhone: '+380991234567',
        alternateEmail: '',
        addressDto: [],
        telegramIsNotify: true,
        hasPassword: true,
        botList: [{ link: 'https://t.me/testbot', type: 'telegram' }]
      };

      component.userInit();
      component.savedTelegramIsNotify = true;
      component.isEditing = false;

      clientProfileServiceMock.postDataClientProfile.and.returnValue(of({ ...component.userProfile, telegramIsNotify: false }));

      component.onSwitchChanged(false);

      expect(component.userProfile.telegramIsNotify).toBeFalse();
      expect(component.userForm.get('telegramIsNotify')?.value).toBeFalse();
    });

    describe('onSwitchChanged method - saveToServer function coverage', () => {
      beforeEach(() => {
        clientProfileServiceMock.postDataClientProfile.calls.reset();
        snackBarMock.openSnackBar.calls.reset();
      });

      it('should call postDataClientProfile when turning on notifications in non-editing mode', fakeAsync(() => {
        const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(true) });
        spyOn(TestBed.inject(MatDialog), 'open').and.returnValue(dialogRefSpyObj as any);
        spyOn(component, 'goToTelegramUrl');

        component.userProfile = {
          recipientName: 'Test',
          recipientSurname: 'User',
          recipientEmail: 'test@example.com',
          recipientPhone: '+380991234567',
          alternateEmail: '',
          addressDto: [],
          telegramIsNotify: false,
          hasPassword: true,
          botList: [{ link: 'https://t.me/testbot', type: 'telegram' }]
        };

        component.userInit();
        component.savedTelegramIsNotify = false;
        component.isEditing = false;
        component.isFetching = false;

        const mockResponse = { ...component.userProfile, telegramIsNotify: true };
        clientProfileServiceMock.postDataClientProfile.and.returnValue(of(mockResponse));

        component.onSwitchChanged(true);
        tick();

        expect(clientProfileServiceMock.postDataClientProfile).toHaveBeenCalled();
        expect(clientProfileServiceMock.postDataClientProfile).toHaveBeenCalledWith(jasmine.objectContaining({ telegramIsNotify: true }));
      }));

      it('should use pipe(take(1)) when calling postDataClientProfile', fakeAsync(() => {
        const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(true) });
        spyOn(TestBed.inject(MatDialog), 'open').and.returnValue(dialogRefSpyObj as any);
        spyOn(component, 'goToTelegramUrl');

        component.userProfile = {
          recipientName: 'Test',
          recipientSurname: 'User',
          recipientEmail: 'test@example.com',
          recipientPhone: '+380991234567',
          alternateEmail: '',
          addressDto: [],
          telegramIsNotify: false,
          hasPassword: true,
          botList: [{ link: 'https://t.me/testbot', type: 'telegram' }]
        };

        component.userInit();
        component.savedTelegramIsNotify = false;
        component.isEditing = false;

        const mockResponse = { ...component.userProfile, telegramIsNotify: true };
        const observable = of(mockResponse);
        const pipeSpy = spyOn(observable, 'pipe').and.callThrough();

        clientProfileServiceMock.postDataClientProfile.and.returnValue(observable);

        component.onSwitchChanged(true);
        tick();

        expect(pipeSpy).toHaveBeenCalled();
      }));

      it('should update userProfile.telegramIsNotify in next callback', fakeAsync(() => {
        const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(true) });
        spyOn(TestBed.inject(MatDialog), 'open').and.returnValue(dialogRefSpyObj as any);
        spyOn(component, 'goToTelegramUrl');

        component.userProfile = {
          recipientName: 'Test',
          recipientSurname: 'User',
          recipientEmail: 'test@example.com',
          recipientPhone: '+380991234567',
          alternateEmail: '',
          addressDto: [],
          telegramIsNotify: false,
          hasPassword: true,
          botList: [{ link: 'https://t.me/testbot', type: 'telegram' }]
        };

        component.userInit();
        component.savedTelegramIsNotify = false;
        component.isEditing = false;

        const mockResponse = { ...component.userProfile, telegramIsNotify: true };
        clientProfileServiceMock.postDataClientProfile.and.returnValue(of(mockResponse));

        component.onSwitchChanged(true);
        tick();

        expect(component.userProfile.telegramIsNotify).toBe(true);
      }));

      it('should update savedTelegramIsNotify in next callback', fakeAsync(() => {
        const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(true) });
        spyOn(TestBed.inject(MatDialog), 'open').and.returnValue(dialogRefSpyObj as any);
        spyOn(component, 'goToTelegramUrl');

        component.userProfile = {
          recipientName: 'Test',
          recipientSurname: 'User',
          recipientEmail: 'test@example.com',
          recipientPhone: '+380991234567',
          alternateEmail: '',
          addressDto: [],
          telegramIsNotify: false,
          hasPassword: true,
          botList: [{ link: 'https://t.me/testbot', type: 'telegram' }]
        };

        component.userInit();
        component.savedTelegramIsNotify = false;
        component.isEditing = false;

        const mockResponse = { ...component.userProfile, telegramIsNotify: true };
        clientProfileServiceMock.postDataClientProfile.and.returnValue(of(mockResponse));

        component.onSwitchChanged(true);
        tick();

        expect(component.savedTelegramIsNotify).toBe(true);
      }));

      it('should restore isFetching state after successful save', fakeAsync(() => {
        const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(true) });
        spyOn(TestBed.inject(MatDialog), 'open').and.returnValue(dialogRefSpyObj as any);
        spyOn(component, 'goToTelegramUrl');

        component.userProfile = {
          recipientName: 'Test',
          recipientSurname: 'User',
          recipientEmail: 'test@example.com',
          recipientPhone: '+380991234567',
          alternateEmail: '',
          addressDto: [],
          telegramIsNotify: false,
          hasPassword: true,
          botList: [{ link: 'https://t.me/testbot', type: 'telegram' }]
        };

        component.userInit();
        component.savedTelegramIsNotify = false;
        component.isEditing = false;
        component.isFetching = false;

        const mockResponse = { ...component.userProfile, telegramIsNotify: true };
        clientProfileServiceMock.postDataClientProfile.and.returnValue(of(mockResponse));

        component.onSwitchChanged(true);
        tick();

        expect(component.isFetching).toBe(false);
      }));

      it('should handle error in postDataClientProfile and revert switch value', fakeAsync(() => {
        const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(true) });
        spyOn(TestBed.inject(MatDialog), 'open').and.returnValue(dialogRefSpyObj as any);
        spyOn(component, 'goToTelegramUrl');

        component.userProfile = {
          recipientName: 'Test',
          recipientSurname: 'User',
          recipientEmail: 'test@example.com',
          recipientPhone: '+380991234567',
          alternateEmail: '',
          addressDto: [],
          telegramIsNotify: false,
          hasPassword: true,
          botList: [{ link: 'https://t.me/testbot', type: 'telegram' }]
        };

        component.userInit();
        component.savedTelegramIsNotify = false;
        component.isEditing = false;

        clientProfileServiceMock.postDataClientProfile.and.returnValue(throwError(() => new Error('Server error')));

        component.onSwitchChanged(true);
        tick();

        expect(component.userForm.get('telegramIsNotify')?.value).toBe(false);
      }));

      it('should revert userProfile.telegramIsNotify on error', fakeAsync(() => {
        const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(true) });
        spyOn(TestBed.inject(MatDialog), 'open').and.returnValue(dialogRefSpyObj as any);
        spyOn(component, 'goToTelegramUrl');

        component.userProfile = {
          recipientName: 'Test',
          recipientSurname: 'User',
          recipientEmail: 'test@example.com',
          recipientPhone: '+380991234567',
          alternateEmail: '',
          addressDto: [],
          telegramIsNotify: false,
          hasPassword: true,
          botList: [{ link: 'https://t.me/testbot', type: 'telegram' }]
        };

        component.userInit();
        component.savedTelegramIsNotify = false;
        component.isEditing = false;

        clientProfileServiceMock.postDataClientProfile.and.returnValue(throwError(() => new Error('Server error')));

        component.onSwitchChanged(true);
        tick();

        expect(component.userProfile.telegramIsNotify).toBe(false);
      }));

      it('should restore isFetching state on error', fakeAsync(() => {
        const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(true) });
        spyOn(TestBed.inject(MatDialog), 'open').and.returnValue(dialogRefSpyObj as any);
        spyOn(component, 'goToTelegramUrl');

        component.userProfile = {
          recipientName: 'Test',
          recipientSurname: 'User',
          recipientEmail: 'test@example.com',
          recipientPhone: '+380991234567',
          alternateEmail: '',
          addressDto: [],
          telegramIsNotify: false,
          hasPassword: true,
          botList: [{ link: 'https://t.me/testbot', type: 'telegram' }]
        };

        component.userInit();
        component.savedTelegramIsNotify = false;
        component.isEditing = false;
        component.isFetching = false;

        clientProfileServiceMock.postDataClientProfile.and.returnValue(throwError(() => new Error('Server error')));

        component.onSwitchChanged(true);
        tick();

        expect(component.isFetching).toBe(false);
      }));

      it('should show error snackbar on postDataClientProfile error', fakeAsync(() => {
        const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(true) });
        spyOn(TestBed.inject(MatDialog), 'open').and.returnValue(dialogRefSpyObj as any);
        spyOn(component, 'goToTelegramUrl');

        component.userProfile = {
          recipientName: 'Test',
          recipientSurname: 'User',
          recipientEmail: 'test@example.com',
          recipientPhone: '+380991234567',
          alternateEmail: '',
          addressDto: [],
          telegramIsNotify: false,
          hasPassword: true,
          botList: [{ link: 'https://t.me/testbot', type: 'telegram' }]
        };

        component.userInit();
        component.savedTelegramIsNotify = false;
        component.isEditing = false;

        clientProfileServiceMock.postDataClientProfile.and.returnValue(throwError(() => new Error('Server error')));
        snackBarMock.openSnackBar.calls.reset();

        component.onSwitchChanged(true);
        tick();

        expect(snackBarMock.openSnackBar).toHaveBeenCalledWith('error');
      }));

      it('should call saveToServer with false when turning off notifications in non-editing mode', fakeAsync(() => {
        component.userProfile = {
          recipientName: 'Test',
          recipientSurname: 'User',
          recipientEmail: 'test@example.com',
          recipientPhone: '+380991234567',
          alternateEmail: '',
          addressDto: [],
          telegramIsNotify: true,
          hasPassword: true,
          botList: [{ link: 'https://t.me/testbot', type: 'telegram' }]
        };

        component.userInit();
        component.savedTelegramIsNotify = true;
        component.isEditing = false;

        const mockResponse = { ...component.userProfile, telegramIsNotify: false };
        clientProfileServiceMock.postDataClientProfile.and.returnValue(of(mockResponse));

        component.onSwitchChanged(false);
        tick();

        expect(clientProfileServiceMock.postDataClientProfile).toHaveBeenCalledWith(jasmine.objectContaining({ telegramIsNotify: false }));
        expect(component.userProfile.telegramIsNotify).toBe(false);
        expect(component.savedTelegramIsNotify).toBe(false);
      }));

      it('should set emitEvent to false when reverting switch on error', fakeAsync(() => {
        const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(true) });
        spyOn(TestBed.inject(MatDialog), 'open').and.returnValue(dialogRefSpyObj as any);
        spyOn(component, 'goToTelegramUrl');

        component.userProfile = {
          recipientName: 'Test',
          recipientSurname: 'User',
          recipientEmail: 'test@example.com',
          recipientPhone: '+380991234567',
          alternateEmail: '',
          addressDto: [],
          telegramIsNotify: false,
          hasPassword: true,
          botList: [{ link: 'https://t.me/testbot', type: 'telegram' }]
        };

        component.userInit();
        component.savedTelegramIsNotify = false;
        component.isEditing = false;

        const control = component.userForm.get('telegramIsNotify');
        const setValueSpy = spyOn(control, 'setValue').and.callThrough();

        clientProfileServiceMock.postDataClientProfile.and.returnValue(throwError(() => new Error('Server error')));

        component.onSwitchChanged(true);
        tick();

        expect(setValueSpy).toHaveBeenCalledWith(false, { emitEvent: false });
      }));

      it('should preserve isFetching state through saveToServer execution', fakeAsync(() => {
        const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(true) });
        spyOn(TestBed.inject(MatDialog), 'open').and.returnValue(dialogRefSpyObj as any);
        spyOn(component, 'goToTelegramUrl');

        component.userProfile = {
          recipientName: 'Test',
          recipientSurname: 'User',
          recipientEmail: 'test@example.com',
          recipientPhone: '+380991234567',
          alternateEmail: '',
          addressDto: [],
          telegramIsNotify: false,
          hasPassword: true,
          botList: [{ link: 'https://t.me/testbot', type: 'telegram' }]
        };

        component.userInit();
        component.savedTelegramIsNotify = false;
        component.isEditing = false;
        component.isFetching = true;

        const mockResponse = { ...component.userProfile, telegramIsNotify: true };
        clientProfileServiceMock.postDataClientProfile.and.returnValue(of(mockResponse));

        component.onSwitchChanged(true);

        expect(component.isFetching).toBe(true);

        tick();

        expect(component.isFetching).toBe(true);
      }));
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

  it('should dispatch UpdateAddress action for a modified existing address', fakeAsync(() => {
    const initialUserProfile: UserProfile = { ...userProfileDataMock };
    component.userProfile = { ...initialUserProfile };
    component.savedUserAddresses = [...initialUserProfile.addressDto];
    component.userInit();
    fixture.detectChanges();

    const addressFormArray = component.userForm.get('address') as FormArray;
    const addressControl = addressFormArray.at(0) as FormControl;

    const updatedAddress: Address = { ...addressControl.value, streetUk: 'Updated Street' };
    addressControl.setValue(updatedAddress);
    addressControl.markAsDirty();

    clientProfileServiceMock.postDataClientProfile.and.returnValue(of({ ...initialUserProfile, addressDto: [updatedAddress] }));
    const store = TestBed.inject(Store) as MockStore;
    const dispatchSpy = spyOn(store, 'dispatch');

    component.onSubmit();
    tick();

    expect(dispatchSpy).toHaveBeenCalledWith(
      UpdateAddress({
        address: jasmine.objectContaining({ streetUk: 'Updated Street', id: 2276 }) as any
      })
    );
  }));
});
