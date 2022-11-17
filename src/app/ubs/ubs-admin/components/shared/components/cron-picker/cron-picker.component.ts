import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CronService } from 'src/app/shared/cron/cron.service';

@Component({
  selector: 'app-cron-picker',
  templateUrl: './cron-picker.component.html',
  styleUrls: ['./cron-picker.component.scss']
})
export class CronPickerComponent implements OnInit, OnDestroy, OnChanges {
  form: FormGroup;
  @Input() schedule = '';
  @Output() scheduleSelected = new EventEmitter<string>();

  private destroy = new Subject<void>();
  lang = 'en';

  daysOfWeekAliases = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  monthsAliases = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  daysOfWeek = new Array(7).fill(0).map((_, idx) => idx + 1);
  months = new Array(12).fill(0).map((_, idx) => idx + 1);
  days = new Array(31).fill(0).map((_, idx) => idx + 1);
  minutes = new Array(60).fill(0).map((_, idx) => idx);
  hours = new Array(24).fill(0).map((_, idx) => idx);
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

  dayValidator(control: AbstractControl) {
    const output = {
      'every-day': null,
      'days-of-week': control.value.daysOfWeek.length ? null : { atLeastOneDayOfWeekSelected: true },
      'days-of-month': control.value.daysOfMonth.length ? null : { atLeastOneDayOfMonthSelected: true }
    };
    return output[control.value.type];
  }

  monthValidator(control: AbstractControl) {
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
    if (schedule) {
      this.fillForm(schedule);
    }
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.unsubscribe();
  }

  onSelect() {
    const { params } = this.getCronParams();
    const cronString = `${params.min} ${params.hour} ${params.daysOfMonth} ${params.months} ${params.daysOfWeek}`;
    this.scheduleSelected.emit(cronString);
  }

  fillForm(cronString) {
    const { min, hour, dayOfMonth, month, dayOfWeek } = this.cronService.parse(cronString);

    // console.log({ min, hour, dayOfMonth, month, dayOfWeek });
    // const [min, hour, daysOfMonth, months, daysOfWeek] = cronString.split(' ');
    const compareObjects = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2);

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

    if (!supported.time.some((schema) => compareObjects({ min: min.type, hour: hour.type }, schema))) {
      throw new Error('Unsupported expression!');
    }
    if (!supported.day.some((schema) => compareObjects({ dayOfMonth: dayOfMonth.type, dayOfWeek: dayOfWeek.type }, schema))) {
      throw new Error('Unsupported expression!');
    }
    if (!supported.month.some((schema) => compareObjects({ month: month.type }, schema))) {
      throw new Error('Unsupported expression!');
    }

    let dayType = 'every-day';
    let monthType = 'every-month';

    if ((dayOfMonth.type === 'value' || dayOfMonth.type === 'list') && dayOfWeek.type === 'every') {
      dayType = 'days-of-month';
    }

    if ((dayOfWeek.type === 'value' || dayOfWeek.type === 'list') && dayOfMonth.type === 'every') {
      dayType = 'days-of-week';
    }

    if (month.type === 'months') {
      monthType = 'months';
    }

    console.log({
      time: { min: min.value, hour: hour.value },
      day: {
        type: dayType,
        daysOfMonth: dayOfMonth.value,
        daysOfWeek: dayOfWeek.value
      },
      month: {
        type: monthType,
        months: month.value
      }
    });

    this.form.patchValue({
      time: { min: min.value, hour: hour.value },
      day: {
        type: dayType,
        ...(dayOfMonth.value && { daysOfMonth: [dayOfMonth.value].flat() }),
        ...(dayOfWeek.value && { daysOfWeek: [dayOfWeek.value].flat().map((idx) => this.daysOfWeek[idx - 1]) })
      },
      month: {
        type: monthType,
        ...(month.value && { months: [month.value].flat() })
      }
    });
  }

  getCronParams() {
    const paramsByType = {
      day: {
        'every-day': { daysOfMonth: '*', daysOfWeek: '*' },
        'days-of-week': { daysOfMonth: '*', daysOfWeek: this.form.value.day.daysOfWeek.join(',') },
        'days-of-month': { daysOfMonth: this.form.value.day.daysOfMonth.join(','), daysOfWeek: '*' }
      },
      month: {
        'every-month': { months: '*' },
        months: { months: this.form.value.month.months.join(',') }
      }
    };

    const dayType = this.form.value.day.type;
    const monthType = this.form.value.month.type;
    const params = {
      ...this.form.value.time,
      ...paramsByType.day[dayType],
      ...paramsByType.month[monthType]
    };

    return { params, dayType, monthType };
  }

  setDescription() {
    const { params, dayType, monthType } = this.getCronParams();
    const parseTimePart = (num) => (String(num).length >= 2 ? String(num) : `0${num}`);
    this.description = {
      time: `${parseTimePart(params.hour)}:${parseTimePart(params.min)}`,
      day: dayType,
      month: monthType
    };
  }
}
