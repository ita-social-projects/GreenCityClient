import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CronService } from 'src/app/shared/cron/cron.service';

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

  form: FormGroup;
  private destroy = new Subject<void>();
  lang = 'en';

  minutes = range(0, 60);
  hours = range(0, 24);
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

  constructor(private fb: FormBuilder, private localStorageService: LocalStorageService, private cronService: CronService) {
    this.form = this.fb.group({
      time: this.fb.group({
        min: [0],
        hour: [0]
      }),
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
    this.form.valueChanges.pipe(takeUntil(this.destroy)).subscribe((value) => {
      this.setDescription();
    });
    this.setDescription();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const schedule = changes.schedule.currentValue;
    if (!schedule) {
      return;
    }
    try {
      const updates = this.mapInputToFormValue(schedule);
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

  private mapInputToFormValue(cron: string): any {
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

    if (month.type === 'months') {
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
    const parseTimePart = (num) => (String(num).length >= 2 ? String(num) : `0${num}`);

    const time = { min: this.form.value.time.min, hour: this.form.value.time.hour };
    const dayType = this.form.value.day.type;
    const monthType = this.form.value.month.type;

    this.description = {
      time: `${parseTimePart(time.hour)}:${parseTimePart(time.min)}`,
      day: dayType,
      month: monthType
    };
  }
}
