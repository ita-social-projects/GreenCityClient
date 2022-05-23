import { Component, OnInit } from '@angular/core';
import { EventPageResponceDto, EventResponseDto } from '../../models/events.interface';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss']
})
export class EventsListComponent implements OnInit {
  eventsList: EventPageResponceDto[] = [];

  constructor(private eventService: EventsService) {}

  ngOnInit(): void {
    this.eventService.getEvents(0, 14).subscribe((res: EventResponseDto) => {
      this.eventsList = [...res.page];
    });
  }
}
