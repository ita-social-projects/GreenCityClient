import {
  AddAttenderEcoEventsByIdAction,
  DeleteEcoEventAction,
  RemoveAttenderEcoEventsByIdAction
} from 'src/app/store/actions/ecoEvents.actions';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TagsArray } from '../../../events/models/event-consts';
import { EventPageResponceDto, TagDto, TagObj } from '../../../events/models/events.interface';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { EventsListItemModalComponent } from './events-list-item-modal/events-list-item-modal.component';
import { EventListItemSuccessComponent } from './events-list-item-success/events-list-item-success';
import { MatDialog } from '@angular/material/dialog';
import { DialogPopUpComponent } from 'src/app/shared/dialog-pop-up/dialog-pop-up.component';
import { TranslateService } from '@ngx-translate/core';
import { ReplaySubject, Subscription } from 'rxjs';
import { UserOwnAuthService } from '@auth-service/user-own-auth.service';
import { DatePipe } from '@angular/common';
import { EventsService } from '../../../events/services/events.service';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { AuthModalComponent } from '@global-auth/auth-modal/auth-modal.component';

@Component({
  selector: 'app-events-list-item',
  templateUrl: './events-list-item.component.html',
  styleUrls: ['./events-list-item.component.scss']
})
export class EventsListItemComponent implements OnInit, OnDestroy {
  @Input() event: EventPageResponceDto;
  private destroyed$: ReplaySubject<any> = new ReplaySubject<any>(1);
  public itemTags: Array<TagObj>;
  public activeTags: Array<TagObj>;

  public nameBtn: string;
  public styleBtn: string;
  public isJoinBtnHidden = false;
  public rate: number;
  public userId: number;
  public author: string;

  public isJoined: boolean;
  public isEventOpen: boolean;
  public isOwner: boolean;
  public isRegistered: boolean;
  public isFinished: boolean;
  public isReadonly = false;
  public isPosting: boolean;
  public isRated: boolean;

  public max = 3;

  public bsModalRef: BsModalRef;

  public langChangeSub: Subscription;
  public currentLang: string;
  public datePipe;
  public newDate;
  bookmarkSelected = false;

  attendees = [];
  attendeesAvatars = [];

  deleteDialogData = {
    popupTitle: 'homepage.events.delete-title',
    popupConfirm: 'homepage.events.delete-yes',
    popupCancel: 'homepage.events.delete-no'
  };

  @Output() public isLoggedIn: boolean;

  constructor(
    public router: Router,
    private localStorageService: LocalStorageService,
    private langService: LanguageService,
    private userOwnAuthService: UserOwnAuthService,
    private modalService: BsModalService,
    private dialog: MatDialog,
    private store: Store,
    private eventService: EventsService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.itemTags = TagsArray.reduce((ac, cur) => [...ac, { ...cur }], []);
    this.filterTags(this.event.tags);
    this.rate = Math.round(this.event.organizer.organizerRating);
    this.getUserId();
    this.userOwnAuthService.getDataFromLocalStorage();
    this.checkUserSingIn();
    this.initAllStatusesOfEvent();
    this.checkAllStatusesOfEvent();
    this.subscribeToLangChange();
    this.getAllAttendees();
    this.bindLang(this.localStorageService.getCurrentLanguage());
    this.author = this.event.organizer.name;
  }

  public routeToEvent(): void {
    this.router.navigate(['/events', this.event.id]);
  }

  public filterTags(tags: Array<TagDto>) {
    this.itemTags.forEach((item) => (item.isActive = tags.some((name) => name.nameEn === item.nameEn)));
    this.activeTags = this.itemTags.filter((val) => val.isActive);
  }

  public initAllStatusesOfEvent(): void {
    this.isJoined = this.event.isSubscribed;
    this.isEventOpen = this.event.open;
    this.isOwner = this.userId === this.event.organizer.id;
    this.isRegistered = !!this.userId;
    this.isFinished = Date.parse(this.event.dates[0].finishDate) < Date.parse(new Date().toString());
    this.isRated = !!this.rate;
  }

  public getUserId(): void {
    this.localStorageService.userIdBehaviourSubject.subscribe((id) => (this.userId = id));
  }

  private checkUserSingIn(): void {
    this.userOwnAuthService.credentialDataSubject.subscribe((data) => {
      this.isLoggedIn = data && data.userId;
      this.userId = data.userId;
      this.handleUserAuthorization();
    });
  }

  public handleUserAuthorization(): void {
    if (this.isLoggedIn) {
      if (this.isOwner) {
        return;
      }
      this.nameBtn = this.isJoined ? 'event.btn-cancel' : 'event.btn-join';
      this.styleBtn = this.isJoined ? 'secondary-global-button' : 'primary-global-button';
      return;
    }
    this.isJoinBtnHidden = true;
  }

  public checkAllStatusesOfEvent(): void {
    if (this.isEventOpen && !this.isFinished) {
      this.checkIsOwner(this.isOwner);
    } else {
      if (this.isOwner) {
        this.nameBtn = 'event.btn-delete';
        this.styleBtn = 'secondary-global-button';
      } else {
        this.checkIsRate(this.isRated);
      }
    }
  }

  public checkIsOwner(isOwner: boolean): void {
    if (isOwner) {
      this.nameBtn = 'event.btn-edit';
      this.styleBtn = 'secondary-global-button';
    } else {
      this.nameBtn = this.isJoined ? 'event.btn-cancel' : 'event.btn-join';
      this.styleBtn = this.isJoined ? 'secondary-global-button' : 'primary-global-button';
    }
  }

  public checkIsRate(isRated: boolean): void {
    if (isRated) {
      this.nameBtn = 'event.btn-see';
      this.styleBtn = 'secondary-global-button';
    } else {
      this.isJoinBtnHidden = this.isJoined && !this.isLoggedIn;
      this.nameBtn = !this.isEventOpen ? 'event.btn-see' : 'event.btn-rate';
      this.styleBtn = !this.isRated ? 'primary-global-button' : 'secondary-global-button';
    }
  }

  public buttonAction(): void {
    switch (this.isRegistered) {
      case this.isEventOpen && !this.isFinished:
        if (this.isOwner) {
          this.localStorageService.setEditMode('canUserEdit', true);
          this.localStorageService.setEventForEdit('editEvent', this.event);
          this.router.navigate(['events/', 'create-event']);
        } else {
          if (this.isJoined) {
            this.joinNotification();
          }
          this.actionIsJoined(this.isJoined);
        }
        break;

      case false:
        if (this.isOwner) {
          this.deleteEvent();
        } else {
          if (!this.isRated && this.isEventOpen) {
            this.openModal();
          }
        }
        break;
      default:
        this.openModal();
    }
  }

  public joinNotification(): void {
    const initialState = {
      id: this.event.id,
      isRegistered: this.isRegistered,
      isReadonly: this.isReadonly
    };
    this.bsModalRef = this.modalService.show(EventListItemSuccessComponent, { class: 'modal-dialog-centered', initialState });
    this.bsModalRef.content.closeBtnName = 'event.btn-close';
  }

  public actionIsJoined(isJoined: boolean) {
    if (isJoined) {
      this.store.dispatch(RemoveAttenderEcoEventsByIdAction({ id: this.event.id }));
      this.nameBtn = 'event.btn-join';
      this.styleBtn = 'primary-global-button';
      this.isReadonly = true;
      this.isJoined = false;
    } else {
      this.store.dispatch(AddAttenderEcoEventsByIdAction({ id: this.event.id }));
      this.nameBtn = 'event.btn-cancel';
      this.styleBtn = 'secondary-global-button';
      this.isReadonly = !this.event.organizer.organizerRating ? false : true;
      this.isJoined = true;
    }
  }

  public openModal(): void {
    const initialState = {
      id: this.event.id,
      isRegistered: this.isRegistered,
      max: this.max,
      isReadonly: this.isReadonly
    };

    this.bsModalRef = this.modalService.show(EventsListItemModalComponent, { class: 'modal-dialog-centered', initialState });
    this.bsModalRef.content.closeBtnName = 'event.btn-close';
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

  public bindLang(lang: string): void {
    this.translate.setDefaultLang(lang);
    this.currentLang = this.localStorageService.getCurrentLanguage();
  }

  public subscribeToLangChange(): void {
    this.langChangeSub = this.localStorageService.languageSubject.subscribe(this.bindLang.bind(this));
    this.localStorageService.languageBehaviourSubject.subscribe((lang: string) => {
      this.currentLang = lang;
      this.datePipe = new DatePipe(this.currentLang);
      this.newDate = this.datePipe.transform(new Date(), 'MMM dd, yyyy');
    });
  }

  cutTitle(): string {
    const maxTitleLength = 30;
    return this.event.title.length > 40 ? this.event.title.slice(0, maxTitleLength) + '...' : this.event.title;
  }

  cutDescription(): string {
    const maxDescriptionLength = 90;
    return this.event.description.length > 90 ? this.event.description.slice(0, maxDescriptionLength) + '...' : this.event.description;
  }

  getAllAttendees() {
    this.eventService.getAllAttendees(this.event.id).subscribe((attendees) => {
      this.attendees = attendees;
      this.attendeesAvatars = attendees.filter((attendee) => attendee.imagePath).map((attendee) => attendee.imagePath);
    });
  }

  public getLangValue(uaValue: string, enValue: string): string {
    return this.langService.getLangValue(uaValue, enValue) as string;
  }

  addToFavourite() {
    this.bookmarkSelected = !this.bookmarkSelected;
    if (!this.isRegistered) {
      this.openAuthModalWindow('sign-in');
    }
  }

  public openAuthModalWindow(page: string): void {
    this.dialog.open(AuthModalComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      panelClass: ['custom-dialog-container'],
      data: {
        popUpName: page
      }
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
    this.langChangeSub.unsubscribe();
  }
}
