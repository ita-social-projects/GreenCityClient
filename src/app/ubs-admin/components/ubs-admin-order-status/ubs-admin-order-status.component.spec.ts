import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UbsAdminOrderStatusComponent } from './ubs-admin-order-status.component';

describe('UbsAdminOrderStatusComponent', () => {
  let component: UbsAdminOrderStatusComponent;
  let fixture: ComponentFixture<UbsAdminOrderStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminOrderStatusComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminOrderStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
