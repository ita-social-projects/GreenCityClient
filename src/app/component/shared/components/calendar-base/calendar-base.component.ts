import { Component, OnDestroy, OnInit } from '@angular/core';
import { LanguageService } from '@language-service/language.service';
import { TranslateService } from '@ngx-translate/core';
import { HabitAssignService } from '@global-service/habit-assign/habit-assign.service';
import { Subject, Subscription } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { HabitAssignInterface, HabitStatusCalendarListInterface } from 'src/app/interface/habit/habit-assign.interface';
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

  private _subs: Subscription = new Subscription();
  userHabitsList: any;
  currentDayItem: CalendarInterface;
  isCheckedHabits: boolean;
  checkAnswer: boolean = false;
  getClass: string;

  constructor(
    public translate: TranslateService,
    public languageService: LanguageService,
    public habitAssignService: HabitAssignService,
    public dialog: MatDialog,
  ) { }

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
      this.getHabitsForDay
      this.buildMonthCalendar(this.monthsShort);
      this.getUserHabits(true,this.calendarDay)
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
    this.getUserHabits(true, this.calendarDay)
  }

  public previousMonth(): void {
    this.currentYear = (this.currentMonth === 0) ? this.currentYear - 1 : this.currentYear;
    this.currentMonth = (this.currentMonth === 0) ? 11 : this.currentMonth - 1;
    this.calendarDay = [];
    this.buildCalendar();
    this.getUserHabits(true, this.calendarDay)
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

  formatSelectedDate(dayItem: CalendarInterface) {
    return this.months[dayItem.month] + ' ' + dayItem.numberOfDate + ', ' + dayItem.year;
  }

  getHabitsForDay(habitsList, date) {
    const habitsListForDay = habitsList.find(list => list.enrollDate == date);
    return habitsListForDay;
  }

  public getUserHabits(isMonthCalendar, days) {
    const startDate = this.formatDate(isMonthCalendar, days[0]);//uncorrect date
    const endDate = this.formatDate(isMonthCalendar, days[days.length - 1]);
    this._subs.add(this.habitAssignService.getAssignHabitsByPeriod(startDate, endDate)
      .subscribe(res => {
        this.userHabitsList = res;

        days.forEach(day => {
          const date = this.formatDate(isMonthCalendar, day);
          if (new Date().setHours(0, 0, 0, 0) >= new Date(date).setHours(0, 0, 0, 0)) {
            day.hasHabitsInProgress = this.userHabitsList.filter(h => h.enrollDate == date)[0].habitAssigns.length > 0
            day.areHabitsDone = this.userHabitsList.filter(h => h.enrollDate == date)[0].habitAssigns.filter(hab => !hab.enrolled).length === 0
          }
        });

      }))
  }

  isCheckedAllHabits(habitsForDay) {
    const unenrolledHabit = habitsForDay.find(h => h.enrolled === false);
    if (unenrolledHabit) {
      return false;
    }
    else {
      return true;
    }
  }

  chooseDisplayClass(dayItem) {
    if (dayItem.isCurrentDayActive) {
      this.getClass = 'current-day'
      return this.getClass;
    }
    else if (this.selectedDay === dayItem.numberOfDate && this.isDayTracked) {
      this.getClass = 'tracked-day'
      return this.getClass;
    }
    else if (dayItem.hasHabitsInProgress && dayItem.numberOfDate < (dayItem.date.getDate() - 7) && dayItem.areHabitsDone) {
      this.getClass = 'enrolled-past-day'
      return this.getClass;
    }
    else if (dayItem.hasHabitsInProgress && dayItem.numberOfDate < (dayItem.date.getDate() - 7) && !dayItem.areHabitsDone) {
      this.getClass = 'unenrolled-past-day'
      return this.getClass;
    }
    else if (dayItem.hasHabitsInProgress && dayItem.areHabitsDone) {
      this.getClass = 'enrolled-day'
      return this.getClass;
    }
    else if (dayItem.hasHabitsInProgress && !dayItem.areHabitsDone) {
      this.getClass = 'unenrolled-day'
      return this.getClass;
    }
  }

  public formatedDate: string;
  public isHabitListEditable: boolean;
  public currentDate: Date = new Date();
  public daysCanEditHabits = 7;

  checkHabitListEditable() {
    this.isHabitListEditable = false;
    if (this.currentDate.setHours(0, 0, 0, 0) - this.daysCanEditHabits * 24 * 60 * 60 * 1000 <=
      new Date(this.formatedDate).setHours(0, 0, 0, 0)) {
      this.isHabitListEditable = true;
    }
  }

  openDialogDayHabits(e, isMonthCalendar, dayItem: CalendarInterface) {
    const isHabitListEditable = this.checkHabitListEditable()
    const date = this.formatDate(isMonthCalendar, dayItem)
    const habits = this.getHabitsForDay(this.userHabitsList, date)
    const pos = e.target.getBoundingClientRect()
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.backdropClass = 'backdropBackground';
    dialogConfig.position = {
      top: (pos.y + 20) + 'px',
      left: (pos.x - 300) + 'px'
    };
    dialogConfig.data = {
      habitsCalendarSelectedDate: this.formatSelectedDate(dayItem),
      
      
      habits: habits.habitAssigns
    };

    const dialogRef = this.dialog.open(HabitsPopupComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(changedList => {
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

        console.log('yes')
        habit.enrolled ? this.unEnrollHabit(habit, date) : this.enrollHabit(habit, date);
      }
    });
  }

  enrollHabit(habit, date) {
    this.checkAnswer = true;
    this.habitAssignService.enrollByHabit(habit.habitId, date).pipe(
      take(1)
    ).subscribe(() => {
      habit.enrolled = !habit.enrolled;
      this.isCheckedHabits ? this.currentDayItem.areHabitsDone = true : this.currentDayItem.areHabitsDone = false;
      this.checkAnswer = false;
    })
  }
  destroyUnEnroll = new Subject<void>();

  unEnrollHabit(habit, date) {
    this.checkAnswer = true;
    this.habitAssignService.unenrollByHabit(habit.habitId, date).pipe(
      takeUntil(this.destroyUnEnroll)
    ).subscribe(() => {
      habit.enrolled = !habit.enrolled;
      this.isCheckedHabits ? this.currentDayItem.areHabitsDone = true : this.currentDayItem.areHabitsDone = false;
      this.checkAnswer = false;
    })
  }

  ngOnDestroy() {
    this.langChangeSub.unsubscribe();
    this.defaultTranslateSub.unsubscribe();
    this._subs.unsubscribe();
    this.destroyUnEnroll.next();
    this.destroyUnEnroll.complete()
  }
}
