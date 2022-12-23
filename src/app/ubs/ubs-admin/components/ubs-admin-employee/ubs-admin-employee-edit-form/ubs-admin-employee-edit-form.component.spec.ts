import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
      name: 'fake'
    }
  ];
  const mockedReceivingStations = [
    {
      id: 3,
      name: 'fake'
    },
    {
      id: 4,
      name: 'fake'
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
    receivingStations: mockedReceivingStations
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
  const fakeEmployeeForm = new FormGroup({
    firstName: new FormControl('fake'),
    lastName: new FormControl('fake'),
    phoneNumber: new FormControl('fake'),
    email: new FormControl('fake')
  });
  const dataFileMock = new File([''], 'test-file.jpeg');
  const storeMock = jasmine.createSpyObj('store', ['select', 'dispatch']);
  storeMock.select = () => of(true, true);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminEmployeeEditFormComponent],
      imports: [HttpClientTestingModule, MatDialogModule, TranslateModule.forRoot(), ReactiveFormsModule, IMaskModule, CdkAccordionModule],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: MatDialog, useValue: matDialogMock },
        { provide: MAT_DIALOG_DATA, useValue: mockedData },
        { provide: Store, useValue: storeMock },
        FormBuilder
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminEmployeeEditFormComponent);
    component = fixture.componentInstance;
    // component.receivingStations = JSON.parse(JSON.stringify(mockedReceivingStations));
    component.employeePositions = JSON.parse(JSON.stringify(mockedEmployeePositions));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

  // it('Location should be included', () => {
  //   const isIncludeLocanion = component.doesIncludeLocation({ id: 3 });
  //   expect(isIncludeLocanion).toBe(true);
  // });

  // it('Location should be removed', () => {
  //   const location = { id: 4 };
  //   component.onCheckChangeLocation(location);
  //   expect(component.receivingStations).toEqual([
  //     {
  //       id: 3,
  //       name: 'fake'
  //     }
  //   ]);
  // });

  // it('Location should be added', () => {
  //   const location = { id: 1, name: 'lastAddedFake' };
  //   component.onCheckChangeLocation(location);
  //   expect(component.receivingStations).toEqual([
  //     ...mockedReceivingStations,
  //     {
  //       id: 1,
  //       name: 'lastAddedFake'
  //     }
  //   ]);
  // });

  it('Role should be included', () => {
    const isIncludeRole = component.doesIncludeRole({ id: 2 });
    expect(isIncludeRole).toBe(true);
  });

  it('Role should be added', () => {
    const fakeRole = { id: 3, name: 'addedFake' };
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

  // it('prepareEmployeeDataToSend should send formData', () => {
  //   component.employeeForm = fakeEmployeeForm;
  //   component.employeePositions = fakeEmployeePositions as any;
  //   // component.receivingStations = fakeReceivingStations as any;
  //   component.selectedFile = false;
  //   component.data.id = 123;

  //   const res = component.prepareEmployeeDataToSend('fakeDto');
  //   const expectedAnswer = {
  //     firstName: 'fake',
  //     lastName: 'fake',
  //     phoneNumber: 'fake',
  //     email: 'fake',
  //     employeePositions: ['fake'],
  //     receivingStations: ['fake'],
  //     id: 123
  //   };
  //   expect(JSON.parse(res.get('fakeDto') as string)).toEqual(expectedAnswer);
  // });

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
          name: 'fake'
        },
        {
          id: 22,
          name: 'fake22'
        }
      ];
      const isInitialPositionsChangedMock = component.checkIsInitialPositionsChanged();
      expect(isInitialPositionsChangedMock).toBeTruthy();
    });
  });

  // describe('checkIsInitialStationsChanged', () => {
  //   it('isInitialStationsChanged should be falsy', () => {
  //     const isInitialStationsChanged = component.checkIsInitialStationsChanged();
  //     expect(isInitialStationsChanged).toBeFalsy();
  //   });

  //   it('isInitialStationsChanged should be truthy', () => {
  //     component.receivingStations = [
  //       {
  //         id: 2,
  //         name: 'fake'
  //       },
  //       {
  //         id: 22,
  //         name: 'fake22'
  //       }
  //     ];
  //     const isInitialStationsChanged = component.checkIsInitialStationsChanged();
  //     expect(isInitialStationsChanged).toBeTruthy();
  //   });
  // });

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
