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
  public nameBtn = 'Join Event';

  constructor(private router: Router, private eventService: EventsService) {}

  ngOnInit(): void {
    this.itemTags = TagsArray.reduce((ac, cur) => [...ac, { ...cur }], []);
    this.filterTags(this.event.tags);
    // this.checkSubscription();
  }

  public routeToEvent(): void {
    this.router.navigate(['/events', this.event.id]);
  }

  private filterTags(tags: Array<TagDto>) {
    this.itemTags.forEach((item) => (item.isActive = tags.some((name) => name.nameEn === item.nameEn)));
  }

  checkSubscription(): void {
    this.eventService.removeAttender(this.event.id).subscribe(
      (res: any) => {
        // if (res.status === 200) {
        //   this.nameBtn = 'OK'
        // }
      },
      (error) => {
        // this.eventService.removeAttender(this.event.id).subscribe();
        this.nameBtn = 'Ok';
      }
    );
  }

  subscribeEvent(): void {
    this.eventService.addAttender(this.event.id).subscribe(
      (res: any) => {
        if (res.status === 200) {
          this.nameBtn = 'OK';
        }
      },
      (error) => {
        // this.eventService.removeAttender(this.event.id).subscribe();
        // this.nameBtn = 'Ok'
      }
    );
  }

  // setRate() {
  //   this.eventService.rateEvent(this.event.id, this.selected).subscribe();
  // }
}
