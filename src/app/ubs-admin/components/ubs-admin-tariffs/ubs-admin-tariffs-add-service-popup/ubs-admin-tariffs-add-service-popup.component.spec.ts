import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UbsAdminTariffsAddServicePopupComponent } from './ubs-admin-tariffs-add-service-popup.component';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
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
      providers: [{ provide: MAT_DIALOG_DATA, useValue: button }, FormBuilder]
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
});
