import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { AddViolationsComponent } from './add-violations.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { DragDirective } from 'src/app/shared/drag-and-drop/dragDrop.directive';
import { SharedModule } from 'src/app/shared/shared.module';

describe('AddViolationsComponent', () => {
  let component: AddViolationsComponent;
  let fixture: ComponentFixture<AddViolationsComponent>;

  const fakeData = {
    id: 1303,
    viewMode: true
  };
  const dataFileMock = new File([''], 'test-file.jpeg', { type: 'image/jpeg' });
  const fakeFileHandle = {
    file: dataFileMock,
    url: 'fakeUrl'
  };
  const event = { target: { files: [dataFileMock] } };
  const InputVarMock = { nativeElement: { value: 'fake' } };
  const initialDataMock = {
    orderId: 1303,
    violationLevel: 'LOW',
    description: 'violation description',
    images: [
      'https://csb10032000a548f571.blob.core.windows.net/allfiles/4e684870-8b9e-4cce-b5bd-5c8460d7e5fbnature-image-for-website.jpg',
      'https://csb10032000a548f571.blob.core.windows.net/allfiles/25c4d706-2534-46d8-bac1-877dc6cdedcdimage.jpg'
    ],
    violationDate: '2022-09-09T14:03:58.198624',
    addedByUser: 'AAAAB AAAA'
  };

  const matDialogRefStub = jasmine.createSpyObj('matDialogRefStub', ['close']);
  const matDialogStub = () => ({
    open: () => ({
      afterClosed: () => ({ pipe: () => ({ subscribe: (f) => f({}) }) })
    })
  });
  const formBuilderStub = () => ({ group: () => ({}) });
  const orderServiceStub = () => ({
    getViolationOfCurrentOrder: (id) => of(initialDataMock),
    updateViolationOfCurrentOrder: () => ({}),
    addViolationToCurrentOrder: () => ({}),
    deleteViolationOfCurrentOrder: () => ({ subscribe: (f) => f({}) })
  });
  const localStorageServiceStub = () => ({
    firstNameBehaviourSubject: { pipe: () => of('fakeName') }
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [AddViolationsComponent],
      imports: [MatDialogModule, HttpClientTestingModule, ReactiveFormsModule, SharedModule, TranslateModule.forRoot()],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefStub },
        { provide: MatDialog, useFactory: matDialogStub },
        { provide: MAT_DIALOG_DATA, useValue: fakeData },
        { provide: OrderService, useFactory: orderServiceStub },
        { provide: LocalStorageService, useFactory: localStorageServiceStub }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddViolationsComponent);
    component = fixture.componentInstance;
  });

  beforeEach(async () => {
    component.ngOnInit();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it('displays correct data on init when order id and viewMode=true passed to modal', async () => {
    const description = fixture.debugElement.query(By.css('.description'));
    expect(description.nativeElement.value).toBe(initialDataMock.description);
    const images = fixture.debugElement.queryAll(By.css('.image-preview'));
    const sources = images.map((img) => img.nativeElement.src);
    expect(sources).toEqual(initialDataMock.images);
    const username = fixture.debugElement.query(By.css('.user'));
    expect(username.nativeElement.textContent).toBe('fakeName');
    const date = fixture.debugElement.query(By.css('.date'));
    expect(date.nativeElement.textContent).toBe('09.09.2022');
  });

  it('add/save button should be disabled in view mode', async () => {
    const button = fixture.debugElement.query(By.css('.addButton'));
    expect(button.nativeElement.disabled).toBeTruthy();
  });

  it('clicking on edit button should make form editable', async () => {
    const editButton = fixture.debugElement.query(By.css('.edit-violation-btn'));
    editButton.nativeElement.click();
    await fixture.whenStable();
    fixture.detectChanges();
    const description = fixture.debugElement.query(By.css('.description'));
    expect(description.nativeElement.disabled).toBeFalsy();
  });

  it('save button should be disabled if no changes have been made', async () => {
    const editButton = fixture.debugElement.query(By.css('.edit-violation-btn'));
    editButton.nativeElement.click();
    await fixture.whenStable();
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('.addButton'));
    expect(button.nativeElement.disabled).toBeTruthy();
  });

  it('save button should be enabled if user edited description', async () => {
    const editButton = fixture.debugElement.query(By.css('.edit-violation-btn'));
    editButton.nativeElement.click();
    await fixture.whenStable();
    fixture.detectChanges();
    const description = fixture.debugElement.query(By.css('.description'));
    description.nativeElement.value = 'new description';
    description.nativeElement.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('.addButton'));
    expect(button.nativeElement.disabled).toBeFalsy();
  });

  it('save button should be enabled if user dropped an image', async () => {
    const editButton = fixture.debugElement.query(By.css('.edit-violation-btn'));
    editButton.nativeElement.click();
    await fixture.whenStable();
    fixture.detectChanges();
    const dropArea = fixture.debugElement.query(By.directive(DragDirective));
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(dataFileMock);
    const dropEvent = new DragEvent('drop', { dataTransfer });
    dropArea.nativeElement.dispatchEvent(dropEvent);
    await fixture.whenStable();
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('.addButton'));
    expect(button.nativeElement.disabled).toBeFalsy();
  });

  it('clicking cancel button should close the modal', async () => {
    const editButton = fixture.debugElement.query(By.css('.edit-violation-btn'));
    editButton.nativeElement.click();
    await fixture.whenStable();
    fixture.detectChanges();
    const cancelButton = fixture.debugElement.query(By.css('.cancelButton'));
    cancelButton.nativeElement.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(matDialogRefStub.close).toHaveBeenCalled();
  });

  // it(`maxNumberOfImgs has default value`, () => {
  //   expect(component.maxNumberOfImgs).toEqual(6);
  // });

  // it(`images has default value`, () => {
  //   expect(component.images).toEqual([]);
  // });

  // it(`files has default value`, () => {
  //   expect(component.files).toEqual([]);
  // });

  // it(`isImageSizeError has default value`, () => {
  //   expect(component.isImageSizeError).toEqual(false);
  // });

  // it(`isImageTypeError has default value`, () => {
  //   expect(component.isImageTypeError).toEqual(false);
  // });

  // it(`isUploading has default value`, () => {
  //   expect(component.isUploading).toEqual(false);
  // });

  // it(`isDeleting has default value`, () => {
  //   expect(component.isDeleting).toEqual(false);
  // });

  // it(`imgArray has default value`, () => {
  //   expect(component.imgArray).toEqual([]);
  // });

  // it(`imagesFromDB has default value`, () => {
  //   expect(component.imagesFromDB).toEqual([]);
  // });

  // it(`isInitialDataChanged has default value`, () => {
  //   expect(component.isInitialDataChanged).toEqual(false);
  // });

  // it(`isInitialImageDataChanged has default value`, () => {
  //   expect(component.isInitialImageDataChanged).toEqual(false);
  // });

  // it(`viewMode has default value`, () => {
  //   expect(component.viewMode).toEqual(false);
  // });

  // it(`editMode has default value`, () => {
  //   expect(component.editMode).toEqual(false);
  // });

  // it(`isLoading has default value`, () => {
  //   expect(component.isLoading).toEqual(false);
  // });

  // describe('files', () => {
  //   it('makes expected calls in filesDropped', () => {
  //     const checkFileExtensionSpy = spyOn(component, 'checkFileExtension');
  //     const transferFileSpy = spyOn(component as any, 'transferFile');
  //     component.filesDropped([fakeFileHandle]);
  //     expect(checkFileExtensionSpy).toHaveBeenCalledWith([fakeFileHandle]);
  //     expect(transferFileSpy).toHaveBeenCalledWith(dataFileMock);
  //   });

  //   it('makes expected calls in loadFile', () => {
  //     const transferFileSpy = spyOn(component as any, 'transferFile');
  //     component.loadFile(event);
  //     expect(transferFileSpy).toHaveBeenCalledWith(dataFileMock);
  //   });

  //   it('File should be transfered', () => {
  //     component.isImageTypeError = false;
  //     (component as any).transferFile(dataFileMock);
  //     expect(component.imgArray[0]).toEqual(dataFileMock);
  //   });
  // });

  // describe('ngOnInit', () => {
  //   it('makes expected calls', () => {
  //     const translateServiceStub: TranslateService = fixture.debugElement.injector.get(TranslateService);
  //     const spyInitForm = spyOn(component as any, 'initForm');
  //     const spyCheckMode = spyOn(component as any, 'checkMode');
  //     spyOn(component, 'initImages').and.callThrough();
  //     spyOn(translateServiceStub, 'get').and.callThrough();
  //     component.ngOnInit();
  //     expect(spyInitForm).toHaveBeenCalled();
  //     expect(spyCheckMode).toHaveBeenCalled();
  //     expect(component.initImages).toHaveBeenCalled();
  //     expect(translateServiceStub.get).toHaveBeenCalled();
  //     expect(component.dragAndDropLabel).toBe('fakeLabel');
  //     expect(component.name).toBe('fakeName');
  //   });
  // });

  // describe('send', () => {
  //   it('makes expected calls', () => {
  //     component.addViolationForm = fakeViolationForm;
  //     const matDialogRefStub: MatDialogRef<AddViolationsComponent> = fixture.debugElement.injector.get(MatDialogRef);
  //     const orderServiceStub: OrderService = fixture.debugElement.injector.get(OrderService);
  //     spyOn(component, 'prepareDataToSend').and.callThrough();
  //     spyOn(matDialogRefStub, 'close').and.callThrough();
  //     spyOn(orderServiceStub, 'updateViolationOfCurrentOrder').and.returnValue(of(true));
  //     spyOn(orderServiceStub, 'addViolationToCurrentOrder').and.returnValue(of(true));
  //     component.send();
  //     expect(component.prepareDataToSend).toHaveBeenCalled();
  //     expect(matDialogRefStub.close).toHaveBeenCalled();
  //     expect(orderServiceStub.updateViolationOfCurrentOrder).toHaveBeenCalled();
  //     expect(orderServiceStub.addViolationToCurrentOrder).toHaveBeenCalled();
  //   });
  // });

  // describe('deleteImage', () => {
  //   it(`is edit mode and delete multipart files`, () => {
  //     component.editMode = true;
  //     component.imagesFromDBLength = 2;
  //     component.imgArray = ['0', '1', '2'];
  //     component.deleteImage(2);
  //     expect(component.imgArray).toEqual(['1', '2']);
  //     expect(component.isInitialImageDataChanged).toBe(true);
  //   });

  //   it(`is edit mode and delete images received from data base`, () => {
  //     component.editMode = true;
  //     component.isInitialImageDataChanged = false;
  //     component.imagesFromDBLength = 2;
  //     component.imagesFromDB = ['0', '1'];
  //     component.deleteImage(1);
  //     expect(component.imagesFromDB).toEqual(['0']);
  //     expect(component.imagesFromDBLength).toBe(1);
  //     expect(component.isInitialImageDataChanged).toBe(true);
  //   });

  //   it(`is not editMode`, () => {
  //     component.editMode = false;
  //     component.imgArray = ['0', '1', '2'];
  //     component.deleteImage(1);
  //     expect(component.imgArray).toEqual(['0', '2']);
  //   });
  // });

  // describe('deleteViolation', () => {
  //   it('makes expected calls', () => {
  //     const matDialogRefStub: MatDialogRef<AddViolationsComponent> = fixture.debugElement.injector.get(MatDialogRef);
  //     const matDialogStub: MatDialog = fixture.debugElement.injector.get(MatDialog);
  //     const orderServiceStub: OrderService = fixture.debugElement.injector.get(OrderService);
  //     spyOn(matDialogRefStub, 'close').and.callThrough();
  //     spyOn(matDialogStub, 'open').and.callThrough();
  //     spyOn(orderServiceStub, 'deleteViolationOfCurrentOrder').and.callThrough();
  //     component.deleteViolation();
  //     expect(matDialogRefStub.close).toHaveBeenCalled();
  //     expect(matDialogStub.open).toHaveBeenCalled();
  //     expect(orderServiceStub.deleteViolationOfCurrentOrder).toHaveBeenCalled();
  //   });
  // });

  // describe('deleteChanges', () => {
  //   it('makes expected calls', () => {
  //     const matDialogRefStub: MatDialogRef<AddViolationsComponent> = fixture.debugElement.injector.get(MatDialogRef);
  //     const matDialogStub: MatDialog = fixture.debugElement.injector.get(MatDialog);
  //     spyOn(matDialogRefStub, 'close').and.callThrough();
  //     spyOn(matDialogStub, 'open').and.callThrough();
  //     component.deleteChanges();
  //     expect(matDialogRefStub.close).toHaveBeenCalled();
  //     expect(matDialogStub.open).toHaveBeenCalled();
  //   });
  // });

  // describe('closeDialog', () => {
  //   it('makes expected calls when initial data is not changed', () => {
  //     const matDialogRefStub: MatDialogRef<AddViolationsComponent> = fixture.debugElement.injector.get(MatDialogRef);
  //     spyOn(matDialogRefStub, 'close').and.callThrough();
  //     component.closeDialog();
  //     expect(matDialogRefStub.close).toHaveBeenCalled();
  //   });

  //   it('makes expected calls when initial data is changed', () => {
  //     component.isInitialDataChanged = true;
  //     spyOn(component, 'deleteChanges').and.callThrough();
  //     component.closeDialog();
  //     expect(component.deleteChanges).toHaveBeenCalled();
  //   });
  // });
});
