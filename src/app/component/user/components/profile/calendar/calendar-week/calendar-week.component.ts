import { Component, OnInit, OnDestroy } from '@angular/core';
import { CalendarBaseComponent } from '@shared/components/calendar-base/calendar-base.component';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TranslateService } from '@ngx-translate/core';
import { HabitAssignService } from './../../../../../../service/habit-assign/habit-assign.service';
import { LanguageService } from '@language-service/language.service';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CalendarWeekInterface } from '../calendar-week/calendar-week-interface';
import { calendarImage } from '../calendar-image';
import { CalendarInterface } from '../calendar-interface';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { HabitsPopupComponent } from '../habits-popup/habits-popup.component';

@Component({
  selector: 'app-calendar-week',
  templateUrl: './calendar-week.component.html',
  styleUrls: ['./calendar-week.component.scss']
})
export class CalendarWeekComponent extends CalendarBaseComponent implements OnInit, OnDestroy {
  public calendarImages = calendarImage;
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
  ) {
    super(translate, languageService, habitAssignService, dialog);
  }

  ngOnInit() {
    this.buildWeekCalendar(this.getFirstWeekDate());
    this.getLanguage();
    this.getUserHabits(false, this.weekDates);
    // this.markCalendarDays(false, this.weekDates);
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
    this.getUserHabits(false, this.weekDates);
    // this.markCalendarDays(false, this.weekDates);
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public showHabits(e, dayItem: CalendarInterface) {
    // this.checkIfFuture(dayItem);
    this.openDialogDayHabits(e, dayItem);


  }
  openDialogDayHabits(e, dayItem: CalendarInterface) {
    const date = this.formatDate(false, dayItem)

    const habits = this.getHabitsForDay(this.userHabitsList, date)
    console.log(habits)
    const pos = e.target.getBoundingClientRect()
    console.log(pos)
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.backdropClass = 'backdropBackground';
    dialogConfig.position = {
      top: (pos.y + 20) + 'px',
      left: (pos.x - 300) + 'px'
    };
    dialogConfig.data = {
      enrollDate:habits.enrollDate,
      habitsCalendarSelectedDate: this.months[dayItem.month] + ' ' + dayItem.numberOfDate + ', ' + dayItem.year,
      habits: habits.habitAssigns
    };

    const dialogRef = this.dialog.open(HabitsPopupComponent, dialogConfig);
  }
}
