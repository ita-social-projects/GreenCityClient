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
import { HabitAssignInterface } from '@global-user/components/habit/models/interfaces/habit-assign.interface';

@Component({
  selector: 'app-calendar-week',
  templateUrl: './calendar-week.component.html',
  styleUrls: ['./calendar-week.component.scss']
})
export class CalendarWeekComponent extends CalendarBaseComponent implements OnInit, OnDestroy {
  language: string;
  private destroyed$: ReplaySubject<any> = new ReplaySubject<any>(1);
  currentDate = new Date();
  weekTitle: string;
  weekDates: CalendarWeekInterface[];

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

  buildWeekCalendar(firstWeekDay: Date): void {
    if (!this.language) {
      console.error('Мова ще не ініціалізована');
      return;
    }

    const year = firstWeekDay.getFullYear();
    const month = firstWeekDay.getMonth();
    const day = firstWeekDay.getDate();
    this.weekDates = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(year, month, day + i);
      this.weekDates.push({
        date,
        dayName: this.setDayName(date),
        isCurrent: this.isCurrentDate(date),
        hasHabitsInProgress: false,
        areHabitsDone: this.checkIfHabitDone(date),
        isMissed: this.checkIfMissedDay(date),
        numberOfDate: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear()
      });
    }
  }

  private checkIfMissedDay(date: Date): boolean {
    const currentDate = new Date();
    const eightDaysAgo = new Date(currentDate);
    eightDaysAgo.setDate(currentDate.getDate() - 8);

    return date < eightDaysAgo;
  }

  getHabitForDate(date: Date): HabitAssignInterface | undefined {
    const dateString = date.toISOString().split('T')[0]; // Формат дати "YYYY-MM-DD"

    if (!this.habitAssignService.habitsFromDashBoard) {
      console.error('habitsFromDashBoard не ініціалізовано');
      return undefined;
    }

    // Пошук звички за датою
    const habitForDate = this.habitAssignService.habitsFromDashBoard.find((habit) => {
      const enrollDateString = new Date(habit.enrollDate).toISOString().split('T')[0];
      return enrollDateString === dateString;
    });

    // Якщо знайдена звичка не відповідає типу HabitAssignInterface, повертаємо undefined
    if (!habitForDate) {
      return undefined;
    }

    // Перевіряємо, чи всі необхідні властивості присутні
    const isValidHabit = 'id' in habitForDate && 'status' in habitForDate && 'createDateTime' in habitForDate && 'habit' in habitForDate;

    if (!isValidHabit) {
      console.error("Знайдений об'єкт не відповідає типу HabitAssignInterface");
      return undefined;
    }

    // Повертаємо знайдену звичку, приведену до потрібного типу
    return habitForDate as HabitAssignInterface;
  }

  checkIfHabitDone(date: Date): boolean {
    const habit = this.getHabitForDate(date);
    return habit?.habitStatusCalendarDtoList?.some((status) => status.enrollDate === date.toISOString().split('T')[0]) ?? false;
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

  buildWeekCalendarTitle(): void {
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

  changeWeek(isNext: boolean): void {
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

  showHabits(event, dayItem: CalendarWeekInterface) {
    if (this.checkCanOpenPopup(dayItem)) {
      this.openDialogDayHabits(event, false, this.toCalendarMonth(dayItem));
    }
  }

  toCalendarMonth(weekItem: CalendarWeekInterface): CalendarInterface {
    const date = weekItem.date;
    return {
      ...weekItem,
      numberOfDate: date.getDate(),
      year: date.getFullYear(),
      month: date.getMonth(),
      firstDay: new Date(date.getFullYear(), date.getMonth(), 1).getDay(),
      totalDaysInMonth: new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
      isCurrentDayActive: weekItem.isCurrent
    };
  }
}
