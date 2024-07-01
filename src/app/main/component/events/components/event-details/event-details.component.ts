import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
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
import { EventDatesResponse, EventResponse, LocationResponse, PagePreviewDTO } from '../../models/events.interface';
import { EventsService } from '../../services/events.service';
import { JwtService } from '@global-service/jwt/jwt.service';
import { Subject, Subscription } from 'rxjs';
import { AuthModalComponent } from '@global-auth/auth-modal/auth-modal.component';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { IEcoEventsState } from 'src/app/store/state/ecoEvents.state';
import { IAppState } from 'src/app/store/state/app.state';
import { EventsListItemModalComponent } from '@shared/components/events-list-item/events-list-item-modal/events-list-item-modal.component';
import { ofType } from '@ngrx/effects';
import { CREATE_ROUTE, ICONS, UPDATE_ROUTE } from '../../models/event-consts';
import { WarningPopUpComponent } from '@shared/components';
import { EventStoreService } from '../../services/event-store.service';
import { LanguageService } from '../../../../i18n/language.service';
import { AttendersModalComponent } from '../attenders-modal/attenders-modal.component';
import { EventScheduleComponent } from '../event-schedule/event-schedule.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit, OnDestroy {
  icons = ICONS;
  eventId: number;
  roles = {
    UNAUTHENTICATED: 'UNAUTHENTICATED',
    USER: 'USER',
    ORGANIZER: 'ORGANIZER',
    ADMIN: 'ADMIN'
  };
  ecoEvents$ = this.store.select((state: IAppState): IEcoEventsState => state.ecoEventsState);
  bsModalRef: BsModalRef;
  role = this.roles.UNAUTHENTICATED;
  isEventFavorite: boolean;
  attendees = [];
  attendeesAvatars = [];
  placeLink: string;
  organizerName: string;
  event: EventResponse | PagePreviewDTO;
  locationCoordinates: LocationResponse;
  place: string;
  images: string[] = [];
  isFetching: boolean;
  isActive: boolean;
  currentDate = new Date();
  max = 5;
  rate: number;
  deleteDialogData = {
    popupTitle: 'homepage.events.delete-title-admin',
    popupConfirm: 'homepage.events.delete-yes',
    popupCancel: 'homepage.events.delete-no',
    style: 'green'
  };
  mapDialogData: any;
  address = 'Should be address';
  backRoute: string;
  routedFromProfile: boolean;
  isUserCanJoin = false;
  isUserCanRate = false;
  isSubscribed = false;
  attenderError: string;
  isRegistered: boolean;
  isReadonly = false;
  firstDateStart: Date;
  firstDateEnd: Date;
  onlineLink: string;
  dates: EventDatesResponse[] = [];
  protected readonly UPDATE_ROUTE = UPDATE_ROUTE;
  protected readonly CREATE_ROUTE = CREATE_ROUTE;
  private dialogRef;
  private cancelationPopupData = {
    popupTitle: 'homepage.events.pop-up-cancelling-event',
    popupConfirm: 'homepage.events.events-popup.cancelling-event-request-btn',
    popupCancel: 'homepage.events.events-popup.reject-cancelling-event-btn',
    isUBS: false,
    isUbsOrderSubmit: false,
    isHabit: false
  };
  private userId: number;
  private destroy: Subject<boolean> = new Subject<boolean>();
  private userNameSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    public eventService: EventsService,
    public router: Router,
    public localStorageService: LocalStorageService,
    private dialog: MatDialog,
    private store: Store,
    private actionsSubj: ActionsSubject,
    private jwtService: JwtService,
    private snackBar: MatSnackBarComponent,
    private modalService: BsModalService,
    private eventStore: EventStoreService,
    public languageService: LanguageService,
    private _bottomSheet: MatBottomSheet
  ) {}

  openAttendersDialog() {
    this.dialog.open(AttendersModalComponent);
  }

  ngOnInit(): void {
    if (this.route.snapshot.params.id) {
      this.eventId = this.route.snapshot.params.id;
      this.localStorageService.userIdBehaviourSubject.subscribe((id) => {
        this.userId = Number(id);
      });
      this.eventService.getEventById(this.eventId).subscribe((res: EventResponse) => {
        this.event = res;
        const fd = res.dates[0];
        this.dates = res.dates;
        this.firstDateStart = new Date(fd.startDate);
        this.firstDateEnd = new Date(fd.finishDate);
        this.place = fd.coordinates?.formattedAddressEn;
        this.placeLink = this.place
          ? `https://www.google.com/maps/search/?api=1&query=${fd.coordinates.latitude}%2C${fd.coordinates.longitude}`
          : undefined;
        this.onlineLink = fd.onlineLink;
        this.organizerName = this.event.organizer.name;
        this.locationCoordinates = fd.coordinates;
        this.images = [res.titleImage, ...res.additionalImages];
        this.rate = Math.round(this.event.organizer.organizerRating);
        this.mapDialogData = {
          lat: this.event.dates[this.event.dates.length - 1].coordinates?.latitude,
          lng: this.event.dates[this.event.dates.length - 1].coordinates?.longitude
        };
        this.isEventFavorite = this.event.isFavorite;
        this.isRegistered = !!this.userId;
        this.isSubscribed = this.event.isSubscribed;
        const isOwner = Number(this.userId) === this.event.organizer.id;
        this.isActive = this.event.isRelevant;
        this.isUserCanRate = this.isSubscribed && !this.isActive && !isOwner;
        this.isUserCanJoin = this.isActive && !isOwner;
        this.role = this.verifyRole();
        this.ecoEvents$.subscribe((result: IEcoEventsState) => {
          this.attenderError = result.error;
        });
      });

      this.localStorageService.setEditMode('canUserEdit', true);
      this.eventService.getAllAttendees(this.eventId).subscribe((attendees) => {
        this.attendees = attendees;
        this.attendeesAvatars = attendees.filter((attendee) => attendee.imagePath).map((attendee) => attendee.imagePath);
      });

      this.actionsSubj.pipe(ofType(EventsActions.DeleteEcoEventSuccess)).subscribe(() => {
        this.router.navigate(['/events']);
      });

      this.routedFromProfile = this.localStorageService.getPreviousPage() === '/profile';
      this.backRoute = this.localStorageService.getPreviousPage();
    } else {
      this.event = this.eventService.getForm() as PagePreviewDTO;
      const fd = this.event.dates[0];
      this.firstDateStart = new Date(fd.startDate);
      this.firstDateEnd = new Date(fd.finishDate);
      this.place = fd.coordinates.addressUa;
      this.placeLink = this.place
        ? `https://www.google.com/maps/search/?api=1&query=${fd.coordinates.latitude}%2C${fd.coordinates.longitude}`
        : undefined;
      this.onlineLink = fd.onlineLink;
      this.images = this.event.imgArrayToPreview;

      this.bindUserName();
      this.formatDates();
    }
  }

  bindUserName(): void {
    this.userNameSub = this.localStorageService.firstNameBehaviourSubject.subscribe((name) => {
      this.organizerName = name;
    });
  }

  getAddress(): string {
    return this.eventService.getFormattedAddress(this.locationCoordinates);
  }

  navigateToEditEvent(): void {
    this.localStorageService.setEditMode('canUserEdit', true);
    // this.localStorageService.setEventForEdit('editEvent', this.event);
    this.eventStore.setEventAuthorId(this.event.organizer.id);
    this.router.navigate(['/events', 'update-event', this.eventId]);
  }

  submitEventCancelling() {
    this.store.dispatch(RemoveAttenderEcoEventsByIdAction({ id: this.event.id }));
    this.isSubscribed = !this.isSubscribed;
  }

  openPopUp(): void {
    if (this.dialogRef) {
      return;
    }
    this.dialogRef = this.dialog.open(WarningPopUpComponent, {
      data: this.cancelationPopupData
    });

    this.dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        this.dialogRef = null;
        if (result) {
          this.submitEventCancelling();
        }
      });
  }

  openSchedule() {
    this._bottomSheet.open(EventScheduleComponent, {
      data: this.dates
    });
  }

  deleteEvent(): void {
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
          this.isFetching = true;
        }
      });
  }

  changeFavouriteStatus(event?: Event) {
    event?.stopPropagation();
    if (!this.isRegistered) {
      this.openAuthModalWindow('sign-in');
      return;
    }

    this.isEventFavorite = !this.isEventFavorite;
    const operation$ = this.isEventFavorite
      ? this.eventService.addEventToFavourites(this.event.id)
      : this.eventService.removeEventFromFavourites(this.event.id);

    operation$.subscribe({
      error: () => {
        this.snackBar.openSnackBar('error');
        this.isEventFavorite = !this.isEventFavorite;
      }
    });
    const buttonElement = event.target as HTMLButtonElement;
    buttonElement.blur();
  }

  buttonAction(): void {
    if (this.role === this.roles.UNAUTHENTICATED) {
      this.openAuthModalWindow('sign-in');
      return;
    }
    if (this.isUserCanJoin && this.attenderError) {
      this.snackBar.openSnackBar('errorJoinEvent');
      this.attenderError = '';
    }
    if (!this.isSubscribed && !this.attenderError) {
      this.snackBar.openSnackBar('joinedEvent');
      this.userId ? this.store.dispatch(AddAttenderEcoEventsByIdAction({ id: this.event.id })) : this.openAuthModalWindow('sign-in');
      this.isSubscribed = !this.isSubscribed;
    } else {
      this.openPopUp();
    }
  }

  openAuthModalWindow(page: string): void {
    const matDialogRef = this.dialog.open(AuthModalComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      panelClass: ['custom-dialog-container'],
      data: {
        popUpName: page
      }
    });
    matDialogRef.afterClosed().subscribe(() => {
      if (this.userId) {
        this.router.navigate(['/events', this.eventId]);
      }
    });
  }

  openModal(): void {
    const initialState = {
      id: this.event.id,
      isRegistered: this.isRegistered,
      max: this.max,
      isReadonly: this.isReadonly
    };

    this.bsModalRef = this.modalService.show(EventsListItemModalComponent, {
      class: 'modal-dialog-centered',
      initialState
    });
    this.bsModalRef.content.closeBtnName = 'event.btn-close';
  }

  ngOnDestroy() {
    this.destroy.next(true);
    this.destroy.unsubscribe();
  }

  private formatDates(): void {
    // this.event.dates.forEach((date) => {
    //   if (date.startDate) {
    //     date.startDate = this.eventService.transformDate(date, 'startDate');
    //   }
    //   if (date.finishDate) {
    //     date.finishDate = this.eventService.transformDate(date, 'finishDate');
    //   }
    // });
  }

  private verifyRole(): string {
    let role = this.roles.UNAUTHENTICATED;
    role = this.jwtService.getUserRole() === 'ROLE_USER' ? this.roles.USER : role;
    role = this.userId === this.event.organizer.id ? this.roles.ORGANIZER : role;
    role = this.jwtService.getUserRole() === 'ROLE_ADMIN' ? this.roles.ADMIN : role;
    return role;
  }
}
