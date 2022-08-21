import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { TagsArray } from '../../../events/models/event-consts';
import { EventPageResponceDto, TagDto, TagObj } from '../../../events/models/events.interface';
import { EventsService } from '../../../events/services/events.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-events-list-item',
  templateUrl: './events-list-item.component.html',
  styleUrls: ['./events-list-item.component.scss']
})
export class EventsListItemComponent implements OnInit {
  @Input() event: EventPageResponceDto;

  public itemTags: Array<TagObj>;

  public subscribeBtn: string;
  public disabledMode = false;
  public toggle: boolean;

  public max = 5;
  public rate: number;
  public isReadonly = false;

  public modalRef: BsModalRef;

  constructor(
    private router: Router,
    private eventService: EventsService,
    private localStorageService: LocalStorageService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.itemTags = TagsArray.reduce((ac, cur) => [...ac, { ...cur }], []);
    this.filterTags(this.event.tags);
    this.rate = Math.round(this.event.organizer.organizerRating);
    this.toggle = this.event.isSubscribed ? true : false;
    this.checkIsRateAndSubscribe();
  }

  public routeToEvent(): void {
    this.router.navigate(['/events', this.event.id]);
  }

  private filterTags(tags: Array<TagDto>) {
    this.itemTags.forEach((item) => (item.isActive = tags.some((name) => name.nameEn === item.nameEn)));
  }

  public checkIsRateAndSubscribe(): void {
    if (this.localStorageService.getUserId()) {
      if (this.localStorageService.getUserId() === this.event.organizer.id) {
        this.disabledMode = true;
        this.isReadonly = true;
      } else {
        if (!this.event.isSubscribed) {
          this.subscribeBtn = 'Join event';
          this.isReadonly = true;
        } else {
          this.subscribeBtn = 'You are joined';
          this.isReadonly = !this.event.organizer.organizerRating ? false : true;
        }
      }
    } else {
      this.disabledMode = true;
      this.isReadonly = true;
    }
  }

  public subscribeEvent(): void {
    if (this.toggle) {
      this.eventService.removeAttender(this.event.id).subscribe();
      this.subscribeBtn = 'Join event';
      this.isReadonly = true;
      this.toggle = false;
    } else {
      this.eventService.addAttender(this.event.id).subscribe();
      this.subscribeBtn = 'You are joined';
      this.isReadonly = !this.event.organizer.organizerRating ? false : true;
      this.toggle = true;
    }
  }

  public onRateChange(): void {
    if (!this.event.organizer.organizerRating) {
      this.eventService.rateEvent(this.event.id, this.rate).subscribe();
      this.isReadonly = true;
    }
  }

  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {
      class: 'modal-dialog-centered'
    });
  }
}
