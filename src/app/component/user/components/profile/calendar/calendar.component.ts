import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CalendarBaseComponent } from '@shared/components/calendar-base/calendar-base.component';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '@language-service/language.service';
import { HabitAssignService } from '@global-service/habit-assign/habit-assign.service';
import { map, take } from 'rxjs/operators';
import { HabitAssignInterface, HabitStatusCalendarListInterface } from 'src/app/interface/habit/habit-assign.interface';
import { CalendarInterface } from './calendar-interface';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { HabitsPopupComponent } from './habits-popup/habits-popup.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent extends CalendarBaseComponent implements OnInit, OnDestroy {

  // public selectedDay: number | string;
  // public habitsCalendarSelectedDate: string;
  // public isDayTracked: boolean;
  public formatedDate: string;
  public isHabitListEditable: boolean;
  public currentDate: Date = new Date();
  public habits: HabitAssignInterface[];
  public daysCanEditHabits = 7;



  constructor(
    public translate: TranslateService,
    public languageService: LanguageService,
    public habitAssignService: HabitAssignService,
    public dialog: MatDialog,
  ) {
    super(translate, languageService, habitAssignService, dialog);
  }

  ngOnInit() {
    this.bindDefaultTranslate();
    this.subscribeToLangChange();
    this.buildCalendar();
    this.getUserHabits(true, this.calendarDay);
  }



  public checkHabitListEditable() {
    this.isHabitListEditable = false;
    if (this.currentDate.setHours(0, 0, 0, 0) - this.daysCanEditHabits * 24 * 60 * 60 * 1000 <=
      new Date(this.formatedDate).setHours(0, 0, 0, 0)) {
      this.isHabitListEditable = true;
    }
  }

  showHabits(e, dayItem: CalendarInterface) {
    this.openDialogDayHabits(e, dayItem);
  }


}
