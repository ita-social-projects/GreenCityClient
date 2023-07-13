import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { TranslateModule } from '@ngx-translate/core';
import { IMaskModule } from 'angular-imask';
import { of } from 'rxjs';
import { UserProfile } from 'src/app/ubs/ubs-admin/models/ubs-admin.interface';
import { ClientProfileService } from '../services/client-profile.service';
import { UbsUserProfilePageComponent } from './ubs-user-profile-page.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { GoogleScript } from 'src/assets/google-script/google-script';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LocationService } from '@global-service/location/location.service';
import { ADDRESSESMOCK } from 'src/app/ubs/mocks/address-mock';
import { Language } from 'src/app/main/i18n/Language';

describe('UbsUserProfilePageComponent', () => {
  const userProfileDataMock: UserProfile = {
    addressDto: [
      {
        id: 2276,
        city: 'Kyiv',
        cityEn: 'Kyiv',
        district: 'Troeshchina',
        districtEn: 'Troeshchina',
        entranceNumber: '65',
        houseCorpus: '3',
        houseNumber: '8',
        actual: false,
        region: 'Kyiv',
        regionEn: 'Kyiv',
        coordinates: { latitude: 0, longitude: 0 },
        street: 'Jhohn Lenon',
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
  let component: UbsUserProfilePageComponent;
  let fixture: ComponentFixture<UbsUserProfilePageComponent>;
  let clientProfileServiceMock: ClientProfileService;
  clientProfileServiceMock = jasmine.createSpyObj('ClientProfileService', {
    getDataClientProfile: of(userProfileDataMock),
    postDataClientProfile: of({})
  });
  const snackBarMock = {
    openSnackBar: () => {}
  };
  const dialogMock = {
    open: () => {}
  };

  const status = 'OK';

  const fakeLocalStorageService = jasmine.createSpyObj('LocalStorageService', ['getCurrentLanguage', 'languageBehaviourSubject']);
  fakeLocalStorageService.getCurrentLanguage = () => 'ua';
  fakeLocalStorageService.languageBehaviourSubject = new BehaviorSubject('ua');

  const languageServiceMock = jasmine.createSpyObj('languageService', ['getLangValue']);
  languageServiceMock.getLangValue = (valUa: string | AbstractControl, valEn: string | AbstractControl) => {
    return valUa;
  };

  const fakeGoogleScript = jasmine.createSpyObj('GoogleScript', ['load']);
  fakeGoogleScript.load.and.returnValue(of());

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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsUserProfilePageComponent],
      providers: [
        { provide: MatDialog, useValue: dialogMock },
        { provide: MatDialogRef, useValue: {} },
        { provide: ClientProfileService, useValue: clientProfileServiceMock },
        { provide: MatSnackBarComponent, useValue: snackBarMock },
        { provide: LocalStorageService, useValue: fakeLocalStorageService },
        { provide: LanguageService, useValue: languageServiceMock },
        { provide: GoogleScript, useValue: fakeGoogleScript },
        { provide: LocationService, useValue: fakeLocationServiceMock }
      ],
      imports: [TranslateModule.forRoot(), ReactiveFormsModule, IMaskModule, MatAutocompleteModule, HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsUserProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call "redirectToMessengers" correctly ', () => {
    component.viberNotification = false;
    component.telegramNotification = true;
    const goToTelegramSpy = spyOn(component, 'goToTelegramUrl');
    const goToViberSpy = spyOn(component, 'goToViberUrl');
    const redirectSpy = spyOn(component, 'redirectToMessengers');

    redirectSpy();
    goToTelegramSpy();

    expect(redirectSpy).toHaveBeenCalled();
    expect(goToViberSpy).toHaveBeenCalledTimes(0);
    expect(goToTelegramSpy).toHaveBeenCalled();
  });

  it('should call "goToTelegramUrl" correctly', () => {
    const goToTelegramSpy = spyOn(component, 'goToTelegramUrl');
    goToTelegramSpy();
    expect(goToTelegramSpy).toHaveBeenCalled();
  });

  it('should call "goToViberUrl" correctly', () => {
    const goToViberSpy = spyOn(component, 'goToViberUrl');
    goToViberSpy();
    expect(goToViberSpy).toHaveBeenCalled();
  });

  it('if post data set isFetching === false', () => {
    clientProfileServiceMock.postDataClientProfile(userProfileDataMock).subscribe((data) => {
      expect(component.isFetching).toBeFalsy();
    });
  });

  it('method ngOnInit should call getUserData', () => {
    spyOn(component, 'getUserData');
    component.ngOnInit();
    expect(component.getUserData).toHaveBeenCalled();
    expect(component.currentLanguage).toEqual('ua');
  });

  it('function composeData has to return data', () => {
    let mock;
    mock = JSON.parse(JSON.stringify(userProfileDataMock));
    const data = component.composeFormData(userProfileDataMock);
    mock.recipientPhone = '972333333';
    expect(data).toEqual(mock);
  });

  it('function composeData has to cut phone number to 9 digits', () => {
    const data = component.composeFormData(userProfileDataMock);
    expect(data.recipientPhone.length).toBe(9);
  });

  it('method getUserData should call method userInit', () => {
    spyOn(component, 'userInit');
    component.getUserData();
    expect(component.userInit).toHaveBeenCalled();
  });

  it('method onCancel should be called by clicking cancel button', fakeAsync(() => {
    component.isEditing = true;
    fixture.detectChanges();
    spyOn(component, 'onCancel');
    const cancelButton = fixture.debugElement.query(By.css('.submit-btns .ubs-secondary-global-button')).nativeElement;
    cancelButton.click();
    tick();
    expect(component.onCancel).toHaveBeenCalled();
  }));

  it('method openDeleteProfileDialog should be calls by clicking delete button', fakeAsync(() => {
    spyOn(component, 'openDeleteProfileDialog');
    const deleteButton = fixture.debugElement.query(By.css('.header-buttons .ubs-danger-global-button')).nativeElement;
    deleteButton.click();
    tick();
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

  it('spiner has to be defined if (isFetching === true)', () => {
    component.isFetching = true;
    fixture.detectChanges();
    const spiner = fixture.debugElement.query(By.css('app-spinner')).nativeElement;
    expect(spiner).toBeDefined();
  });

  it('method onEdit should get data and invoke methods', fakeAsync(() => {
    component.isEditing = false;
    component.isFetching = true;
    const spy1 = spyOn(component as any, 'initGoogleAutocompleteServices');
    const spy2 = spyOn(component, 'focusOnFirst');
    component.onEdit();
    expect(component.isEditing).toEqual(true);
    expect(component.isFetching).toEqual(false);
    expect(spy1).toHaveBeenCalled();
    tick();
    fixture.detectChanges();
    expect(spy2).toHaveBeenCalled();
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
      spyOn(component, 'onSubmit');
      const deleteButton = fixture.debugElement.query(By.css('.submit-btns .ubs-primary-global-button')).nativeElement;
      deleteButton.click();
      tick();
      expect(component.onSubmit).toHaveBeenCalled();
    }
  }));

  it('method onSubmit should return submitData', () => {
    let submitData;
    component.toggleAlternativeEmail();
    component.onSubmit();
    submitData = {
      addressDto: [
        {
          ...component.userForm.value.address[0],
          id: userProfileDataMock.addressDto[0].id,
          actual: userProfileDataMock.addressDto[0].actual,
          coordinates: userProfileDataMock.addressDto[0].coordinates
        }
      ],
      recipientEmail: component.userForm.value.recipientEmail,
      alternateEmail: component.userForm.value.alternateEmail,
      recipientName: component.userForm.value.recipientName,
      recipientPhone: component.userForm.value.recipientPhone,
      recipientSurname: component.userForm.value.recipientSurname,
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

    delete submitData.addressRegionDistrictList;

    expect(submitData).toEqual(userProfileDataMock);
  });

  it('method onSubmit should return boolean if user has a password', () => {
    component.onSubmit();
    userProfileDataMock.hasPassword = userProfileDataMock.hasPassword;
    expect(userProfileDataMock.hasPassword).toBeTruthy();
  });

  it('method onSubmit should return submitData without alternative email ', () => {
    let submitData;
    submitData = {
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

  it('method onSubmit should return submitData without housecorpus ', () => {
    let submitData;
    component.toggleAlternativeEmail();
    component.onSubmit();
    submitData = {
      addressDto: [
        {
          ...component.userForm.value.address[0],
          houseCorpus: null,
          id: userProfileDataMock.addressDto[0].id,
          actual: userProfileDataMock.addressDto[0].actual,
          coordinates: userProfileDataMock.addressDto[0].coordinates
        }
      ],
      recipientEmail: component.userForm.value.recipientEmail,
      alternateEmail: component.userForm.value.alternateEmail,
      recipientName: component.userForm.value.recipientName,
      recipientPhone: component.userForm.value.recipientPhone,
      recipientSurname: component.userForm.value.recipientSurname,
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
    userProfileDataMock.addressDto[0].houseCorpus = null;

    expect(submitData).toEqual(userProfileDataMock);
  });

  it('method onSubmit should return submitData  without entrance number ', () => {
    let submitData;

    component.toggleAlternativeEmail();
    component.onSubmit();
    submitData = {
      addressDto: [
        {
          ...component.userForm.value.address[0],
          entranceNumber: null,
          id: userProfileDataMock.addressDto[0].id,
          actual: userProfileDataMock.addressDto[0].actual,
          coordinates: userProfileDataMock.addressDto[0].coordinates
        }
      ],
      recipientEmail: component.userForm.value.recipientEmail,
      alternateEmail: component.userForm.value.alternateEmail,
      recipientName: component.userForm.value.recipientName,
      recipientPhone: component.userForm.value.recipientPhone,
      recipientSurname: component.userForm.value.recipientSurname,
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
    userProfileDataMock.addressDto[0].entranceNumber = null;

    expect(submitData).toEqual(userProfileDataMock);
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

  it('method emptyPredictLists should set lists', () => {
    component.emptyPredictLists();
    expect(component.cityPredictionList).toBe(null);
    expect(component.streetPredictionList).toBe(null);
  });

  it('method setPredictCities should call method for predicting cities in ua', () => {
    const currentFormGroup = component.userForm.controls.address.get('0');
    const regionEn = currentFormGroup.get('regionEn');
    const region = currentFormGroup.get('region');
    const city = currentFormGroup.get('city');

    region.setValue('місто Київ');
    city.setValue('Київ');
    const searchAddress = `${region.value}, ${city.value}`;
    const spy = spyOn(component, 'inputCity');
    component.currentLanguage = 'ua';
    component.setPredictCities(0);
    expect(component.cityPredictionList).toBe(null);
    expect(spy).toHaveBeenCalledWith(searchAddress, regionEn.value, 'uk');
  });

  it('method setPredictCities should call method for predicting cities in en', () => {
    const currentFormGroup = component.userForm.controls.address.get('0');
    const regionEn = currentFormGroup.get('regionEn');
    const cityEn = currentFormGroup.get('cityEn');

    regionEn.setValue('Kyiv');
    cityEn.setValue('Kyiv');
    const searchAddress = `${regionEn.value},${cityEn.value}`;
    const spy = spyOn(component, 'inputCity');
    component.currentLanguage = 'en';
    component.setPredictCities(0);
    expect(component.cityPredictionList).toBe(null);
    expect(spy).toHaveBeenCalledWith(searchAddress, regionEn.value, 'en');
  });

  it('method inputCity should invoke getPlacePredictions', () => {
    const currentFormGroup = component.userForm.controls.address.get('0');
    const regionEn = currentFormGroup.get('regionEn');
    component.autocompleteService = { getPlacePredictions: (a, b) => {} } as any;
    spyOn(component.autocompleteService, 'getPlacePredictions').and.callThrough();
    const fakesearchAddress = `Kyiv, Kyiv`;
    component.inputCity(fakesearchAddress, regionEn.value, Language.EN);
    expect(component.autocompleteService.getPlacePredictions).toHaveBeenCalled();
  });

  it('method getPlacePredictions should form prediction list for Kyiv region', () => {
    const currentFormGroup = component.userForm.controls.address.get('0');
    const regionEn = currentFormGroup.get('regionEn');

    regionEn.setValue(`Kyivs'ka oblast`);
    component.autocompleteService = { getPlacePredictions: () => {} } as any;
    spyOn(component.autocompleteService, 'getPlacePredictions').and.callFake((request, callback) => {
      callback(ADDRESSESMOCK.KYIVREGIONSLIST, status as any);
    });
    const fakesearchAddress = `Київська область, Ше`;
    component.inputCity(fakesearchAddress, regionEn.value, Language.UK);
    expect(component.cityPredictionList).toEqual(ADDRESSESMOCK.KYIVREGIONSLIST);
  });

  it('method getPlacePredictions should form prediction list for Kyiv city', () => {
    const currentFormGroup = component.userForm.controls.address.get('0');
    const regionEn = currentFormGroup.get('regionEn');

    const result = [ADDRESSESMOCK.KYIVCITYLIST[0]];
    regionEn.setValue(`Kyiv`);
    component.autocompleteService = { getPlacePredictions: () => {} } as any;
    spyOn(component.autocompleteService, 'getPlacePredictions').and.callFake((request, callback) => {
      callback(ADDRESSESMOCK.KYIVCITYLIST, status as any);
    });

    const fakesearchAddress = `Київ`;
    component.inputCity(fakesearchAddress, regionEn.value, Language.UK);
    expect(component.cityPredictionList).toEqual(result);
  });

  it('method onCitySelected should invoke method setValueOfCity 2 times', () => {
    const spy = spyOn(component, 'setValueOfCity');
    component.onCitySelected(0, ADDRESSESMOCK.KYIVREGIONSLIST[0]);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('method onCitySelected should invoke methods to set value of city', () => {
    const currentFormGroup = component.userForm.controls.address.get('0');
    const spy = spyOn(component, 'setValueOfCity');
    component.onCitySelected(0, ADDRESSESMOCK.KYIVREGIONSLIST[0]);
    expect(spy).toHaveBeenCalledWith(ADDRESSESMOCK.KYIVREGIONSLIST[0], currentFormGroup, 'city');
    expect(spy).toHaveBeenCalledWith(ADDRESSESMOCK.KYIVREGIONSLIST[0], currentFormGroup, 'cityEn');
  });

  it('method onCitySelected should invoke getDetails', () => {
    const currentFormGroup = component.userForm.controls.address.get('0');
    component.placeService = { getDetails: (a, b) => {} } as any;
    spyOn(component.placeService, 'getDetails').and.callThrough();
    component.setValueOfCity(ADDRESSESMOCK.KYIVREGIONSLIST[0], currentFormGroup, 'city');
    expect(component.placeService.getDetails).toHaveBeenCalled();
  });

  it('if value of city was changed other fields should be empty', fakeAsync(() => {
    const currentFormGroup = component.userForm.controls.address.get('0');
    const city = currentFormGroup.get('city');
    spyOn(component, 'setValueOfCity');
    component.onCitySelected(0, ADDRESSESMOCK.KYIVREGIONSLIST[0]);
    city.setValue('Щасливе');
    city.updateValueAndValidity({ emitEvent: true });
    tick();
    fixture.detectChanges();
    expect(currentFormGroup.get('districtEn').value).toBe('');
    expect(currentFormGroup.get('district').value).toBe('');
    expect(currentFormGroup.get('street').value).toBe('');
    expect(currentFormGroup.get('streetEn').value).toBe('');
    expect(currentFormGroup.get('houseNumber').value).toBe('');
    expect(currentFormGroup.get('entranceNumber').value).toBe('');
    expect(currentFormGroup.get('houseCorpus').value).toBe('');
    expect(component.streetPredictionList).toBe(null);
  }));

  it('method onCitySelected should get details for selected city in en', () => {
    const currentFormGroup = component.userForm.controls.address.get('0');
    const cityEn = currentFormGroup.get('cityEn');

    component.placeService = { getDetails: () => {} } as any;
    spyOn(component.placeService, 'getDetails').and.callFake((request, callback) => {
      callback(ADDRESSESMOCK.PLACECITYEN, status as any);
    });
    component.setValueOfCity(ADDRESSESMOCK.KYIVCITYLIST[0], currentFormGroup, 'cityEn');
    expect(cityEn.value).toEqual(ADDRESSESMOCK.PLACECITYEN.name);
  });

  it('method onCitySelected should get details for selected city in uk', () => {
    const currentFormGroup = component.userForm.controls.address.get('0');
    const city = currentFormGroup.get('city');

    component.placeService = { getDetails: () => {} } as any;
    spyOn(component.placeService, 'getDetails').and.callFake((request, callback) => {
      callback(ADDRESSESMOCK.PLACEKYIVUK, status as any);
    });
    component.setValueOfCity(ADDRESSESMOCK.KYIVCITYLIST[0], currentFormGroup, 'city');
    expect(city.value).toEqual(ADDRESSESMOCK.PLACEKYIVUK.name);
  });

  it('method onCitySelected should set isDistrict if city is not Kyiv', () => {
    const currentFormGroup = component.userForm.controls.address.get('0');
    const city = currentFormGroup.get('city');

    component.placeService = { getDetails: () => {} } as any;
    spyOn(component.placeService, 'getDetails').and.callFake((request, callback) => {
      callback(ADDRESSESMOCK.PLACECITYUK, status as any);
    });
    component.setValueOfCity(ADDRESSESMOCK.KYIVCITYLIST[0], currentFormGroup, 'city');
    expect(city.value).toEqual(ADDRESSESMOCK.PLACECITYUK.name);
  });

  it('method setPredictStreets should call method for predicting streets in ua', () => {
    const currentFormGroup = component.userForm.controls.address.get('0');
    const city = currentFormGroup.get('city');
    const street = currentFormGroup.get('street');
    city.setValue('Київ');
    street.setValue('Ломо');
    const searchAddress = `${city.value}, ${street.value}`;
    const spy = spyOn(component, 'inputAddress');
    component.currentLanguage = 'ua';
    component.setPredictStreets(0);
    expect(component.streetPredictionList).toBe(null);
    expect(spy).toHaveBeenCalledWith(searchAddress, currentFormGroup, 'uk');
  });

  it('method setPredictStreets should call method for predicting streets in en', () => {
    const currentFormGroup = component.userForm.controls.address.get('0');
    const cityEn = currentFormGroup.get('cityEn');
    const streetEn = currentFormGroup.get('streetEn');
    const region = currentFormGroup.get('region');
    const regionEn = currentFormGroup.get('regionEn');

    cityEn.setValue('Kyiv');
    streetEn.setValue('Lomo');
    const searchAddress = `${cityEn.value}, ${streetEn.value}`;
    const spy = spyOn(component, 'inputAddress');
    component.currentLanguage = 'en';
    component.setPredictStreets(0);
    expect(component.streetPredictionList).toBe(null);
    expect(spy).toHaveBeenCalledWith(searchAddress, currentFormGroup, Language.EN);
  });

  it('method inputAddress should invoke getPlacePredictions', () => {
    const currentFormGroup = component.userForm.controls.address.get('0');
    component.autocompleteService = { getPlacePredictions: (a, b) => {} } as any;
    spyOn(component.autocompleteService, 'getPlacePredictions').and.callThrough();
    const fakesearchAddress = `Kyiv, Lomo`;
    component.inputAddress(fakesearchAddress, currentFormGroup, Language.EN);
    expect(component.autocompleteService.getPlacePredictions).toHaveBeenCalled();
  });

  it('method getPlacePredictions should form prediction street list for Kyiv city', () => {
    const currentFormGroup = component.userForm.controls.address.get('0');
    const city = currentFormGroup.get('city');
    city.setValue('Київ');
    component.autocompleteService = { getPlacePredictions: () => {} } as any;
    spyOn(component.autocompleteService, 'getPlacePredictions').and.callFake((request, callback) => {
      callback(ADDRESSESMOCK.STREETSKYIVCITYLIST, status as any);
    });
    const fakesearchAddress = `Київ, Сі`;
    component.inputAddress(fakesearchAddress, currentFormGroup, Language.UK);
    expect(component.streetPredictionList).toEqual(ADDRESSESMOCK.STREETSKYIVCITYLIST);
  });

  it('method getPlacePredictions should form prediction street list for Kyiv region', () => {
    const currentFormGroup = component.userForm.controls.address.get('0');
    const city = currentFormGroup.get('city');
    const cityEn = currentFormGroup.get('cityEn');
    const region = currentFormGroup.get('region');
    const regionEn = currentFormGroup.get('regionEn');

    city.setValue(`Київська область`);
    cityEn.setValue(`Kyiv Oblast`);
    region.setValue(`Щасливе`);
    regionEn.setValue(`Shchaslyve`);
    const result = [ADDRESSESMOCK.STREETSKYIVREGIONLIST[0]];
    component.autocompleteService = { getPlacePredictions: () => {} } as any;
    spyOn(component.autocompleteService, 'getPlacePredictions').and.callFake((request, callback) => {
      callback(ADDRESSESMOCK.STREETSKYIVREGIONLIST, status as any);
    });

    const fakesearchAddress = `Щасливе, Не`;
    component.inputAddress(fakesearchAddress, currentFormGroup, Language.UK);
    expect(component.streetPredictionList).toEqual(result);
  });

  it('method onStreetSelected should invoke method setValueOfStreet 2 times', () => {
    const spy = spyOn(component, 'setValueOfStreet');
    component.onStreetSelected(0, ADDRESSESMOCK.STREETSKYIVREGIONLIST[0]);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('method onStreetSelected should invoke methods to set value of street', () => {
    const currentFormGroup = component.userForm.controls.address.get('0');
    const spy = spyOn(component, 'setValueOfStreet');
    component.onStreetSelected(0, ADDRESSESMOCK.STREETSKYIVREGIONLIST[0]);
    expect(spy).toHaveBeenCalledWith(ADDRESSESMOCK.STREETSKYIVREGIONLIST[0], currentFormGroup, 'street');
    expect(spy).toHaveBeenCalledWith(ADDRESSESMOCK.STREETSKYIVREGIONLIST[0], currentFormGroup, 'streetEn');
  });

  it('method onStreetSelected should invoke getDetails', () => {
    const currentFormGroup = component.userForm.controls.address.get('0');
    component.placeService = { getDetails: (a, b) => {} } as any;
    spyOn(component.placeService, 'getDetails').and.callThrough();
    component.setValueOfStreet(ADDRESSESMOCK.STREETSKYIVREGIONLIST[0], currentFormGroup, 'street');
    expect(component.placeService.getDetails).toHaveBeenCalled();
  });

  it('method onStreetSelected should get details for selected street in en', () => {
    const currentFormGroup = component.userForm.controls.address.get('0');
    const streetEn = currentFormGroup.get('streetEn');
    const districtEn = currentFormGroup.get('districtEn');
    const spy = spyOn(component, 'setDistrictAuto');

    component.placeService = { getDetails: () => {}, textSearch: () => {} } as any;
    spyOn(component.placeService, 'getDetails').and.callFake((request, callback) => {
      callback(ADDRESSESMOCK.PLACESTREETEN, status as any);
    });
    component.setValueOfStreet(ADDRESSESMOCK.STREETSKYIVCITYLIST[0], currentFormGroup, 'streetEn');
    expect(streetEn.value).toEqual(ADDRESSESMOCK.PLACESTREETEN.name);
    expect(spy).toHaveBeenCalledWith(ADDRESSESMOCK.PLACESTREETEN, Language.EN, currentFormGroup);
  });

  it('method onStreetSelected should get details for selected street in UK', () => {
    const currentFormGroup = component.userForm.controls.address.get('0');
    const street = currentFormGroup.get('street');
    const district = currentFormGroup.get('district');

    const spy = spyOn(component, 'setDistrictAuto');
    component.placeService = { getDetails: () => {} } as any;
    spyOn(component.placeService, 'getDetails').and.callFake((request, callback) => {
      callback(ADDRESSESMOCK.PLACESTREETUK, status as any);
    });

    component.setValueOfStreet(ADDRESSESMOCK.STREETSKYIVCITYLIST[0], currentFormGroup, 'street');

    expect(street.value).toEqual(ADDRESSESMOCK.PLACESTREETUK.name);
    expect(spy).toHaveBeenCalledWith(ADDRESSESMOCK.PLACESTREETUK, Language.UK, currentFormGroup);
  });

  it('should return ua value by getLangValue', () => {
    const value = component.getLangValue('value', 'enValue');
    expect(value).toBe('value');
  });
});
