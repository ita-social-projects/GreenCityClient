import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UbsAdminTariffsAddServicePopupComponent } from './ubs-admin-tariffs-add-service-popup.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('UbsAdminTariffsAddServicePopupComponent', () => {
  let component: UbsAdminTariffsAddServicePopupComponent;
  let fixture: ComponentFixture<UbsAdminTariffsAddServicePopupComponent>;
  let httpMock: HttpTestingController;

  const button = {
    add: 'add',
    update: 'update'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminTariffsAddServicePopupComponent],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, MatDialogModule],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: bagData }, FormBuilder, { provide: MatDialogRef, useValue: {} }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminTariffsAddServicePopupComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create form with 5 controls', () => {
    expect(component.addServiceForm.contains('name')).toBeTruthy();
    expect(component.addServiceForm.contains('capacity')).toBeTruthy();
    expect(component.addServiceForm.contains('price')).toBeTruthy();
    expect(component.addServiceForm.contains('commission')).toBeTruthy();
    expect(component.addServiceForm.contains('description')).toBeTruthy();
  });

  it('should mark name as invalid if empty value', () => {
    const control = component.addServiceForm.get('name');
    control.setValue('');
    expect(control.valid).toBeFalsy();
  });

  it('should mark price as valid if not empty value', () => {
    const control = component.addServiceForm.get('price');
    control.setValue(21);
    expect(control.valid).toBeTruthy();
  });

  it('destroy Subject should be closed after ngOnDestroy()', () => {
    // @ts-ignore
    component.destroy = new Subject<boolean>();
    // @ts-ignore
    spyOn(component.destroy, 'unsubscribe');
    component.ngOnDestroy();
    // @ts-ignore
    expect(component.destroy.unsubscribe).toHaveBeenCalledTimes(1);
  });

  it('ngOnInit should call initForm method one time', () => {
    // @ts-ignore
    const showInfo = spyOn(component, 'initForm');
    component.ngOnInit();
    expect(showInfo).toHaveBeenCalledTimes(1);
  });
});
