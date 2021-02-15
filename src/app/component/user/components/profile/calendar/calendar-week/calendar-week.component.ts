import { HabitAssignService } from './../../../../../../service/habit-assign/habit-assign.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { CalendarWeekInterface } from '../calendar-week/calendar-week-interface';
import { HabitAssignInterface, HabitStatusCalendarListInterface } from 'src/app/interface/habit/habit-assign.interface';
import { calendarImage } from '../calendar-image';

@Component({
  selector: 'app-calendar-week',
  templateUrl: './calendar-week.component.html',
  styleUrls: ['./calendar-week.component.scss']
})
export class CalendarWeekComponent implements OnInit, OnDestroy {
  public calendarImages = calendarImage;
  private language: string;
  private destroyed$: ReplaySubject<any> = new ReplaySubject<any>(1);
  public currentDate = new Date();
  public weekTitle: string;
  public weekDates: CalendarWeekInterface[];

  constructor(
    private localStorageService: LocalStorageService,
    private habitAssignService: HabitAssignService
  ) {}

  ngOnInit() {
    this.buildWeekCalendar(this.getFirstWeekDate());
    this.getLanguage();
    this.markCalendarDays();
  }

  private buildWeekCalendar(firstWeekDay: Date): void {
    const year = firstWeekDay.getFullYear();
    const month = firstWeekDay.getMonth();
    const day = firstWeekDay.getDate();
    this.weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(year, month, day + i);
      const isCurrent = date.getFullYear() === this.currentDate.getFullYear()
        && date.getMonth() === this.currentDate.getMonth()
        && date.getDate() === this.currentDate.getDate();
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
    const day = this.currentDate.getDay() === 0
      ? this.currentDate.getDay() - 6
      : this.currentDate.getDate() - this.currentDate.getDay() + 1;
    const month = this.currentDate.getMonth();
    const year = this.currentDate.getFullYear();
    return new Date(year, month, day);
  }

  private setDayName(source: Date): string {
    return source.toLocaleDateString(this.language, { weekday: 'short'});
  }

  private getLanguage(): void {
    this.localStorageService.languageBehaviourSubject
      .pipe(takeUntil(this.destroyed$))
      .subscribe(language => {
        this.language = language;
        this.weekDates.forEach(dateObj => dateObj.dayName = this.setDayName(dateObj.date));
        this.buildWeekCalendarTitle();
      });
  }

  public buildWeekCalendarTitle(): void {
    const firstDay = this.weekDates[0].date.getDate();
    const lastDay = this.weekDates[6].date.getDate();
    const firstDayMonth = this.weekDates[0].date.toLocaleDateString(this.language, { month: 'long'});
    const lastDayMonth = this.weekDates[6].date.toLocaleDateString(this.language, { month: 'long'});
    const firstDayYear = this.weekDates[0].date.getFullYear();
    const lastDayYear = this.weekDates[6].date.getFullYear();
    this.weekTitle = firstDayMonth === lastDayMonth
      ? `${firstDay} - ${lastDay} ${firstDayMonth} ${firstDayYear}`
      : firstDayYear === lastDayYear
        ? `${firstDay} ${firstDayMonth} - ${lastDay} ${lastDayMonth} ${firstDayYear}`
        : `${firstDay} ${firstDayMonth} ${firstDayYear} - ${lastDay} ${lastDayMonth} ${lastDayYear}`;
  }

  public changeWeek(isNext: boolean): void {
    const year = this.weekDates[0].date.getFullYear();
    const month = this.weekDates[0].date.getMonth();
    const day = this.weekDates[0].date.getDate() + (isNext ? 7 : - 7);
    const firstWeekDate = new Date(year, month, day);
    this.buildWeekCalendar(firstWeekDate);
    this.buildWeekCalendarTitle();
    this.markCalendarDays();
  }

  public formatDate(date: Date) {
    return `${date.getFullYear()}-${ date.getMonth() + 1 < 10 ?
      '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate() < 10 ?
      '0' + date.getDate() : date.getDate()}`;
  }

  public markCalendarDays() {
    this.weekDates.forEach((day: CalendarWeekInterface) => {
      const date = this.formatDate(day.date);
      if (new Date().setHours(0, 0, 0, 0) >= new Date(date).setHours(0, 0, 0, 0)) {
        this.habitAssignService.getHabitAssignByDate(date).pipe(
          take(1)
        ).subscribe((habits: HabitAssignInterface[]) => {
          day.hasHabitsInProgress = habits.length > 0;
          day.areHabitsDone = habits.every((habit: HabitAssignInterface) => {
            return habit.habitStatusCalendarDtoList.some((habitEnrollDate: HabitStatusCalendarListInterface) => {
              if (habitEnrollDate.enrollDate === date) {
                return true;
              }
              return false;
            });
          });
        });
      }
    });
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
