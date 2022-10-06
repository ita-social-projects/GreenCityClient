import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { AddViolationsComponent } from './add-violations.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { DragDirective } from 'src/app/shared/drag-and-drop/dragDrop.directive';
import { SharedModule } from 'src/app/shared/shared.module';
import { ShowImgsPopUpComponent } from 'src/app/shared/show-imgs-pop-up/show-imgs-pop-up.component';
import { DialogPopUpComponent } from 'src/app/shared/dialog-pop-up/dialog-pop-up.component';

const dataURLtoBlob = (dataURL: string) => {
  const [, encoded] = dataURL.split(',');
  const binaryString = atob(encoded);
  let n = binaryString.length;
  const view = new Uint8Array(n);
  while (n--) {
    view[n] = binaryString.charCodeAt(n);
  }
  return new Blob([view], { type: 'image/jpeg' });
};

describe('AddViolationsComponent', () => {
  let component: AddViolationsComponent;
  let fixture: ComponentFixture<AddViolationsComponent>;

  const addModeInputs = { viewMode: false };
  const viewModeInputs = {
    id: 1303,
    viewMode: true
  };
  const fileDataURL =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8tzn2PwAHlAL/DTRTsgAAAABJRU5ErkJggg==';
  const dataFileMock = new File([dataURLtoBlob(fileDataURL)], 'test-file.jpeg', { type: 'image/jpeg' });

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
  const matDialogStub = jasmine.createSpyObj('matDialogRefStub', ['open']);

  const orderServiceStub = {
    getViolationOfCurrentOrder: (id) => of(initialDataMock),
    updateViolationOfCurrentOrder: jasmine.createSpy('updateViolationOfCurrentOrder'),
    addViolationToCurrentOrder: jasmine.createSpy('addViolationToCurrentOrder'),
    deleteViolationOfCurrentOrder: jasmine.createSpy('deleteViolationOfCurrentOrder')
  };
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
        { provide: MatDialog, useValue: matDialogStub },
        { provide: MAT_DIALOG_DATA, useValue: viewModeInputs },
        { provide: OrderService, useValue: orderServiceStub },
        { provide: LocalStorageService, useFactory: localStorageServiceStub }
      ]
    });
  }));

  const buildComponent = async () => {
    await TestBed.compileComponents();
    fixture = TestBed.createComponent(AddViolationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it('loads and displays correct data on init when order id and viewMode=true passed to modal', async () => {
    await buildComponent();
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
    await buildComponent();
    const button = fixture.debugElement.query(By.css('.addButton'));
    expect(button.nativeElement.disabled).toBeTruthy();
  });

  it('clicking on edit button should make form editable', async () => {
    await buildComponent();
    const editButton = fixture.debugElement.query(By.css('.edit-violation-btn'));
    editButton.nativeElement.click();
    await fixture.whenStable();
    fixture.detectChanges();
    const description = fixture.debugElement.query(By.css('.description'));
    expect(description.nativeElement.disabled).toBeFalsy();
  });

  it('save button should be disabled if no changes have been made', async () => {
    await buildComponent();
    const editButton = fixture.debugElement.query(By.css('.edit-violation-btn'));
    editButton.nativeElement.click();
    await fixture.whenStable();
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('.addButton'));
    expect(button.nativeElement.disabled).toBeTruthy();
  });

  it('save button should be enabled if user edited description', async () => {
    await buildComponent();
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
    await buildComponent();
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

  it('should make a OrderService.updateViolationOfCurrentOrder call if save button is clicked', async () => {
    await buildComponent();
    const editButton = fixture.debugElement.query(By.css('.edit-violation-btn'));
    editButton.nativeElement.click();
    await fixture.whenStable();
    fixture.detectChanges();
    const highSevRadio = fixture.debugElement.query(By.css('input[type=radio][value=MAJOR]'));
    highSevRadio.nativeElement.click();
    await fixture.whenStable();
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('.addButton'));
    button.nativeElement.click();
    expect(orderServiceStub.updateViolationOfCurrentOrder).toHaveBeenCalled();
  });

  it('should remove image from view if corresponding X button is clicked', async () => {
    await buildComponent();
    const idx = 1;
    const editButton = fixture.debugElement.query(By.css('.edit-violation-btn'));
    editButton.nativeElement.click();
    await fixture.whenStable();
    fixture.detectChanges();
    const image = fixture.debugElement.queryAll(By.css('.image-preview'))[idx];
    const removeImageButton = fixture.debugElement.queryAll(By.css('.delete-image-button'))[idx];
    const imageSrc = image.nativeElement.src;
    removeImageButton.nativeElement.click();
    await fixture.whenStable();
    fixture.detectChanges();
    const deletedImage = fixture.debugElement.query(By.css(`.image-preview[src="${imageSrc}"]`));
    expect(deletedImage).toBeFalsy();
  });

  it('clicking cancel button should close the modal', async () => {
    await buildComponent();
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

  it('clicking an image opens modal with ShowImgsPopUpComponent with correct params', async () => {
    await buildComponent();
    const firstImage = fixture.debugElement.query(By.css('.image-preview'));
    firstImage.nativeElement.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(matDialogStub.open).toHaveBeenCalledWith(ShowImgsPopUpComponent, {
      hasBackdrop: true,
      panelClass: 'custom-img-pop-up',
      data: {
        imgIndex: 0,
        images: initialDataMock.images.map((src) => ({ src }))
      }
    });
  });

  it('clicking delete button should open confirmation modal (DialogPopUpComponent)', async () => {
    await buildComponent();
    const deleteButton = fixture.debugElement.query(By.css('.delete-violation'));
    deleteButton.nativeElement.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(matDialogStub.open).toHaveBeenCalledWith(DialogPopUpComponent, {
      data: {
        popupTitle: 'add-violation-modal.delete-message',
        popupConfirm: 'employees.btn.yes',
        popupCancel: 'employees.btn.no'
      },
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: true,
      panelClass: ''
    });
  });

  it('renders editable form correctly and in add-violation mode', async () => {
    TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: addModeInputs });
    await buildComponent();
    const description = fixture.debugElement.query(By.css('.description'));
    expect(description.nativeElement.disabled).toBeFalsy();
    const lowSevRadio = fixture.debugElement.query(By.css('input[type=radio][value=LOW]'));
    const highSevRadio = fixture.debugElement.query(By.css('input[type=radio][value=MAJOR]'));
    expect(lowSevRadio).toBeDefined();
    expect(highSevRadio).toBeDefined();
    expect(lowSevRadio.nativeElement.checked).toBeTruthy();
  });

  it('makes OrderService.addViolationToCurrentOrder call after clicking add button if form is filled', async () => {
    TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: addModeInputs });
    await buildComponent();
    const description = fixture.debugElement.query(By.css('.description'));
    description.nativeElement.value = 'new description';
    description.nativeElement.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('.addButton'));
    button.nativeElement.click();
    expect(orderServiceStub.addViolationToCurrentOrder).toHaveBeenCalled();
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
