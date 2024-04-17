import { Component, OnInit, OnDestroy } from '@angular/core';
import { CalendarBaseComponent } from '@shared/components/calendar-base/calendar-base.component';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TranslateService } from '@ngx-translate/core';
import { HabitAssignService } from '@global-service/habit-assign/habit-assign.service';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CalendarWeekInterface } from '../calendar-week/calendar-week-interface';
import { CalendarInterface } from '../calendar-interface';
import { MatDialog } from '@angular/material/dialog';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Locale } from 'src/app/main/i18n/Language';

@Component({
  selector: 'app-calendar-week',
  templateUrl: './calendar-week.component.html',
  styleUrls: ['./calendar-week.component.scss']
})
export class CalendarWeekComponent extends CalendarBaseComponent implements OnInit, OnDestroy {
  public language: string;
  private destroyed$: ReplaySubject<any> = new ReplaySubject<any>(1);
  public currentDate = new Date();
  public weekTitle: string;
  public weekDates: CalendarWeekInterface[];

  constructor(
    private localStorageService: LocalStorageService,
    public habitAssignService: HabitAssignService,
    public translate: TranslateService,
    public languageService: LanguageService,
    public dialog: MatDialog,
    public breakpointObserver: BreakpointObserver
  ) {
    super(translate, languageService, habitAssignService, dialog, breakpointObserver);
  }

  ngOnInit() {
    this.buildWeekCalendar(this.getFirstWeekDate());
    this.getLanguage();
    this.getUserHabits(false, this.weekDates);
    this.getAllAssignedHabbits();
  }

  private buildWeekCalendar(firstWeekDay: Date): void {
    const year = firstWeekDay.getFullYear();
    const month = firstWeekDay.getMonth();
    const day = firstWeekDay.getDate();
    this.weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(year, month, day + i);
      const isCurrent =
        date.getFullYear() === this.currentDate.getFullYear() &&
        date.getMonth() === this.currentDate.getMonth() &&
        date.getDate() === this.currentDate.getDate();
      this.weekDates.push({
        date,
        dayName: this.language ? this.setDayName(date) : '',
        isCurrent,
        hasHabitsInProgress: false,
        areHabitsDone: false
      });
    }
  }

  private getFirstWeekDate(): Date {
    const day =
      this.currentDate.getDay() === 0 ? this.currentDate.getDate() - 6 : this.currentDate.getDate() - this.currentDate.getDay() + 1;
    const month = this.currentDate.getMonth();
    const year = this.currentDate.getFullYear();
    return new Date(year, month, day);
  }

  private setDayName(source: Date): string {
    return source.toLocaleDateString(this.language === 'ua' ? Locale.UA : Locale.EN, { weekday: 'short' });
  }

  private getLanguage(): void {
    this.localStorageService.languageBehaviourSubject.pipe(takeUntil(this.destroyed$)).subscribe((language) => {
      this.language = language;
      this.weekDates.forEach((dateObj) => (dateObj.dayName = this.setDayName(dateObj.date)));
      this.buildWeekCalendarTitle();
    });
  }

  public buildWeekCalendarTitle(): void {
    const language = this.language === 'ua' ? Locale.UA : Locale.EN;
    const firstDay = this.weekDates[0].date.getDate();
    const lastDay = this.weekDates[6].date.getDate();
    const firstDayMonth = this.weekDates[0].date.toLocaleDateString(language, { month: 'long' });
    const lastDayMonth = this.weekDates[6].date.toLocaleDateString(language, { month: 'long' });
    const firstDayYear = this.weekDates[0].date.getFullYear();
    const lastDayYear = this.weekDates[6].date.getFullYear();
    const weekBetweenTwoYears = `${firstDay} ${firstDayMonth} ${firstDayYear} - ${lastDay} ${lastDayMonth} ${lastDayYear}`;
    const weekBetweenTwoMonth = `${firstDay} ${firstDayMonth} - ${lastDay} ${lastDayMonth} ${firstDayYear}`;
    const weekInOneMonth = `${firstDay} - ${lastDay} ${firstDayMonth} ${firstDayYear}`;
    const isWeekBetweenTwoMonth = firstDayYear === lastDayYear ? weekBetweenTwoMonth : weekBetweenTwoYears;
    this.weekTitle = firstDayMonth === lastDayMonth ? weekInOneMonth : isWeekBetweenTwoMonth;
  }

  public changeWeek(isNext: boolean): void {
    const year = this.weekDates[0].date.getFullYear();
    const month = this.weekDates[0].date.getMonth();
    const day = this.weekDates[0].date.getDate() + (isNext ? 7 : -7);
    const firstWeekDate = new Date(year, month, day);
    this.buildWeekCalendar(firstWeekDate);
    this.buildWeekCalendarTitle();
    this.getUserHabits(false, this.weekDates);
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public showHabits(event, dayItem: CalendarInterface) {
    if (this.checkCanOpenPopup(dayItem)) {
      this.openDialogDayHabits(event, false, dayItem);
    }
  }
}
