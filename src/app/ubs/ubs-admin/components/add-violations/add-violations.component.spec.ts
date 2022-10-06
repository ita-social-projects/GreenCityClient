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

  const enterEditMode = async () => {
    getEditButtonDebug().nativeElement.click();
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

  it('can load instance', async () => {
    await buildComponent();
    expect(component).toBeTruthy();
  });

  it('loads and displays correct data on init when order id and viewMode=true passed to modal', async () => {
    await buildComponent();
    expect(getDescriptionDebug().nativeElement.value).toBe(initialDataMock.description);
    const imageSources = getImagesDebug().map((img) => img.nativeElement.src);
    expect(imageSources).toEqual(initialDataMock.images);
    expect(getUsernameLabelDebug().nativeElement.textContent).toBe('fakeName');
    expect(getDateLabelDebug().nativeElement.textContent).toBe('09.09.2022');
  });

  it('add/save button should be disabled in view mode', async () => {
    await buildComponent();
    expect(getAddSaveButtonDebug().nativeElement.disabled).toBeTruthy();
  });

  it('clicking on edit button should make form editable', async () => {
    await buildComponent();
    await enterEditMode();
    expect(getDescriptionDebug().nativeElement.disabled).toBeFalsy();
  });

  it('save button should be disabled if no changes have been made', async () => {
    await buildComponent();
    await enterEditMode();
    expect(getAddSaveButtonDebug().nativeElement.disabled).toBeTruthy();
  });

  it('save button should be enabled if user edited description', async () => {
    await buildComponent();
    await enterEditMode();
    const descriptionDebug = getDescriptionDebug();
    await inputText(descriptionDebug, 'some text');
    expect(getAddSaveButtonDebug().nativeElement.disabled).toBeFalsy();
  });

  it('save button should be enabled if user dropped an image', async () => {
    await buildComponent();
    await enterEditMode();
    const dropArea = getDropAreaDebug();
    await dropFileIntoArea(dropArea, dataFileMock);
    expect(getAddSaveButtonDebug().nativeElement.disabled).toBeFalsy();
  });

  it('should make a OrderService.updateViolationOfCurrentOrder call with correct params if save button is clicked', async () => {
    await buildComponent();
    await enterEditMode();
    const highSevRadio = fixture.debugElement.query(By.css('input[type=radio][value=MAJOR]'));
    highSevRadio.nativeElement.click();
    await fixture.whenStable();
    fixture.detectChanges();
    await inputText(getDescriptionDebug(), 'new desc');
    const idx = 1;
    const deletedImageSrc = getImagesDebug()[idx].nativeElement.src;
    const deleteImageButton = getDeleteImageButtonsDebug()[idx];
    deleteImageButton.nativeElement.click();

    const expectedDataToBePassed = new FormData();
    expectedDataToBePassed.append(
      'add',
      JSON.stringify({
        orderID: initialDataMock.orderId,
        violationDescription: 'new desc',
        violationLevel: 'MAJOR',
        imagesToDelete: [deletedImageSrc]
      })
    );
    getAddSaveButtonDebug().nativeElement.click();
    expect(orderServiceStub.updateViolationOfCurrentOrder).toHaveBeenCalled();
    const args = orderServiceStub.updateViolationOfCurrentOrder.calls.mostRecent().args;
    expect([...args[0].entries()]).toEqual([...(expectedDataToBePassed as any).entries()]);
  });

  it('should remove image from view if corresponding X button is clicked', async () => {
    await buildComponent();
    await enterEditMode();
    const idx = 1;
    const deletedImageSrc = getImagesDebug()[idx].nativeElement.src;
    const deleteImageButton = getDeleteImageButtonsDebug()[idx];
    deleteImageButton.nativeElement.click();
    await fixture.whenStable();
    fixture.detectChanges();
    const deletedImage = fixture.debugElement.query(By.css(`.image-preview[src="${deletedImageSrc}"]`));
    expect(deletedImage).toBeFalsy();
  });

  it('clicking cancel button should close the modal', async () => {
    await buildComponent();
    await enterEditMode();
    getCancelButtonDebug().nativeElement.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(matDialogRefStub.close).toHaveBeenCalled();
  });

  it('clicking an image opens modal with ShowImgsPopUpComponent with correct params', async () => {
    await buildComponent();
    const imagesDebug = getImagesDebug();
    imagesDebug[0].nativeElement.click();
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
    getDeleteButtonDebug().nativeElement.click();
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

  it('renders editable form correctly in add-violation mode', async () => {
    TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: addModeInputs });
    await buildComponent();
    expect(getDescriptionDebug().nativeElement.disabled).toBeFalsy();
    const lowSevRadio = fixture.debugElement.query(By.css('input[type=radio][value=LOW]'));
    const highSevRadio = fixture.debugElement.query(By.css('input[type=radio][value=MAJOR]'));
    expect(lowSevRadio).toBeDefined();
    expect(highSevRadio).toBeDefined();
    expect(lowSevRadio.nativeElement.checked).toBeTruthy();
  });

  it('makes OrderService.addViolationToCurrentOrder call with correct params after clicking add button if form is filled', async () => {
    TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: addModeInputs });
    await buildComponent();
    const descriptionDebug = getDescriptionDebug();
    descriptionDebug.nativeElement.value = 'new description';
    descriptionDebug.nativeElement.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    fixture.detectChanges();
    getAddSaveButtonDebug().nativeElement.click();

    const expectedDataToBePassed = new FormData();
    expectedDataToBePassed.append(
      'add',
      JSON.stringify({
        violationDescription: 'new description',
        violationLevel: 'LOW'
      })
    );
    getAddSaveButtonDebug().nativeElement.click();
    expect(orderServiceStub.addViolationToCurrentOrder).toHaveBeenCalled();
    const args = orderServiceStub.addViolationToCurrentOrder.calls.mostRecent().args;
    expect([...args[0].entries()]).toEqual([...(expectedDataToBePassed as any).entries()]);
  });

  it('should display error message if file type is not jpeg/png', async () => {
    TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: addModeInputs });
    await buildComponent();
    const dropArea = getDropAreaDebug();
    await dropFileIntoArea(dropArea, wrongExtFileMock);
    const errorMessage = fixture.debugElement.query(By.css('.error-message-file-type'));
    expect(errorMessage.nativeElement.textContent).toBe('add-violation-modal.error-message-for-type');
  });

  it('should display error message if file size is over 10MB', async () => {
    TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: addModeInputs });
    await buildComponent();
    const dropArea = getDropAreaDebug();
    await dropFileIntoArea(dropArea, largeFileMock);
    const errorMessage = fixture.debugElement.query(By.css('.error-message-file-size'));
    expect(errorMessage.nativeElement.textContent).toBe('add-violation-modal.error-message-for-size');
  });
});
