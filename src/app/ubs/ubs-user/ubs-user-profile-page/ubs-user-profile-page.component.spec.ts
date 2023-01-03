import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { TranslateModule } from '@ngx-translate/core';
import { IMaskModule } from 'angular-imask';
import { of } from 'rxjs';
import { UserProfile } from 'src/app/ubs/ubs-admin/models/ubs-admin.interface';
import { ClientProfileService } from '../services/client-profile.service';
import { UbsUserProfilePageComponent } from './ubs-user-profile-page.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Locations } from 'src/assets/locations/locations';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';

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
        isKyiv: false,
        street: 'Jhohn Lenon',
        streetEn: 'Jhohn Lenon'
      }
    ],
    recipientEmail: 'blackstar@gmail.com',
    alternateEmail: 'blackStar@gmail.com',
    recipientName: 'Black',
    recipientPhone: '+380972333333',
    recipientSurname: 'Star',
    hasPassword: true
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

  const fakeLocalStorageService = jasmine.createSpyObj('LocalStorageService', ['getCurrentLanguage']);
  fakeLocalStorageService.getCurrentLanguage = () => 'ua';

  const fakeLocationsMockUk = jasmine.createSpyObj('Locations', ['getBigRegions', 'getRegions', 'getRegionsKyiv']);
  fakeLocationsMockUk.getBigRegions.and.returnValue(fakeRegions);
  fakeLocationsMockUk.getRegions.and.returnValue(fakeDistricts);
  fakeLocationsMockUk.getRegionsKyiv.and.returnValue(fakeDictrictsKyiv);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsUserProfilePageComponent],
      providers: [
        { provide: MatDialog, useValue: dialogMock },
        { provide: ClientProfileService, useValue: clientProfileServiceMock },
        { provide: MatSnackBarComponent, useValue: snackBarMock },
        { provide: LocalStorageService, useValue: fakeLocalStorageService },
        { provide: Locations, useValue: fakeLocationsMockUk }
      ],
      imports: [TranslateModule.forRoot(), ReactiveFormsModule, IMaskModule, MatAutocompleteModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsUserProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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

  it('should create', () => {
    expect(component).toBeTruthy();
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
    const cancelButton = fixture.debugElement.query(By.css('.cancel')).nativeElement;
    cancelButton.click();
    tick();
    expect(component.onCancel).toHaveBeenCalled();
  }));

  it('method onEdit should be calls by clicking edit button', fakeAsync(() => {
    component.isEditing = false;
    fixture.detectChanges();
    spyOn(component, 'onEdit');
    const editButton = fixture.debugElement.query(By.css('.edit')).nativeElement;
    editButton.click();
    tick();
    expect(component.onEdit).toHaveBeenCalled();
  }));

  it('method openDeleteProfileDialog should be calls by clicking delete button', fakeAsync(() => {
    spyOn(component, 'openDeleteProfileDialog');
    const deleteButton = fixture.debugElement.query(By.css('.delete')).nativeElement;
    deleteButton.click();
    tick();
    expect(component.openDeleteProfileDialog).toHaveBeenCalled();
  }));

  it('method openDeleteProfileDialog has to open popup', () => {
    spyOn(dialogMock, 'open').and.callFake(() => {});
    component.openDeleteProfileDialog();
    expect(dialogMock.open).toHaveBeenCalled();
  });

  it('method openChangePasswordDialog should calls by clicking open button', fakeAsync(() => {
    spyOn(component, 'openChangePasswordDialog');
    const openButton = fixture.debugElement.query(By.css('.open')).nativeElement;
    openButton.click();
    tick();
    expect(component.openChangePasswordDialog).toHaveBeenCalled();
  }));

  it('spiner has to be defined if (isFetching === true)', () => {
    component.isFetching = true;
    fixture.detectChanges();
    const spiner = fixture.debugElement.query(By.css('app-spinner')).nativeElement;
    expect(spiner).toBeDefined();
  });

  it('Form should be defined by clicking on the edit button', fakeAsync(() => {
    const editButton = fixture.debugElement.query(By.css('.edit')).nativeElement;
    const spy = spyOn(component, 'focusOnFirst');
    editButton.click();
    tick();
    fixture.detectChanges();
    const formElement = fixture.debugElement.nativeElement.querySelector('form');
    const inputElements = formElement.querySelectorAll('input');
    expect(inputElements.length).toBe(9);
  }));

  it('method onEdit should get data and invoke methods', fakeAsync(() => {
    component.isEditing = false;
    component.isFetching = true;
    const spy1 = spyOn(component as any, 'initGoogleAutocompleteServices');
    const spy2 = spyOn(component, 'focusOnFirst');
    component.onEdit();
    expect(component.isEditing).toEqual(true);
    expect(component.isFetching).toEqual(false);
    expect(component.regions).toBe(fakeRegions);
    expect(component.districtsKyiv).toBe(fakeDictrictsKyiv);
    expect(component.districts).toBe(fakeDistricts);
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
    spyOn(component, 'onSubmit');
    const deleteButton = fixture.debugElement.query(By.css('.btn-success')).nativeElement;
    deleteButton.click();
    tick();
    expect(component.onSubmit).toHaveBeenCalled();
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
      hasPassword: true
    };
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

  it('method onSubmit should return submitData  without housecorpus ', () => {
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
      hasPassword: true
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
      hasPassword: true
    };
    userProfileDataMock.addressDto[0].entranceNumber = null;
    expect(submitData).toEqual(userProfileDataMock);
  });

  it('should toggle alternativeEmail state', () => {
    component.toggleAlternativeEmail();
    expect(component.toggleAlternativeEmail).toBeTruthy();
    expect(component.alternativeEmailDisplay).toBe(true);
  });

  it('method getErrorMessageKey should return error message for alternativeEmail maxLenght', () => {
    const formControlMock = { errors: { maxlength: true } } as unknown as AbstractControl;
    const result = component.getErrorMessageKey(formControlMock, true);

    expect(result).toBe('ubs-client-profile.error-message-if-edit-alternativeEmail');
  });

  it('method toggleAlternativeEmail should toggle input for alternative email', () => {
    component.alternativeEmailDisplay = true;
    component.toggleAlternativeEmail();
    expect(component.alternativeEmailDisplay).toBeFalsy();
  });

  it('method getErrorMessageKey should return correct error message key - required', () => {
    const formControlMock = { errors: { required: true } } as unknown as AbstractControl;
    const result = component.getErrorMessageKey(formControlMock);

    expect(result).toBe('input-error.required');
  });

  it('method getErrorMessageKey should return correct error message key - maxlength', () => {
    const formControlMock = { errors: { maxlength: true } } as unknown as AbstractControl;
    const result = component.getErrorMessageKey(formControlMock);

    expect(result).toBe('ubs-client-profile.error-message-if-edit-name-surname');
  });

  it('method getErrorMessageKey should return correct error message key - pattern', () => {
    const formControlMock = { errors: { pattern: true } } as unknown as AbstractControl;
    const result = component.getErrorMessageKey(formControlMock);

    expect(result).toBe('input-error.pattern');
  });

  it('method getErrorMessageKey should return correct error message key - empty message key', () => {
    const formControlMock = { errors: {} } as unknown as AbstractControl;
    const result = component.getErrorMessageKey(formControlMock);

    expect(result).toBe(undefined);
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

  it('method setRegionValue should set value of region', () => {
    const event = { target: { value: '0: Київська область' } };
    component.regions = fakeRegions;
    const currentFormGroup = component.userForm.controls.address.get('0');
    const region = currentFormGroup.get('region');
    component.setRegionValue(0, event as any);
    expect(region.value).toEqual('Київська область');
  });

  it('if value of region was changed other fields should be empty', fakeAsync(() => {
    const currentFormGroup = component.userForm.controls.address.get('0');
    const region = currentFormGroup.get('region');
    region.setValue('Київ');
    component.regions = fakeRegions;
    const event = { target: { value: '0: Київська область' } };
    component.setRegionValue(0, event as any);
    region.updateValueAndValidity({ emitEvent: true });
    tick();
    fixture.detectChanges();
    expect(currentFormGroup.get('cityEn').value).toBe('');
    expect(currentFormGroup.get('city').value).toBe('');
    expect(currentFormGroup.get('districtEn').value).toBe('');
    expect(currentFormGroup.get('district').value).toBe('');
    expect(currentFormGroup.get('street').value).toBe('');
    expect(currentFormGroup.get('streetEn').value).toBe('');
    expect(currentFormGroup.get('houseNumber').value).toBe('');
    expect(currentFormGroup.get('entranceNumber').value).toBe('');
    expect(currentFormGroup.get('houseCorpus').value).toBe('');
    expect(component.streetPredictionList).toBe(null);
    expect(component.cityPredictionList).toBe(null);
  }));

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
    expect(spy).toHaveBeenCalledWith(searchAddress, regionEn.value);
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
    expect(spy).toHaveBeenCalledWith(searchAddress, regionEn.value);
  });

  it('method inputCity should invoke getPlacePredictions', () => {
    const currentFormGroup = component.userForm.controls.address.get('0');
    const regionEn = currentFormGroup.get('regionEn');
    component.autocompleteService = { getPlacePredictions: (a, b) => {} } as any;
    spyOn(component.autocompleteService, 'getPlacePredictions').and.callThrough();
    const fakesearchAddress = `Kyiv, Kyiv`;
    component.inputCity(fakesearchAddress, regionEn.value);
    expect(component.autocompleteService.getPlacePredictions).toHaveBeenCalled();
  });

  it('method getPlacePredictions should form prediction list for Kyiv region', () => {
    const currentFormGroup = component.userForm.controls.address.get('0');
    const regionEn = currentFormGroup.get('regionEn');

    regionEn.setValue(`Kyivs'ka oblast`);
    component.autocompleteService = { getPlacePredictions: () => {} } as any;
    spyOn(component.autocompleteService, 'getPlacePredictions').and.callFake((request, callback) => {
      callback(predictionListKyivRegion);
    });
    const fakesearchAddress = `Київська область, Ше`;
    component.inputCity(fakesearchAddress, regionEn.value);
    expect(component.cityPredictionList).toEqual(predictionListKyivRegion);
  });

  it('method getPlacePredictions should form prediction list for Kyiv city', () => {
    const currentFormGroup = component.userForm.controls.address.get('0');
    const regionEn = currentFormGroup.get('regionEn');

    const result = [predictionListKyivCity[0]];
    regionEn.setValue(`Kyiv`);
    component.autocompleteService = { getPlacePredictions: () => {} } as any;
    spyOn(component.autocompleteService, 'getPlacePredictions').and.callFake((request, callback) => {
      callback(predictionListKyivCity);
    });

    const fakesearchAddress = `Київ`;
    component.inputCity(fakesearchAddress, regionEn.value);
    expect(component.cityPredictionList).toEqual(result);
  });

  it('method onCitySelected should invoke method setValueOfCity 2 times', () => {
    const spy = spyOn(component, 'setValueOfCity');
    component.onCitySelected(0, predictionListKyivRegion[0]);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('method onCitySelected should invoke methods to set value of city', () => {
    const currentFormGroup = component.userForm.controls.address.get('0');
    const spy = spyOn(component, 'setValueOfCity');
    component.onCitySelected(0, predictionListKyivRegion[0]);
    expect(spy).toHaveBeenCalledWith(predictionListKyivRegion[0], currentFormGroup, 'city');
    expect(spy).toHaveBeenCalledWith(predictionListKyivRegion[0], currentFormGroup, 'cityEn');
  });

  it('method onCitySelected should invoke getDetails', () => {
    const currentFormGroup = component.userForm.controls.address.get('0');
    component.placeService = { getDetails: (a, b) => {} } as any;
    spyOn(component.placeService, 'getDetails').and.callThrough();
    component.setValueOfCity(predictionListKyivRegion[0], currentFormGroup, 'city');
    expect(component.placeService.getDetails).toHaveBeenCalled();
  });

  it('if value of city was changed other fields should be empty', fakeAsync(() => {
    const currentFormGroup = component.userForm.controls.address.get('0');
    const city = currentFormGroup.get('city');
    spyOn(component, 'setValueOfCity');
    component.onCitySelected(0, predictionListKyivRegion[0]);
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
      callback(cityPlaceResultEn);
    });
    component.setValueOfCity(predictionListKyivCity[0], currentFormGroup, 'cityEn');
    expect(cityEn.value).toEqual(cityPlaceResultEn.name);
  });

  it('method onCitySelected should get details for selected city in uk', () => {
    const currentFormGroup = component.userForm.controls.address.get('0');
    const city = currentFormGroup.get('city');
    const isKyiv = currentFormGroup.get('isKyiv');

    component.placeService = { getDetails: () => {} } as any;
    spyOn(component.placeService, 'getDetails').and.callFake((request, callback) => {
      callback(placeResultKyivUk);
    });
    component.setValueOfCity(predictionListKyivCity[0], currentFormGroup, 'city');
    expect(city.value).toEqual(placeResultKyivUk.name);
    expect(isKyiv.value).toEqual(true);
  });

  it('method onCitySelected should set isDistrict if city is not Kyiv', () => {
    const currentFormGroup = component.userForm.controls.address.get('0');
    const city = currentFormGroup.get('city');
    const isKyiv = currentFormGroup.get('isKyiv');

    component.placeService = { getDetails: () => {} } as any;
    spyOn(component.placeService, 'getDetails').and.callFake((request, callback) => {
      callback(cityPlaceResultUk);
    });
    component.setValueOfCity(predictionListKyivCity[0], currentFormGroup, 'city');
    expect(city.value).toEqual(cityPlaceResultUk.name);
    expect(isKyiv.value).toEqual(false);
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
    expect(spy).toHaveBeenCalledWith(searchAddress, currentFormGroup);
  });

  it('method setPredictStreets should call method for predicting streets in en', () => {
    const currentFormGroup = component.userForm.controls.address.get('0');
    const cityEn = currentFormGroup.get('cityEn');
    const streetEn = currentFormGroup.get('streetEn');

    cityEn.setValue('Kyiv');
    streetEn.setValue('Lomo');
    const searchAddress = `${cityEn.value}, ${streetEn.value}`;
    const spy = spyOn(component, 'inputAddress');
    component.currentLanguage = 'en';
    component.setPredictStreets(0);
    expect(component.streetPredictionList).toBe(null);
    expect(spy).toHaveBeenCalledWith(searchAddress, currentFormGroup);
  });

  it('method inputAddress should invoke getPlacePredictions', () => {
    const currentFormGroup = component.userForm.controls.address.get('0');
    component.autocompleteService = { getPlacePredictions: (a, b) => {} } as any;
    spyOn(component.autocompleteService, 'getPlacePredictions').and.callThrough();
    const fakesearchAddress = `Kyiv, Lomo`;
    component.inputAddress(fakesearchAddress, currentFormGroup);
    expect(component.autocompleteService.getPlacePredictions).toHaveBeenCalled();
  });

  it('method getPlacePredictions should form prediction street list for Kyiv city', () => {
    const currentFormGroup = component.userForm.controls.address.get('0');
    const isKyiv = currentFormGroup.get('isKyiv');
    isKyiv.setValue(true);
    component.autocompleteService = { getPlacePredictions: () => {} } as any;
    spyOn(component.autocompleteService, 'getPlacePredictions').and.callFake((request, callback) => {
      callback(streetPredictionKyivCity);
    });
    const fakesearchAddress = `Київ, Сі`;
    component.inputAddress(fakesearchAddress, currentFormGroup);
    expect(component.streetPredictionList).toEqual(streetPredictionKyivCity);
  });

  it('method getPlacePredictions should form prediction street list for Kyiv region', () => {
    const currentFormGroup = component.userForm.controls.address.get('0');
    const isKyiv = currentFormGroup.get('isKyiv');
    isKyiv.setValue(false);
    const result = [streetPredictionKyivRegion[0]];
    component.autocompleteService = { getPlacePredictions: () => {} } as any;
    spyOn(component.autocompleteService, 'getPlacePredictions').and.callFake((request, callback) => {
      callback(streetPredictionKyivRegion);
    });

    const fakesearchAddress = `Щасливе, Не`;
    component.inputAddress(fakesearchAddress, currentFormGroup);
    expect(component.streetPredictionList).toEqual(result);
  });

  it('method onStreetSelected should invoke method setValueOfStreet 2 times', () => {
    const spy = spyOn(component, 'setValueOfStreet');
    component.onStreetSelected(0, streetPredictionKyivRegion[0]);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('method onStreetSelected should invoke methods to set value of street', () => {
    const currentFormGroup = component.userForm.controls.address.get('0');
    const spy = spyOn(component, 'setValueOfStreet');
    component.onStreetSelected(0, streetPredictionKyivRegion[0]);
    expect(spy).toHaveBeenCalledWith(streetPredictionKyivRegion[0], currentFormGroup, 'street');
    expect(spy).toHaveBeenCalledWith(streetPredictionKyivRegion[0], currentFormGroup, 'streetEn');
  });

  it('method onStreetSelected should invoke getDetails', () => {
    const currentFormGroup = component.userForm.controls.address.get('0');
    component.placeService = { getDetails: (a, b) => {} } as any;
    spyOn(component.placeService, 'getDetails').and.callThrough();
    component.setValueOfStreet(streetPredictionKyivRegion[0], currentFormGroup, 'street');
    expect(component.placeService.getDetails).toHaveBeenCalled();
  });

  it('method onStreetSelected should get details for selected street in en', () => {
    const currentFormGroup = component.userForm.controls.address.get('0');
    const streetEn = currentFormGroup.get('streetEn');
    const districtEn = currentFormGroup.get('districtEn');
    const isKyiv = currentFormGroup.get('isKyiv');
    isKyiv.setValue(true);
    const spy = spyOn(component, 'setDistrictAuto');
    component.placeService = { getDetails: () => {} } as any;
    spyOn(component.placeService, 'getDetails').and.callFake((request, callback) => {
      callback(streetPlaceResultEn);
    });
    component.setValueOfStreet(streetPredictionKyivCity[0], currentFormGroup, 'streetEn');
    expect(streetEn.value).toEqual(streetPlaceResultEn.name);
    expect(spy).toHaveBeenCalledWith(streetPlaceResultEn, districtEn, component.languages.en);
  });

  it('method onStreetSelected should get details for selected street in uk', () => {
    const currentFormGroup = component.userForm.controls.address.get('0');
    const street = currentFormGroup.get('street');
    const district = currentFormGroup.get('district');
    const isKyiv = currentFormGroup.get('isKyiv');
    isKyiv.setValue(true);

    const spy = spyOn(component, 'setDistrictAuto');
    component.placeService = { getDetails: () => {} } as any;
    spyOn(component.placeService, 'getDetails').and.callFake((request, callback) => {
      callback(streetPlaceResultUk);
    });
    component.setValueOfStreet(streetPredictionKyivCity[0], currentFormGroup, 'street');
    expect(street.value).toEqual(streetPlaceResultUk.name);
    expect(spy).toHaveBeenCalledWith(streetPlaceResultUk, district, component.languages.uk);
  });

  it('method setDistrictAuto should set district value in uk', () => {
    const currentFormGroup = component.userForm.controls.address.get('0');
    const district = currentFormGroup.get('district');
    const result = streetPlaceResultUk.address_components[1].long_name;
    component.setDistrictAuto(streetPlaceResultUk, district, component.languages.uk);
    expect(district.value).toEqual(result);
  });

  it('method setDistrictAuto should set district value in en', () => {
    const currentFormGroup = component.userForm.controls.address.get('0');
    const districtEn = currentFormGroup.get('districtEn');
    const result = streetPlaceResultEn.address_components[1].long_name;
    component.setDistrictAuto(streetPlaceResultEn, districtEn, component.languages.en);
    expect(districtEn.value).toEqual(result);
  });

  it('method onDistrictSelected should invoke method for setting district value in Kyiv city', () => {
    const currentFormGroup = component.userForm.controls.address.get('0');
    const isKyiv = currentFormGroup.get('isKyiv');
    isKyiv.setValue(true);
    const event = { target: { value: '1: Дарницький район' } };
    const spy = spyOn(component, 'setKyivDistrict');
    component.onDistrictSelected(0, event as any);
    expect(spy).toHaveBeenCalledWith('1', currentFormGroup);
  });

  it('method onDistrictSelected should invoke method for setting district value in Kyiv region', () => {
    const currentFormGroup = component.userForm.controls.address.get('0');
    const isKyiv = currentFormGroup.get('isKyiv');
    isKyiv.setValue(false);
    const event = { target: { value: '1: Броварський' } };
    const spy = spyOn(component, 'setDistrict');
    component.onDistrictSelected(0, event as any);
    expect(spy).toHaveBeenCalledWith('1', currentFormGroup);
  });

  it('method setKyivDistrict should set district value in Kyiv city', () => {
    const currentFormGroup = component.userForm.controls.address.get('0');
    const district = currentFormGroup.get('district');
    component.setKyivDistrict('1', currentFormGroup);
    expect(district.value).toEqual(fakeDictrictsKyiv[1].name);
  });

  it('method setDistrict should set district value in Kyiv region', () => {
    const currentFormGroup = component.userForm.controls.address.get('0');
    const district = currentFormGroup.get('district');
    component.setDistrict('1', currentFormGroup);
    expect(district.value).toEqual(fakeDistricts[1].name);
  });
});
