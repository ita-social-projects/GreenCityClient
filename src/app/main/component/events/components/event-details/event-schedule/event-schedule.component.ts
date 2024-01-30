import { Component, Input, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { EventsService } from '../../../services/events.service';
import { Coordinates } from '../../../models/events.interface';
@Component({
  selector: 'app-event-schedule',
  templateUrl: './event-schedule.component.html',
  styleUrls: ['./event-schedule.component.scss']
})
export class EventScheduleComponent {
  icons = {
    clock: 'assets/img/events/clock.svg',
    location: 'assets/img/events/location.svg',
    ellipsis: 'assets/img/events/ellipsis.svg'
  };

  @Input() days = [];
  constructor(private langService: LanguageService, public eventService: EventsService) {}

  public getLangValue(uaValue: string, enValue: string): string {
    return this.langService.getLangValue(uaValue, enValue) as string;
  }

  public getAddress(location: Coordinates): string {
    return this.eventService.getFormattedAddress(location);
  }
}
