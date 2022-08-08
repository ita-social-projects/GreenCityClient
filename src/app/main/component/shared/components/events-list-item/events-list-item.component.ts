import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
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
  public readonly: boolean;
  public maxRating = 5;
  public subscribeBtn = '';
  public joinMode = false;

  constructor(private router: Router, private eventService: EventsService, private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.itemTags = TagsArray.reduce((ac, cur) => [...ac, { ...cur }], []);
    this.filterTags(this.event.tags);
    this.selected = Math.round(this.event.organizer.organizerRating);
    this.checkSubscription();
  }

  public routeToEvent(): void {
    this.router.navigate(['/events', this.event.id]);
  }

  private filterTags(tags: Array<TagDto>) {
    this.itemTags.forEach((item) => (item.isActive = tags.some((name) => name.nameEn === item.nameEn)));
  }

  checkSubscription(): void {
    if (this.localStorageService.getUserId() == this.event.organizer.id) {
      this.joinMode = true;
      this.subscribeBtn = 'Your own event';
    } else {
      if (!this.event.isSubscribed) {
        this.subscribeBtn = 'Join event';
        this.readonly = true;
      } else {
        this.subscribeBtn = 'You are joined';
        this.readonly = false;
      }
    }
  }

  subscribeEvent(): void {
    this.eventService.getEventById(this.event.id).subscribe((result) => {
      if (result.isSubscribed) {
        this.eventService.removeAttender(this.event.id).subscribe();
        this.subscribeBtn = 'Join event';
        this.readonly = true;
      } else {
        this.eventService.addAttender(this.event.id).subscribe();
        this.subscribeBtn = 'You are joined';
        this.readonly = false;
      }
    });
  }
}
