import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UbsAdminCustomerOrdersComponent } from './ubs-admin-customer-orders.component';

describe('UbsAdminCustomerOrdersComponent', () => {
  let component: UbsAdminCustomerOrdersComponent;
  let fixture: ComponentFixture<UbsAdminCustomerOrdersComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminCustomerOrdersComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminCustomerOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
