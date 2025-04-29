import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { IMask } from 'angular-imask';
import moment from 'moment';
import 'moment/locale/uk';
import { LanguageService } from 'src/app/shared/i18n/language.service';
import { MomentDateAdapter } from 'src/app/shared/services/moment-date-adapter';
import { Subject, takeUntil } from 'rxjs';
import { dateFormatValidator } from '../../../validators/event-custom-validators';

export const MY_FORMATS = {
  parse: {
    dateInput: ['DD MMM, YYYY', 'DD.MM.YYYY', 'MMM DD, YYYY', 'MM/DD/YYYY']
  },
  display: {
    dateInput: 'LL',
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
export class DateTimeComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() daysForm: FormArray;
  @Input() dayNumber: number;
  @Input() dayFormGroup: AbstractControl;
  dayForm: FormGroup;
  startOptionsArr: string[];
  endOptionsArr: string[];
  dateFormat: string;
  private prevStartLength: number;
  private prevEndLength: number;
  private _timeArr: string[] = [];
  private _upperTimeLimit = 0;
  private prevTimeValue: Array<string>;
  private initialStartTime: string;
  private startTimeMask: any;
  private endTimeMask: any;
  private $destroy: Subject<boolean> = new Subject();
  timeMask = {
    mask: 'HH:MM',
    blocks: {
      HH: {
        mask: IMask.MaskedRange,
        from: 0,
        to: 23,
        maxLength: 2
      },
      MM: {
        mask: IMask.MaskedRange,
        from: 0,
        to: 59,
        maxLength: 2
      }
    }
  };

  @ViewChild('startTimeRef') startTimeRef: ElementRef;
  @ViewChild('endTimeRef') endTimeRef: ElementRef;

  mask = IMask.InputMask<any>;
  constructor(
    private ls: LanguageService,
    private adapter: DateAdapter<any>
  ) {}

  get startDate() {
    return this.dayForm.get('startDate');
  }

  get finishDate() {
    return this.dayForm.get('finishDate');
  }

  get day() {
    return this.dayForm.get('day');
  }

  get startTime() {
    return this.dayForm.get('startTime');
  }

  get finishTime() {
    return this.dayForm.get('finishTime');
  }

  get allDay() {
    return this.dayForm.get('allDay');
  }

  get minDate() {
    return this.dayForm.get('minDate').value;
  }

  get maxDate() {
    return this.dayForm.get('maxDate').value;
  }
  ngOnInit() {
    moment.locale('uk');
    this.dayForm = this.dayFormGroup as FormGroup;
    this._fillTimeArray();
    this.initialStartTime = this._initialStartTime();
    this._upperTimeLimit = this._timeArr.indexOf(this.initialStartTime);
    this._setArrTime();
    this.ls
      .getCurrentLangObs()
      .pipe(takeUntil(this.$destroy))
      .subscribe((lang) => {
        const locale = lang !== 'ua' ? 'en-GB' : 'uk-UA';
        this.dateFormat = lang !== 'ua' ? 'MMDDYYYY' : 'DDMMYYYY';
        this.adapter.setLocale(locale);
      });
    this.startTime.valueChanges.pipe(takeUntil(this.$destroy)).subscribe((value: string) => {
      this._handleTimeChange(value, 'start');
    });

    this.finishTime.valueChanges.pipe(takeUntil(this.$destroy)).subscribe((value: string) => {
      this._handleTimeChange(value, 'end');
    });

    // Subscribe to date value changes
    this.day.valueChanges.pipe(takeUntil(this.$destroy)).subscribe((newDate) => {
      if (!newDate) {
        return;
      }
      const newStartDate = new Date(newDate.toDate());
      newStartDate.setHours(this.startDate.value.getHours(), this.startDate.value.getMinutes(), 0, 0);

      const newFinishDate = new Date(newDate.toDate());
      newFinishDate.setHours(this.finishDate.value.getHours(), this.finishDate.value.getMinutes(), 0, 0);

      this.startDate.setValue(newStartDate, { emitEvent: false });
      this.finishDate.setValue(newFinishDate, { emitEvent: false });

      this._updateNeighboringDates();
      this.day.setErrors(this.getDateErrors(newDate));
    });
  }

  ngAfterViewInit() {
    this.startTimeMask = IMask(this.startTimeRef.nativeElement, this.timeMask);
    this.endTimeMask = IMask(this.endTimeRef.nativeElement, this.timeMask);
    this.day.addValidators(dateFormatValidator());
    this.day.updateValueAndValidity();
  }

  getDateErrors(date: moment.Moment | null) {
    if (!date) {
      return { dateIncorrect: true };
    }

    if (date.isBefore(moment(), 'day')) {
      return { dateInPast: true };
    }

    return null;
  }

  private _updateNeighboringDates(): void {
    if (this.dayNumber > 0) {
      const prevFormGroup = this.daysForm.at(this.dayNumber - 1) as FormGroup;
      if (prevFormGroup) {
        prevFormGroup.patchValue({
          maxDate: new Date(this.day.value._d.getTime() - 24 * 60 * 60 * 1000)
        });
      }
    }

    if (this.dayNumber < this.daysForm.length - 1) {
      const nextFormGroup = this.daysForm.at(this.dayNumber + 1) as FormGroup;
      if (nextFormGroup) {
        nextFormGroup.patchValue({
          minDate: new Date(this.day.value._d.getTime() + 24 * 60 * 60 * 1000)
        });
      }
    }
  }

  toggleAllDay(): void {
    if (this.allDay.value) {
      this.prevTimeValue = [this.startTime.value, this.finishTime.value];
      this.startTime.setValue(this.startOptionsArr[0]);
      this.finishTime.setValue(this.endOptionsArr[this.endOptionsArr.length - 1]);
      this.setTimeForDate(this.startOptionsArr[0], 'start');
      this.setTimeForDate(this.endOptionsArr[this.endOptionsArr.length - 1], 'end');
    } else {
      this.startTime.setValue(this.prevTimeValue[0]);
      this.finishTime.setValue(this.prevTimeValue[1]);
      this.setTimeForDate(this.prevTimeValue[0], 'start');
      this.setTimeForDate(this.prevTimeValue[1], 'end');
    }
  }

  private setTimeForDate(time: string, type: 'start' | 'end'): void {
    const [hour, minute] = time.split(':').map(Number);
    const currentDate = new Date(this.day.value);
    const control = type === 'start' ? this.startDate : this.finishDate;
    currentDate.setHours(hour, minute, 0, 0);
    control.setValue(currentDate, { emitEvent: false });
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
  }

  private _handleTimeChange(value: string, type: 'start' | 'end'): void {
    if (Number(value[value.length - 1]) || value[2] === ':' || !value.trim().length) {
      const initialStartTime = this.initialStartTime;
      const startTime = this.startTime.value ? this.startTime.value : null;
      const endTime = this.finishTime.value ? this.finishTime.value : null;
      if (value.length === 2 && !value.includes(':') && value.length >= (type === 'start' ? this.prevStartLength : this.prevEndLength)) {
        value += ':';
        const control = type === 'start' ? this.startTime : this.finishTime;
        control.setValue(value, { emitEvent: false });
      }

      if (type === 'start') {
        this.prevStartLength = value.length;
      } else {
        this.prevEndLength = value.length;
      }

      if (value.length === 5) {
        if (type === 'start') {
          if (value >= initialStartTime && (endTime === null || value < endTime)) {
            this.endOptionsArr = this._timeArr.slice(this._timeArr.indexOf(value) + 1);
            this.setTimeForDate(value, 'start');
          } else {
            this.startTime.setValue('', { emitEvent: false });
          }
        } else {
          if (value > initialStartTime && (startTime === null || value > startTime)) {
            this.startOptionsArr = this._timeArr.slice(this._timeArr.indexOf(this.initialStartTime), this._timeArr.indexOf(value));
            this.setTimeForDate(value, 'end');
          } else {
            this.finishTime.setValue('', { emitEvent: false });
          }
        }
      } else {
        if (type === 'start') {
          this.startOptionsArr = this._timeArr.filter((option) => {
            return (option.startsWith(value) || !startTime) && option >= initialStartTime && (!endTime || option < endTime);
          });
        } else {
          this.endOptionsArr = this._timeArr.filter((option) => {
            return (option.startsWith(value) || !endTime) && option >= initialStartTime && (!startTime || option > startTime);
          });
        }
      }

      if (!startTime && !endTime) {
        this._setArrTime();
      }

      if (type === 'start') {
        this.startTimeMask.updateValue();
      } else {
        this.endTimeMask.updateValue();
      }
    }
  }

  private _setArrTime(): void {
    this.startOptionsArr = this._timeArr.slice(
      this.startTime.value ? this._timeArr.indexOf(this.startTime.value) : this._upperTimeLimit,
      this.finishTime.value ? this._timeArr.indexOf(this.finishTime.value) : this._timeArr.length - 1
    );
    this.endOptionsArr = this._timeArr.slice(
      this.startTime.value ? this._timeArr.indexOf(this.startTime.value) + 1 : this._upperTimeLimit + 1
    );
  }

  private _initialStartTime(): string {
    const today = new Date();
    if (this.startDate?.value.getDate() === today.getDate()) {
      const currentHour = today.getHours();
      const currentMinute = today.getMinutes();
      if (currentMinute - 20 < 0) {
        return `${currentHour > 9 ? currentHour : '0' + currentHour}:30`;
      }
      const nextHour = currentHour + 1;
      return `${nextHour > 9 ? nextHour : '0' + nextHour}:00`;
    } else {
      return '00:00';
    }
  }

  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.complete();
  }
}
