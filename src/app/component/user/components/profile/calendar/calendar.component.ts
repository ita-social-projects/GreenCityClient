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
  public formatedData: string;
  public isChangingEnroll: boolean = false;
  public habits2: any[] = [];
  public habits = [
        {
          title: "Use own cup",
          completed: false,
          id: 504
        },
        {
          title: "No plastic trash",
          completed: false,
          id: 505,
        },
        {
          title: "Use own bag",
          completed: false,
          id: 506
        },
        {
          title: "Recycle",
          completed: true,
          id: 503,
        },
        {
          title: "Plant a tree",
          completed: true,
          id: 502
        }
      ];

  @HostListener('document:click', ['$event']) clickout(event) {
    this.isHabitsPopUpOpen =  this.isHabitsPopUpOpen ? false : null;
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
    this.getFormatedData(dayItem);
    this.getActiveDateHabits(this.formatedData);
    this.isHabitsPopUpOpen = !this.isHabitsPopUpOpen;
    this.selectedDay = dayItem.numberOfDate;
    console.log(dayItem.numberOfDate);
    console.log(this.formatedData);
    this.habitsCalendarSelectedDate = this.months[dayItem.month] + ' ' + dayItem.numberOfDate + ', ' + dayItem.year;
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
