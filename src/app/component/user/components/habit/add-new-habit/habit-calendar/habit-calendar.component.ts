import { Component, OnDestroy, OnInit } from '@angular/core';
import { LanguageService } from '@language-service/language.service';
import { TranslateService } from '@ngx-translate/core';
import { CalendarBaseComponent } from '@shared/components/calendar-base/calendar-base.component';

@Component({
  selector: 'app-habit-calendar',
  templateUrl: './../../../profile/calendar/calendar.component.html',
  styleUrls: [
    './../../../profile/calendar/calendar.component.scss',
    './habit-calendar.component.scss']
})

export class HabitCalendarComponent extends CalendarBaseComponent implements OnInit, OnDestroy {

  constructor(public translate: TranslateService,
              public languageService: LanguageService) {
    super(translate, languageService);
  }

  ngOnInit() {
    this.bindDefaultTranslate();
    this.subscribeToLangChange();
    this.buildCalendar();
  }

}
