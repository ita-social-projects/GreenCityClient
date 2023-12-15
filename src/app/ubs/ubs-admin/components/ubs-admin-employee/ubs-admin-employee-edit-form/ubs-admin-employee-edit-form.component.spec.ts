import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  MatLegacyDialog as MatDialog,
  MatLegacyDialogModule as MatDialogModule,
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA
} from '@angular/material/legacy-dialog';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { IMaskModule } from 'angular-imask';
import { of } from 'rxjs';
import { ShowImgsPopUpComponent } from '../../../../../shared/show-imgs-pop-up/show-imgs-pop-up.component';
import { UbsAdminEmployeeEditFormComponent } from './ubs-admin-employee-edit-form.component';
import { CdkAccordionModule } from '@angular/cdk/accordion';

describe('UbsAdminEmployeeEditFormComponent', () => {
  let component: UbsAdminEmployeeEditFormComponent;
  let fixture: ComponentFixture<UbsAdminEmployeeEditFormComponent>;

  const defaultImagePath =
    'https://csb10032000a548f571.blob.core.windows.net/allfiles/90370622-3311-4ff1-9462-20cc98a64d1ddefault_image.jpg';
  const matDialogRefMock = jasmine.createSpyObj('matDialogRefMock', ['close', 'afterClosed']);
  matDialogRefMock.afterClosed.and.returnValue(of(true));
  const matDialogMock = jasmine.createSpyObj('matDialog', ['open']);
  const dialogRefStub = {
    afterClosed() {
      return of(true);
    }
  };
  const mockedEmployeePositions = [
    {
      id: 2,
      name: 'fake',
      nameEn: 'fakeEn'
    }
  ];
  const mockedReceivingStations = [
    {
      id: 3,
      name: 'fake',
      nameEn: 'fakeEn'
    },
    {
      id: 4,
      name: 'fake',
      nameEn: 'fakeEn'
    }
  ];
  const mockedData = {
    email: 'fake',
    employeePositions: mockedEmployeePositions,
    firstName: 'fake',
    id: 1,
    image: defaultImagePath,
    lastName: 'fake',
    phoneNumber: 'fake',
    tariffs: [
      {
        id: 1,
        region: {
          id: 1,
          nameEn: 'Kyiv Oblast',
          nameUk: 'Київська область'
        },
        locationsDtos: [
          {
            id: 1,
            nameEn: 'Kyiv',
            nameUk: 'Київ'
          }
        ],
        courier: {
          id: 1,
          nameEn: 'UBS',
          nameUk: 'УБС'
        }
      },
      {
        id: 2,
        region: {
          id: 1,
          nameEn: 'Kyiv Oblast',
          nameUk: 'Київська область'
        },
        locationsDtos: [
          {
            id: 2,
            nameEn: 'Irpin',
            nameUk: 'Ірпінь'
          }
        ],
        courier: {
          id: 1,
          nameEn: 'UBS',
          nameUk: 'УБС'
        }
      }
    ]
  };
  const mockFormData = {
    firstName: 'fakeFirstName',
    lastName: 'fakeLastName',
    phoneNumber: 'fakePhoneNumber',
    email: 'fakeEmail'
  };
  const mockedInitialData = {
    firstName: 'fake',
    lastName: 'fake',
    phoneNumber: 'fake',
    email: 'fake',
    imageURL: defaultImagePath,
    employeePositionsIds: [2],
    receivingStationsIds: [3, 4]
  };
  const mockedDto = 'employeeDto';
  const transferFile = 'transferFile';
  const fakeEmployeePositions = ['fake'];
  const fakeReceivingStations = ['fake'];
  const fakeEmployeeForm = new UntypedFormGroup({
    firstName: new UntypedFormControl('fake'),
    lastName: new UntypedFormControl('fake'),
    phoneNumber: new UntypedFormControl('fake'),
    email: new UntypedFormControl('fake')
  });
  const dataFileMock = new File([''], 'test-file.jpeg');
  const storeMock = jasmine.createSpyObj('store', ['select', 'dispatch']);
  storeMock.select = () => of(true, true);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminEmployeeEditFormComponent],
      imports: [HttpClientTestingModule, MatDialogModule, TranslateModule.forRoot(), ReactiveFormsModule, IMaskModule, CdkAccordionModule],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: MatDialog, useValue: matDialogMock },
        { provide: MAT_DIALOG_DATA, useValue: mockedData },
        { provide: Store, useValue: storeMock },
        UntypedFormBuilder
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminEmployeeEditFormComponent);
    component = fixture.componentInstance;
    component.employeePositions = JSON.parse(JSON.stringify(mockedEmployeePositions));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should cancel streams after ngOnDestroy', () => {
    const destroy$ = 'destroyed$';
    const nextSpy = spyOn(component[destroy$], 'next');
    const completeSpy = spyOn(component[destroy$], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should return firstName Control on get firstName', () => {
    const firstName = component.firstName;
    expect(firstName).toEqual(component.employeeForm.get('firstName'));
  });

  it('should return lastName Control on get lastName', () => {
    const lastName = component.lastName;
    expect(lastName).toEqual(component.employeeForm.get('lastName'));
  });

  it('should return phoneNumber Control on get phoneNumber', () => {
    expect(component.employeeForm.get('phoneNumber')).toBeTruthy();
    expect(component.employeeForm.get('phoneNumber').status).toEqual('INVALID');
  });

  it('should return email Control on get email', () => {
    expect(component.employeeForm.get('email')).toBeTruthy();
    expect(component.employeeForm.get('email').status).toEqual('INVALID');
  });

  it('employeeForm should receive data from MAT_DIALOG_DATA', () => {
    expect(component.employeeForm.value).toEqual({
      firstName: 'fake',
      lastName: 'fake',
      phoneNumber: 'fake',
      email: 'fake'
    });
  });

  it('Returned formData should have employeeDto', () => {
    component.selectedFile = false;
    const returnedFormData = component.prepareEmployeeDataToSend(mockedDto);
    expect(returnedFormData.has('employeeDto')).toBe(true);
  });

  it('Returned formData should have image if has selectedFile', () => {
    component.selectedFile = true;
    const returnedFormData = component.prepareEmployeeDataToSend(mockedDto);
    expect(returnedFormData.has('image')).toBe(true);
  });

  it('Role should be included', () => {
    const isIncludeRole = component.doesIncludeRole({ id: 2 });
    expect(isIncludeRole).toBe(true);
  });

  it('Role should be added', () => {
    const fakeRole = { id: 3, name: 'addedFake', nameEn: 'addedFakeEn' };
    component.onCheckChangeRole(fakeRole);
    expect(component.employeePositions).toEqual([...mockedEmployeePositions, fakeRole]);
  });

  it('Role should be removed', () => {
    component.onCheckChangeRole({ id: 2 });
    expect(component.employeePositions).toEqual([]);
  });

  it('updateEmployee method should close dialogRef when EmployeeService has sent a response', () => {
    component.selectedFile = false;
    spyOn(component, 'prepareEmployeeDataToSend').and.returnValue(new FormData());
    component.updateEmployee();
    expect(storeMock.dispatch).toHaveBeenCalled();
  });

  it('createEmployee method should close dialogRef when EmployeeService has sent a response', () => {
    spyOn(component, 'prepareEmployeeDataToSend').and.returnValue(new FormData());
    component.createEmployee();
    expect(storeMock.dispatch).toHaveBeenCalled();
  });

  it('should remove image', () => {
    component.imageURL = defaultImagePath;
    component.imageName = 'fake';
    component.selectedFile = 'fake';
    component.removeImage();

    expect(component.imageURL).toBe(null);
    expect(component.imageName).toBe(null);
    expect(component.selectedFile).toBe(null);
  });

  it('filesDropped should be called', () => {
    const filesDroppedMock = spyOn(component, 'filesDropped');
    component.filesDropped(dataFileMock);
    expect(filesDroppedMock).toHaveBeenCalledWith(dataFileMock);
  });

  it('File should be transfered', () => {
    component.imageName = 'fake';
    spyOn(UbsAdminEmployeeEditFormComponent.prototype as any, 'showWarning').and.returnValue(false);
    component[transferFile](dataFileMock);
    expect(component.imageName).toBe('test-file.jpeg');
  });

  it('File should not be transfered', () => {
    component.imageName = 'fake';
    spyOn(UbsAdminEmployeeEditFormComponent.prototype as any, 'showWarning').and.returnValue(true);
    component[transferFile](dataFileMock);
    expect(component.imageName).toBe('fake');
  });

  describe('checkIsInitialPositionsChanged', () => {
    it('isInitialPositionsChangedMock should be falsy', () => {
      const isInitialPositionsChangedMock = component.checkIsInitialPositionsChanged();
      expect(isInitialPositionsChangedMock).toBeFalsy();
    });

    it('isInitialPositionsChangedMock should be truthy', () => {
      component.employeePositions = [
        {
          id: 2,
          name: 'fake',
          nameEn: 'fakeEn'
        },
        {
          id: 22,
          name: 'fake22',
          nameEn: 'fake22En'
        }
      ];
      const isInitialPositionsChangedMock = component.checkIsInitialPositionsChanged();
      expect(isInitialPositionsChangedMock).toBeTruthy();
    });
  });

  describe('editEmployee', () => {
    it(`employee has been edited`, () => {
      component.editEmployee();
      component.employeeForm.controls.firstName.setValue('NewFakeName');
      expect(component.isInitialDataChanged).toBeTruthy();
    });
  });

  describe('openImg', () => {
    it(`dialog has been opened`, () => {
      component.openImg();
      expect(matDialogMock.open).toHaveBeenCalledWith(ShowImgsPopUpComponent, {
        hasBackdrop: true,
        panelClass: 'custom-img-pop-up',
        data: {
          imgIndex: 0,
          images: [{ src: defaultImagePath }]
        }
      });
    });
  });
});
