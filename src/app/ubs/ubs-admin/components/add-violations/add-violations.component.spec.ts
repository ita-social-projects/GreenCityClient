import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  MatLegacyDialogModule as MatDialogModule,
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA
} from '@angular/material/legacy-dialog';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
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
  const wrongExtFileMock = new File([''], 'test-file.jpeg', { type: 'image/tiff' });
  const getLargeFileMock = () => {
    const file = new File([''], 'test-file.jpeg', { type: 'image/jpeg' });
    Object.defineProperty(file, 'size', { value: 10485761 });
    return file;
  };
  const largeFileMock = getLargeFileMock();
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

  beforeEach(waitForAsync(() => {
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

  const getDescriptionDebug = () => fixture.debugElement.query(By.css('.description'));
  const getImagesDebug = () => fixture.debugElement.queryAll(By.css('.image-preview'));
  const getDeleteImageButtonsDebug = () => fixture.debugElement.queryAll(By.css('.delete-image-button'));
  const getEditButtonDebug = () => fixture.debugElement.query(By.css('.edit-violation-btn'));
  const getAddSaveButtonDebug = () => fixture.debugElement.query(By.css('.addButton'));
  const getDeleteButtonDebug = () => fixture.debugElement.query(By.css('.delete-violation'));
  const getCancelButtonDebug = () => fixture.debugElement.query(By.css('.cancelButton'));
  const getUsernameLabelDebug = () => fixture.debugElement.query(By.css('.user'));
  const getDateLabelDebug = () => fixture.debugElement.query(By.css('.date'));
  const getDropAreaDebug = () => fixture.debugElement.query(By.directive(DragDirective));
  const getRadioButtonDebug = (value) => fixture.debugElement.query(By.css(`input[type=radio][value=${value}]`));
  const getFileInputDebug = () => fixture.debugElement.query(By.css('input[type=file]'));

  const enterEditMode = async () => {
    getEditButtonDebug().nativeElement.click();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  const clickElement = async (buttonDebug) => {
    buttonDebug.nativeElement.click();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  const inputText = async (debugElement, text) => {
    const descriptionElement = debugElement.nativeElement;
    descriptionElement.value = text;
    descriptionElement.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    fixture.detectChanges();
  };

  const dropFileIntoArea = async (dropAreaDebug, file) => {
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    const dropEvent = new DragEvent('drop', { dataTransfer });
    dropAreaDebug.nativeElement.dispatchEvent(dropEvent);
    await fixture.whenStable();
    fixture.detectChanges();
  };

  const selectFile = async (inputDebug, file) => {
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    inputDebug.nativeElement.files = dataTransfer.files;
    inputDebug.nativeElement.dispatchEvent(new InputEvent('change'));
    await fixture.whenStable();
    fixture.detectChanges();
  };

  it('can load instance', async () => {
    await buildComponent();
    expect(component).toBeTruthy();
  });

  it('[View Mode] loads and displays correct data', async () => {
    await buildComponent();
    expect(fixture.debugElement.query(By.css('input[type=radio][value=LOW]')).nativeElement.checked).toBeTruthy();
    expect(getDescriptionDebug().nativeElement.value).toBe(initialDataMock.description);
    const imageSources = getImagesDebug().map((img) => img.nativeElement.src);
    expect(imageSources).toEqual(initialDataMock.images);
    expect(getUsernameLabelDebug().nativeElement.textContent).toBe('fakeName');
    expect(getDateLabelDebug().nativeElement.textContent).toBe('09.09.2022');
  });

  it('[View Mode] form should not be editable', async () => {
    await buildComponent();
    const radioButtonsDebug = fixture.debugElement.queryAll(By.css('input[type=radio]'));
    expect(radioButtonsDebug.map((de) => de.nativeElement.disabled)).toEqual([true, true]);
    expect(getDescriptionDebug().nativeElement.disabled).toBeTruthy();
    expect(getAddSaveButtonDebug().nativeElement.disabled).toBeTruthy();
  });

  it('[View Mode] clicking an image opens modal with ShowImgsPopUpComponent with correct params', async () => {
    await buildComponent();
    await clickElement(getImagesDebug()[1]);
    expect(matDialogStub.open).toHaveBeenCalledWith(ShowImgsPopUpComponent, {
      hasBackdrop: true,
      panelClass: 'custom-img-pop-up',
      data: {
        imgIndex: 1,
        images: initialDataMock.images.map((src) => ({ src }))
      }
    });
  });

  it('[View Mode] clicking delete button should open confirmation modal (DialogPopUpComponent)', async () => {
    await buildComponent();
    await clickElement(getDeleteButtonDebug());
    expect(matDialogStub.open).toHaveBeenCalledWith(DialogPopUpComponent, {
      data: {
        popupTitle: 'add-violation-modal.delete-message',
        popupConfirm: 'employees.btn.yes',
        popupCancel: 'employees.btn.no',
        style: 'red'
      },
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: true,
      panelClass: ''
    });
  });

  it('[Edit Mode] clicking on edit button should make form editable', async () => {
    await buildComponent();
    await enterEditMode();
    const radioButtonsDebug = fixture.debugElement.queryAll(By.css('input[type=radio]'));
    expect(radioButtonsDebug.map((de) => de.nativeElement.disabled)).toEqual([false, false]);
    expect(getDescriptionDebug().nativeElement.disabled).toBeFalsy();
  });

  it('[Edit Mode] save button should be disabled if no changes have been made', async () => {
    await buildComponent();
    await enterEditMode();
    await inputText(getDescriptionDebug(), 'some text');
    await inputText(getDescriptionDebug(), '');
    expect(getAddSaveButtonDebug().nativeElement.disabled).toBeTruthy();
  });

  it('[Edit Mode] save button should be enabled if user edited description', async () => {
    await buildComponent();
    await enterEditMode();
    const descriptionDebug = getDescriptionDebug();
    await inputText(descriptionDebug, 'some text');
    expect(getAddSaveButtonDebug().nativeElement.disabled).toBeFalsy();
  });

  it('[Edit Mode] save button should be enabled if user dropped an image', async () => {
    await buildComponent();
    await enterEditMode();
    await dropFileIntoArea(getDropAreaDebug(), dataFileMock);
    expect(getAddSaveButtonDebug().nativeElement.disabled).toBeFalsy();
  });

  it('[Edit Mode] makes a OrderService.updateViolationOfCurrentOrder call with correct params when save is clicked', async () => {
    await buildComponent();
    await enterEditMode();
    await clickElement(getRadioButtonDebug('MAJOR'));
    await inputText(getDescriptionDebug(), 'new desc');
    const idx = 1;
    const deletedImageSrc = getImagesDebug()[idx].nativeElement.src;
    clickElement(getDeleteImageButtonsDebug()[idx]);

    const expectedData = new FormData();
    expectedData.append(
      'add',
      JSON.stringify({
        orderID: initialDataMock.orderId,
        violationDescription: 'new desc',
        violationLevel: 'MAJOR',
        imagesToDelete: [deletedImageSrc]
      })
    );
    await clickElement(getAddSaveButtonDebug());
    expect(orderServiceStub.updateViolationOfCurrentOrder).toHaveBeenCalled();
    const args = orderServiceStub.updateViolationOfCurrentOrder.calls.mostRecent().args;
    expect([...args[0].entries()]).toEqual([...(expectedData as any).entries()]);
  });

  it('[Edit Mode] should remove image from view if corresponding X button is clicked', async () => {
    await buildComponent();
    await enterEditMode();
    const idx = 1;
    const deletedImageSrc = getImagesDebug()[idx].nativeElement.src;
    const deleteImageButton = getDeleteImageButtonsDebug()[idx];
    await clickElement(deleteImageButton);
    const deletedImage = fixture.debugElement.query(By.css(`.image-preview[src="${deletedImageSrc}"]`));
    expect(deletedImage).toBeFalsy();
  });

  it('[Edit Mode] clicking cancel button should close the modal', async () => {
    await buildComponent();
    await enterEditMode();
    await clickElement(getCancelButtonDebug());
    expect(matDialogRefStub.close).toHaveBeenCalled();
  });

  it('[Edit Mode] save button should be active if file is selected', async () => {
    await buildComponent();
    await enterEditMode();
    await selectFile(getFileInputDebug(), dataFileMock);
    expect(getAddSaveButtonDebug().nativeElement.disabled).toBe(false);
  });

  it('[Edit Mode] clicking an image opens modal with ShowImgsPopUpComponent with correct params', async () => {
    await buildComponent();
    await enterEditMode();
    await clickElement(getImagesDebug()[0]);
    expect(matDialogStub.open).toHaveBeenCalledWith(ShowImgsPopUpComponent, {
      hasBackdrop: true,
      panelClass: 'custom-img-pop-up',
      data: {
        imgIndex: 0,
        images: initialDataMock.images.map((src) => ({ src }))
      }
    });
  });

  it('[Add Mode] makes OrderService.addViolationToCurrentOrder call with correct params when Add is clicked', async () => {
    TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: addModeInputs });
    await buildComponent();
    await clickElement(getRadioButtonDebug('MAJOR'));
    await inputText(getDescriptionDebug(), 'new description');
    await clickElement(getAddSaveButtonDebug());
    const expectedData = new FormData();
    expectedData.append(
      'add',
      JSON.stringify({
        violationDescription: 'new description',
        violationLevel: 'MAJOR'
      })
    );
    expect(orderServiceStub.addViolationToCurrentOrder).toHaveBeenCalled();
    const args = orderServiceStub.addViolationToCurrentOrder.calls.mostRecent().args;
    expect([...args[0].entries()]).toEqual([...(expectedData as any).entries()]);
  });

  it('[Add Mode] should display error message if file type is not jpeg/png', async () => {
    TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: addModeInputs });
    await buildComponent();
    const dropArea = getDropAreaDebug();
    await dropFileIntoArea(dropArea, wrongExtFileMock);
    const errorMessage = fixture.debugElement.query(By.css('.error-message-file-type'));
    expect(errorMessage.nativeElement.textContent).toBe('add-violation-modal.error-message-for-type');
  });

  it('[Add Mode] should display error message if file size is over 10MB', async () => {
    TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: addModeInputs });
    await buildComponent();
    await dropFileIntoArea(getDropAreaDebug(), largeFileMock);
    const errorMessage = fixture.debugElement.query(By.css('.error-message-file-size'));
    expect(errorMessage.nativeElement.textContent).toBe('add-violation-modal.error-message-for-size');
  });

  it('[Add Mode] save button should be inactive if description length < 5 or > 255', async () => {
    TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: addModeInputs });
    await buildComponent();
    await clickElement(getRadioButtonDebug('LOW'));
    await inputText(getDescriptionDebug(), 'sh');
    expect(getAddSaveButtonDebug().nativeElement.disabled).toBe(true);
    await inputText(getDescriptionDebug(), 'a'.repeat(256));
    expect(getAddSaveButtonDebug().nativeElement.disabled).toBe(true);
  });
});
