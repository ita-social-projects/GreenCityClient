import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TagsArray } from '../../../events/models/event-consts';
import { EventPageResponceDto, TagDto, TagObj } from '../../../events/models/events.interface';
import { EventsService } from '../../../events/services/events.service';

@Component({
  selector: 'app-events-list-item',
  templateUrl: './events-list-item.component.html',
  styleUrls: ['./events-list-item.component.scss']
})
export class EventsListItemComponent implements OnInit {
  @Input() event: EventPageResponceDto;

  public itemTags: Array<TagObj>;

  public selected = 0;
  public hovered = 0;
  public readonly = false;
  public maxRating = 5;

  constructor(private router: Router, private eventService: EventsService) { }

  ngOnInit(): void {
    this.itemTags = TagsArray.reduce((ac, cur) => [...ac, { ...cur }], []);
    this.filterTags(this.event.tags);
  }

  public routeToEvent(): void {
    this.router.navigate(['/events', this.event.id]);
  }

  private filterTags(tags: Array<TagDto>) {
    this.itemTags.forEach((item) => (item.isActive = tags.some((name) => name.nameEn === item.nameEn)));
  }

  subscribe(): void {
    this.eventService.addAttender(this.event.id).subscribe();
  }

  setRate() {
    this.eventService.rateEvent(this.event.id, this.selected).subscribe();
  }
}
