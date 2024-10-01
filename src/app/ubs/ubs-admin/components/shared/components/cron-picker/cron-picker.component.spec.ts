import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatAutocompleteHarness } from '@angular/material/autocomplete/testing';
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
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatAutocomplete, MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { FormControl } from '@angular/forms';

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
        MatDividerModule,
        MatExpansionModule,
        NoopAnimationsModule,
        MatAutocompleteModule,
        MatInputModule
      ],
      providers: [FormBuilder, { provide: CronService, useValue: cronServiceMock }]
    }).compileComponents();
  }));

  beforeEach(async () => {
    fixture = TestBed.createComponent(CronPickerComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);

    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  const getAllElements = async () => {
    const timePanelLoader = await loader.getChildLoader('.select-time');
    const dayPanelLoader = await loader.getChildLoader('.select-day');
    const monthPanelLoader = await loader.getChildLoader('.select-month');
    const [hourSelect, minSelect] = await timePanelLoader.getAllHarnesses(MatAutocompleteHarness);
    const [hourInput, minInput] = await timePanelLoader.getAllHarnesses(MatInputHarness);
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
      hourInput,
      minInput,
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

    fixture.detectChanges();
    await fixture.whenStable();

    expect(await hourSelect.getValue()).toBe(component.padZero(new Date().getHours()));
    expect(await minSelect.getValue()).toBe(component.padZero(new Date().getMinutes()));
    expect(await dayTypeRadioGroup.getCheckedValue()).toBe('every-day');
    expect(await monthTypeRadioGroup.getCheckedValue()).toBe('every-month');
    for (const toggle of dayOfWeekToggles) {
      expect(await toggle.isChecked()).toBe(true);
    }

    //only first day of month is checked by default
    expect(await dayOfMonthToggles[0].isChecked()).toBe(true);

    for (const toggle of monthsToggles) {
      expect(await toggle.isChecked()).toBe(true);
    }
  });

  it('`scheduleSelected` event with `0 0 * * *` should be fired when user clicks `select` button without making changes', async () => {
    const { selectButton } = await getAllElements();
    let emitted: string;
    const hour = component.padZero(new Date().getHours());
    const min = component.padZero(new Date().getMinutes());
    component.scheduleSelected.subscribe((val) => {
      emitted = val;
    });
    await selectButton.click();
    expect(emitted).toBe(`${min} ${hour} * * *`);
  });

  it('`scheduleSelected` event with `0 0 1 1,2,3,4,5,6,7,8,9,10,11,12 *` should be fired', async () => {
    const { dayTypeRadioGroup, monthTypeRadioGroup, selectButton } = await getAllElements();
    await dayTypeRadioGroup.checkRadioButton({ selector: '[value=days-of-month]' });
    await monthTypeRadioGroup.checkRadioButton({ selector: '[value=months]' });

    const hour = component.padZero(new Date().getHours());
    const min = component.padZero(new Date().getMinutes());
    let emitted;
    component.scheduleSelected.subscribe((val) => {
      emitted = val;
    });
    await selectButton.click();
    expect(emitted).toBe(`${min} ${hour} 1 1,2,3,4,5,6,7,8,9,10,11,12 *`);
  });

  xit('should fire an `scheduleSelected` event with correct param when user makes changes and clicks select', async () => {
    const {
      hourSelect,
      minSelect,
      hourInput,
      minInput,
      dayTypeRadioGroup,
      dayOfWeekToggles,
      monthTypeRadioGroup,
      monthsToggles,
      selectButton
    } = await getAllElements();

    await hourInput.focus();
    await minInput.focus();

    await hourSelect.selectOption({ text: '15' });
    await minSelect.selectOption({ text: '22' });

    await dayTypeRadioGroup.checkRadioButton({ selector: '[value=days-of-week]' });
    for (const toggle of dayOfWeekToggles) {
      const text = await toggle.getText();
      if (['cron-picker.days-of-week.MON', 'cron-picker.days-of-week.THU'].includes(text)) {
        await toggle.toggle();
      }
    }

    await monthTypeRadioGroup.checkRadioButton({ selector: '[value=months]' });
    for (const toggle of monthsToggles) {
      const text = await toggle.getText();
      if (['cron-picker.months.JAN', 'cron-picker.months.SEP', 'cron-picker.months.DEC'].includes(text)) {
        await toggle.toggle();
      }
    }

    let emitted: string;
    component.scheduleSelected.subscribe((val) => {
      emitted = val;
    });

    fixture.detectChanges();
    await fixture.whenStable();

    await selectButton.click();

    expect(emitted).toBe('22 15 * 2,3,4,5,6,7,8,10,11 2,3,5,6,7');
  });

  it('`select` button should be disabled and error displayed if days-of-week type is selected but no days specified', async () => {
    const { dayTypeRadioGroup, dayOfWeekToggles, selectButton } = await getAllElements();
    await dayTypeRadioGroup.checkRadioButton({ selector: '[value=days-of-week]' });
    for (const toggle of dayOfWeekToggles) {
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
    for (const toggle of monthsToggles) {
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
    for (const toggle of dayOfMonthToggles) {
      if (await toggle.isChecked()) {
        selectedDays.push(await toggle.getText());
      }
    }
    const selectedMonths = [];
    for (const toggle of monthsToggles) {
      if (await toggle.isChecked()) {
        selectedMonths.push(await toggle.getText());
      }
    }
    expect(await hourSelect.getValue()).toBe('14');
    expect(await minSelect.getValue()).toBe('17');
    expect(await dayTypeRadioGroup.getCheckedValue()).toBe('days-of-month');
    expect(selectedDays).toEqual(['4', '5', '7']);
    expect(await monthTypeRadioGroup.getCheckedValue()).toBe('months');
    expect(selectedMonths).toEqual(['cron-picker.months.JAN', 'cron-picker.months.FEB']);
  });

  it('if unsupported schedule is passed form values should stay default', async () => {
    component.schedule = '17 14 4-7 1,2 *';
    const hour = component.padZero(new Date().getHours());
    const min = component.padZero(new Date().getMinutes());

    component.ngOnChanges({
      schedule: { previousValue: '', currentValue: '17 14 4-7 1,2 *', firstChange: true, isFirstChange: () => true }
    });

    fixture.detectChanges();
    await fixture.whenStable();

    const { hourSelect, minSelect, dayTypeRadioGroup, dayOfWeekToggles, dayOfMonthToggles, monthTypeRadioGroup, monthsToggles } =
      await getAllElements();
    expect(await hourSelect.getValue()).toBe(hour);
    expect(await minSelect.getValue()).toBe(min);
    expect(await dayTypeRadioGroup.getCheckedValue()).toBe('every-day');
    expect(await monthTypeRadioGroup.getCheckedValue()).toBe('every-month');
    for (const toggle of dayOfWeekToggles) {
      expect(await toggle.isChecked()).toBe(true);
    }
    //only first day of month is checked by default
    expect(await dayOfMonthToggles[0].isChecked()).toBe(true);

    for (const toggle of monthsToggles) {
      expect(await toggle.isChecked()).toBe(true);
    }
  });

  describe('padZero', () => {
    it('should add a leading zero to single-digit numbers', () => {
      const result = component.padZero(5);
      expect(result).toBe('05');
    });

    it('should not add a leading zero to two-digit numbers', () => {
      const result = component.padZero(12);
      expect(result).toBe('12');
    });

    it('should handle zero correctly', () => {
      const result = component.padZero(0);
      expect(result).toBe('00');
    });
  });

  describe('Form Control Methods', () => {
    it('should get the FormControl for hour', () => {
      const control = component.getFormControl('hour');
      expect(control).toBeTruthy();
      expect(control instanceof FormControl).toBe(true);
    });

    it('should get the FormControl for min', () => {
      const control = component.getFormControl('min');
      expect(control).toBeTruthy();
      expect(control instanceof FormControl).toBe(true);
    });

    it('should return null for invalid control name', () => {
      const control = component.getFormControl('invalidControl');
      expect(control).toBeNull();
    });

    it('should return the correct error message for hour control', () => {
      const control = component.form.get('time.hour');
      control.setValue('');
      control.markAsTouched();
      const error = component.checkForErrorsIn('hour');
      expect(error).toBe('cron-picker.errors.hour-required');
    });

    it('should return the correct error message for min control', () => {
      const control = component.form.get('time.min');
      control.setValue('');
      control.markAsTouched();
      const error = component.checkForErrorsIn('min');
      expect(error).toBe('cron-picker.errors.minute-required');
    });

    it('should return the correct error message for invalid hour control', () => {
      const control = component.form.get('time.hour');
      control.setValue('35');
      control.markAsTouched();
      const error = component.checkForErrorsIn('hour');
      expect(error).toBe('cron-picker.errors.hour-error');
    });

    it('should return the correct error message for invalid min control', () => {
      const control = component.form.get('time.min');
      control.setValue('60');
      control.markAsTouched();
      const error = component.checkForErrorsIn('min');
      expect(error).toBe('cron-picker.errors.minute-error');
    });

    it('should return null for valid hour control', () => {
      const control = component.form.get('time.hour');
      control.setValue('10');
      control.markAsTouched();
      const error = component.checkForErrorsIn('hour');
      expect(error).toBeNull();
    });

    it('should return null for valid min control', () => {
      const control = component.form.get('time.min');
      control.setValue('30');
      control.markAsTouched();
      const error = component.checkForErrorsIn('min');
      expect(error).toBeNull();
    });
  });
});
