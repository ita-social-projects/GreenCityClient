import { HabitAssignService } from './habit-assign.service';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '@language-service/language.service';
import { CalendarBaseComponent } from '@shared/components/calendar-base/calendar-base.component';
import { calendarIcons } from 'src/app/image-pathes/calendar-icons';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent extends CalendarBaseComponent implements OnInit, OnDestroy {

  public isHabitsPopUpOpen = false;
  public selectedDay;
  public habitsCalendarSelectedDate;
  public calendarIcons = calendarIcons;
  public userHabitAssigns;
  public habitEnrollDates;
  public isDayTracked: boolean;
  public formatedData: string;
  public isChangingEnroll: boolean = false;
  public isHabitListEditable: boolean;
  public currentDate: number = new Date().getDate();
  public habits2: any[] = [];
  public habits = [];

  @HostListener('document:click', ['$event']) clickout(event) {
    this.isHabitsPopUpOpen =  this.isHabitsPopUpOpen ? false : null;
    this.isDayTracked = false;
  }

  constructor(
    public translate: TranslateService,
    public languageService: LanguageService,
    public habitAssignService: HabitAssignService
              ) {
                super(translate, languageService);
              }

  ngOnInit() {
    this.bindDefaultTranslate();
    this.subscribeToLangChange();
    this.buildCalendar();
  }

  public getFormatedData(dayItem) {
    console.log(dayItem);
    this.formatedData = `${dayItem.year}-${ dayItem.month + 1 < 10 ?
      '0' + dayItem.month : dayItem.month + 1}-${dayItem.numberOfDate < 10 ?
      '0' + dayItem.numberOfDate : dayItem.numberOfDate}`;
  }

  public toggleHabitsList(dayItem) {
    this.checkHabitListEditable(dayItem);
    this.getFormatedData(dayItem);
    this.getActiveDateHabits(this.formatedData);
    this.isHabitsPopUpOpen = !this.isHabitsPopUpOpen;
    this.selectedDay = dayItem.numberOfDate;
    this.habitsCalendarSelectedDate = this.months[dayItem.month] + " " + dayItem.numberOfDate + ", " + dayItem.year;
    this.isDayTracked = !this.isDayTracked; 
  }

  public checkHabitListEditable(dayItem) {
    this.isHabitListEditable = false;
    if(this.currentDate - 7 <= dayItem.numberOfDate && dayItem.numberOfDate <= this.currentDate) {
      this.isHabitListEditable = true;
    }
  }

  public toggleCompleteHabit(habit) {
    console.log(`habitid:${habit.id} and formdata:${this.formatedData} and completed${habit.completed}`);
    habit.completed = !habit.completed;
    this.isChangingEnroll = true;
    setTimeout(() => this.isChangingEnroll = false, 1000);
  }

  public getActiveDateHabits(date) {
    console.log('Hi date', date);
    this.habitAssignService.getActiveDateHabits(date, this.language).subscribe( data => {
      console.log(data);
      this.habits2 = [];
      data.forEach(item => {
        this.habits2 = [...this.habits2, item.habit];
      });
      console.log(this.habits2);
    });
  }
}
