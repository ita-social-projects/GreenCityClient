import { Component, OnDestroy, OnInit } from '@angular/core';
import { LanguageService } from '@language-service/language.service';
import { TranslateService } from '@ngx-translate/core';
import { HabitAssignService } from '@global-service/habit-assign/habit-assign.service';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CalendarInterface } from '@global-user/components/profile/calendar/calendar-interface';
import { calendarImage } from './calendar-image';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { HabitsPopupComponent } from '@global-user/components/profile/calendar/habits-popup/habits-popup.component';

@Component({
  selector: 'app-calendar-base',
  template: ''
})
export class CalendarBaseComponent implements OnInit, OnDestroy {
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

  public selectedDay;
  public isDayTracked;
  public habits;
  public isFetching;
  public checkIfFuture;
  public toggleEnrollHabit;

  public langChangeSub: Subscription;
  public defaultTranslateSub: Subscription;
  private destroyGetHabits = new Subject<void>();
  public destroyOpenPopup = new Subject<void>();
  public destroyEnroll = new Subject<void>();
  public destroyUnEnroll = new Subject<void>();

  public calendar: CalendarInterface = {
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


  public userHabitsList: any;
  public currentDayItem: CalendarInterface;
  public isCheckedHabits: boolean;
  public checkAnswer = false;
  public getClass: string;
  public isHabitListEditable: boolean;
  public daysCanEditHabits = 7;

  constructor(
    public translate: TranslateService,
    public languageService: LanguageService,
    public habitAssignService: HabitAssignService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.langChangeSub.unsubscribe();
    this.defaultTranslateSub.unsubscribe();
    this.destroyGetHabits.next();
    this.destroyGetHabits.complete();
    this.destroyOpenPopup.next();
    this.destroyOpenPopup.complete();
    this.destroyEnroll.next();
    this.destroyEnroll.complete();
    this.destroyUnEnroll.next();
    this.destroyUnEnroll.complete();
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
      this.getUserHabits(true, this.calendarDay);
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
      numberOfDate: days || '',
      date: new Date(),
      month: this.calendar.month,
      year: this.calendar.year,
      firstDay: this.calendar.firstDay,
      totalDaysInMonth: this.calendar.totalDaysInMonth,
      dayName: (new Date(this.calendar.year, this.calendar.month, days)
        .toDateString()
        .substring(0, 3)) || '',
      hasHabitsInProgress: false,
      areHabitsDone: false,
      isCurrentDayActive: false
    };
  }

  public isCurrentDayActive(): void {
    this.calendarDay.forEach(el => el.isCurrentDayActive =
      (el.date.getDate() === el.numberOfDate
        && el.date.getMonth() === el.month
        && el.date.getFullYear() === el.year)
    );
  }

  public markCurrentDayOfWeek(): void {
    const option: any = { weekday: 'short' };
    this.language = this.languageService.getCurrentLanguage();
    this.calendarDay.forEach(el => {
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
    this.getUserHabits(true, this.calendarDay);
  }

  public previousMonth(): void {
    this.currentYear = (this.currentMonth === 0) ? this.currentYear - 1 : this.currentYear;
    this.currentMonth = (this.currentMonth === 0) ? 11 : this.currentMonth - 1;
    this.calendarDay = [];
    this.buildCalendar();
    this.getUserHabits(true, this.calendarDay);
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

  public formatDate(isMonthCalendar: boolean, dayItem) {
    if (isMonthCalendar) {
      return `${dayItem.year}-${dayItem.month + 1 < 10 ?
        '0' + (dayItem.month + 1) : dayItem.month + 1}-${dayItem.numberOfDate < 10 ?
          '0' + dayItem.numberOfDate : dayItem.numberOfDate}`;
    } else {
      return `${dayItem.date.getFullYear()}-${dayItem.date.getMonth() + 1 < 10 ?
        '0' + (dayItem.date.getMonth() + 1) : dayItem.date.getMonth() + 1}-${dayItem.date.getDate() < 10 ?
          '0' + dayItem.date.getDate() : dayItem.date.getDate()}`;
    }
  }

  formatSelectedDate(isMonthCalendar, dayItem: CalendarInterface) {
    if (isMonthCalendar) {
      return `${this.months[dayItem.month]} ${dayItem.numberOfDate}, ${dayItem.year}`;
    } else {
      const month = dayItem.date.toLocaleDateString(this.language, { month: 'long' });
      const day = dayItem.date.getDate();
      const year = dayItem.date.getFullYear();
      return `${month} ${day}, ${year}`;
    }
  }

  getHabitsForDay(habitsList, date) {
    const habitsListForDay = habitsList.find(list => list.enrollDate === date);
    return habitsListForDay;
  }

  public getUserHabits(isMonthCalendar, days) {
    let firstDay;
    if (isMonthCalendar) {
      firstDay = days.find(day => day.numberOfDate === 1);
    } else {
      firstDay = days[0];
    }
    const startDate = this.formatDate(isMonthCalendar, firstDay);
    const endDate = this.formatDate(isMonthCalendar, days[days.length - 1]);
    this.habitAssignService.getAssignHabitsByPeriod(startDate, endDate).pipe(
      takeUntil(this.destroyGetHabits)
    ).subscribe(res => {
      this.userHabitsList = res;
      days.forEach(day => {
        const date = this.formatDate(isMonthCalendar, day);
        if (new Date().setHours(0, 0, 0, 0) >= new Date(date).setHours(0, 0, 0, 0)) {
          day.hasHabitsInProgress = this.userHabitsList.filter(h => h.enrollDate === date)[0].habitAssigns.length > 0;
          day.areHabitsDone = this.userHabitsList
            .filter(h => h.enrollDate === date)[0].habitAssigns
            .filter(hab => !hab.enrolled).length === 0;
        }
      });
    });
  }

  isCheckedAllHabits(habitsForDay) {
    const unenrolledHabit = habitsForDay.find(h => h.enrolled === false);
    if (unenrolledHabit) {
      return false;
    } else {
      return true;
    }
  }

  chooseDisplayClass(dayItem) {
    if (dayItem.isCurrentDayActive) {
      this.getClass = 'current-day';
      return this.getClass;
    } else if (dayItem.hasHabitsInProgress && dayItem.numberOfDate < (dayItem.date.getDate() - 7) && dayItem.areHabitsDone) {
      this.getClass = 'enrolled-past-day';
      return this.getClass;
    } else if (dayItem.hasHabitsInProgress && dayItem.numberOfDate < (dayItem.date.getDate() - 7) && !dayItem.areHabitsDone) {
      this.getClass = 'unenrolled-past-day';
      return this.getClass;
    } else if (dayItem.hasHabitsInProgress && dayItem.areHabitsDone) {
      this.getClass = 'enrolled-day';
      return this.getClass;
    } else if (dayItem.hasHabitsInProgress && !dayItem.areHabitsDone) {
      this.getClass = 'unenrolled-day';
      return this.getClass;
    }
  }

  checkHabitListEditable(isMonthCalendar, dayItem: CalendarInterface) {
    if (isMonthCalendar) {
      this.selectedDay = new Date(dayItem.year, dayItem.month, +dayItem.numberOfDate);
    } else {
      this.selectedDay = dayItem.date;
    }
    this.isHabitListEditable = false;
    const currentDate: Date = new Date();
    if (currentDate.setHours(0, 0, 0, 0) - this.daysCanEditHabits * 24 * 60 * 60 * 1000 >=
      new Date(this.selectedDay).setHours(0, 0, 0, 0)) {
      this.isHabitListEditable = true;
    }
  }

  checkCanOpenPopup(dayItem: CalendarInterface) {
    if (dayItem.hasHabitsInProgress) {
      return true;
    } else {
      return false;
    }
  }

  openDialogDayHabits(e, isMonthCalendar, dayItem: CalendarInterface) {
    this.checkHabitListEditable(isMonthCalendar, dayItem);
    const date = this.formatDate(isMonthCalendar, dayItem);
    const habits = this.getHabitsForDay(this.userHabitsList, date);
    const pos = e.target.getBoundingClientRect();
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.backdropClass = 'backdropBackground';
    dialogConfig.position = {
      top: (pos.y + 20) + 'px',
      left: (pos.x - 300) + 'px'
    };
    dialogConfig.data = {
      habitsCalendarSelectedDate: this.formatSelectedDate(isMonthCalendar, dayItem),
      isHabitListEditable: this.isHabitListEditable,
      habits: habits.habitAssigns
    };

    const dialogRef = this.dialog.open(HabitsPopupComponent, dialogConfig);
    dialogRef.afterClosed().pipe(
      takeUntil(this.destroyOpenPopup)
    ).subscribe(changedList => {
      this.sendEnrollRequest(changedList, habits.enrollDate);

      this.isCheckedHabits = this.isCheckedAllHabits(changedList);
      this.currentDayItem = dayItem;
    });
  }

  sendEnrollRequest(changedList, date) {
    const habitsForSelectedDay = this.getHabitsForDay(this.userHabitsList, date).habitAssigns;
    habitsForSelectedDay.forEach((habit: any) => {
      const baseHabit: any = changedList.find((list: any) => list.habitId === habit.habitId);
      if (habit.enrolled !== baseHabit.enrolled) {
        habit.enrolled ? this.unEnrollHabit(habit, date) : this.enrollHabit(habit, date);
      }
    });
  }

  enrollHabit(habit, date) {
    this.checkAnswer = true;
    this.habitAssignService.enrollByHabit(habit.habitId, date).pipe(
      takeUntil(this.destroyEnroll)
    ).subscribe(() => {
      habit.enrolled = !habit.enrolled;
      this.isCheckedHabits ? this.currentDayItem.areHabitsDone = true : this.currentDayItem.areHabitsDone = false;
      this.checkAnswer = false;
    });
  }

  unEnrollHabit(habit, date) {
    this.checkAnswer = true;
    this.habitAssignService.unenrollByHabit(habit.habitId, date).pipe(
      takeUntil(this.destroyUnEnroll)
    ).subscribe(() => {
      habit.enrolled = !habit.enrolled;
      this.isCheckedHabits ? this.currentDayItem.areHabitsDone = true : this.currentDayItem.areHabitsDone = false;
      this.checkAnswer = false;
    });
  }
}
