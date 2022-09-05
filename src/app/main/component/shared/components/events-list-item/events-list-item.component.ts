import {
  AddAttenderEcoEventsByIdAction,
  DeleteEcoEventAction,
  RemoveAttenderEcoEventsByIdAction
} from 'src/app/store/actions/ecoEvents.actions';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TagsArray } from '../../../events/models/event-consts';
import { EventPageResponceDto, TagDto, TagObj } from '../../../events/models/events.interface';
import { EventsService } from '../../../events/services/events.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { EventsListItemModalComponent } from './events-list-item-modal/events-list-item-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogPopUpComponent } from 'src/app/shared/dialog-pop-up/dialog-pop-up.component';

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
  public rate: number;

  public isJoined: boolean;
  public isEventOpen: boolean;
  public isOwner: boolean;
  public isRegistered: boolean;
  public isFinished: boolean;
  public isReadonly = false;
  public isPosting: boolean;

  public max = 3;

  public bsModalRef: BsModalRef;

  deleteDialogData = {
    popupTitle: 'homepage.events.delete-title',
    popupConfirm: 'homepage.events.delete-yes',
    popupCancel: 'homepage.events.delete-no'
  };

  constructor(
    private router: Router,
    private eventService: EventsService,
    private localStorageService: LocalStorageService,
    private modalService: BsModalService,
    private dialog: MatDialog,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.itemTags = TagsArray.reduce((ac, cur) => [...ac, { ...cur }], []);
    this.filterTags(this.event.tags);
    this.checkAllStatusesOfEvent();
  }

  public routeToEvent(): void {
    this.router.navigate(['/events', this.event.id]);
  }

  private filterTags(tags: Array<TagDto>) {
    this.itemTags.forEach((item) => (item.isActive = tags.some((name) => name.nameEn === item.nameEn)));
  }

  public checkAllStatusesOfEvent(): void {
    this.rate = Math.round(this.event.organizer.organizerRating);
    this.isJoined = this.event.isSubscribed ? true : false;
    this.isEventOpen = this.event.open;
    this.isOwner = this.localStorageService.getUserId() === this.event.organizer.id;
    this.isRegistered = this.localStorageService.getUserId() ? true : false;
    this.isFinished = Date.parse(this.event.dates[0].finishDate) < Date.parse(new Date().toString());

    if (this.isEventOpen && !this.isFinished) {
      if (this.isOwner) {
        this.nameBtn = 'Edit event';
        this.styleBtn = 'secondary-global-button';
      } else {
        this.nameBtn = this.isJoined ? 'Cancel join event' : 'Join event';
        this.styleBtn = this.isJoined ? 'secondary-global-button' : 'primary-global-button';
      }
    } else {
      if (this.isOwner) {
        this.nameBtn = 'Delete';
        this.styleBtn = 'secondary-global-button';
      } else {
        if (this.rate) {
          this.nameBtn = 'See rating';
          this.styleBtn = 'secondary-global-button';
        } else {
          this.disabledMode = this.isJoined ? false : true;
          this.nameBtn = !this.isEventOpen ? 'See rating' : 'Rate Organizer';
          this.styleBtn = !this.rate ? 'primary-global-button' : 'secondary-global-button';
        }
      }
    }
  }

  public buttonAction(): void {
    if (this.isRegistered) {
      if (this.isEventOpen && !this.isFinished) {
        if (this.isOwner) {
          this.localStorageService.setEditMode('canUserEdit', true);
          this.localStorageService.setEventForEdit('editEvent', this.event);
          this.router.navigate(['events/', 'create-event']);
        } else {
          if (this.isJoined) {

            this.store.dispatch(RemoveAttenderEcoEventsByIdAction({ id: this.event.id }));
            this.nameBtn = 'Join event';
            this.styleBtn = 'primary-global-button';
            this.isReadonly = true;
            this.isJoined = false;
          } else {
            this.store.dispatch(AddAttenderEcoEventsByIdAction({ id: this.event.id }));
            this.nameBtn = 'Cancel join event';
            this.styleBtn = 'secondary-global-button';
            this.isReadonly = !this.event.organizer.organizerRating ? false : true;
            this.isJoined = true;
          }
        }
      } else {
        if (this.isOwner) {
          this.deleteEvent();
        } else {
          if (!this.rate && this.isEventOpen) {
            this.openModal();
          }
        }
      }
    } else {
      this.openModal();
    }
  }

  openModal() {
    const initialState = {
      id: this.event.id,
      switcher: this.isRegistered,
      max: this.max,
      isReadonly: this.isReadonly
    };

    this.bsModalRef = this.modalService.show(EventsListItemModalComponent, { class: 'modal-dialog-centered', initialState });
    this.bsModalRef.content.closeBtnName = 'Close';
  }

  public deleteEvent(): void {
    const matDialogRef = this.dialog.open(DialogPopUpComponent, {
      data: this.deleteDialogData,
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: true,
      panelClass: '',
      width: '300px'
    });

    matDialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((res) => {
        if (res) {
          this.store.dispatch(DeleteEcoEventAction({ id: this.event.id }));
          this.isPosting = true;
        }
      });
  }
}
