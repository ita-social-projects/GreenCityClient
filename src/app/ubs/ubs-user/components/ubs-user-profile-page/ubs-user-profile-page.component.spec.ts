import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { AbstractControl, FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { IMaskModule } from 'angular-imask';
import { of } from 'rxjs';
import { UserProfile } from 'src/app/ubs/ubs-admin/models/ubs-admin.interface';
import { ClientProfileService } from '../../services/client-profile.service';
import { UbsUserProfilePageComponent } from './ubs-user-profile-page.component';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { LanguageService } from 'src/app/shared/i18n/language.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LocationService } from '@ubs/ubs-user/services/location/location.service';
import { ADDRESSESMOCK } from 'src/app/ubs/mocks/address-mock';
import { NotificationPlatform } from '../../../ubs/notification-platform.enum';
import { ubsOrderServiseMock } from 'src/app/ubs/mocks/order-data-mock';
import { provideMockStore } from '@ngrx/store/testing';
import { AddressInputComponent } from '@ubs/shared/components/address-input/address-input.component';
import { InputGoogleAutocompleteComponent } from 'src/app/shared/components/input-google-autocomplete/input-google-autocomplete.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { LangValueDirective } from 'src/app/shared/directives/lang-value/lang-value.directive';
import { JwtService } from 'src/app/shared/services/jwt/jwt.service';
import { MatSnackBarService } from '@global-service/mat-snack-bar/mat-snack-bar.service';
import { MatSelectModule } from '@angular/material/select';

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
  const clientProfileServiceMock: ClientProfileService = jasmine.createSpyObj('ClientProfileService', {
    getDataClientProfile: of(userProfileDataMock),
    postDataClientProfile: of({})
  });
  const snackBarMock = {
    openSnackBar: () => {}
  };
  const dialogMock = {
    open: () => {}
  };

  const fakeLocalStorageService = jasmine.createSpyObj('LocalStorageService', [
    'getCurrentLanguage',
    'languageBehaviourSubject',
    'getLocations',
    'getAccessToken',
    'getUserId'
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

  const initialState = { order: { ubsOrderServiseMock } };

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
          id: userProfileDataMock.addressDto[0].id,
          actual: userProfileDataMock.addressDto[0].actual,
          coordinates: userProfileDataMock.addressDto[0].coordinates
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

  it('should test userInit', () => {
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
});
