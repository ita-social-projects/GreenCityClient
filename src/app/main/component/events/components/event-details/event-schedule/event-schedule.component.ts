import { Component, Input } from '@angular/core';
// import { Coordinates } from '@global-user/models/edit-profile.model';
// import { EventsService } from '../../../services/events.service';

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

  // constructor(public eventsService: EventsService) {}

  // public getAddress(location: Coordinates): string {
  //   return this.eventsService.getFormattedAddress(this.locationCoordinates);
  // }
}
