import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { CronPipe } from 'src/app/shared/cron-pipe/cron.pipe';
import { SharedModule } from 'src/app/shared/shared.module';

import { UbsAdminNotificationSettingsComponent } from './ubs-admin-notification-settings.component';

describe('UbsAdminNotificationSettingsComponent', () => {
  let component: UbsAdminNotificationSettingsComponent;
  let fixture: ComponentFixture<UbsAdminNotificationSettingsComponent>;

  const matDialogRefMock = jasmine.createSpyObj('matDialogRefMock', ['close']);

  const mockedData = {
    title: { en: '', ua: '' }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminNotificationSettingsComponent, CronPipe],
      imports: [TranslateModule.forRoot(), MatMenuModule],
      providers: [FormBuilder, { provide: MAT_DIALOG_DATA, useValue: mockedData }, { provide: MatDialogRef, useValue: matDialogRefMock }]
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
