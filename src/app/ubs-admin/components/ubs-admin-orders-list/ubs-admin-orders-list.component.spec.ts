import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UbsAdminOrdersListComponent } from './ubs-admin-orders-list.component';

describe('UbsAdminOrdersListComponent', () => {
  let component: UbsAdminOrdersListComponent;
  let fixture: ComponentFixture<UbsAdminOrdersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminOrdersListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminOrdersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
