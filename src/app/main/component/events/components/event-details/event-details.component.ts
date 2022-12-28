import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { ofType } from '@ngrx/effects';
import { ActionsSubject, Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { DialogPopUpComponent } from 'src/app/shared/dialog-pop-up/dialog-pop-up.component';
import { DeleteEcoEventAction, EventsActions } from 'src/app/store/actions/ecoEvents.actions';
import { singleNewsImages } from '../../../../image-pathes/single-news-images';
import { EventPageResponceDto } from '../../models/events.interface';
import { EventsService } from '../../services/events.service';
import { MapEventComponent } from '../map-event/map-event.component';
import { JwtService } from '@global-service/jwt/jwt.service';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit {
  public icons = {
    socials: {
      plus: 'assets/img/events/plus.svg',
      twitter: 'assets/img/events/twitter.svg',
      linkedin: 'assets/img/events/linkedin.svg',
      facebook: 'assets/img/events/facebook.svg'
    },
    clock: 'assets/img/events/clock.svg',
    location: 'assets/img/events/location.svg',
    lock: 'assets/img/events/lock.svg',
    user: 'assets/img/events/user.svg',
    ellipsis: 'assets/img/events/ellipsis.svg',
    arrowLeft: 'assets/img/icon/econews/arrow_left.svg'
  };

  private eventId: number;
  private userId: number;

  public roles = {
    UNAUTHENTICATED: 'UNAUTHENTICATED',
    USER: 'USER',
    ORGANIZER: 'ORGANIZER',
    ADMIN: 'ADMIN'
  };

  public role = this.roles.UNAUTHENTICATED;

  attendees = [];

  public isAdmin = false;
  // public icons = singleNewsImages;
  public event: EventPageResponceDto;

  public images: string[] = [];
  public sliderIndex = 0;
  public isPosting: boolean;

  public max = 5;
  public rate: number;
  // public isReadonly = true;

  deleteDialogData = {
    popupTitle: 'homepage.events.delete-title',
    popupConfirm: 'homepage.events.delete-yes',
    popupCancel: 'homepage.events.delete-no'
  };

  mapDialogData: any;

  public address = 'Should be adress';

  // public readonly = false;
  public maxRating = 5;
  constructor(
    private route: ActivatedRoute,
    private eventService: EventsService,
    public router: Router,
    private localStorageService: LocalStorageService,
    private dialog: MatDialog,
    private store: Store,
    private actionsSubj: ActionsSubject,
    private jwtService: JwtService
  ) {}

  ngOnInit(): void {
    this.eventId = this.route.snapshot.params.id;
    this.localStorageService.userIdBehaviourSubject.subscribe((id) => {
      this.userId = Number(id);
    });

    this.localStorageService.setEditMode('canUserEdit', true);

    this.eventService.getEventById(this.eventId).subscribe((res: EventPageResponceDto) => {
      this.event = res;
      // this.localStorageService.setEventForEdit('editEvent', this.event);
      this.images = [res.titleImage, ...res.additionalImages];
      this.rate = Math.round(this.event.organizer.organizerRating);
      this.mapDialogData = {
        lat: this.event.dates[0].coordinates.latitude,
        lng: this.event.dates[0].coordinates.longitude
      };

      this.role = this.verifyRole();
    });

    this.eventService.getAllAttendees(this.eventId).subscribe((attendees) => {
      this.attendees = attendees;
    });

    this.actionsSubj.pipe(ofType(EventsActions.DeleteEcoEventSuccess)).subscribe(() => this.router.navigate(['/events']));
  }

  private verifyRole() {
    let role = this.roles.UNAUTHENTICATED;
    role = this.jwtService.getUserRole() === 'ROLE_USER' ? this.roles.USER : role;
    role = this.userId === this.event.organizer.id ? this.roles.ORGANIZER : role;
    role = this.jwtService.getUserRole() === 'ROLE_ADMIN' ? this.roles.ADMIN : role;
    return role;
  }

  public navigateToEditEvent(): void {
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
}
