import { Component, Input, OnInit } from '@angular/core';
import { TagsArray } from '../../models/event-consts';
import { EventPageResponceDto, TagDto, TagObj } from '../../models/events.interface';

@Component({
  selector: 'app-events-list-item',
  templateUrl: './events-list-item.component.html',
  styleUrls: ['./events-list-item.component.scss']
})
export class EventsListItemComponent implements OnInit {
  @Input() event: EventPageResponceDto;

  public itemTags: Array<TagObj>;

  public adress = 'Should be adress';

  ngOnInit(): void {
    this.itemTags = TagsArray.reduce((ac, cur) => [...ac, { ...cur }], []);
    this.filterTags(this.event.tags);
  }

  private filterTags(tags: Array<TagDto>) {
    this.itemTags.forEach((item) => (item.isActive = tags.some((name) => name.nameEn === item.nameEn)));
  }
}
