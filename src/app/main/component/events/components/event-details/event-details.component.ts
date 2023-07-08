import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { ofType } from '@ngrx/effects';
import { ActionsSubject, Store } from '@ngrx/store';
import { take, takeUntil } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DialogPopUpComponent } from 'src/app/shared/dialog-pop-up/dialog-pop-up.component';
import {
  AddAttenderEcoEventsByIdAction,
  DeleteEcoEventAction,
  EventsActions,
  RemoveAttenderEcoEventsByIdAction
} from 'src/app/store/actions/ecoEvents.actions';
import { EventPageResponceDto } from '../../models/events.interface';
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
  public locationAddress: string;
  public addressUa: string;
  public addressEn: string;

  public images: string[] = [];
  public sliderIndex = 0;
  public isPosting: boolean;

  public max = 5;
  public rate: number;

  deleteDialogData = {
    popupTitle: 'homepage.events.delete-title-admin',
    popupConfirm: 'homepage.events.delete-yes',
    popupCancel: 'homepage.events.delete-no',
    style: 'red'
  };

  mapDialogData: any;

  public address = 'Should be adress';

  public maxRating = 5;
  public currentLang: string;
  private destroy: Subject<boolean> = new Subject<boolean>();

  public backRoute: string;
  public routedFromProfile: boolean;
  public isUserCanJoin = false;
  public isUserCanRate = false;
  public isSubscribe = false;
  public addAttenderError: string;
  public isRegistered: boolean;
  public isReadonly = false;

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
    private modalService: BsModalService
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

    this.eventService.getEventById(this.eventId).subscribe((res: EventPageResponceDto) => {
      this.event = res;
      this.locationLink = this.event.dates[0].onlineLink;
      this.addressUa = this.eventService.createAdresses(this.event.dates[0].coordinates, 'Ua');
      this.addressEn = this.eventService.createAdresses(this.event.dates[0].coordinates, 'En');
      this.locationAddress = this.getLangValue(this.addressUa, this.addressEn);
      this.images = [res.titleImage, ...res.additionalImages];
      this.rate = Math.round(this.event.organizer.organizerRating);
      this.mapDialogData = {
        lat: this.event.dates[0].coordinates.latitude,
        lng: this.event.dates[0].coordinates.longitude
      };

      this.isRegistered = !!this.userId;
      this.isSubscribe = this.event.isSubscribed;
      this.isUserCanRate = this.isSubscribe && !isActive && !isOwner;
      this.isUserCanJoin = !this.isSubscribe && isActive && !isOwner;
      this.ecoEvents$.subscribe((result: IEcoEventsState) => {
        this.addAttenderError = result.error;
      });
      this.role = this.verifyRole();
    });

    this.currentLang = this.localStorageService.getCurrentLanguage();
    this.localStorageService.languageBehaviourSubject.pipe(takeUntil(this.destroy)).subscribe((lang: string) => {
      this.currentLang = lang;
      this.bindLang(this.currentLang);
      this.locationAddress = this.getLangValue(this.addressUa, this.addressEn);
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

  private bindLang(lang: string): void {
    this.translate.setDefaultLang(lang);
  }

  private verifyRole() {
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

  public getLangValue(uaValue, enValue): string {
    return this.langService.getLangValue(uaValue, enValue) as string;
  }

  public buttonAction() {
    if (this.isUserCanJoin) {
      if (this.addAttenderError) {
        this.snackBar.openSnackBar('errorJoinEvent');
        this.addAttenderError = '';
      } else {
        this.snackBar.openSnackBar('joinedEvent');
        !!this.userId ? this.store.dispatch(AddAttenderEcoEventsByIdAction({ id: this.event.id })) : this.openAuthModalWindow('sign-in');
      }
    } else {
      this.store.dispatch(RemoveAttenderEcoEventsByIdAction({ id: this.event.id }));
    }
    this.isUserCanJoin = !this.isUserCanJoin;
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
