import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { UserProfile } from 'src/app/ubs-admin/models/ubs-admin.interface';
import { ClientProfileService } from '../services/client-profile.service';
import { UbsUserProfilePageComponent } from './ubs-user-profile-page.component';

describe('UbsUserProfilePageComponent', () => {
  const userProfileDataMock: UserProfile = {
    addressDto: {
      id: 2276,
      city: 'Kiev',
      district: 'Troeshchina',
      entranceNumber: '65',
      houseCorpus: '3',
      houseNumber: '8',
      actual: false,
      coordinates: { latitude: 0, longitude: 0 },
      street: 'Jhohn Lenon '
    },
    recipientEmail: 'blackstar@gmail.com',
    recipientName: 'Black',
    recipientPhone: '+38 0972333333',
    recipientSurname: 'Star'
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
      imports: [TranslateModule.forRoot(), ReactiveFormsModule]
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

  it('method ngOnInit should call getUserData', () => {
    spyOn(component, 'getUserData');
    component.ngOnInit();
    expect(component.getUserData).toHaveBeenCalled();
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
    editButton.click();
    tick();
    fixture.detectChanges();
    const formElement = fixture.debugElement.nativeElement.querySelector('form');
    const inputElements = formElement.querySelectorAll('input');
    expect(inputElements.length).toBe(10);
  }));

  it('method onSubmit has to be called by clicking submit button', fakeAsync(() => {
    component.isEditing = true;
    fixture.detectChanges();
    spyOn(component, 'onSubmit');
    const deleteButton = fixture.debugElement.query(By.css('.btn-success')).nativeElement;
    deleteButton.click();
    tick();
    expect(component.onSubmit).toHaveBeenCalled();
  }));

  it('method onSubmit should send post request with submitData', () => {
    let submitData;
    component.onSubmit();
    submitData = {
      addressDto: {
        ...component.userForm.value.address,
        id: userProfileDataMock.addressDto.id,
        actual: userProfileDataMock.addressDto.actual,
        coordinates: userProfileDataMock.addressDto.coordinates
      },
      recipientEmail: component.userForm.value.recipientEmail,
      recipientName: component.userForm.value.recipientName,
      recipientPhone: component.userForm.value.recipientPhone,
      recipientSurname: component.userForm.value.recipientSurname
    };
    expect(submitData).toEqual(userProfileDataMock);
    expect(clientProfileServiceMock.postDataClientProfile).toHaveBeenCalledWith(submitData);
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
