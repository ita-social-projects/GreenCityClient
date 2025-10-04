import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UbsAdminSettingsComponent } from './ubs-admin-settings.component';

describe('UbsAdminSettingsComponent', () => {
  let component: UbsAdminSettingsComponent;
  let fixture: ComponentFixture<UbsAdminSettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminSettingsComponent]
    });
    fixture = TestBed.createComponent(UbsAdminSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
