import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { FormBaseComponent } from './form-base.component';
import { Store } from '@ngrx/store';
import { ubsOrderServiseMock } from 'src/app/ubs/mocks/order-data-mock';

describe('FormBaseComponent', () => {
  let component: FormBaseComponent;
  let fixture: ComponentFixture<FormBaseComponent>;
  let router: Router;
  let matDialog: MatDialog;
  const dialogRefStub = {
    afterClosed() {
      return of(true);
    }
  };

  const storeMock = jasmine.createSpyObj('Store', ['select', 'dispatch']);
  storeMock.select.and.returnValue(of({ order: ubsOrderServiseMock }));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormBaseComponent],
      imports: [RouterTestingModule, MatDialogModule, HttpClientTestingModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefStub },
        { provide: Store, useValue: storeMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormBaseComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    matDialog = TestBed.inject(MatDialog);
    spyOn(component.orderService, 'cancelUBSwithoutSaving');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should cancelPopupJustifying and removeItem be called in cancel', () => {
    const spyCancelPopupJustifying = spyOn(FormBaseComponent.prototype as any, 'cancelPopupJustifying');
    const spyLocalStorage = spyOn(window.localStorage, 'removeItem');
    component.cancel(true);
    expect(spyCancelPopupJustifying).toHaveBeenCalledWith(true);
    expect(spyLocalStorage).toHaveBeenCalledWith('newsTags');
  });

  it('should call navigateByUrl inside cancelUBSwithoutSaving', () => {
    const spy = spyOn(router, 'navigateByUrl');
    component.cancelUBSwithoutSaving();
    expect(spy).toHaveBeenCalledWith('/ubs');
  });

  it('should call cancelPopupJustifying inside cancelUBS', () => {
    spyOn(component, 'getFormValues').and.returnValue(true);
    const spy = spyOn(FormBaseComponent.prototype as any, 'cancelPopupJustifying');
    component.cancelUBS(true);
    expect(spy).toHaveBeenCalledWith(true, true);
  });

  it('should call router.navigate if isUbs is false inside cancelPopupJustifying', () => {
    component.previousPath = 'fakePath';
    spyOn(matDialog, 'open').and.returnValue(dialogRefStub as any);
    spyOnProperty(router, 'url', 'get').and.returnValue('fake');
    const spy = spyOn(router, 'navigate');
    const cancelPopupJustifying = 'cancelPopupJustifying';
    component[cancelPopupJustifying](true, false);
    expect(spy).toHaveBeenCalledWith(['fakePath']);
  });

  it('should call cancelUBSwithoutSaving if isUbs is true inside cancelPopupJustifying', () => {
    component.previousPath = 'fakePath';
    spyOn(matDialog, 'open').and.returnValue(dialogRefStub as any);
    spyOnProperty(router, 'url', 'get').and.returnValue('ubs/order');
    const spy = spyOn(component, 'cancelUBSwithoutSaving');
    const cancelPopupJustifying = 'cancelPopupJustifying';
    component[cancelPopupJustifying](true, false);
    expect(spy).toHaveBeenCalled();
  });

  it('should call router.navigate if isUbsOrderSubmit is true inside cancelPopupJustifying', () => {
    spyOn(matDialog, 'open').and.returnValue(dialogRefStub as any);
    spyOnProperty(router, 'url', 'get').and.returnValue('fake');
    const spy = spyOn(router, 'navigate');
    const cancelPopupJustifying = 'cancelPopupJustifying';
    component[cancelPopupJustifying](true, true);
    expect(spy).toHaveBeenCalledWith(['ubs', 'confirm']);
  });

  it('should call router.navigate if conditions is false inside cancelPopupJustifying', () => {
    component.previousPath = 'fakePath';
    const spy = spyOn(router, 'navigate');
    const cancelPopupJustifying = 'cancelPopupJustifying';
    component[cancelPopupJustifying](false, false);
    expect(spy).toHaveBeenCalledWith(['fakePath']);
  });

  it('should call cancelUBSwithoutSaving if isUbsOrderSubmit is true and confirm === null inside cancelPopupJustifying', () => {
    const fakedialogRef = {
      afterClosed() {
        return of(null);
      }
    };
    spyOn(matDialog, 'open').and.returnValue(fakedialogRef as any);
    const spy = spyOn(component, 'cancelUBSwithoutSaving');
    const cancelPopupJustifying = 'cancelPopupJustifying';
    component[cancelPopupJustifying](true, true);
    expect(spy).toHaveBeenCalled();
  });
});
