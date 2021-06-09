import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UbsAdminOrderDetailsComponent } from './ubs-admin-order-details.component';

describe('UbsAdminOrderDetailsComponent', () => {
  let component: UbsAdminOrderDetailsComponent;
  let fixture: ComponentFixture<UbsAdminOrderDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminOrderDetailsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
