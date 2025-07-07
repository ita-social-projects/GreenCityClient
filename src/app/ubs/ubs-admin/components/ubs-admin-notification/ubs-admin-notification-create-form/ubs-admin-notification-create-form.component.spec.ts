import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UbsAdminNotificationCreateFormComponent } from './ubs-admin-notification-create-form.component';

describe('UbsAdminNotificationCreateFormComponent', () => {
  let component: UbsAdminNotificationCreateFormComponent;
  let fixture: ComponentFixture<UbsAdminNotificationCreateFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminNotificationCreateFormComponent]
    });
    fixture = TestBed.createComponent(UbsAdminNotificationCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
