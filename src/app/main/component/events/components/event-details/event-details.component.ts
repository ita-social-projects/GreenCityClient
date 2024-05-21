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
import { Coordinates, EventPageResponseDto, PagePreviewDTO } from '../../models/events.interface';
import { EventsService } from '../../services/events.service';
import { JwtService } from '@global-service/jwt/jwt.service';
import { Subject, Subscription } from 'rxjs';
import { AuthModalComponent } from '@global-auth/auth-modal/auth-modal.component';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { IEcoEventsState } from 'src/app/store/state/ecoEvents.state';
import { IAppState } from 'src/app/store/state/app.state';
import { EventsListItemModalComponent } from '@shared/components/events-list-item/events-list-item-modal/events-list-item-modal.component';
import { ICONS, ROLES } from '../../models/event-consts';
import { ofType } from '@ngrx/effects';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit, OnDestroy {
  bsOpen = false;

  public icons = ICONS;
  public eventId: number;
  public roles = ROLES;
  ecoEvents$ = this.store.select((state: IAppState): IEcoEventsState => state.ecoEventsState);
  public bsModalRef: BsModalRef;
  public role = this.roles.UNAUTHENTICATED;
  public isEventFavorite: boolean;
  attendees = [];
  attendeesAvatars = [];
  public organizerName: string;
  public event: EventPageResponseDto | PagePreviewDTO;
  public locationLink: string;
  public locationCoordinates: Coordinates;
  public place: string;
  public addressUa: string;
  public addressEn: string;
  public images: string[] = [];
  public sliderIndex = 0;
  public isPosting: boolean;
  public isActive: boolean;
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
  public address = 'Should be address';
  public maxRating = 5;
  public backRoute: string;
  public routedFromProfile: boolean;
  public isUserCanJoin = false;
  public isUserCanRate = false;
  public isSubscribed = false;
  public addAttenderError: string;
  public isRegistered: boolean;
  public isReadonly = false;
  googleMapLink: string;
  private userId: number;
  private destroy: Subject<boolean> = new Subject<boolean>();
  private userNameSub: Subscription;
  private isOwner: boolean;

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
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    if (this.route.snapshot.params.id) {
      this.eventId = this.route.snapshot.params.id;
      this.localStorageService.userIdBehaviourSubject.subscribe((id) => {
        this.userId = Number(id);
      });
      this.eventService.getEventById(this.eventId).subscribe((res: EventPageResponseDto) => {
        this.event = res;
        this.organizerName = this.event.organizer.name;
        this.locationLink = this.event.dates[this.event.dates.length - 1].onlineLink;
        this.locationCoordinates = this.event.dates[this.event.dates.length - 1].coordinates;
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
          this.addAttenderError = result.error;
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
      console.log(this.event);
      this.locationLink = this.event.dates[this.event.dates.length - 1].onlineLink;
      this.place = this.event.location as string;
      this.images = this.event.imgArrayToPreview;

      this.bindUserName();
      this.formatDates();
    }
    const coords = this.event.dates[0].coordinates;
    this.googleMapLink = `https://www.google.com.ua/maps/@${coords.longitude},${coords.latitude}`;
  }

  public bindUserName(): void {
    this.userNameSub = this.localStorageService.firstNameBehaviourSubject.subscribe((name) => {
      this.organizerName = name;
    });
  }

  public getAddress(): string {
    return this.eventService.getFormattedAddress(this.locationCoordinates);
  }

  public navigateToEditEvent(): void {
    this.localStorageService.setEditMode('canUserEdit', true);
    // this.localStorageService.setEventForEdit('editEvent', this.event);
    this.eventService.setEventResponse(this.event as EventPageResponseDto);
    this.router.navigate(['/events', 'create-event']);
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

  public changeFavouriteStatus(event?: Event) {
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

  public buttonAction(event: Event): void {
    if (this.role === this.roles.UNAUTHENTICATED) {
      this.openAuthModalWindow('sign-in');
      return;
    }
    if (this.isUserCanJoin && this.addAttenderError) {
      this.snackBar.openSnackBar('errorJoinEvent');
      this.addAttenderError = '';
    }
    if (!this.isSubscribed && !this.addAttenderError) {
      this.snackBar.openSnackBar('joinedEvent');
      this.userId ? this.store.dispatch(AddAttenderEcoEventsByIdAction({ id: this.event.id })) : this.openAuthModalWindow('sign-in');
      this.isSubscribed = !this.isSubscribed;
    } else {
      this.store.dispatch(RemoveAttenderEcoEventsByIdAction({ id: this.event.id }));
      this.isSubscribed = !this.isSubscribed;
    }
  }

  public openAuthModalWindow(page: string): void {
    const matDialogRef = this.dialog.open(AuthModalComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      panelClass: ['custom-dialog-container'],
      data: {
        popUpName: page
      }
    });
    matDialogRef.afterClosed().subscribe((res) => {
      if (this.userId) {
        this.router.navigate(['/events', this.eventId]);
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
