import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CalendarBaseComponent } from '@shared/components/calendar-base/calendar-base.component';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '@language-service/language.service';
import { HabitAssignService } from '@global-service/habit-assign/habit-assign.service';
import { map, take } from 'rxjs/operators';
import { HabitAssignInterface, HabitStatusCalendarListInterface } from 'src/app/interface/habit/habit-assign.interface';
import { CalendarInterface } from './calendar-interface';
import { calendarIcons } from 'src/app/image-pathes/calendar-icons';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent extends CalendarBaseComponent implements OnInit, OnDestroy {
  public isHabitsPopUpOpen = false;
  public selectedDay: number | string;
  public habitsCalendarSelectedDate: string;
  public calendarIcons = calendarIcons;
  public isDayTracked: boolean;
  public formatedDate: string;
  public isHabitListEditable: boolean;
  public isHabitChecked: boolean;
  public isHabitEnrolled: boolean;
  public currentDate: Date = new Date();
  public habits: HabitAssignInterface[];
  public daysCanEditHabits = 7;
  public isFetching: boolean;
  public allHabitsEnrolled: boolean;

  @HostListener('document:click') clickout() {
    if (this.isHabitsPopUpOpen) {
      this.closePopUp();
    }
  }

  constructor(public translate: TranslateService, public languageService: LanguageService, public habitAssignService: HabitAssignService) {
    super(translate, languageService, habitAssignService);
  }

  ngOnInit() {
    this.bindDefaultTranslate();
    this.subscribeToLangChange();
    this.buildCalendar();
    this.markCalendarDays(true, this.calendarDay);
  }

  public checkIfFuture = (dayItem: CalendarInterface) => {
    this.formatedDate = this.formatDate(true, dayItem);
    if (this.currentDate.setHours(0, 0, 0, 0) >= new Date(this.formatedDate).setHours(0, 0, 0, 0)) {
      this.toggleHabitsList(dayItem);
    }
  };

  public toggleHabitsList(dayItem: CalendarInterface) {
    this.isFetching = true;
    this.isHabitsPopUpOpen = !this.isHabitsPopUpOpen;
    this.checkHabitListEditable();
    this.getActiveDateHabits(this.formatedDate);
    this.selectedDay = dayItem.numberOfDate;
    this.habitsCalendarSelectedDate = this.months[dayItem.month] + ' ' + dayItem.numberOfDate + ', ' + dayItem.year;
    this.isDayTracked = !this.isDayTracked;
  }

  public checkHabitListEditable() {
    this.isHabitListEditable = false;
    if (
      this.currentDate.setHours(0, 0, 0, 0) - this.daysCanEditHabits * 24 * 60 * 60 * 1000 <=
      new Date(this.formatedDate).setHours(0, 0, 0, 0)
    ) {
      this.isHabitListEditable = true;
    }
  }

  public sortHabits(habits: HabitAssignInterface[]): HabitAssignInterface[] {
    return habits.sort((habit1, habit2) => (habit1.id > habit2.id ? 1 : -1));
  }

  public getActiveDateHabits(date: string) {
    this.habitAssignService
      .getHabitAssignByDate(date)
      .pipe(
        take(1),
        map((habits: HabitAssignInterface[]) => this.sortHabits(habits))
      )
      .subscribe((data: HabitAssignInterface[]) => {
        this.habits = [...data];
        this.habits.forEach((habit: HabitAssignInterface) => {
          habit.enrolled = this.checkIfEnrolledDate(habit);
        });
        this.isFetching = false;
      });
  }

  public enrollHabit(habit: HabitAssignInterface) {
    this.habitAssignService.enrollByHabit(habit.habit.id, this.formatedDate).pipe(take(1)).subscribe();
  }

  public unEnrollHabit(habit: HabitAssignInterface) {
    this.habitAssignService.unenrollByHabit(habit.habit.id, this.formatedDate).pipe(take(1)).subscribe();
  }

  public toggleEnrollHabit = (habit: HabitAssignInterface) => {
    if (this.isHabitListEditable) {
      habit.enrolled = !habit.enrolled;
    }
  };

  public sendEnrollRequest() {
    this.habits.forEach((habit: HabitAssignInterface) => {
      if (habit.enrolled !== this.checkIfEnrolledDate(habit)) {
        habit.enrolled ? this.enrollHabit(habit) : this.unEnrollHabit(habit);
      }
    });
  }

  public checkIfEnrolledDate(habit: HabitAssignInterface) {
    this.isHabitEnrolled = false;
    habit.habitStatusCalendarDtoList.forEach((habitEnrollDate: HabitStatusCalendarListInterface) => {
      if (habitEnrollDate.enrollDate === this.formatedDate) {
        this.isHabitEnrolled = true;
      }
    });
    return this.isHabitEnrolled;
  }

  public closePopUp() {
    this.isHabitsPopUpOpen = this.isHabitsPopUpOpen ? false : null;
    this.isDayTracked = false;
    this.sendEnrollRequest();
    this.habits = [];
  }
}
