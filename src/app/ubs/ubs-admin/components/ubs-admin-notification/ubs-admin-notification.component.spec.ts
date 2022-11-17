import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CronPipe } from 'src/app/shared/cron-pipe/cron.pipe';

import { UbsAdminNotificationComponent } from './ubs-admin-notification.component';

describe('UbsAdminNotificationComponent', () => {
  let component: UbsAdminNotificationComponent;
  let fixture: ComponentFixture<UbsAdminNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminNotificationComponent, CronPipe],
      imports: [HttpClientTestingModule, MatDialogModule, RouterTestingModule, TranslateModule.forRoot()],
      providers: [FormBuilder, MatDialog]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
