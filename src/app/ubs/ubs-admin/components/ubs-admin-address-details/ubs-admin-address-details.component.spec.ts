import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { FormGroup } from '@angular/forms';

import { UbsAdminAddressDetailsComponent } from './ubs-admin-address-details.component';
import { OrderService } from '../../services/order.service';

describe('UbsAdminAddressDetailsComponent', () => {
  let component: UbsAdminAddressDetailsComponent;

  let fixture: ComponentFixture<UbsAdminAddressDetailsComponent>;

  const OrderServiceFake = {};

  const FormGroupMock = new FormGroup({});

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminAddressDetailsComponent],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: OrderService, useValue: OrderServiceFake }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminAddressDetailsComponent);
    component = fixture.componentInstance;
    component.addressExportDetailsDto = FormGroupMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change pageOpen', () => {
    component.pageOpen = true;
    component.openDetails();
    expect(component.pageOpen).toBe(false);
  });
});
