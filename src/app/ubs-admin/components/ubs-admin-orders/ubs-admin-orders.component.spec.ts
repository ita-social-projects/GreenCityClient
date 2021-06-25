import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UbsAdminOrdersComponent } from './ubs-admin-orders.component';

describe('UbsAdminOrdersComponent', () => {
  let component: UbsAdminOrdersComponent;
  let fixture: ComponentFixture<UbsAdminOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminOrdersComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
