import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cron-picker',
  templateUrl: './cron-picker.component.html',
  styleUrls: ['./cron-picker.component.scss']
})
export class CronPickerComponent implements OnInit {
  form: FormGroup;
  @Input() cronString = '';
  @Output() scheduleSelected = new EventEmitter<string>();

  daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  days = new Array(31).fill(0).map((val, idx) => idx + 1);
  minutes = new Array(60).fill(0).map((val, idx) => idx);
  hours = new Array(24).fill(0).map((val, idx) => idx);
  hint = '';

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      time: this.fb.group({
        min: [0],
        hour: [0]
      }),
      day: this.fb.group({
        type: ['every-day'],
        daysOfWeek: [this.daysOfWeek],
        daysOfMonth: [[1]]
      }),
      month: this.fb.group({
        type: ['every-month'],
        months: [this.months]
      })
    });
  }

  ngOnInit(): void {
    if (this.cronString) {
      this.fillForm(this.cronString);
    }

    this.form.valueChanges.subscribe((value) => {
      this.getHint();
    });

    this.getHint();
  }

  onSelect() {
    const { params } = this.getCronParams();
    const cronString = `${params.min} ${params.hour} ${params.daysOfMonth} ${params.months} ${params.daysOfWeek}`;
    this.scheduleSelected.emit(cronString);
  }

  fillForm(cronString) {
    const [min, hour, daysOfMonth, months, daysOfWeek] = cronString.split(' ');

    let dayType = 'every-day';
    let monthType = 'every-month';

    if (daysOfMonth !== '*') {
      dayType = 'days-of-month';
    }
    if (daysOfWeek !== '*') {
      dayType = 'days-of-week';
    }
    if (months !== '*') {
      monthType = 'months';
    }

    this.form.setValue({
      time: { min: parseInt(min, 10), hour: parseInt(hour, 10) },
      day: {
        type: dayType,
        daysOfMonth: daysOfMonth.split(','),
        daysOfWeek: daysOfWeek.split(',')
      },
      month: {
        type: monthType,
        months: months.split(',')
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

  getHint() {
    const { params, dayType, monthType } = this.getCronParams();
    const parseTimePart = (num) => (String(num).length >= 2 ? String(num) : `0${num}`);

    const hintTime = `О ${parseTimePart(params.hour)}:${parseTimePart(params.min)}`;
    const hintDay = {
      'every-day': 'щодня',
      'days-of-week': `у ${params.daysOfWeek}`,
      'days-of-month': `у ${params.daysOfMonth}-й день місяця`
    };
    const hintMonth = {
      'every-month': 'щомісяця',
      months: `у такі місяці: ${params.months}`
    };
    const hint = `${hintTime} ${hintDay[dayType]} ${hintMonth[monthType]}`;
    this.hint = hint;
  }
}
