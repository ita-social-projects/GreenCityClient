import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { ofType } from '@ngrx/effects';
import { ActionsSubject, Store } from '@ngrx/store';
import { take, takeUntil } from 'rxjs/operators';
import { DialogPopUpComponent } from 'src/app/shared/dialog-pop-up/dialog-pop-up.component';
import { DeleteEcoEventAction, EventsActions } from 'src/app/store/actions/ecoEvents.actions';
import { EventPageResponceDto } from '../../models/events.interface';
import { EventsService } from '../../services/events.service';
import { MapEventComponent } from '../map-event/map-event.component';
import { JwtService } from '@global-service/jwt/jwt.service';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { EventsListItemComponent } from '../../../shared/components/events-list-item/events-list-item.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent extends EventsListItemComponent implements OnInit, OnDestroy {
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

  private eventId: number;
  public userId: number;

  public roles = {
    UNAUTHENTICATED: 'UNAUTHENTICATED',
    USER: 'USER',
    ORGANIZER: 'ORGANIZER',
    ADMIN: 'ADMIN'
  };

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

  public btnStyle: string;
  public styleBtn = {
    secondary: 'secondary-global-button',
    primary: 'primary-global-button',
    hiden: 'event-button-hiden'
  };

  mapDialogData: any;

  public address = 'Should be adress';

  public maxRating = 5;
  public currentLang: string;
  private destroy: Subject<boolean> = new Subject<boolean>();

  public backRoute: string;
  public routedFromProfile: boolean;

  constructor(
    public route: ActivatedRoute,
    public eventService: EventsService,
    public router: Router,
    public localStorageService: LocalStorageService,
    public langService: LanguageService,
    public translate: TranslateService,
    public dialog: MatDialog,
    public store: Store,
    private actionsSubj: ActionsSubject,
    private jwtService: JwtService,
    public modalService?: BsModalService,
    public snackBar?: MatSnackBarComponent
  ) {
    super(router, route, localStorageService, langService, dialog, store, eventService, translate, modalService);
  }

  ngOnInit(): void {
    this.eventId = this.route.snapshot.params.id;
    this.localStorageService.userIdBehaviourSubject.subscribe((id) => {
      this.userId = Number(id);
    });

    this.eventService.getEventById(this.eventId).subscribe((res: EventPageResponceDto) => {
      this.event = res;
      this.checkButtonStatus();
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

  public bindLang(lang: string): void {
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

  public checkButtonStatus(): void {
    const isSubscribe = this.event.isSubscribed;
    const isOwner = this.userId === this.event.organizer.id;
    const isActive = this.checkIsActive();
    if (isSubscribe && isActive && !isOwner) {
      this.btnStyle = this.styleBtn.secondary;
      this.nameBtn = this.btnName.cancel;
      return;
    }
    if (!isSubscribe && isActive && !isOwner) {
      this.btnStyle = this.styleBtn.primary;
      this.nameBtn = this.btnName.join;
      return;
    }
    if (isSubscribe && !isActive && !isOwner) {
      this.btnStyle = this.styleBtn.primary;
      this.nameBtn = this.btnName.rate;
      return;
    }
    if (!!this.userId) {
      this.btnStyle = this.styleBtn.primary;
      this.nameBtn = this.btnName.join;
    }
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

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
