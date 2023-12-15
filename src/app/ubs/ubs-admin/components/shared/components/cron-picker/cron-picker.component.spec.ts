import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';
import { MatRadioGroupHarness } from '@angular/material/radio/testing';

import { CronPickerComponent } from './cron-picker.component';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonToggleGroupHarness } from '@angular/material/button-toggle/testing';
import { CronService } from 'src/app/shared/cron/cron.service';

describe('CronPickerComponent', () => {
  let component: CronPickerComponent;
  let fixture: ComponentFixture<CronPickerComponent>;
  let loader: HarnessLoader;

  const cronServiceMock = {
    parse: (cron: string) => {
      const mapper = {
        '17 14 4,5,7 1,2 *': {
          min: { type: 'value', value: 17 },
          hour: { type: 'value', value: 14 },
          dayOfMonth: { type: 'list', value: [4, 5, 7] },
          month: { type: 'list', value: [1, 2] },
          dayOfWeek: { type: 'every', value: null }
        },
        '17 14 4-7 1,2 *': {
          min: { type: 'value', value: 17 },
          hour: { type: 'value', value: 14 },
          dayOfMonth: { type: 'range', value: [4, 7] },
          month: { type: 'list', value: [1, 2] },
          dayOfWeek: { type: 'every', value: null }
        }
      };
      return mapper[cron];
    }
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CronPickerComponent],
      imports: [
        TranslateModule.forRoot(),
        MatSelectModule,
        MatRadioModule,
        MatButtonToggleModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatButtonModule,
        NoopAnimationsModule
      ],
      providers: [UntypedFormBuilder, { provide: CronService, useValue: cronServiceMock }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CronPickerComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);

    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit();
  });

  const getAllElements = async () => {
    const timePanelLoader = await loader.getChildLoader('.select-time');
    const dayPanelLoader = await loader.getChildLoader('.select-day');
    const monthPanelLoader = await loader.getChildLoader('.select-month');
    const [hourSelect, minSelect] = await timePanelLoader.getAllHarnesses(MatSelectHarness);
    const dayTypeRadioGroup = await dayPanelLoader.getHarness(MatRadioGroupHarness);
    const dayOfWeekToggleGroup = await dayPanelLoader.getHarness(MatButtonToggleGroupHarness.with({ ancestor: '.select-days-of-week' }));
    const dayOfMonthToggleGroup = await dayPanelLoader.getHarness(MatButtonToggleGroupHarness.with({ ancestor: '.select-days-of-month' }));
    const dayOfWeekToggles = await dayOfWeekToggleGroup.getToggles();
    const dayOfMonthToggles = await dayOfMonthToggleGroup.getToggles();
    const monthTypeRadioGroup = await monthPanelLoader.getHarness(MatRadioGroupHarness);
    const monthsToggleButtonGroup = await monthPanelLoader.getHarness(MatButtonToggleGroupHarness.with({ ancestor: '.select-months' }));
    const monthsToggles = await monthsToggleButtonGroup.getToggles();
    const selectButton = await loader.getHarness(MatButtonHarness.with({ selector: '.select-schedule-button' }));

    return {
      timePanelLoader,
      dayPanelLoader,
      monthPanelLoader,
      hourSelect,
      minSelect,
      dayTypeRadioGroup,
      dayOfWeekToggleGroup,
      dayOfMonthToggleGroup,
      dayOfWeekToggles,
      dayOfMonthToggles,
      monthTypeRadioGroup,
      monthsToggleButtonGroup,
      monthsToggles,
      selectButton
    };
  };

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('correct options are selected by default', async () => {
    const { hourSelect, minSelect, dayTypeRadioGroup, dayOfWeekToggles, dayOfMonthToggles, monthTypeRadioGroup, monthsToggles } =
      await getAllElements();
    expect(await hourSelect.getValueText()).toBe('0');
    expect(await minSelect.getValueText()).toBe('0');
    expect(await dayTypeRadioGroup.getCheckedValue()).toBe('every-day');
    expect(await monthTypeRadioGroup.getCheckedValue()).toBe('every-month');
    expect(
      dayOfWeekToggles.every(async (toggle) => {
        await toggle.isChecked();
      })
    ).toBe(true);
    expect(
      dayOfMonthToggles.every(async (toggle) => {
        await toggle.isChecked();
      })
    ).toBe(true);
    expect(
      monthsToggles.every(async (toggle) => {
        await toggle.isChecked();
      })
    ).toBe(true);
  });

  it('`scheduleSelected` event with `0 0 * * *` should be fired when user clicks `select` button without making changes', async () => {
    const { selectButton } = await getAllElements();
    let emitted;
    component.scheduleSelected.subscribe((val) => {
      emitted = val;
    });
    await selectButton.click();
    expect(emitted).toBe('0 0 * * *');
  });

  it('`scheduleSelected` event with `0 0 1 1,2,3,4,5,6,7,8,9,10,11,12 *` should be fired', async () => {
    const { dayTypeRadioGroup, monthTypeRadioGroup, selectButton } = await getAllElements();
    await dayTypeRadioGroup.checkRadioButton({ selector: '[value=days-of-month]' });
    await monthTypeRadioGroup.checkRadioButton({ selector: '[value=months]' });
    let emitted;
    component.scheduleSelected.subscribe((val) => {
      emitted = val;
    });
    await selectButton.click();
    expect(emitted).toBe('0 0 1 1,2,3,4,5,6,7,8,9,10,11,12 *');
  });

  it('should fire an `scheduleSelected` event with correct param when user makes changes and clicks select', async () => {
    const { hourSelect, minSelect, dayTypeRadioGroup, dayOfWeekToggles, monthTypeRadioGroup, monthsToggles, selectButton } =
      await getAllElements();
    await hourSelect.clickOptions({ text: '15' });
    await minSelect.clickOptions({ text: '22' });
    await dayTypeRadioGroup.checkRadioButton({ selector: '[value=days-of-week]' });
    for await (const toggle of dayOfWeekToggles) {
      if (['cron-picker.days-of-week.MON', 'cron-picker.days-of-week.THU'].includes(await toggle.getText())) {
        await toggle.toggle();
      }
    }
    await monthTypeRadioGroup.checkRadioButton({ selector: '[value=months]' });
    for await (const toggle of monthsToggles) {
      if (['cron-picker.months.JAN', 'cron-picker.months.SEP', 'cron-picker.months.DEC'].includes(await toggle.getText())) {
        await toggle.toggle();
      }
    }
    let emitted;
    component.scheduleSelected.subscribe((val) => {
      emitted = val;
    });
    await selectButton.click();
    expect(emitted).toBe('22 15 * 2,3,4,5,6,7,8,10,11 2,3,5,6,7');
  });

  it('`select` button should be disabled and error displayed if days-of-week type is selected but no days specified', async () => {
    const { dayTypeRadioGroup, dayOfWeekToggles, selectButton } = await getAllElements();
    await dayTypeRadioGroup.checkRadioButton({ selector: '[value=days-of-week]' });
    for await (const toggle of dayOfWeekToggles) {
      await toggle.toggle();
    }
    const errorLabel = fixture.debugElement.query(By.css('.error-days-of-week'));
    expect(await selectButton.isDisabled()).toBe(true);
    expect(errorLabel.nativeElement.textContent).toContain('cron-picker.errors.at-least-one-day-of-week');
  });

  it('`select` button should be disabled and error displayed if days-of-month type is selected but no days specified', async () => {
    const { dayTypeRadioGroup, dayOfMonthToggles, selectButton } = await getAllElements();
    await dayTypeRadioGroup.checkRadioButton({ selector: '[value=days-of-month]' });
    await dayOfMonthToggles[0].toggle();
    const errorLabel = fixture.debugElement.query(By.css('.error-days-of-month'));
    expect(await selectButton.isDisabled()).toBe(true);
    expect(errorLabel.nativeElement.textContent).toContain('cron-picker.errors.at-least-one-day-of-month');
  });

  it('`select` button should be disabled and error displayed if month type is selected but no month specified', async () => {
    const { monthTypeRadioGroup, monthsToggles, selectButton } = await getAllElements();
    await monthTypeRadioGroup.checkRadioButton({ selector: '[value=months]' });
    for await (const toggle of monthsToggles) {
      await toggle.toggle();
    }
    const errorLabel = fixture.debugElement.query(By.css('.error-months'));
    expect(await selectButton.isDisabled()).toBe(true);
    expect(errorLabel.nativeElement.textContent).toContain('cron-picker.errors.at-least-one-month');
  });

  it('form should be set correctly if input `schedule` is set', async () => {
    component.schedule = '17 14 4,5,7 1,2 *';
    component.ngOnChanges({
      schedule: { previousValue: '', currentValue: '17 14 4,5,7 1,2 *', firstChange: true, isFirstChange: () => true }
    });
    fixture.detectChanges();
    const { hourSelect, minSelect, dayTypeRadioGroup, dayOfMonthToggles, monthTypeRadioGroup, monthsToggles } = await getAllElements();
    const selectedDays = [];
    for await (const toggle of dayOfMonthToggles) {
      if (await toggle.isChecked()) {
        selectedDays.push(await toggle.getText());
      }
    }
    const selectedMonths = [];
    for await (const toggle of monthsToggles) {
      if (await toggle.isChecked()) {
        selectedMonths.push(await toggle.getText());
      }
    }
    expect(await hourSelect.getValueText()).toBe('14');
    expect(await minSelect.getValueText()).toBe('17');
    expect(await dayTypeRadioGroup.getCheckedValue()).toBe('days-of-month');
    expect(selectedDays).toEqual(['4', '5', '7']);
    expect(await monthTypeRadioGroup.getCheckedValue()).toBe('months');
    expect(selectedMonths).toEqual(['cron-picker.months.JAN', 'cron-picker.months.FEB']);
  });

  it('if unsupported schedule is passed form values should stay default', async () => {
    component.schedule = '17 14 4-7 1,2 *';
    component.ngOnChanges({
      schedule: { previousValue: '', currentValue: '17 14 4-7 1,2 *', firstChange: true, isFirstChange: () => true }
    });
    fixture.detectChanges();
    const { hourSelect, minSelect, dayTypeRadioGroup, dayOfWeekToggles, dayOfMonthToggles, monthTypeRadioGroup, monthsToggles } =
      await getAllElements();
    expect(await hourSelect.getValueText()).toBe('0');
    expect(await minSelect.getValueText()).toBe('0');
    expect(await dayTypeRadioGroup.getCheckedValue()).toBe('every-day');
    expect(await monthTypeRadioGroup.getCheckedValue()).toBe('every-month');
    expect(
      dayOfWeekToggles.every(async (toggle) => {
        await toggle.isChecked();
      })
    ).toBe(true);
    expect(
      dayOfMonthToggles.every(async (toggle) => {
        await toggle.isChecked();
      })
    ).toBe(true);
    expect(
      monthsToggles.every(async (toggle) => {
        await toggle.isChecked();
      })
    ).toBe(true);
  });
});
