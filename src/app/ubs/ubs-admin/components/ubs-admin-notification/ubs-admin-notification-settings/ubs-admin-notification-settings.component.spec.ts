import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UbsAdminNotificationSettingsComponent } from './ubs-admin-notification-settings.component';

describe('UbsAdminNotificationSettingsComponent', () => {
  let component: UbsAdminNotificationSettingsComponent;
  let fixture: ComponentFixture<UbsAdminNotificationSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminNotificationSettingsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminNotificationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
