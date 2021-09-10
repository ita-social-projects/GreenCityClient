import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WarningPopUpComponent } from '@shared/components';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { of } from 'rxjs';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
      // @ts-ignore
      const spy = spyOn(component.matDialogRef, 'keydownEvents').and.returnValue(of());
      component.ngOnInit();

      expect(spy).toHaveBeenCalled();
    });

    it('should call setTitles inside ngOnInit', () => {
      // @ts-ignore
      const spy = spyOn(component, 'setTitles');
      component.ngOnInit();

      expect(spy).toHaveBeenCalled();
    });

    it('should set titles after setTitles method', () => {
      component.ngOnInit();

      expect(component.popupTitle).toBe(popupDataStub.popupTitle);
      expect(component.popupSubtitle).toBe(popupDataStub.popupSubtitle);
      expect(component.popupCancel).toBe(popupDataStub.popupCancel);
      expect(component.popupConfirm).toBe(popupDataStub.popupConfirm);
    });

    it('should execute close method inside ngOnDestroy', () => {
      // @ts-ignore
      const spy = spyOn(component.matDialogRef, 'close');
      component.userReply(true);

      expect(spy).toHaveBeenCalled();
    });

    it('should cancel streams after ngOnDestroy', () => {
      // @ts-ignore
      const nextSpy = spyOn(component.destroyed$, 'next');
      // @ts-ignore
      const completeSpy = spyOn(component.destroyed$, 'complete');
      component.ngOnDestroy();

      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });
});
