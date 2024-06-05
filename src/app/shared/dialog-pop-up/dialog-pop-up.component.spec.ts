import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { DialogPopUpComponent } from './dialog-pop-up.component';

describe('DialogPopUpComponent', () => {
  let component: DialogPopUpComponent;
  let fixture: ComponentFixture<DialogPopUpComponent>;
  const fakeTitles = {
    popupTitle: 'popupTitle',
    popupSubtitle: 'popupSubtitle',
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

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DialogPopUpComponent],
      imports: [TranslateModule.forRoot(), MatDialogModule, BrowserDynamicTestingModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefStub },
        { provide: MAT_DIALOG_DATA, useValue: fakeTitles }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should setTitles be called in ngOnInit', () => {
    const spy = spyOn(DialogPopUpComponent.prototype as any, 'setTitles');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should keydownEvents be called in ngOnInit', () => {
    const spy = spyOn(component[matDialogRef], 'keydownEvents').and.returnValue(of());
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should backdropClick be called in ngOnInit', () => {
    const spy = spyOn(component[matDialogRef], 'backdropClick').and.returnValue(of());
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should set titles after setTitles method', () => {
    component.popupTitle = 'fake';
    component.popupSubtitle = 'fake';
    component.popupCancel = 'fake';
    component.popupConfirm = 'fake';
    const setTitles = 'setTitles';
    component[setTitles]();
    expect(component.popupTitle).toBe(fakeTitles.popupTitle);
    expect(component.popupSubtitle).toBe(fakeTitles.popupSubtitle);
    expect(component.popupCancel).toBe(fakeTitles.popupCancel);
    expect(component.popupConfirm).toBe(fakeTitles.popupConfirm);
  });

  it('should call close on matDialogRef', () => {
    const spy = spyOn(component[matDialogRef], 'close');
    component.userReply(true);
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should cancel streams after ngOnDestroy', () => {
    const destroy$ = 'destroy$';
    const nextSpy = spyOn(component[destroy$], 'next');
    const completeSpy = spyOn(component[destroy$], 'complete');
    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
