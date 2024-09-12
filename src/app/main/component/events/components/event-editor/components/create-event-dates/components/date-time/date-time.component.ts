import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { startWith, tap } from 'rxjs/operators';
import { combineLatest, Subscription } from 'rxjs';
import { FormBridgeService } from '../../../../../../services/form-bridge.service';
import { timeValidator } from './validator/timeValidator';
import { LanguageService } from '../../../../../../../../i18n/language.service';
import { DateTime, DateTimeForm, FormEmitter } from '../../../../../../models/events.interface';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import 'moment/locale/uk';

const moment = _rollupMoment || _moment;
moment.locale('uk');

// Custom date formats
export const MY_FORMATS = {
  parse: {
    dateInput: 'MMM DD, YYYY'
  },
  display: {
    dateInput: 'MMM DD, YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

@Component({
  selector: 'app-date-time',
  templateUrl: './date-time.component.html',
  styleUrls: ['./date-time.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class DateTimeComponent implements OnInit, OnDestroy {
  @Input({ required: true }) dayNumber: number;
  @Input({ required: true }) sharedKey: number;
  @Input() formDisabled: boolean;
  @Input() formInput: DateTime;
  today: Date = new Date();
  dateFilterBind = this._dateFilter.bind(this);
  startOptionsArr: string[];
  endOptionsArr: string[];
  // we will attach this validator later in code { validators: timeValidator(this._timeArr[this._upperTimeLimit]) }

  @Output() destroy = new EventEmitter<any>();
  @Output() formEmitter: EventEmitter<FormEmitter<DateTime>> = new EventEmitter<FormEmitter<DateTime>>();
  private _timeArr: string[] = [];
  private _upperTimeLimit = 0;
  private _lowerTimeLimit: number = this._timeArr.length - 1;
  private _subscriptions: Subscription[] = [];
  private _indexStartTime: number;
  private _indexEndTime: number;
  private _checkedAllDay = false;
  private _lastTimeValues: string[] = [];
  private _key = Symbol('dateKey');

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private bridge: FormBridgeService,
    private ls: LanguageService,
    private adapter: DateAdapter<any>
  ) {
    this.form = this.fb.group({
      date: [moment(this.today), [Validators.required, this.dateValidator]],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      allDay: [false]
    });
  }

  get date() {
    return this.form.get('date');
  }

  get startTime() {
    return this.form.get('startTime');
  }

  get endTime() {
    return this.form.get('endTime');
  }

  get allDay() {
    return this.form.get('allDay');
  }

  ngOnInit() {
    this.today = this._setDay(this.dayNumber);
    this._fillTimeArray();
    this._subscribeToFormChanges();
    this._subscribeToFormStatus();
    const initialStartTime = this._initialStartTime();
    this._upperTimeLimit = this._timeArr.indexOf(initialStartTime);
    this.form.patchValue(
      {
        date: moment(this.today),
        startTime: initialStartTime
      },
      { emitEvent: true }
    );
    this.bridge.changeDay(this.dayNumber, this.today);
    this._updateTimeIndex(initialStartTime, this.endTime.value);

    if (this.formInput) {
      this.form.setValue(this.formInput);
      if (this.formInput.allDay) {
        this.toggleAllDay();
      }
      if (this.formDisabled) {
        this.form.disable();
      }
    }
    this.ls.getCurrentLangObs().subscribe((lang) => {
      const locale = lang !== 'ua' ? 'en-GB' : 'uk-UA';
      this.adapter.setLocale(locale);
    });
  }

  ngOnDestroy() {
    this._subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.bridge.deleteRecordFromDayMap(this.dayNumber);
    this.destroy.emit(this._key);
    if (this.dayNumber === 0) {
      this.bridge.resetSubjects();
    }
  }

  toggleAllDay(): void {
    this._checkedAllDay = !this._checkedAllDay;
    const startTime = this.startTime;
    const endTime = this.endTime;
    [startTime, endTime].forEach((control) => control[this._checkedAllDay ? 'disable' : 'enable']());
    // IF toggle true disable forms and memorize last values
    if (this._checkedAllDay) {
      this._lastTimeValues = [startTime.value, endTime.value];
      this.form.patchValue({
        startTime: this._timeArr[0],
        endTime: this._timeArr[this._lowerTimeLimit - 1]
      });
    } else {
      this.form.patchValue({
        startTime: this._lastTimeValues[0],
        endTime: this._lastTimeValues[1]
      });
    }
  }

  private dateValidator(control: AbstractControl): null | { [error: string]: boolean } {
    const selectedDate = control.value;
    if (!selectedDate) {
      return control.errors.matDatepickerMin ? { dateIncorrect: true } : { isRequired: true };
    }

    // Convert control value to a Moment object
    const momentDate = moment(selectedDate);
    const now = moment();

    // Check if the date is in the past
    if (momentDate.isBefore(now, 'day')) {
      return { dateInPast: true };
    }

    return null;
  }

  private _emitForm(form: DateTimeForm, valid: boolean) {
    const newForm = form && { ...form, date: form?.date.toDate() };
    this.formEmitter.emit({ key: this._key, valid, form: newForm, sharedKey: this.sharedKey, formKey: 'dateTime' });
  }

  private _subscribeToFormStatus() {
    this.form.statusChanges.subscribe((status) => {
      if (status === 'VALID') {
        this._emitForm(this.form.getRawValue(), true);
      } else {
        this._emitForm(undefined, false);
      }
    });
  }

  private _fillTimeArray(): void {
    const timeArr = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        // Pad hours and minutes with leading zeros for consistent formatting
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        timeArr.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    timeArr.push('23:59');
    this._timeArr = timeArr;
    this._lowerTimeLimit = this._timeArr.length;
  }

  private _setDay(n: number) {
    const day = this.bridge.getDayFromMap(n - 1);
    if (day) {
      const currentDay = day.getDate();
      const newDate = new Date(day.getTime());
      // Create a copy to avoid modifying the original
      newDate.setDate(currentDay + 1);
      return newDate;
    }
    const f = new Date();
    f.setHours(0, 0, 0, 0);
    return f;
  }

  private _subscribeToFormChanges() {
    const startTime$ = this.startTime.valueChanges.pipe(
      startWith(''),
      tap(() => this._checkForColumn('startTime'))
    );

    const endTime$ = this.endTime.valueChanges.pipe(
      startWith(''),
      tap(() => this._checkForColumn('endTime'))
    );

    const date$ = this.date.valueChanges.pipe(
      startWith(this.today),
      tap((value) => {
        this.bridge.changeDay(this.dayNumber, value);
        const isCurrentDate = this._checkIsCurrentDate(value);
        if (isCurrentDate) {
          this._upperTimeLimit = this._timeArr.indexOf(this._initialStartTime());
          this.allDay.disable({ emitEvent: false });
        } else {
          this._upperTimeLimit = 0;
          this.allDay.enable({ emitEvent: false });
        }
      })
    );

    const allDay$ = this.allDay.valueChanges.pipe(startWith(false));
    const formChanges$ = combineLatest([startTime$, endTime$, date$, allDay$]);
    const subscription = formChanges$.subscribe(([startTime, endTime, _, allDay]) => {
      if (allDay) {
        return;
      }
      this._updateTimeIndex(startTime, endTime);
      this.startOptionsArr = this._filterAutoOptions(startTime, this._upperTimeLimit, this._indexEndTime);
      this.endOptionsArr = this._filterAutoOptions(endTime, this._indexStartTime, this._lowerTimeLimit);
      this.form.setValidators(timeValidator(this._timeArr[this._upperTimeLimit]));
    });

    this._subscriptions.push(subscription);
  }

  private _checkForColumn(controller: 'startTime' | 'endTime') {
    let value = this.form.controls[controller].value;
    if (value.length === 3 && value.indexOf(':') === -1) {
      value = value.slice(0, 2) + ':' + value.slice(2);
      this.form.patchValue({ [controller]: value }, { emitEvent: false });
    }
  }

  private _dateFilter(date: Date | null): boolean {
    if (!date) {
      return false; // Handle invalid dates
    }
    const dateTime = date.getTime();
    let prevDate: Date | undefined;
    for (let i = this.dayNumber - 1; i >= 0 && !prevDate; i--) {
      prevDate = this.bridge.getDayFromMap(i);
    }
    let nextDate: Date | undefined;
    for (let i = this.dayNumber + 1; i <= this.bridge.getDaysLength() && !nextDate; i++) {
      nextDate = this.bridge.getDayFromMap(i);
    }
    if (prevDate && nextDate) {
      return prevDate.getTime() < dateTime && nextDate.getTime() > dateTime;
    }
    if (prevDate && !nextDate) {
      return prevDate.getTime() < dateTime;
    }
    if (!nextDate) {
      return this.today.getTime() <= dateTime;
    }
    if (nextDate) {
      return this.today.getTime() <= dateTime && nextDate.getTime() > dateTime;
    }
  }

  private _updateTimeIndex(startTime: string, endTime: string): void {
    if (this._timeArr.indexOf(endTime) < 0) {
      this._indexEndTime = this._lowerTimeLimit - 1;
    } else {
      this._indexEndTime = this._timeArr.indexOf(endTime);
    }

    if (this._timeArr.slice(this._upperTimeLimit).indexOf(startTime) < 0) {
      this._indexStartTime = this._upperTimeLimit + 1;
    } else {
      this._indexStartTime = this._timeArr.indexOf(startTime) + 1;
    }
  }

  private _filterAutoOptions(value: string, startPosition: number, endPosition: number) {
    const filtered = this._timeArr.slice(startPosition, endPosition).filter((time) => time.includes(value));
    return filtered.length >= 2 ? filtered : this._timeArr.slice(startPosition, endPosition);
  }

  private _initialStartTime(): string {
    const today = new Date();
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();
    if (currentMinute - 20 < 0) {
      return `${currentHour > 9 ? currentHour : '0' + currentHour}:30`;
    }
    const nextHour = currentHour + 1;
    return `${nextHour > 9 ? nextHour : '0' + nextHour}:00`;
  }

  private _checkIsCurrentDate(value: Date): boolean {
    const curDay = new Date().toDateString();
    const selectDay = new Date(value).toDateString();
    return curDay === selectDay;
  }
}
