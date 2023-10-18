import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { ofType } from '@ngrx/effects';
import { ActionsSubject, Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DialogPopUpComponent } from 'src/app/shared/dialog-pop-up/dialog-pop-up.component';
import {
  AddAttenderEcoEventsByIdAction,
  DeleteEcoEventAction,
  EventsActions,
  RemoveAttenderEcoEventsByIdAction
} from 'src/app/store/actions/ecoEvents.actions';
import { Coordinates, EventPageResponceDto } from '../../models/events.interface';
import { EventsService } from '../../services/events.service';
import { MapEventComponent } from '../map-event/map-event.component';
import { JwtService } from '@global-service/jwt/jwt.service';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { AuthModalComponent } from '@global-auth/auth-modal/auth-modal.component';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { IEcoEventsState } from 'src/app/store/state/ecoEvents.state';
import { IAppState } from 'src/app/store/state/app.state';
import { EventsListItemModalComponent } from '@shared/components/events-list-item/events-list-item-modal/events-list-item-modal.component';
import { UserFriendsService } from '@global-user/services/user-friends.service';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit, OnDestroy {
  bsOpen = false;

  public icons = {
    socials: {
      plus: 'assets/img/events/plus.svg',
      twitter: 'assets/img/events/twitter.svg',
      linkedin: 'assets/img/events/linkedin.svg',
      facebook: 'assets/img/events/facebook.svg'
    },
    clock: 'assets/img/events/clock.svg',
    location: 'assets/img/events/location.svg',
    link: 'assets/img/events/link.svg',
    lock: {
      open: 'assets/img/events/lock.svg',
      closed: 'assets/img/events/lock-closed.svg'
    },
    user: 'assets/img/events/user.svg',
    ellipsis: 'assets/img/events/ellipsis.svg',
    arrowLeft: 'assets/img/icon/econews/arrow_left.svg'
  };

  private userId: number;
  public eventId: number;

  public roles = {
    UNAUTHENTICATED: 'UNAUTHENTICATED',
    USER: 'USER',
    ORGANIZER: 'ORGANIZER',
    ADMIN: 'ADMIN'
  };

  ecoEvents$ = this.store.select((state: IAppState): IEcoEventsState => state.ecoEventsState);
  public bsModalRef: BsModalRef;
  public role = this.roles.UNAUTHENTICATED;

  attendees = [];
  attendeesAvatars = [];

  public isAdmin = false;
  public event: EventPageResponceDto;
  public locationLink: string;
  public locationCoordinates: Coordinates;
  public addressUa: string;
  public addressEn: string;

  public images: string[] = [];
  public sliderIndex = 0;
  public isPosting: boolean;
  public isOver: boolean;
  public currentDate = new Date();

  public max = 5;
  public rate: number;

  deleteDialogData = {
    popupTitle: 'homepage.events.delete-title-admin',
    popupConfirm: 'homepage.events.delete-yes',
    popupCancel: 'homepage.events.delete-no',
    style: 'green'
  };

  mapDialogData: any;

  public address = 'Should be adress';

  public maxRating = 5;
  private destroy: Subject<boolean> = new Subject<boolean>();

  public backRoute: string;
  public routedFromProfile: boolean;
  public isUserCanJoin = false;
  public isUserCanRate = false;
  public isSubscribe = false;
  public addAttenderError: string;
  public isRegistered: boolean;
  public isReadonly = false;
  public isEventOrginizerFriend: boolean;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventsService,
    public router: Router,
    private localStorageService: LocalStorageService,
    private langService: LanguageService,
    private translate: TranslateService,
    private dialog: MatDialog,
    private store: Store,
    private actionsSubj: ActionsSubject,
    private jwtService: JwtService,
    private snackBar: MatSnackBarComponent,
    private modalService: BsModalService,
    private userFriendsService: UserFriendsService
  ) {}

  ngOnInit(): void {
    this.eventId = this.route.snapshot.params.id;
    const isOwnerParams = this.route.snapshot.params.isOwner;
    const isActiveParams = this.route.snapshot.params.isActive;
    const isOwner = isOwnerParams ? JSON.parse(isOwnerParams) : false;
    const isActive = isActiveParams ? JSON.parse(isActiveParams) : false;
    this.localStorageService.userIdBehaviourSubject.subscribe((id) => {
      this.userId = Number(id);
    });
    this.userFriendsService.getAllFriendsByUserId(this.userId).subscribe((res: any) => {
      this.isEventOrginizerFriend = res.page.some((el) => el.id === this.userId);
    });
    this.eventService.getEventById(this.eventId).subscribe((res: EventPageResponceDto) => {
      this.event = res;
      this.locationLink = this.event.dates[this.event.dates.length - 1].onlineLink;
      this.locationCoordinates = this.event.dates[this.event.dates.length - 1].coordinates;
      this.images = [res.titleImage, ...res.additionalImages];
      this.rate = Math.round(this.event.organizer.organizerRating);
      this.mapDialogData = {
        lat: this.event.dates[this.event.dates.length - 1].coordinates.latitude,
        lng: this.event.dates[this.event.dates.length - 1].coordinates.longitude
      };
      this.isRegistered = !!this.userId;
      this.isSubscribe = this.event.isSubscribed;
      this.isUserCanRate = this.isSubscribe && !isActive && !isOwner;
      this.isUserCanJoin = !this.isSubscribe && isActive && !isOwner;
      this.role = this.verifyRole();
      this.ecoEvents$.subscribe((result: IEcoEventsState) => {
        this.addAttenderError = result.error;
      });
    });

    this.localStorageService.setEditMode('canUserEdit', true);

    this.eventService.getAllAttendees(this.eventId).subscribe((attendees) => {
      this.attendees = attendees;
      this.attendeesAvatars = attendees.filter((attendee) => attendee.imagePath).map((attendee) => attendee.imagePath);
    });

    this.actionsSubj.pipe(ofType(EventsActions.DeleteEcoEventSuccess)).subscribe(() => this.router.navigate(['/events']));

    this.routedFromProfile = this.localStorageService.getPreviousPage() === '/profile';
    this.backRoute = this.localStorageService.getPreviousPage();
  }

  public getAddress(): string {
    return this.eventService.getFormattedAddress(this.locationCoordinates);
  }

  private verifyRole(): string {
    let role = this.roles.UNAUTHENTICATED;
    role = this.jwtService.getUserRole() === 'ROLE_USER' ? this.roles.USER : role;
    role = this.userId === this.event.organizer.id ? this.roles.ORGANIZER : role;
    role = this.jwtService.getUserRole() === 'ROLE_ADMIN' ? this.roles.ADMIN : role;
    return role;
  }

  public navigateToEditEvent(): void {
    this.localStorageService.setEditMode('canUserEdit', true);
    this.localStorageService.setEventForEdit('editEvent', this.event);
    this.router.navigate(['/events', 'create-event']);
  }

  public openMap(event): void {
    const dataToMap = {
      address: event.coordinates.addressEn,
      lat: event.coordinates.latitude,
      lng: event.coordinates.longitude
    };
    this.dialog.open(MapEventComponent, {
      data: dataToMap,
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: true,
      panelClass: '',
      width: '900px',
      height: '400px'
    });
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
          this.store.dispatch(DeleteEcoEventAction({ id: this.eventId }));
          this.isPosting = true;
        }
      });
  }

  public getLangValue(uaValue: string, enValue: string): string {
    return this.langService.getLangValue(uaValue, enValue) as string;
  }

  public buttonAction(event: Event): void {
    if (this.role === this.roles.UNAUTHENTICATED) {
      this.openAuthModalWindow('sign-in');
    }
    if (this.isUserCanJoin && this.addAttenderError) {
      this.snackBar.openSnackBar('errorJoinEvent');
      this.addAttenderError = '';
    }
    if (this.isUserCanJoin && !this.addAttenderError) {
      this.snackBar.openSnackBar('joinedEvent');
      this.userId ? this.store.dispatch(AddAttenderEcoEventsByIdAction({ id: this.event.id })) : this.openAuthModalWindow('sign-in');
      this.isUserCanJoin = !this.isUserCanJoin;
    } else {
      this.store.dispatch(RemoveAttenderEcoEventsByIdAction({ id: this.event.id }));
      this.isUserCanJoin = !this.isUserCanJoin;
    }
    const buttonElement = event.target as HTMLButtonElement;
    buttonElement.blur();
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

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
