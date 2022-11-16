import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddOrderNotTakenOutReasonComponent } from './add-order-not-taken-out-reason.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { OrderService } from '../../services/order.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { DragDirective } from 'src/app/shared/drag-and-drop/dragDrop.directive';
import { SharedModule } from 'src/app/shared/shared.module';
import { ShowImgsPopUpComponent } from 'src/app/shared/show-imgs-pop-up/show-imgs-pop-up.component';
import { DialogPopUpComponent } from 'src/app/shared/dialog-pop-up/dialog-pop-up.component';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('AddOrderNotTakenOutReasonComponent', () => {
  let component: AddOrderNotTakenOutReasonComponent;
  let fixture: ComponentFixture<AddOrderNotTakenOutReasonComponent>;
  let localStorageServiceMock: LocalStorageService;
  const images = [
    'https://csb10032000a548f571.blob.core.windows.net/allfiles/4e684870-8b9e-4cce-b5bd-5c8460d7e5fbnature-image-for-website.jpg',
    'https://csb10032000a548f571.blob.core.windows.net/allfiles/25c4d706-2534-46d8-bac1-877dc6cdedcdimage.jpg'
  ];
  const dataMock = {
    //orderId: 1577,
    //reason: 'add reason',
    images: [
      'https://csb10032000a548f571.blob.core.windows.net/allfiles/4e684870-8b9e-4cce-b5bd-5c8460d7e5fbnature-image-for-website.jpg',
      'https://csb10032000a548f571.blob.core.windows.net/allfiles/25c4d706-2534-46d8-bac1-877dc6cdedcdimage.jpg'
    ]
    // Date: '2022-09-09T14:03:58.198624',
    // addedByUser: 'Admin Admin'
  };
  const photoMock = [
    'https://csb10032000a548f571.blob.core.windows.net/allfiles/4e684870-8b9e-4cce-b5bd-5c8460d7e5fbnature-image-for-website.jpg',
    'https://csb10032000a548f571.blob.core.windows.net/allfiles/25c4d706-2534-46d8-bac1-877dc6cdedcdimage.jpg'
  ];

  const fileDataURL =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8tzn2PwAHlAL/DTRTsgAAAABJRU5ErkJggg==';
  const wrongExtFileMock = new File([''], 'test-file.jpeg', { type: 'image/tiff' });
  const getLargeFileMock = () => {
    const file = new File([''], 'test-file.jpeg', { type: 'image/jpeg' });
    Object.defineProperty(file, 'size', { value: 10485761 });
    return file;
  };
  //const localeStorageServiceMock = jasmine.createSpyObj('localeStorageService', ['getCurrentLanguage']);
  //localeStorageServiceMock.firstNameBehaviourSubject = of('fakeName');
  const largeFileMock = getLargeFileMock();
  const matDialogRefStub = jasmine.createSpyObj('matDialogRefStub', ['close']);
  const matDialogStub = jasmine.createSpyObj('matDialogRefStub', ['open']);

  const viewModeInputs = {
    id: 1577
  };

  localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', ['firstNameBehaviourSubject']);
  localStorageServiceMock.firstNameBehaviourSubject = new BehaviorSubject('firstNameFake');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [AddOrderNotTakenOutReasonComponent],
      imports: [MatDialogModule, HttpClientTestingModule, ReactiveFormsModule, SharedModule, TranslateModule.forRoot()],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefStub },
        { provide: MatDialog, useValue: matDialogStub },
        { provide: MAT_DIALOG_DATA, useValue: viewModeInputs }
        //{ provide: LocalStorageService, useFactory: localStorageServiceMock; }
      ]
    });
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddOrderNotTakenOutReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('addNotTakenOutForm invalid when empty', () => {
    expect(component.addNotTakenOutForm.valid).toBeFalsy();
  });

  /*it('addNotTakenOutForm field validity', () => {
    let addOrderNotTakenOutReason = component.addNotTakenOutForm.controls.notTakenOutReason;
    expect(addOrderNotTakenOutReason).toBeFalsy();
    /*let reason = component.addNotTakenOutForm.controls['notTakenOutReason'];
    let errors = {};
    reason.setValue('');
    errors = reason.errors || {};
    expect(errors['required']).toBeTruthy();
  });/** */

  describe('Testing controls for the notTakenOutReason', () => {
    const validNotTakenOutReason = ['notTakenOutReason'];
    const invalidnotTakenOutReason = [
      'notTakenOutReasonnotTakenOutReasonnotTakenOutReasonnotTakenOutReasonnotTakenOutReasonnotTakenOutReasonnotTakenOutReasonnotTakenOutReasonnotTakenOutReasonnotTakenOutReasonnotTakenOutReasonotTakenOutReasootTakenOutReasootTakenOutReasootTakenOutReasootTakenOutReasootTakenOutReasootTakenOutReasootTakenOutReaso'
    ];

    function controlsValidator(itemValue, controlName, status) {
      it(`The formControl: ${controlName} should be marked as ${status} if the value is ${itemValue}.`, () => {
        const control = component.addNotTakenOutForm.get(controlName);
        control.setValue(itemValue);
        status === 'valid' ? expect(control.valid).toBeTruthy() : expect(control.valid).toBeFalsy();
      });
    }

    validNotTakenOutReason.forEach((el) => controlsValidator(el, 'notTakenOutReason', 'valid'));
    invalidnotTakenOutReason.forEach((el) => controlsValidator(el, 'notTakenOutReason', 'invalid'));

    it('form should be invalid when empty', () => {
      expect(component.addNotTakenOutForm.valid).toBeFalsy();
    });
  });

  /*it('addNotTakenOutForm field required', () => {
    addNotTakenOutReason.setValue('notTakenOutReason');
    component.addNotTakenOutForm.controls['addNotTakenOutReason'].value;
    expect(component.addNotTakenOutForm.valid).toBeTruthy();
  });/** */

  it('initForm should create', () => {
    const initFormFake = {
      notTakenOutReason: ''
    };

    component.initForm();
    expect(component.addNotTakenOutForm.value).toEqual(initFormFake);
  });

  it('LocalStorageService should get firstName', () => {
    expect(localStorageServiceMock.firstNameBehaviourSubject.value).toBe('firstNameFake');
  });

  /*it('makes expected calls in filesDropped', () => {
    //await buildComponent();
    component.transferFile(dataFileMock);
    expect(dataFileMock).toEqual(images);
  }); /** */

  /*it('[Edit Mode] should remove image from view if corresponding X button is clicked', async () => {
    await buildComponent();
    const idx = 1;
    //const deletedImageSrc = getImagesDebug()[0].nativeElement.src;
    let deletedImageSrc =
      'https://csb10032000a548f571.blob.core.windows.net/allfiles/4e684870-8b9e-4cce-b5bd-5c8460d7e5fbnature-image-for-website.jpg';
    const deleteImageButton = getDeleteImageButtonsDebug()[idx];
    await clickElement(deleteImageButton);
    const deletedImage = fixture.debugElement.query(By.css(`.image-container[src="${deletedImageSrc}"]`));
    expect(deletedImage).toBeFalsy();
  });/** */
});
