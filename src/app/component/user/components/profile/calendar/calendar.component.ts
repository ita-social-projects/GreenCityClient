import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { CalendarInterface } from './calendar-interface';
import { calendarImage } from './calendar-image';
import { LanguageService } from '@language-service/language.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy {
  public calendarImages = calendarImage;
  public monthAndYearName: string;
  public yearData: number;
  public activeMonth: string;
  public monthView = true;
  public daysName: Array<string> = [];
  public months: Array<string> = [];
  public monthsShort: Array<string> = [];
  public monthsCalendar: Array<string> = [];
  public calendarDay: Array<CalendarInterface> = [];
  public currentDayName: string;
  public language: string;
  public currentMonth = new Date().getMonth();
  public currentYear = new Date().getFullYear();

  private langChangeSub: Subscription;
  private defaultTranslateSub: Subscription;

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

  constructor(private translate: TranslateService,
              private languageService: LanguageService) {}

  ngOnInit() {
    this.bindDefaultTranslate();
    this.subscribeToLangChange();
    this.buildCalendar();
  }

  public toggleCalendarView(): void {
    this.monthView = !this.monthView;
    this.yearData = this.currentYear;
  }

  public getDaysInMonth(iMonth, iYear): number {
    return new Date(iYear, iMonth + 1, 0).getDate();
  }

  public subscribeToLangChange(): void {
    this.langChangeSub = this.translate.onDefaultLangChange.subscribe((res) => {
      const translations = res.translations.profile.calendar;
      this.daysName = translations.days;
      this.months = translations.months;
      this.monthsShort = translations.monthsShort;
      this.monthAndYearName = `${this.months[this.currentMonth]} ${this.currentYear}`;
      this.markCurrentDayOfWeek();
      this.buildMonthCalendar(this.monthsShort);
    });
  }

  public bindDefaultTranslate(): void {
    this.defaultTranslateSub = this.translate.getTranslation(this.translate.getDefaultLang())
      .subscribe((res) => {
        const translations = res.profile.calendar;
        this.daysName = translations.days;
        this.months = translations.months;
        this.monthsShort = translations.monthsShort;
        this.monthAndYearName = `${this.months[this.currentMonth]} ${this.currentYear}`;
        this.markCurrentDayOfWeek();
        this.buildMonthCalendar(this.monthsShort);
      });
  }

  public buildCalendar(): void {
    this.calculateCalendarModel(this.currentMonth, this.currentYear);
    this.bindCalendarModel();
    this.setEmptyDays();
    this.isCurrentDayActive();
  }

  public calculateCalendarModel(month: number, year: number): void {
    this.calendar.month = month;
    this.calendar.year = year;
    this.calendar.firstDay = (new Date(year, month, 0)).getDay();
    this.calendar.totalDaysInMonth = this.getDaysInMonth(month, year);
    this.monthAndYearName = `${this.months[month]} ${year}`;
  }

  public bindCalendarModel(): void {
    const end = this.calendar.totalDaysInMonth;
    const calendarDays = Array.from({ length: end },
      (_, i) =>
        this.getMonthTemplate(i + 1));
    this.calendarDay = [...this.calendarDay, ...calendarDays];
  }

  public setEmptyDays(): void {
    const end = this.calendar.firstDay;
    const emptyDays = Array.from({ length: end }, () => this.getMonthTemplate());
    this.calendarDay = [...emptyDays, ...this.calendarDay];

  }

  public getMonthTemplate(days?: number): CalendarInterface {
    return {
      numberOfDate : days || '',
      date : new Date(),
      month : this.calendar.month,
      year : this.calendar.year,
      firstDay : this.calendar.firstDay,
      totalDaysInMonth : this.calendar.totalDaysInMonth,
      dayName : (new Date(this.calendar.year, this.calendar.month, days)
        .toDateString()
        .substring(0, 3)) || '',
      isHabitsTracked: false,
      isCurrentDayActive: false
    };
  }

  public isCurrentDayActive(): void {
    this.calendarDay.map(el => el.isCurrentDayActive =
      (el.date.getDate() === el.numberOfDate
        && el.date.getMonth() === el.month
        && el.date.getFullYear() === el.year)
    );
  }

  public markCurrentDayOfWeek(): void {
    const option = { weekday: 'short' };
    this.language = this.languageService.getCurrentLanguage();
    this.calendarDay.find(el => {
        if (el.isCurrentDayActive &&
          el.date.getMonth() === el.month &&
          el.date.getFullYear() === el.year) {
            const dayName = (new Date(el.year, el.month, +el.numberOfDate)
                .toLocaleDateString(this.language, option));
            this.currentDayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);
        }
    });
  }

  public nextMonth(): void {
    this.currentYear = (this.currentMonth === 11) ? this.currentYear + 1 : this.currentYear;
    this.currentMonth = (this.currentMonth + 1) % 12;
    this.calendarDay = [];
    this.buildCalendar();
  }

  public previousMonth(): void {
    this.currentYear = (this.currentMonth === 0) ? this.currentYear - 1 : this.currentYear;
    this.currentMonth = (this.currentMonth === 0) ? 11 : this.currentMonth - 1;
    this.calendarDay = [];
    this.buildCalendar();
  }

  public buildMonthCalendar(months): void {
    this.yearData = this.currentYear;
    this.monthsCalendar = months;
    this.isActiveMonth();
  }

  public isActiveMonth(): void {
    this.activeMonth = this.calendarDay.filter(item => item.isCurrentDayActive)
      .map(el => this.monthsShort[el.month])
      .toString();
  }

  public previousYear(): void {
    this.yearData = this.yearData - 1;
  }

  public nextYear(): void {
    this.yearData = this.yearData + 1;
  }

  public buildSelectedMonthCalendar(month): void {
    this.monthView = true;
    this.currentMonth = this.monthsShort.indexOf(month);
    this.currentYear = this.yearData;
    this.calendarDay = [];
    this.buildCalendar();
  }

  ngOnDestroy() {
    this.langChangeSub.unsubscribe();
    this.defaultTranslateSub.unsubscribe();
  }
}
