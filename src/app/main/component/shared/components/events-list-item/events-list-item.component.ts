import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { TagsArray } from '../../../events/models/event-consts';
import { EventPageResponceDto, TagDto, TagObj } from '../../../events/models/events.interface';
import { EventsService } from '../../../events/services/events.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { EventsListItemModalComponent } from './events-list-item-modal/events-list-item-modal.component';

@Component({
  selector: 'app-events-list-item',
  templateUrl: './events-list-item.component.html',
  styleUrls: ['./events-list-item.component.scss']
})
export class EventsListItemComponent implements OnInit {
  @Input() event: EventPageResponceDto;

  public itemTags: Array<TagObj>;

  public nameBtn: string;
  public styleBtn: string;
  public disabledMode = false;
  public isJoined: boolean;
  public isEventOpen: boolean

  public max = 3;
  public rate: number;
  public isReadonly = false;

  public bsModalRef: BsModalRef;

  constructor(
    private router: Router,
    private eventService: EventsService,
    private localStorageService: LocalStorageService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.itemTags = TagsArray.reduce((ac, cur) => [...ac, { ...cur }], []);
    this.filterTags(this.event.tags);


    this.checkAllStatusOfEvent();

  }

  public routeToEvent(): void {
    this.router.navigate(['/events', this.event.id]);
  }

  private filterTags(tags: Array<TagDto>) {
    this.itemTags.forEach((item) => (item.isActive = tags.some((name) => name.nameEn === item.nameEn)));
  }

  public checkAllStatusOfEvent(): void {
    this.rate = Math.round(this.event.organizer.organizerRating);
    this.isJoined = this.event.isSubscribed ? true : false;
    this.isEventOpen = this.event.open;

    if (this.isEventOpen) {
      if (this.localStorageService.getUserId() === this.event.organizer.id) {
        this.nameBtn = 'Edit event';
        this.styleBtn = 'secondary-global-button';
      } else {
        this.nameBtn = this.isJoined ? 'Cancel join event'
          : 'Join event';
        this.styleBtn = this.isJoined ? 'secondary-global-button'
          : 'primary-global-button';
      }
    } else {
      if (this.localStorageService.getUserId() === this.event.organizer.id) {
        this.nameBtn = 'Delete';
        this.styleBtn = 'secondary-global-button';
      } else {
        this.disabledMode = this.isJoined ? false : true;
        this.nameBtn = this.rate ? 'See rating'
          : 'Rate Organizer';
        this.styleBtn = this.rate ? 'primary-global-button'
          : 'secondary-global-button';
      }
    }
  }

  public buttonAction(): void {
    if (this.localStorageService.getUserId() === this.event.organizer.id) {
      if (this.isEventOpen) {
        this.localStorageService.setEditMode('canUserEdit', true);
        this.localStorageService.setEventForEdit('editEvent', this.event);
        this.router.navigate(['events/', 'create-event']);
      }

    } else {
      this.localStorageService.setEditMode('canUserEdit', false);
      if (this.isJoined) {
        this.eventService.removeAttender(this.event.id).subscribe();
        this.nameBtn = 'Join event';
        this.styleBtn = 'primary-global-button';
        this.isReadonly = true;
        this.isJoined = false;
      } else {
        this.eventService.addAttender(this.event.id).subscribe();
        this.nameBtn = 'Cancel join event';
        this.styleBtn = 'secondary-global-button';
        this.isReadonly = !this.event.organizer.organizerRating ? false : true;
        this.isJoined = true;
      }
    }
  }

  public onRateChange(): void {
    if (!this.event.organizer.organizerRating) {
      this.eventService.rateEvent(this.event.id, this.rate).subscribe();
      this.isReadonly = true;
    }
  }

  openModal() {
    const initialState = {
      max: this.max,
      rate: this.rate,
      isReadonly: this.isReadonly
    };

    this.bsModalRef = this.modalService.show(EventsListItemModalComponent, { class: 'modal-dialog-centered', initialState });
    this.bsModalRef.content.closeBtnName = 'Close';
  }
}
