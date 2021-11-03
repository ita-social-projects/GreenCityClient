import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UbsAdminOrderHistoryComponent } from './ubs-admin-order-history.component';

describe('UbsAdminOrderHistoryComponent', () => {
  let component: UbsAdminOrderHistoryComponent;
  let fixture: ComponentFixture<UbsAdminOrderHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminOrderHistoryComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminOrderHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
