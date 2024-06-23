import { Component, Inject } from '@angular/core';
import { EventDatesResponse } from '../../models/events.interface';
import { EventsService } from '../../services/events.service';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { LanguageService } from '../../../../i18n/language.service';

@Component({
  selector: 'app-event-schedule',
  templateUrl: './event-schedule.component.html',
  styleUrls: ['./event-schedule.component.scss']
})
export class EventScheduleComponent {
  dates: EventDatesResponse[];

  constructor(
    public eventService: EventsService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: EventDatesResponse[],
    public ls: LanguageService
  ) {
    console.log(data);
    this.dates = data;
    console.log(this.dates);
  }
}
