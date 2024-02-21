import { Component, Input } from '@angular/core';
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
    ellipsis: 'assets/img/events/ellipsis.svg',
    link: 'assets/img/events/link.svg'
  };

  @Input() days = [];
  constructor(public eventService: EventsService) {}

  public getAddress(location: Coordinates): string {
    return this.eventService.getFormattedAddress(location);
  }
}
