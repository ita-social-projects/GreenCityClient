import { Component, OnDestroy, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { TranslateService } from '@ngx-translate/core';
import { HabitAssignService } from './../../../../../../service/habit-assign/habit-assign.service';
import { CalendarBaseComponent } from '@shared/components/calendar-base/calendar-base.component';
import { CalendarInterface } from '@global-user/components/profile/calendar/calendar-interface';
import { MatDialog } from '@angular/material/dialog';
import { BreakpointObserver } from '@angular/cdk/layout';
@Component({
  selector: 'app-habit-calendar',
  templateUrl: './../../../profile/calendar/calendar.component.html',
  styleUrls: ['./../../../profile/calendar/calendar.component.scss', './habit-calendar.component.scss']
})
export class HabitCalendarComponent extends CalendarBaseComponent implements OnInit, OnDestroy {
  constructor(
    public translate: TranslateService,
    public languageService: LanguageService,
    public habitAsignService: HabitAssignService,
    public dialog: MatDialog,
    public breakpointObserver: BreakpointObserver
  ) {
    super(translate, languageService, habitAsignService, dialog, breakpointObserver);
  }

  ngOnInit() {
    this.bindDefaultTranslate();
    this.subscribeToLangChange();
    this.buildCalendar();
    this.getUserHabits(true, this.calendarDay);
    this.getAllAssignedHabbits();
  }

  showHabits(event, dayItem: CalendarInterface) {
    if (this.checkCanOpenPopup(dayItem)) {
      this.openDialogDayHabits(event, true, dayItem);
    }
  }
}
