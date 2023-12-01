import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSelectHarness } from '@angular/material/select/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { UbsAdminNotificationSettingsComponent } from './ubs-admin-notification-settings.component';
import { LanguageService } from 'src/app/main/i18n/language.service';

@Pipe({ name: 'cron' })
class CronPipe implements PipeTransform {
  transform() {
    return 'at 00:00';
  }
}

describe('UbsAdminNotificationSettingsComponent', () => {
  let component: UbsAdminNotificationSettingsComponent;
  let fixture: ComponentFixture<UbsAdminNotificationSettingsComponent>;
  let loader: HarnessLoader;
  const matDialogRefMock = jasmine.createSpyObj('matDialogRefMock', ['close']);
  const langServiceSpy = jasmine.createSpyObj('LanguageService', ['getLangValue']);

  const mockedData = {
    title: { en: 'Unpaid order', ua: 'Неоплачене замовлення' },
    trigger: 'ORDER_NOT_PAID_FOR_3_DAYS',
    time: '6PM_3DAYS_AFTER_ORDER_FORMED_NOT_PAID',
    schedule: '0 0 * * *'
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminNotificationSettingsComponent, CronPipe],
      imports: [TranslateModule.forRoot(), ReactiveFormsModule, MatMenuModule, MatSelectModule, NoopAnimationsModule],
      providers: [
        FormBuilder,
        { provide: MAT_DIALOG_DATA, useValue: mockedData },
        { provide: LanguageService, useValue: langServiceSpy },
        { provide: MatDialogRef, useValue: matDialogRefMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminNotificationSettingsComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the schedule when onScheduleSelected is called', () => {
    const cron = '0 * * * *';
    component.onScheduleSelected(cron);
    expect(component.schedule).toBe(cron);
  });

  it('should return the correct language value when getLangValue is called', () => {
    const uaValue = 'Ukrainian Value';
    const enValue = 'English Value';
    (component as any).langService.getLangValue.and.returnValue(enValue);

    const result = component.getLangValue(uaValue, enValue);
    expect(result).toBe(enValue);
    expect((component as any).langService.getLangValue).toHaveBeenCalledWith(uaValue, enValue);
  });

  it('should close the dialog without data when onCancel is called', () => {
    component.onCancel();
    expect(matDialogRefMock.close).toHaveBeenCalled();
  });

  it('should close the dialog with the form data when onSubmit is called', () => {
    const formData = {
      titleEn: 'English Title',
      titleUa: 'Ukrainian Title',
      trigger: 'trigger',
      time: 'time'
    };
    component.form.setValue(formData);
    component.schedule = '0 * * * *';

    component.onSubmit();
    expect(matDialogRefMock.close).toHaveBeenCalledWith({
      title: {
        en: formData.titleEn,
        ua: formData.titleUa
      },
      trigger: formData.trigger,
      time: formData.time,
      schedule: component.schedule
    });
  });
});
