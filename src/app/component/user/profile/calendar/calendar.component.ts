import { Component, OnDestroy, OnInit } from '@angular/core';
import { CalendarInterface } from './calendar-interface';
import { calendarImage } from '../../../../../assets/img/profile/calendar/calendar-image';
import { TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy {
  private langChangeSub: Subscription;
  private defaultTranslateSub: Subscription;
  private calendarImages = calendarImage;
  private monthAndYearName: string;
  private daysNameLong: Array<string> = [];
  private months: Array<string> = [];
  private currentMonth = new Date().getMonth();
  private currentYear = new Date().getFullYear();
  private calendarDay: Array<CalendarInterface> = [];

  private calendar: CalendarInterface = {
    date: new Date(),
    numberOfDate: 0,
    year: 0,
    month: 0,
    firstDay: 0,
    dayName: '',
    totalDaysInMonth: 0,
    isHabitsTracked: false,
    isCurrentDayActive: false
  };

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    this.bindDefaultTranslate();
    this.subscribeToLangChange();
    this.buildCalendar();
  }

  private getDaysInMonth(iMonth, iYear): number {
    return new Date(iYear, iMonth + 1, 0).getDate();
  }

  private subscribeToLangChange(): void {
    this.langChangeSub = this.translate.onDefaultLangChange.subscribe((res) => {
      const translations = res.translations.profile.calendar;
      this.daysNameLong = translations.days;
      this.months = translations.months;
      this.monthAndYearName = this.months[this.currentMonth] + ' ' + this.currentYear;
    })
  }

  private bindDefaultTranslate(): void {
    this.defaultTranslateSub = this.translate.getTranslation(this.translate.getDefaultLang()).subscribe((res) => {
      let translations = res.profile.calendar;
      this.daysNameLong = translations.days;
      this.months = translations.months;
      this.monthAndYearName = this.months[this.currentMonth] + ' ' + this.currentYear;
    });
  }

  private buildCalendar(): void {
    this.calculateCalendarModel(this.currentMonth, this.currentYear);
    this.bindCalendarModel();
    this.setEmptyDays();
    this.isCurrentDayActive();
  }

  private calculateCalendarModel(month: number, year: number): void {
    this.calendar.month = month;
    this.calendar.year = year;
    this.calendar.firstDay = (new Date(year, month, 0)).getDay();
    this.calendar.totalDaysInMonth = this.getDaysInMonth(month, year);
    this.monthAndYearName = this.months[month] + ' ' + year;
  }

  private bindCalendarModel(): void {
    for (let i = 1; i <= this.calendar.totalDaysInMonth; i++) {
      this.calendarDay.push(this.getMonthTemplate(i));
    }
  }

  private setEmptyDays(): void {
    for (let i = 1; i <= this.calendar.firstDay; i++) {
      this.calendarDay.unshift(this.getMonthTemplate());
    }
  }

  private getMonthTemplate(days?: number): CalendarInterface {
    return {
      numberOfDate : days || '',
      date : new Date(),
      month : this.calendar.month,
      year : this.calendar.year,
      firstDay : this.calendar.firstDay,
      totalDaysInMonth : this.calendar.totalDaysInMonth,
      dayName : (new Date(this.calendar.year, this.calendar.month, days).toDateString().substring(0, 3)) || '',
      isHabitsTracked: false,
      isCurrentDayActive: false
    }
  }

  private isCurrentDayActive(): void {
    this.calendarDay.map(el =>
      (el.date.getDate() === el.numberOfDate && el.date.getMonth() === el.month) ?
        el.isCurrentDayActive = true : el.isCurrentDayActive
    );
  }

  private nextMonth(): void {
    this.currentYear = (this.currentMonth === 11) ? this.currentYear + 1 : this.currentYear;
    this.currentMonth = (this.currentMonth + 1) % 12;
    this.calendarDay = [];
    this.buildCalendar();
  }

  private previousMonth(): void {
    this.currentYear = (this.currentMonth === 0) ? this.currentYear - 1 : this.currentYear;
    this.currentMonth = (this.currentMonth === 0) ? 11 : this.currentMonth - 1;
    this.calendarDay = [];
    this.buildCalendar();
  }

  ngOnDestroy() {
    this.langChangeSub.unsubscribe();
    this.defaultTranslateSub.unsubscribe();
  }
}
