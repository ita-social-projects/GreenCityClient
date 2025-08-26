import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { IMaskModule } from 'angular-imask';
import { of } from 'rxjs';
import { ShowImgsPopUpComponent } from '@ubs/shared/components/show-imgs-pop-up/show-imgs-pop-up.component';
import { UbsAdminEmployeeEditFormComponent } from './ubs-admin-employee-edit-form.component';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { FileHandle } from 'src/app/shared/models/file-handle.model';

describe('UbsAdminEmployeeEditFormComponent', () => {
  let component: UbsAdminEmployeeEditFormComponent;
  let fixture: ComponentFixture<UbsAdminEmployeeEditFormComponent>;

  const defaultImagePath =
    'https://csb10032000a548f571.blob.core.windows.net/allfiles/90370622-3311-4ff1-9462-20cc98a64d1ddefault_image.jpg';
  const matDialogRefMock = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed']);
  matDialogRefMock.afterClosed.and.returnValue(of(true));
  const matDialogMock = jasmine.createSpyObj('MatDialog', ['open']);
  matDialogMock.open.and.returnValue(matDialogRefMock);

  const mockedEmployeePositions = [
    {
      id: 7,
      nameUk: 'fake',
      nameEn: 'fakeEn'
    }
  ];
  const mockedEmployeePositionIds: number[] = [7];
  const mockedData = {
    email: 'fake',
    employeePositions: mockedEmployeePositions,
    employeePositionIds: mockedEmployeePositionIds,
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
  const mockedDto = 'employeeDto';
  const datasFileMock: FileHandle[] = [
    {
      file: new File([''], 'test-file.jpeg'),
      url: ''
    }
  ];
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
        FormBuilder
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminEmployeeEditFormComponent);
    component = fixture.componentInstance;
    component.employeePositionIds = [...mockedEmployeePositionIds];
    component.initialData.employeePositionsIds = [...mockedEmployeePositionIds];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

  it('Returned formData should have employeeDto', async () => {
    component.selectedFile = false;
    const returnedFormData = await component.prepareEmployeeDataToSend(mockedDto);
    expect(returnedFormData.has('employeeDto')).toBe(true);
  });

  it('Returned formData should have image if has selectedFile', async () => {
    component.imageURL = 'data:image/jpeg;base64,fakeData';
    component.selectedFile = new File([''], 'fake.jpg');
    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve({
        blob: () => Promise.resolve(new Blob(['fake blob'], { type: 'image/jpeg' }))
      } as Response)
    );
    const returnedFormData = await component.prepareEmployeeDataToSend(mockedDto);
    expect(returnedFormData.has('image')).toBe(true);
  });

  it('Role should be included', () => {
    const isIncludeRole = component.doesIncludeRole({ id: 7 });
    expect(isIncludeRole).toBe(true);
  });

  it('Role should be added', () => {
    const fakeRole = { id: 3, nameUk: 'addedFake', nameEn: 'addedFakeEn' };
    component.onCheckChangeRole(fakeRole);
    expect(component.employeePositionIds).toEqual([7, 3]);
  });

  it('Role should be removed', () => {
    component.onCheckChangeRole({ id: 7 });
    expect(component.employeePositionIds).toEqual([]);
  });

  it('updateEmployee method should dispatch action when async prepareEmployeeDataToSend is done', async () => {
    component.selectedFile = false;
    spyOn(component, 'prepareEmployeeDataToSend').and.returnValue(Promise.resolve(new FormData()));
    await component.updateEmployee();
    expect(storeMock.dispatch).toHaveBeenCalled();
  });

  it('createEmployee method should dispatch action when async prepareEmployeeDataToSend is done', async () => {
    spyOn(component, 'prepareEmployeeDataToSend').and.returnValue(Promise.resolve(new FormData()));
    await component.createEmployee();
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
    component.filesDropped(datasFileMock);
    expect(filesDroppedMock).toHaveBeenCalledWith(datasFileMock);
  });

  describe('checkIsInitialPositionsChanged', () => {
    it('isInitialPositionsChangedMock should be falsy', () => {
      component.employeePositionIds = [1];
      component.initialData.employeePositionsIds = [1];
      const isInitialPositionsChangedMock = component.checkIsInitialPositionsChanged();
      expect(isInitialPositionsChangedMock).toBeFalsy();
    });

    it('isInitialPositionsChangedMock should be truthy', () => {
      component.employeePositionIds = [2, 3, 4, 5];
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

  it('should add +380 to the value of recipientPhone', () => {
    component.phoneNumber.setValue('');
    component.onPhoneFocus();

    expect(component.phoneNumber.value).toBe('+380');
  });

  it('should clear the value of recipientPhone', () => {
    component.phoneNumber.setValue('+380');
    component.onPhoneBlur();

    expect(component.phoneNumber.value).toBe('');
    expect(component.phoneNumber.untouched).toBe(true);
  });

  describe('Form Validation', () => {
    it('should show an error for invalid firstName', () => {
      component.firstName.setValue('123');
      expect(component.firstName.valid).toBeFalse();
    });

    it('should show an error for invalid lastName', () => {
      component.lastName.setValue('123');
      expect(component.lastName.valid).toBeFalse();
    });

    it('should show an error for invalid phoneNumber', () => {
      component.phoneNumber.setValue('+380991234');
      expect(component.phoneNumber.valid).toBeFalse();
    });

    it('should show an error for invalid email', () => {
      component.email.setValue('invalid-email');
      expect(component.email.valid).toBeFalse();
    });

    it('should disable the save button if the form is invalid', () => {
      component.employeeForm.controls.firstName.setValue('');
      fixture.detectChanges();
      expect(component.isButtonDisabled()).toBeTrue();
    });

    it('should disable the save button if no position is selected', () => {
      component.employeePositionIds = [];
      fixture.detectChanges();
      expect(component.isButtonDisabled()).toBeTrue();
    });
  });

  describe('Image Handling', () => {
    beforeEach(() => {
      spyOn<any>(component, 'transferFile').and.callThrough();
      spyOn<any>(component, 'showWarning').and.callThrough();
    });

    it('should call transferFile when filesDropped is called', () => {
      component.filesDropped(datasFileMock);
      expect(component['transferFile']).toHaveBeenCalledWith(datasFileMock[0].file);
    });

    it('should set selectedFile and imageName when a file is transferred', () => {
      const mockFile = new File([''], 'test.png', { type: 'image/png' });
      const mockFileHandle: FileHandle = { file: mockFile, url: '' };
      component.filesDropped([mockFileHandle]);
      expect(component.selectedFile).toEqual(mockFile);
      expect(component.imageName).toEqual('test.png');
    });

    it('should set isWarning to true for an oversized file', () => {
      const oversizedFile = new File(new Array(10485761).fill('a'), 'oversized.png', { type: 'image/png' });
      const mockFileHandle: FileHandle = { file: oversizedFile, url: '' };
      component.filesDropped([mockFileHandle]);
      expect(component.isWarning).toBeTrue();
    });

    it('should set isWarning to true for an invalid file type', () => {
      const invalidFile = new File([''], 'invalid.txt', { type: 'text/plain' });
      const mockFileHandle: FileHandle = { file: invalidFile, url: '' };
      component.filesDropped([mockFileHandle]);
      expect(component.isWarning).toBeTrue();
    });

    it('should remove image and reset related properties', () => {
      component.imageURL = 'some-url.jpg';
      component.imageName = 'my-image.jpg';
      component.selectedFile = new File([''], 'my-image.jpg');
      component.removeImage();
      expect(component.imageURL).toBeNull();
      expect(component.imageName).toBeNull();
      expect(component.selectedFile).toBeNull();
    });
  });

  describe('Tariffs and Positions Logic', () => {
    it('should mark `isInitialPositionsChanged` as false when no change occurs', () => {
      component.employeePositionIds = [7];
      component.initialData.employeePositionsIds = [7];
      expect(component.checkIsInitialPositionsChanged()).toBeFalse();
    });

    it('should mark `isInitialPositionsChanged` as true when the number of positions changes', () => {
      component.employeePositionIds = [7, 8];
      component.initialData.employeePositionsIds = [7];
      expect(component.checkIsInitialPositionsChanged()).toBeTrue();
    });
  });
});
