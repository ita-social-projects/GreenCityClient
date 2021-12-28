import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { AddViolationsComponent } from './add-violations.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('AddViolationsComponent', () => {
  let component: AddViolationsComponent;
  let fixture: ComponentFixture<AddViolationsComponent>;

  const fakeData = {
    viewMode: false
  };
  const fakeViolationForm: FormGroup = new FormGroup({
    violationLevel: new FormControl('LOW'),
    violationDescription: new FormControl('FakeDescription')
  });
  const dataFileMock = new File([''], 'test-file.jpeg');
  const fakeFileHandle = {
    file: dataFileMock,
    url: 'fakeUrl'
  };
  const event = { target: { files: [dataFileMock] } };
  const InputVarMock = { nativeElement: { value: 'fake' } };
  const initialDataMock = {
    violationLevel: 'LOW',
    violationDescription: 'fakeInitialDescription',
    initialImagesLength: 2
  };

  beforeEach(() => {
    const matDialogRefStub = () => ({ close: () => ({}) });
    const matDialogStub = () => ({
      open: () => ({
        afterClosed: () => ({ pipe: () => ({ subscribe: (f) => f({}) }) })
      })
    });
    const translateServiceStub = () => ({
      get: () => ({ pipe: () => of('fakeLabel') })
    });
    const formBuilderStub = () => ({ group: () => ({}) });
    const orderServiceStub = () => ({
      getViolationOfCurrentOrder: () => ({
        pipe: () => ({ subscribe: (f) => f({}) })
      }),
      updateViolationOfCurrentOrder: () => ({}),
      addViolationToCurrentOrder: () => ({}),
      deleteViolationOfCurrentOrder: () => ({ subscribe: (f) => f({}) })
    });
    const localStorageServiceStub = () => ({
      firstNameBehaviourSubject: { pipe: () => of('fakeName') }
    });
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [AddViolationsComponent],
      imports: [MatDialogModule, HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: MatDialogRef, useFactory: matDialogRefStub },
        { provide: MatDialog, useFactory: matDialogStub },
        { provide: MAT_DIALOG_DATA, useValue: fakeData },
        { provide: TranslateService, useFactory: translateServiceStub },
        { provide: FormBuilder, useFactory: formBuilderStub },
        { provide: OrderService, useFactory: orderServiceStub },
        { provide: LocalStorageService, useFactory: localStorageServiceStub }
      ]
    });
    fixture = TestBed.createComponent(AddViolationsComponent);
    component = fixture.componentInstance;
    component.InputVar = InputVarMock;
    component.initialData = initialDataMock;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`maxNumberOfImgs has default value`, () => {
    expect(component.maxNumberOfImgs).toEqual(6);
  });

  it(`images has default value`, () => {
    expect(component.images).toEqual([]);
  });

  it(`files has default value`, () => {
    expect(component.files).toEqual([]);
  });

  it(`isImageSizeError has default value`, () => {
    expect(component.isImageSizeError).toEqual(false);
  });

  it(`isImageTypeError has default value`, () => {
    expect(component.isImageTypeError).toEqual(false);
  });

  it(`isUploading has default value`, () => {
    expect(component.isUploading).toEqual(false);
  });

  it(`isDeleting has default value`, () => {
    expect(component.isDeleting).toEqual(false);
  });

  it(`imgArray has default value`, () => {
    expect(component.imgArray).toEqual([]);
  });

  it(`imagesFromDB has default value`, () => {
    expect(component.imagesFromDB).toEqual([]);
  });

  it(`isInitialDataChanged has default value`, () => {
    expect(component.isInitialDataChanged).toEqual(false);
  });

  it(`isInitialImageDataChanged has default value`, () => {
    expect(component.isInitialImageDataChanged).toEqual(false);
  });

  it(`viewMode has default value`, () => {
    expect(component.viewMode).toEqual(false);
  });

  it(`editMode has default value`, () => {
    expect(component.editMode).toEqual(false);
  });

  it(`isLoading has default value`, () => {
    expect(component.isLoading).toEqual(false);
  });

  describe('files', () => {
    it('makes expected calls in filesDropped', () => {
      const checkFileExtensionSpy = spyOn(component, 'checkFileExtension');
      const transferFileSpy = spyOn(component as any, 'transferFile');
      component.filesDropped([fakeFileHandle]);
      expect(checkFileExtensionSpy).toHaveBeenCalledWith([fakeFileHandle]);
      expect(transferFileSpy).toHaveBeenCalledWith(dataFileMock);
    });

    it('makes expected calls in loadFile', () => {
      const transferFileSpy = spyOn(component as any, 'transferFile');
      component.loadFile(event);
      expect(transferFileSpy).toHaveBeenCalledWith(dataFileMock);
    });

    it('File should be transfered', () => {
      component.isImageTypeError = false;
      (component as any).transferFile(dataFileMock);
      expect(component.imgArray[0]).toEqual(dataFileMock);
    });
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const translateServiceStub: TranslateService = fixture.debugElement.injector.get(TranslateService);
      const spyInitForm = spyOn(component as any, 'initForm');
      const spyCheckMode = spyOn(component as any, 'checkMode');
      spyOn(component, 'initImages').and.callThrough();
      spyOn(translateServiceStub, 'get').and.callThrough();
      component.ngOnInit();
      expect(spyInitForm).toHaveBeenCalled();
      expect(spyCheckMode).toHaveBeenCalled();
      expect(component.initImages).toHaveBeenCalled();
      expect(translateServiceStub.get).toHaveBeenCalled();
      expect(component.dragAndDropLabel).toBe('fakeLabel');
      expect(component.name).toBe('fakeName');
    });
  });

  describe('send', () => {
    it('makes expected calls', () => {
      component.addViolationForm = fakeViolationForm;
      const matDialogRefStub: MatDialogRef<AddViolationsComponent> = fixture.debugElement.injector.get(MatDialogRef);
      const orderServiceStub: OrderService = fixture.debugElement.injector.get(OrderService);
      spyOn(component, 'prepareDataToSend').and.callThrough();
      spyOn(matDialogRefStub, 'close').and.callThrough();
      spyOn(orderServiceStub, 'updateViolationOfCurrentOrder').and.returnValue(of(true));
      spyOn(orderServiceStub, 'addViolationToCurrentOrder').and.returnValue(of(true));
      component.send();
      expect(component.prepareDataToSend).toHaveBeenCalled();
      expect(matDialogRefStub.close).toHaveBeenCalled();
      expect(orderServiceStub.updateViolationOfCurrentOrder).toHaveBeenCalled();
      expect(orderServiceStub.addViolationToCurrentOrder).toHaveBeenCalled();
    });
  });

  describe('deleteImage', () => {
    it(`is edit mode and delete multipart files`, () => {
      component.editMode = true;
      component.imagesFromDBLength = 2;
      component.imgArray = ['0', '1', '2'];
      component.deleteImage(2);
      expect(component.imgArray).toEqual(['1', '2']);
      expect(component.isInitialImageDataChanged).toBe(true);
    });

    it(`is edit mode and delete images received from data base`, () => {
      component.editMode = true;
      component.isInitialImageDataChanged = false;
      component.imagesFromDBLength = 2;
      component.imagesFromDB = ['0', '1'];
      component.deleteImage(1);
      expect(component.imagesFromDB).toEqual(['0']);
      expect(component.imagesFromDBLength).toBe(1);
      expect(component.isInitialImageDataChanged).toBe(true);
    });

    it(`is not editMode`, () => {
      component.editMode = false;
      component.imgArray = ['0', '1', '2'];
      component.deleteImage(1);
      expect(component.imgArray).toEqual(['0', '2']);
    });
  });

  describe('deleteViolation', () => {
    it('makes expected calls', () => {
      const matDialogRefStub: MatDialogRef<AddViolationsComponent> = fixture.debugElement.injector.get(MatDialogRef);
      const matDialogStub: MatDialog = fixture.debugElement.injector.get(MatDialog);
      const orderServiceStub: OrderService = fixture.debugElement.injector.get(OrderService);
      spyOn(matDialogRefStub, 'close').and.callThrough();
      spyOn(matDialogStub, 'open').and.callThrough();
      spyOn(orderServiceStub, 'deleteViolationOfCurrentOrder').and.callThrough();
      component.deleteViolation();
      expect(matDialogRefStub.close).toHaveBeenCalled();
      expect(matDialogStub.open).toHaveBeenCalled();
      expect(orderServiceStub.deleteViolationOfCurrentOrder).toHaveBeenCalled();
    });
  });

  describe('deleteChanges', () => {
    it('makes expected calls', () => {
      const matDialogRefStub: MatDialogRef<AddViolationsComponent> = fixture.debugElement.injector.get(MatDialogRef);
      const matDialogStub: MatDialog = fixture.debugElement.injector.get(MatDialog);
      spyOn(matDialogRefStub, 'close').and.callThrough();
      spyOn(matDialogStub, 'open').and.callThrough();
      component.deleteChanges();
      expect(matDialogRefStub.close).toHaveBeenCalled();
      expect(matDialogStub.open).toHaveBeenCalled();
    });
  });

  describe('closeDialog', () => {
    it('makes expected calls when initial data is not changed', () => {
      const matDialogRefStub: MatDialogRef<AddViolationsComponent> = fixture.debugElement.injector.get(MatDialogRef);
      spyOn(matDialogRefStub, 'close').and.callThrough();
      component.closeDialog();
      expect(matDialogRefStub.close).toHaveBeenCalled();
    });

    it('makes expected calls when initial data is changed', () => {
      component.isInitialDataChanged = true;
      spyOn(component, 'deleteChanges').and.callThrough();
      component.closeDialog();
      expect(component.deleteChanges).toHaveBeenCalled();
    });
  });
});
