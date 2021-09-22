import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UbsAdminTariffsAddServicePopupComponent } from './ubs-admin-tariffs-add-service-popup.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

describe('UbsAdminTariffsAddServicePopupComponent', () => {
  let component: UbsAdminTariffsAddServicePopupComponent;
  let fixture: ComponentFixture<UbsAdminTariffsAddServicePopupComponent>;

  const button = {
    add: 'add',
    update: 'update'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminTariffsAddServicePopupComponent],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: button }, FormBuilder]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminTariffsAddServicePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
