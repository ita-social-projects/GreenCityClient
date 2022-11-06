import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';

export enum PERIOD_TYPES {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}

export enum PERIOD_SUBTYPES {
  ON_DAY = 'on-day',
  ON_WEEK_ON_DAY = 'on-week-on-day'
}

const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const weekdays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const weeks = ['first', 'second', 'third', 'forth', 'last'];
const modes = ['daily', 'weekly', 'monthly', 'yearly'];

export type RecurringEventsPickerComponentProps =
  | null
  | ({ begin: string; end: string } & (
      | {
          type: PERIOD_TYPES.DAILY;
          day: number;
        }
      | {
          type: PERIOD_TYPES.WEEKLY;
          week: number;
          weekdays: number[];
        }
      | {
          type: PERIOD_TYPES.MONTHLY;
          subtype: PERIOD_SUBTYPES.ON_DAY;
          month: number;
          day: number;
        }
      | {
          type: PERIOD_TYPES.MONTHLY;
          subtype: PERIOD_SUBTYPES.ON_WEEK_ON_DAY;
          month: number;
          week: number;
          weekday: number;
        }
      | {
          type: PERIOD_TYPES.YEARLY;
          subtype: PERIOD_SUBTYPES.ON_DAY;
          year: number;
          month: number;
          day: number;
        }
      | {
          type: PERIOD_TYPES.YEARLY;
          subtype: PERIOD_SUBTYPES.ON_WEEK_ON_DAY;
          year: number;
          month: number;
          week: number;
          weekday: number;
        }
    ));

@Component({
  selector: 'app-recurring-events-picker',
  templateUrl: './recurring-events-picker.component.html',
  styleUrls: ['./recurring-events-picker.component.scss']
})
export class RecurringEventsPickerComponent implements OnInit {
  // translations = translations;
  weekdays = weekdays;
  months = months;
  weeks = weeks;
  modes = modes;

  mode = 'daily';
  lang = 'en';

  form: FormGroup;
  @Input() input;
  @Input() noBegin = false;
  @Input() noEnd = false;

  constructor(private fb: FormBuilder, private localStorageService: LocalStorageService) {
    this.form = this.fb.group({
      begin: [''],
      end: [''],
      period: ['daily'],
      daily: this.fb.group({
        interval: [1]
      }),
      weekly: this.fb.group({
        interval: [{ value: 1, disabled: true }],
        weekdays: [this.weekdays]
      }),
      monthly: this.fb.group({
        interval: [1],
        subperiod: ['on-day'],
        day: [1],
        week: ['first'],
        weekdays: ['mon']
      }),
      yearly: this.fb.group({
        interval: [{ value: 1, disabled: true }],
        months: [['jan']],
        subperiod: ['on-day'],
        day: [1],
        week: ['first'],
        weekdays: ['mon']
      })
    });
  }

  ngOnInit(): void {
    this.localStorageService.languageBehaviourSubject.subscribe((lang) => {
      this.lang = lang;
    });

    this.form.valueChanges.subscribe((value) => {
      this.mode = value.period;
    });

    console.log(this.input);

    if (this.input) {
      this.fillForm();
    }
  }

  // ngOnChanges(): void {
  //   if (this.input) {
  //     this.fillForm();
  //   }
  // }

  fillForm() {
    const { begin, end, period } = this.input;

    if (!this.modes.includes(period)) {
      return;
    }

    const fields = {
      daily: ['interval'],
      weekly: ['interval', 'weekdays'],
      monthly: ['subperiod', 'interval', 'day', 'week', 'weekdays'],
      yearly: ['subperiod', 'interval', 'month', 'day', 'week', 'weekdays']
    };

    this.form.setValue({
      ...this.form.value,
      begin,
      end,
      period,
      [period]: {
        ...this.form.value[period],
        ...Object.fromEntries(fields[period].map((field) => [field, this.input[field]]).filter(([, val]) => val))
      }
    });
  }

  onSubmit() {
    const { begin, end, period } = this.form.value;
    console.log({
      begin,
      end,
      period,
      ...this.form.value[period]
    });
  }

  toCron() {
    const { period } = this.form.value;

    if (period === 'daily') {
      const day = this.form.value.daily.day;
      return `0 0 */${day} * *`;
    }
    if (period === 'weekly') {
      // ??????????????
    }
    if (period === 'monthly') {
      const { periodType, month, day, week, weekday } = this.form.value.daily;
      if (periodType === 'day-of-month') {
        return `0 0 ${day} * *`;
      }
    }
  }
}
