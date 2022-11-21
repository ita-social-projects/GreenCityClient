import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Pipe, PipeTransform } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSelectHarness } from '@angular/material/select/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';

import { UbsAdminNotificationSettingsComponent } from './ubs-admin-notification-settings.component';

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
  const mockedData = {
    title: { en: 'Unpaid order', ua: 'Неоплачене замовлення' },
    trigger: 'ORDER_NOT_PAID_FOR_3_DAYS',
    schedule: '0 0 * * *'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminNotificationSettingsComponent, CronPipe],
      imports: [TranslateModule.forRoot(), ReactiveFormsModule, MatMenuModule, MatSelectModule, NoopAnimationsModule],
      providers: [FormBuilder, { provide: MAT_DIALOG_DATA, useValue: mockedData }, { provide: MatDialogRef, useValue: matDialogRefMock }]
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

  it('should display en and ua title, trigger and schedule', async () => {
    const [uaTitleField, enTitleField] = fixture.debugElement.queryAll(By.css('input.title-field'));
    const triggerSelectHarness = await loader.getHarness(MatSelectHarness.with({ selector: '.select-trigger' }));
    const scheduleField = fixture.debugElement.query(By.css('input.select-schedule'));
    expect(enTitleField.nativeElement.value).toBe('Unpaid order');
    expect(uaTitleField.nativeElement.value).toBe('Неоплачене замовлення');
    expect(await triggerSelectHarness.getValueText()).toBe('ubs-notifications.triggers.ORDER_NOT_PAID_FOR_3_DAYS');
    expect(scheduleField.nativeElement.value).toBe('at 00:00');
  });

  it('should pass new notification settings through `DialogRef` when user clicks `change`', async () => {
    const changeButton = fixture.debugElement.query(By.css('.controls .submit-button'));
    const uaTitleField = fixture.debugElement.queryAll(By.css('input.title-field'))[0].nativeElement;
    const triggerSelectHarness = await loader.getHarness(MatSelectHarness.with({ selector: '.select-trigger' }));
    uaTitleField.value = 'Неопл. замовлення';
    uaTitleField.dispatchEvent(new Event('input'));
    await triggerSelectHarness.open();
    await triggerSelectHarness.clickOptions({ text: 'ubs-notifications.triggers.STATUS_PARTIALLY_PAID' });
    await triggerSelectHarness.close();
    changeButton.triggerEventHandler('click', null);
    expect(matDialogRefMock.close).toHaveBeenCalledWith({
      title: { en: 'Unpaid order', ua: 'Неопл. замовлення' },
      trigger: 'STATUS_PARTIALLY_PAID',
      schedule: '0 0 * * *'
    });
  });
});
