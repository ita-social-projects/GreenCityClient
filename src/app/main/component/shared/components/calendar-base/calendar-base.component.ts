import { LanguageService } from 'src/app/main/i18n/language.service';
import { Component, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HabitAssignService } from '@global-service/habit-assign/habit-assign.service';
import { Subject, Subscription } from 'rxjs';
import { finalize, takeUntil, take } from 'rxjs/operators';
import { CalendarInterface } from '@global-user/components/profile/calendar/calendar-interface';
import { calendarImage } from './calendar-image';
import { HabitsPopupComponent } from '@global-user/components/profile/calendar/habits-popup/habits-popup.component';
import { HabitPopupInterface, HabitsForDateInterface } from '@global-user/components/profile/calendar/habit-popup-interface';
import { ItemClass } from './CalendarItemStyleClasses';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Breakpoints } from 'src/app/main/config/breakpoints.constants';
import { HabitAssignInterface } from '@global-user/components/habit/models/interfaces/habit-assign.interface';
import { BaseCalendar } from '@global-user/components/profile/calendar/calendar-week/calendar-week-interface';

@Component({
  selector: 'app-calendar-base',
  template: ''
})
export class CalendarBaseComponent implements OnDestroy {
  calendarImages = calendarImage;
  monthAndYearName: string;
  yearData: number;
  activeMonth: string;
  monthView = true;
  daysName: Array<string> = [];
  months: Array<string> = [];
  monthsShort: Array<string> = [];
  monthsCalendar: Array<string> = [];
  calendarDay: Array<CalendarInterface> = [];
  currentDayName: string;
  language: string;
  currentMonth = new Date().getMonth();
  currentYear = new Date().getFullYear();
  selectedDay: Date;
  langChangeSub: Subscription;
  defaultTranslateSub: Subscription;
  private destroySub = new Subject<void>();

  calendar: CalendarInterface = {
    date: new Date(),
    numberOfDate: 0,
    year: 0,
    month: 0,
    firstDay: 0,
    dayName: '',
    totalDaysInMonth: 0,
    hasHabitsInProgress: false,
    areHabitsDone: false,
    isCurrentDayActive: false
  };

  userHabitsListByPeriod: Array<HabitsForDateInterface>;
  currentDayItem: CalendarInterface;
  isCheckedHabits: boolean;
  checkAnswer = false;
  isHabitListEditable: boolean;
  daysCanEditHabits = 7;
  allAssignedHabits: Array<Pick<HabitAssignInterface, 'id' | 'createDateTime'>>;

  constructor(
    public translate: TranslateService,
    public languageService: LanguageService,
    public habitAssignService: HabitAssignService,
    public dialog: MatDialog,
    public breakpointObserver: BreakpointObserver
  ) {}

  ngOnDestroy(): void {
    if (this.langChangeSub) {
      this.langChangeSub.unsubscribe();
    }
    if (this.defaultTranslateSub) {
      this.defaultTranslateSub.unsubscribe();
    }
    this.destroySub.next();
    this.destroySub.complete();
  }

  toggleCalendarView(): void {
    this.monthView = !this.monthView;
    this.yearData = this.currentYear;
  }

  getDaysInMonth(iMonth: number, iYear: number): number {
    return new Date(iYear, iMonth + 1, 0).getDate();
  }

  subscribeToLangChange(): void {
    this.langChangeSub = this.translate.onDefaultLangChange.subscribe((res) => {
      setTimeout(() => {
        this.setDate(res.translations.profile.calendar);
        this.getUserHabits(true, this.calendarDay);
      }, 0);
    });
  }

  private setDate(date): void {
    this.daysName = date.days;
    this.months = date.months;
    this.monthsShort = date.monthsShort;
    this.monthAndYearName = `${this.months[this.currentMonth]} ${this.currentYear}`;
    this.markCurrentDayOfWeek();
    this.buildMonthCalendar(this.monthsShort);
  }

  bindDefaultTranslate(): void {
    let lang = this.translate.getDefaultLang();
    if (!lang) {
      lang = 'en';
    }
    this.defaultTranslateSub = this.translate.getTranslation(lang).subscribe((res) => {
      this.setDate(res.profile.calendar);
    });
  }

  buildCalendar(): void {
    this.calculateCalendarModel(this.currentMonth, this.currentYear);
    this.bindCalendarModel();
    this.setEmptyDays();
    this.isCurrentDayActive();
  }

  calculateCalendarModel(month: number, year: number): void {
    this.calendar.month = month;
    this.calendar.year = year;
    this.calendar.firstDay = new Date(year, month, 0).getDay();
    this.calendar.totalDaysInMonth = this.getDaysInMonth(month, year);
    this.monthAndYearName = `${this.months[month]} ${year}`;
  }

  bindCalendarModel(): void {
    const end = this.calendar.totalDaysInMonth;
    const calendarDays = Array.from({ length: end }, (_, i) => this.getMonthTemplate(i + 1));
    this.calendarDay = [...this.calendarDay, ...calendarDays];
  }

  setEmptyDays(): void {
    const end = this.calendar.firstDay;
    const emptyDays = Array.from({ length: end }, () => this.getMonthTemplate());
    this.calendarDay = [...emptyDays, ...this.calendarDay];
  }

  getMonthTemplate(days?: number): CalendarInterface {
    return {
      numberOfDate: days,
      date: new Date(),
      month: this.calendar.month,
      year: this.calendar.year,
      firstDay: this.calendar.firstDay,
      totalDaysInMonth: this.calendar.totalDaysInMonth,
      dayName: new Date(this.calendar.year, this.calendar.month, days).toDateString().substring(0, 3) || '',
      hasHabitsInProgress: false,
      areHabitsDone: false,
      isCurrentDayActive: false
    };
  }

  isCurrentDayActive(): void {
    this.calendarDay.forEach((el) => {
      const date = this.getDate(el);
      const dayOfMonth = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();
      el.isCurrentDayActive = dayOfMonth === el.numberOfDate && month === el.month && year === el.year;
    });
  }

  markCurrentDayOfWeek(): void {
    const option: any = { weekday: 'short' };
    this.language = this.languageService.getCurrentLanguage();
    this.calendarDay.forEach((el) => {
      if (el.isCurrentDayActive && el.date.getMonth() === el.month && el.date.getFullYear() === el.year) {
        const dayName = new Date(el.year, el.month, Number(el.numberOfDate)).toLocaleDateString(this.language, option);
        this.currentDayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);
      }
    });
  }

  nextMonth(): void {
    this.currentYear = this.currentMonth === 11 ? this.currentYear + 1 : this.currentYear;
    this.currentMonth = (this.currentMonth + 1) % 12;
    this.calendarDay = [];
    this.buildCalendar();
    this.getUserHabits(true, this.calendarDay);
  }

  previousMonth(): void {
    this.currentYear = this.currentMonth === 0 ? this.currentYear - 1 : this.currentYear;
    this.currentMonth = this.currentMonth === 0 ? 11 : this.currentMonth - 1;
    this.calendarDay = [];
    this.buildCalendar();
    this.getUserHabits(true, this.calendarDay);
  }

  buildMonthCalendar(months: string[]): void {
    this.yearData = this.currentYear;
    this.monthsCalendar = months;
    this.isActiveMonth();
  }

  isActiveMonth(): void {
    this.activeMonth = this.calendarDay
      .filter((item) => item.isCurrentDayActive)
      .map((el) => this.monthsShort[el.month])
      .toString();
  }

  previousYear(): void {
    this.yearData = this.yearData - 1;
  }

  nextYear(): void {
    this.yearData = this.yearData + 1;
  }

  buildSelectedMonthCalendar(month: string): void {
    this.monthView = true;
    this.currentMonth = this.monthsShort.indexOf(month);
    this.currentYear = this.yearData;
    this.calendarDay = [];
    this.buildCalendar();
    this.getUserHabits(true, this.calendarDay);
  }

  formatDate(isMonthCalendar: boolean, dayItem: BaseCalendar): string {
    if (isMonthCalendar) {
      return `${dayItem.year}-${dayItem.month + 1 < 10 ? '0' + (dayItem.month + 1) : dayItem.month + 1}-${
        dayItem.numberOfDate < 10 ? '0' + dayItem.numberOfDate : dayItem.numberOfDate
      }`;
    } else {
      return `${dayItem.date.getFullYear()}-${
        dayItem.date.getMonth() + 1 < 10 ? '0' + (dayItem.date.getMonth() + 1) : dayItem.date.getMonth() + 1
      }-${dayItem.date.getDate() < 10 ? '0' + dayItem.date.getDate() : dayItem.date.getDate()}`;
    }
  }

  getHabitsForDay(habitsList: HabitsForDateInterface[], date: string): HabitsForDateInterface {
    return habitsList.find((list) => list.enrollDate === date);
  }

  getUserHabits(isMonthCalendar: boolean, days: BaseCalendar[]): void {
    const firstDay = isMonthCalendar ? days.find((day) => Number(day.numberOfDate) === 1) : days[0];
    const startDate = this.formatDate(isMonthCalendar, firstDay);
    const endDate = this.formatDate(isMonthCalendar, days[days.length - 1]);

    this.habitAssignService
      .getAssignHabitsByPeriod(startDate, endDate)
      .pipe(takeUntil(this.destroySub))
      .subscribe((res) => {
        this.userHabitsListByPeriod = Array.isArray(res) ? res : [];
        this.habitAssignService.habitsFromDashBoard = res;

        days.forEach((day) => {
          const date = this.formatDate(isMonthCalendar, day);
          if (new Date().setHours(0, 0, 0, 0) >= new Date(date).setHours(0, 0, 0, 0)) {
            const filteredHabits = this.userHabitsListByPeriod.filter((habit) => habit.enrollDate === date);
            if (filteredHabits.length > 0) {
              const habit = filteredHabits[0];
              day.hasHabitsInProgress = habit.habitAssigns.length > 0;
              day.areHabitsDone = habit.habitAssigns.filter((habit) => !habit.enrolled).length === 0;
            } else {
              day.hasHabitsInProgress = false;
              day.areHabitsDone = false;
            }
          }
        });
      });
  }

  isCheckedAllHabits(habitsForDay: HabitPopupInterface[] = []): boolean {
    return !habitsForDay.find((habit) => !habit.enrolled);
  }

  chooseDisplayClass(dayItem: CalendarInterface): ItemClass {
    const date = this.getDate(dayItem);
    if (dayItem.isCurrentDayActive) {
      return ItemClass.CURRENT;
    } else if (dayItem.hasHabitsInProgress && dayItem.numberOfDate < date.getDate() - this.daysCanEditHabits && dayItem.areHabitsDone) {
      return ItemClass.ENROLLEDPAST;
    } else if (dayItem.hasHabitsInProgress && dayItem.numberOfDate < date.getDate() - this.daysCanEditHabits && !dayItem.areHabitsDone) {
      return ItemClass.UNENROLLEDPAST;
    } else if (dayItem.hasHabitsInProgress && dayItem.areHabitsDone) {
      return ItemClass.ENROLLED;
    } else if (dayItem.hasHabitsInProgress && !dayItem.areHabitsDone) {
      return ItemClass.UNENROLLED;
    }
  }

  private getDate(day: CalendarInterface): Date {
    if (day.date instanceof Date && !isNaN(day.date.getTime())) {
      return day.date;
    }
    const parsedDate = new Date(day.date);
    return !isNaN(parsedDate.getTime()) ? parsedDate : new Date(day.year, day.month, day.numberOfDate);
  }

  checkHabitListEditable(isMonthCalendar: boolean, dayItem: CalendarInterface) {
    this.selectedDay = isMonthCalendar ? new Date(dayItem.year, dayItem.month, Number(dayItem.numberOfDate)) : dayItem.date;
    this.isHabitListEditable = false;
    const currentDate: Date = new Date();
    this.isHabitListEditable =
      currentDate.setHours(0, 0, 0, 0) - (this.daysCanEditHabits + 1) * 24 * 60 * 60 * 1000 >=
      new Date(this.selectedDay).setHours(0, 0, 0, 0);
  }

  checkCanOpenPopup(dayItem: BaseCalendar) {
    return !!dayItem.hasHabitsInProgress;
  }

  openDialogDayHabits(event, isMonthCalendar: boolean, dayItem: CalendarInterface) {
    const dateForHabitPopup = `${dayItem.year}-${dayItem.month + 1}-${dayItem.numberOfDate}`;
    if (dayItem.numberOfDate) {
      this.habitAssignService.habitDate = new Date(dateForHabitPopup);
    } else {
      this.habitAssignService.habitDate = dayItem.date;
    }
    this.checkHabitListEditable(isMonthCalendar, dayItem);
    const date = this.formatDate(isMonthCalendar, dayItem);
    const dayHabits = this.getHabitsForDay(this.userHabitsListByPeriod, date);
    const pos = event.target.getBoundingClientRect();
    const dialogBoxSize = {
      headerHeight: 52,
      habitLineHeight: 44,
      width: 320
    };
    const dialogHeight = dayHabits.habitAssigns.length * dialogBoxSize.habitLineHeight + dialogBoxSize.headerHeight;
    let space: number;
    this.breakpointObserver.observe([`(max-width: ${Breakpoints.pcLow}px)`]).subscribe((result: BreakpointState) => {
      space = result.matches ? 20 : 40;
    });
    const horisontalPositioning =
      window.innerWidth - pos.left > dialogBoxSize.width ? pos.left + space : window.innerWidth - (dialogBoxSize.width + space);
    const verticalPosition = window.innerHeight - pos.top < dialogHeight ? window.innerHeight - dialogHeight : pos.top + space;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.backdropClass = 'backdropBackground';
    dialogConfig.position = {
      top: verticalPosition + 'px',
      left: horisontalPositioning + 'px'
    };

    const createDateTime = (habit: HabitPopupInterface) => {
      const dataString = this.allAssignedHabits?.find((el) => el.id === habit.habitAssignId)?.createDateTime;
      return new Date(dataString).getTime();
    };

    dialogConfig.data = {
      habitsCalendarSelectedDate: this.formatDate(isMonthCalendar, dayItem),
      isHabitListEditable: this.isHabitListEditable,
      habits: [...dayHabits.habitAssigns].sort((a, b) => createDateTime(b) - createDateTime(a))
    };

    this.dialog
      .open(HabitsPopupComponent, dialogConfig)
      .afterClosed()
      .pipe(takeUntil(this.destroySub))
      .subscribe((changedList) => {
        if (!changedList) {
          changedList = [];
        }
        this.sendEnrollRequest(changedList, dayHabits.enrollDate);
        this.isCheckedHabits = this.isCheckedAllHabits(changedList);
        this.currentDayItem = dayItem;
      });
  }

  getAllAssignedHabbits() {
    this.habitAssignService
      .getAssignedHabits()
      .pipe(takeUntil(this.destroySub), take(1))
      .subscribe((response: Array<HabitAssignInterface>) => {
        this.allAssignedHabits = response.map((el) => ({ id: el.id, createDateTime: el.createDateTime }));
      });
  }

  sendEnrollRequest(changedList: HabitPopupInterface[], date: string) {
    const habitsForSelectedDay = this.getHabitsForDay(this.userHabitsListByPeriod, date).habitAssigns;
    habitsForSelectedDay.forEach((habit) => {
      const baseHabit = changedList.find((list) => list.habitAssignId === habit.habitAssignId);
      if (habit.enrolled !== baseHabit.enrolled) {
        habit.enrolled ? this.unEnrollHabit(habit, date) : this.enrollHabit(habit, date);
      }
    });
  }

  enrollHabit(habit: HabitPopupInterface, date: string): void {
    this.checkAnswer = true;
    this.habitAssignService
      .enrollByHabit(habit.habitAssignId, date)
      .pipe(
        takeUntil(this.destroySub),
        finalize(() => (this.checkAnswer = false))
      )
      .subscribe(() => {
        habit.enrolled = !habit.enrolled;
        this.currentDayItem.areHabitsDone = this.isCheckedHabits;
      });
  }

  unEnrollHabit(habit: HabitPopupInterface, date: string): void {
    this.checkAnswer = true;
    this.habitAssignService
      .unenrollByHabit(habit.habitAssignId, date)
      .pipe(
        takeUntil(this.destroySub),
        finalize(() => (this.checkAnswer = false))
      )
      .subscribe(() => {
        habit.enrolled = !habit.enrolled;
        this.currentDayItem.areHabitsDone = this.isCheckedHabits;
      });
  }
}
