import { Component, OnInit, OnDestroy } from '@angular/core';
import { CalendarWeekInterface  } from '../calendar-week/calendar-week-interface';
import { calendarImage } from '../calendar-image';
import { LanguageService } from '@language-service/language.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-calendar-week',
  templateUrl: './calendar-week.component.html',
  styleUrls: ['./calendar-week.component.scss']
})
export class CalendarWeekComponent implements OnInit, OnDestroy {
  public calendarImages = calendarImage;
  public monthAndYearName: string;
  public maxDaysInWeek = 6;
  public daysName: Array<string> = [];
  public months: Array<string> = [];
  public monthsShort: Array<string> = [];
  public calendarDay: Array<CalendarWeekInterface> = [];
  public currentDayName: string;
  public language: string;
  public currentMonth = new Date().getMonth();
  public currentYear = new Date().getFullYear();
  public currentDay = new Date().getDate();

  private langChangeSub: Subscription;
  private defaultTranslateSub: Subscription;

  private calendar: CalendarWeekInterface = {
    date: new Date(),
    numberOfDate: 0,
    year: 0,
    month: 0,
    firstDay: 0,
    lastDayInWeek: 7,
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

  public getDaysInMonth(iMonth, iYear): number {
    return new Date(iYear, iMonth + 1, 0).getDate();
  }

  public subscribeToLangChange(): void {
    this.langChangeSub = this.translate.onDefaultLangChange.subscribe((res) => {
      const translations = res.translations.profile.calendar;
      this.daysName = translations.days;
      this.months = translations.months;
      this.monthsShort = translations.monthsShort;
      this.monthAndYearName = `${this.currentDay} - ${this.currentDay + this.maxDaysInWeek}
${this.months[this.currentMonth]} ${this.currentYear}`;
      this.markCurrentDayOfWeek();
    });
  }

  public bindDefaultTranslate(): void {
    this.defaultTranslateSub = this.translate.getTranslation(this.translate.getDefaultLang())
      .subscribe((res) => {
        const translations = res.profile.calendar;
        this.daysName = translations.days;
        this.months = translations.months;
        this.monthsShort = translations.monthsShort;
        this.monthAndYearName = `${this.currentDay} - ${this.currentDay + this.maxDaysInWeek}
${this.months[this.currentMonth]} ${this.currentYear}`;
        this.markCurrentDayOfWeek();
      });
  }

  public buildCalendar(): void {
    this.calculateCalendarModel(this.currentDay, this.currentMonth, this.currentYear);
    this.bindCalendarModel();
    this.isCurrentDayActive();
  }

  public calculateCalendarModel(day: number, month: number, year: number): void {
    this.calendar.month = month;
    this.calendar.year = year;
    this.calendar.firstDay = (new Date(year, month, 0)).getDay();
    this.calendar.lastDayInWeek = (this.calendar.firstDay + this.maxDaysInWeek);
    this.calendar.totalDaysInMonth = this.getDaysInMonth(month, year);
    this.monthAndYearName = `${this.currentDay} - ${this.currentDay + this.maxDaysInWeek}
${this.months[this.currentMonth]} ${this.currentYear}`;
  }

  public bindCalendarModel(): void {
    const end = 7;
    const calendarDays = Array.from({ length: end },
      (_, i) =>
        this.getWeekTemplate(i + this.currentDay));
    this.calendarDay = [...this.calendarDay, ...calendarDays];
  }

  public getWeekTemplate(days?: number): CalendarWeekInterface {
    return {
      numberOfDate : days || '',
      date : new Date(),
      month : this.calendar.month,
      year : this.calendar.year,
      firstDay : this.calendar.firstDay,
      lastDayInWeek: this.calendar.lastDayInWeek,
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
      if (
        el.isCurrentDayActive
        && el.date.getMonth() === el.month
        && el.date.getFullYear() === el.year
      ) {
        const dayName = (new Date(el.year, el.month, +el.numberOfDate)
          .toLocaleDateString(this.language, option));
        this.currentDayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);
      }
    });
  }

  public nextWeek(): void {
    if (this.currentDay === this.calendar.totalDaysInMonth) {
      this.currentMonth = this.currentMonth + 1;
      this.currentDay = 1;
    } else {
      this.currentDay = this.currentDay + 1;
      const [firstDay, ...lastDays] = this.daysName;
      this.daysName = [...lastDays, firstDay];
    }
    this.calendarDay = [];
    this.buildCalendar();
  }

  public previousWeek(): void {
    if (this.currentDay === 1) {
      this.currentMonth = this.currentMonth - 1;
      this.currentDay = this.calendar.totalDaysInMonth - this.maxDaysInWeek;
    } else {
      this.currentDay = this.currentDay - 1;
      this.daysName = [this.daysName[6], ...this.daysName.slice(0, 6)];
    }
    this.calendarDay = [];
    this.buildCalendar();
  }

  ngOnDestroy() {
    this.langChangeSub.unsubscribe();
    this.defaultTranslateSub.unsubscribe();
  }
}
