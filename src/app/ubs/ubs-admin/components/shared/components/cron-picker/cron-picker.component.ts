import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Subject, Observable } from 'rxjs';
import { CronService } from 'src/app/shared/cron/cron.service';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { startWith, map, takeUntil } from 'rxjs/operators';

const range = (from: number, to: number) => new Array(to - from).fill(0).map((_, idx) => from + idx);
const compareObjects = (obj1: any, obj2: any) => JSON.stringify(obj1) === JSON.stringify(obj2);

@Component({
  selector: 'app-cron-picker',
  templateUrl: './cron-picker.component.html',
  styleUrls: ['./cron-picker.component.scss']
})
export class CronPickerComponent implements OnInit, OnDestroy, OnChanges {
  @Input() schedule = '';
  @Output() scheduleSelected = new EventEmitter<string>();

  @ViewChild('autoHour', { static: false }) autoHour!: MatAutocomplete;
  @ViewChild('autoMin', { static: false }) autoMin!: MatAutocomplete;

  form: FormGroup;
  private destroy = new Subject<void>();
  lang = 'en';

  hours: string[] = Array.from({ length: 24 }, (_, i) => this.padZero(i));
  minutes: string[] = Array.from({ length: 60 }, (_, i) => this.padZero(i));

  hourFiltered!: Observable<string[]>;
  minFiltered!: Observable<string[]>;

  daysOfWeek = range(1, 8);
  days = range(1, 32);
  months = range(1, 13);
  daysOfWeekAliases = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  monthsAliases = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  description = {
    time: '',
    day: '',
    month: ''
  };

  constructor(
    private fb: FormBuilder,
    private localStorageService: LocalStorageService,
    private cronService: CronService
  ) {
    this.form = this.fb.group({
      time: this.fb.group(
        {
          min: new FormControl(this.padZero(new Date().getMinutes()), [Validators.required, Validators.pattern(/^[0-5]\d$/)]),
          hour: new FormControl(this.padZero(new Date().getHours()), [
            Validators.required,
            Validators.pattern(/^[0-2]\d$/),
            this.hourValidator
          ])
        },
        { validators: [this.timeValidator] }
      ),
      day: this.fb.group(
        {
          type: ['every-day'],
          daysOfWeek: [this.daysOfWeek],
          daysOfMonth: [[1]]
        },
        { validators: [this.dayValidator] }
      ),
      month: this.fb.group(
        {
          type: ['every-month'],
          months: [this.months]
        },
        { validators: [this.monthValidator] }
      )
    });

    this.localStorageService.languageBehaviourSubject.pipe(takeUntil(this.destroy)).subscribe((lang) => {
      this.lang = lang;
    });
  }

  private hourValidator(control: FormControl) {
    const value = parseInt(control.value, 10);
    if (isNaN(value) || value < 0 || value >= 25) {
      return { invalidHour: true };
    }
    return null;
  }

  private timeValidator(control: AbstractControl): null | { [error: string]: boolean } {
    const hour = control.get('hour')?.value;
    const min = control.get('min')?.value;

    if (!hour || !min) {
      return null;
    }
    const hourValid = /^[0-2][0-9]$/.test(hour) && hour < 25;
    const minValid = /^[0-5][0-9]$/.test(min);

    if (hourValid && minValid) {
      return null;
    } else {
      return { invalidHourMin: true };
    }
  }

  private isFormControl(control: AbstractControl): control is FormControl {
    return control instanceof FormControl;
  }

  getFormControl(controlName: string): FormControl | null {
    const control = this.form.get(`time.${controlName}`);
    return this.isFormControl(control) ? control : null;
  }

  checkForErrorsIn(controlName: string): string | null {
    const control = this.form.get(`time.${controlName}`);

    if (control?.errors) {
      if (control.errors.required) {
        return controlName === 'hour' ? 'cron-picker.errors.hour-required' : 'cron-picker.errors.minute-required';
      }
      if (control.errors.pattern || control.errors.invalidHourMin) {
        return controlName === 'hour' ? 'cron-picker.errors.hour-error' : 'cron-picker.errors.minute-error';
      }
    }
    return null;
  }

  private dayValidator(control: AbstractControl): null | { [error: string]: boolean } {
    const output = {
      'every-day': null,
      'days-of-week': control.value.daysOfWeek.length ? null : { atLeastOneDayOfWeekSelected: true },
      'days-of-month': control.value.daysOfMonth.length ? null : { atLeastOneDayOfMonthSelected: true }
    };
    return output[control.value.type];
  }

  private monthValidator(control: AbstractControl): null | { [error: string]: boolean } {
    const output = {
      'every-month': null,
      months: control.value.months.length ? null : { atLeastOneMonthSelected: true }
    };
    return output[control.value.type];
  }

  ngOnInit(): void {
    if (this.schedule) {
      this.initializeForm();
    }
    this.setupFormValueChanges();
  }

  private initializeForm() {
    const { min, hour } = this.cronService.parse(this.schedule);
    this.form.patchValue({
      time: {
        min: this.padZero(min.value || min.value[0]),
        hour: this.padZero(hour.value || hour.value[0])
      }
    });
    this.setDescription();
  }

  private setupFormValueChanges() {
    this.setDescription();

    this.form.valueChanges.pipe(takeUntil(this.destroy)).subscribe(() => {
      this.setDescription();
    });

    this.setupFilteredValues('hour', this.hours);
    this.setupFilteredValues('min', this.minutes);
  }

  private setupFilteredValues(controlName: string, options: string[]): void {
    this[`${controlName}Filtered`] = this.form.get(`time.${controlName}`)?.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value, options))
    );
  }

  private _filter(value: string, list: string[]): string[] {
    const filterValue = value.toString().toLowerCase();
    return list.filter((option) => option.toLowerCase().includes(filterValue));
  }

  ngOnChanges(changes: SimpleChanges): void {
    const schedule = changes.schedule.currentValue;
    if (!schedule) {
      return;
    }
    try {
      const updates = this.mapScheduleToFormValue(schedule);
      this.form.patchValue(updates);
    } catch (error) {
      console.error(`Error while parsing cron-picker input. ${error}`);
    }
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.unsubscribe();
  }

  onSelect(): void {
    const params = this.getCronParams();
    const cron = `${params.min} ${params.hour} ${params.dayOfMonth} ${params.month} ${params.dayOfWeek}`;
    this.scheduleSelected.emit(cron);
  }

  padZero(num: number): string {
    return num.toString().padStart(2, '0');
  }

  private mapScheduleToFormValue(cron: string): any {
    const { min, hour, dayOfMonth, month, dayOfWeek } = this.cronService.parse(cron);

    const supported = {
      time: [{ min: 'value', hour: 'value' }],
      day: [
        { dayOfMonth: 'every', dayOfWeek: 'every' },
        { dayOfMonth: 'value', dayOfWeek: 'every' },
        { dayOfMonth: 'list', dayOfWeek: 'every' },
        { dayOfMonth: 'every', dayOfWeek: 'value' },
        { dayOfMonth: 'every', dayOfWeek: 'list' }
      ],
      month: [{ month: 'every' }, { month: 'value' }, { month: 'list' }]
    };

    if (
      !supported.time.some((schema) => compareObjects({ min: min.type, hour: hour.type }, schema)) ||
      !supported.day.some((schema) => compareObjects({ dayOfMonth: dayOfMonth.type, dayOfWeek: dayOfWeek.type }, schema)) ||
      !supported.month.some((schema) => compareObjects({ month: month.type }, schema))
    ) {
      throw new Error('Invalid or unsupported expression!');
    }

    let dayType = 'every-day';
    let monthType = 'every-month';

    if (['value', 'list'].includes(dayOfMonth.type) && dayOfWeek.type === 'every') {
      dayType = 'days-of-month';
    }

    if (['value', 'list'].includes(dayOfWeek.type) && dayOfMonth.type === 'every') {
      dayType = 'days-of-week';
    }

    if (['value', 'list'].includes(month.type)) {
      monthType = 'months';
    }

    return {
      time: { min: min.value, hour: hour.value },
      day: {
        type: dayType,
        ...(dayOfMonth.value && { daysOfMonth: [dayOfMonth.value].flat() }),
        ...(dayOfWeek.value && { daysOfWeek: [dayOfWeek.value].flat() })
      },
      month: {
        type: monthType,
        ...(month.value && { months: [month.value].flat() })
      }
    };
  }

  private getCronParams(): { min: string; hour: string; dayOfMonth: string; month: string; dayOfWeek: string } {
    const paramsByType = {
      day: {
        'every-day': { dayOfMonth: '*', dayOfWeek: '*' },
        'days-of-week': { dayOfMonth: '*', dayOfWeek: this.form.value.day.daysOfWeek.join(',') },
        'days-of-month': { dayOfMonth: this.form.value.day.daysOfMonth.join(','), dayOfWeek: '*' }
      },
      month: {
        'every-month': { month: '*' },
        months: { month: this.form.value.month.months.join(',') }
      }
    };

    const dayType = this.form.value.day.type;
    const monthType = this.form.value.month.type;

    return {
      ...this.form.value.time,
      ...paramsByType.day[dayType],
      ...paramsByType.month[monthType]
    };
  }

  private setDescription(): void {
    const time = { min: this.form.value.time.min, hour: this.form.value.time.hour };
    const dayType = this.form.value.day.type;
    const monthType = this.form.value.month.type;

    this.description = {
      time: `${String(time.hour).padStart(2, '0')}:${String(time.min).padStart(2, '0')}`,
      day: dayType,
      month: monthType
    };
  }
}
