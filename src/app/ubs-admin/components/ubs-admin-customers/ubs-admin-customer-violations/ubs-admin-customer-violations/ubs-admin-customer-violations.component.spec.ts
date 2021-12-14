import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UbsAdminCustomerViolationsComponent } from './ubs-admin-customer-violations.component';

describe('UbsAdminCustomerViolationsComponent', () => {
  let component: UbsAdminCustomerViolationsComponent;
  let fixture: ComponentFixture<UbsAdminCustomerViolationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminCustomerViolationsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminCustomerViolationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
