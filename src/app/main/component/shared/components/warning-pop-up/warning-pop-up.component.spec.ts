import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarningPopUpComponent } from '@shared/components';
import { TranslateModule } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { of } from 'rxjs';

describe('WarningPopUpComponent', () => {
  let component: WarningPopUpComponent;
  let fixture: ComponentFixture<WarningPopUpComponent>;

  const dialogRefStub = {
    keydownEvents() {
      return of();
    },
    backdropClick() {
      return of();
    },
    close() {}
  };

  const popupDataStub = {
    popupTitle: 'popupTitle',
    popupSubtitle: 'popupSubtitle',
    popupCancel: 'popupCancel',
    popupConfirm: 'popupConfirm'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WarningPopUpComponent],
      imports: [TranslateModule.forRoot(), MatDialogModule, BrowserDynamicTestingModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefStub },
        { provide: MAT_DIALOG_DATA, useValue: popupDataStub }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarningPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Testing the basic functionality', () => {
    it('should create keyboard event inside ngOnInit', () => {
      const spy = spyOn(component.matDialogRef, 'keydownEvents').and.returnValue(of());
      component.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });

    it('should call setTitles inside ngOnInit', () => {
      const spy = spyOn(component, 'setTitles');
      component.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });

    it('should set titles after setTitles method', () => {
      component.ngOnInit();
      expect(component.popupTitle).toBe('popupTitle');
      expect(component.popupSubtitle).toBe('popupSubtitle');
      expect(component.popupCancel).toBe('popupCancel');
      expect(component.popupConfirm).toBe('popupConfirm');
    });

    it('should execute close method inside ngOnDestroy', () => {
      const spy = spyOn(component.matDialogRef, 'close');
      component.userReply(true);
      expect(spy).toHaveBeenCalled();
    });

    it('should cancel streams after ngOnDestroy', () => {
      const nextSpy = spyOn(component.destroyed$, 'next');
      const completeSpy = spyOn(component.destroyed$, 'complete');
      component.ngOnDestroy();
      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });
});
