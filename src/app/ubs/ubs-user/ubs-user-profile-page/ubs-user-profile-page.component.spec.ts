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

describe('UbsUserProfilePageComponent', () => {
  const userProfileDataMock: any = {
    addressDto: [
      {
        id: 2276,
        city: 'Київ',
        cityEn: 'Kiev',
        district: 'Голосіївський',
        districtEn: 'Holosiivskyi',
        entranceNumber: '65',
        houseCorpus: '3',
        houseNumber: '8',
        actual: false,
        region: 'Київська область',
        regionEn: 'Kyiv oblast',
        coordinates: { latitude: 0, longitude: 0 },
        street: 'Ломоносова',
        streetEn: 'Lomonosova'
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsUserProfilePageComponent],
      providers: [
        { provide: MatDialog, useValue: dialogMock },
        { provide: ClientProfileService, useValue: clientProfileServiceMock },
        { provide: MatSnackBarComponent, useValue: snackBarMock }
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
    expect(inputElements.length).toBe(8);
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
});
