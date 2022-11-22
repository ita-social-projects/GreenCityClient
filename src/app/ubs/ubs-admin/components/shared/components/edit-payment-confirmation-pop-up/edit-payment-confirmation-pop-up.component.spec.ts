import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { EditPaymentConfirmationPopUpComponent } from './edit-payment-confirmation-pop-up.component';

describe('EditPaymentConfirmationPopUpComponent', () => {
  let component: EditPaymentConfirmationPopUpComponent;
  let fixture: ComponentFixture<EditPaymentConfirmationPopUpComponent>;
  const fakeTitles = {
    popupTitle: 'popupTitle',
    popupConfirm: 'popupSubtitle',
    popupCancel: 'popupSubtitle'
  };
  const dialogRefStub = {
    keydownEvents() {
      return of();
    },
    backdropClick() {
      return of();
    },
    close() {}
  };
  const matDialogRef = 'matDialogRef';

  beforeEach(async(() => {
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
    const spy = spyOn(component[matDialogRef], 'keydownEvents').and.returnValue(of());
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should setTitles be called in ngOnInit', () => {
    const spy = spyOn(EditPaymentConfirmationPopUpComponent.prototype as any, 'setTitles');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should backdropClick be called in ngOnInit', () => {
    const spy = spyOn(component[matDialogRef], 'backdropClick').and.returnValue(of());
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should set titles after setTitles method', () => {
    component.ngOnInit();

    expect(component.popupTitle).toBe(fakeTitles.popupTitle);
    expect(component.popupCancel).toBe(fakeTitles.popupCancel);
    expect(component.popupConfirm).toBe(fakeTitles.popupConfirm);
  });

  it('should call close on matDialogRef', () => {
    const spy = spyOn(component[matDialogRef], 'close');
    component.userReply(true);
    expect(spy).toHaveBeenCalled();
  });

  it('should cancel streams after ngOnDestroy', () => {
    const nextSpy = spyOn(component.destroy$, 'next');
    const completeSpy = spyOn(component.destroy$, 'complete');
    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
