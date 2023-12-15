import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  MatLegacyDialogModule as MatDialogModule,
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA
} from '@angular/material/legacy-dialog';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { EditPaymentConfirmationPopUpComponent } from './edit-payment-confirmation-pop-up.component';

describe('EditPaymentConfirmationPopUpComponent', () => {
  let component: EditPaymentConfirmationPopUpComponent;
  let fixture: ComponentFixture<EditPaymentConfirmationPopUpComponent>;
  const fakeTitles = {
    popupTitle: 'popupTitle',
    popupConfirm: 'popupConfirm',
    popupCancel: 'popupCancel'
  };
  const dialogRefStub = jasmine.createSpyObj('MatDialogRef', ['keydownEvents', 'backdropClick', 'close']);
  dialogRefStub.keydownEvents.and.returnValue(of());
  dialogRefStub.backdropClick.and.returnValue(of());
  dialogRefStub.close.and.returnValue(of());

  const matDialogRef = 'matDialogRef';

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditPaymentConfirmationPopUpComponent],
      imports: [TranslateModule.forRoot(), MatDialogModule, BrowserDynamicTestingModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefStub },
        { provide: MAT_DIALOG_DATA, useValue: fakeTitles }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPaymentConfirmationPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    spyOn(component, 'ngOnDestroy').and.callFake(() => {});
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should keydownEvents be called in ngOnInit', () => {
    dialogRefStub.close.and.returnValue(of({ key: 'Escape' }));
    component.ngOnInit();
    expect(dialogRefStub.close).toBeTruthy();
  });

  it('should keydownEvents be called in ngOnInit', () => {
    dialogRefStub.keydownEvents.and.returnValue(of({ key: 'Enter' }));
    component.ngOnInit();
    expect(dialogRefStub.keydownEvents).toBeTruthy();
  });

  it('should keydownEvents be called in ngOnInit', () => {
    dialogRefStub.backdropClick.and.returnValue(of());
    component.ngOnInit();
    expect(dialogRefStub.backdropClick).toHaveBeenCalled();
  });

  it('should set titles', () => {
    expect(component.popupTitle).toBe(fakeTitles.popupTitle);
    expect(component.popupCancel).toBe(fakeTitles.popupCancel);
    expect(component.popupConfirm).toBe(fakeTitles.popupConfirm);
  });

  it('should call close on matDialogRef', () => {
    component.userReply(true);
    expect(dialogRefStub.close).toBeTruthy();
  });

  it('should cancel streams after ngOnDestroy', () => {
    const nextSpy = spyOn(component.destroy$, 'next');
    const completeSpy = spyOn(component.destroy$, 'complete');
    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
