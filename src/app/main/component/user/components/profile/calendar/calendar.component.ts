import { Component, OnDestroy, OnInit } from '@angular/core';
import { CalendarBaseComponent } from '@shared/components/calendar-base/calendar-base.component';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { HabitAssignService } from '@global-service/habit-assign/habit-assign.service';
import { CalendarInterface } from './calendar-interface';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent extends CalendarBaseComponent implements OnInit, OnDestroy {
  constructor(
    public translate: TranslateService,
    public languageService: LanguageService,
    public habitAssignService: HabitAssignService,
    public dialog: MatDialog
  ) {
    super(translate, languageService, habitAssignService, dialog);
  }

  ngOnInit() {
    this.bindDefaultTranslate();
    this.subscribeToLangChange();
    this.buildCalendar();
    this.getUserHabits(true, this.calendarDay);
  }

  showHabits(event, dayItem: CalendarInterface) {
    if (this.checkCanOpenPopup(dayItem)) {
      this.openDialogDayHabits(event, true, dayItem);
    }
  }
}
