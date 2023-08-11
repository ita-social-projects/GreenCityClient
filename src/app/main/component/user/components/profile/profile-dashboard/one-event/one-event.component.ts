import { userAssignedCardsIcons } from 'src/app/main/image-pathes/profile-icons';
import {
  AddAttenderEcoEventsByIdAction,
  DeleteEcoEventAction,
  RemoveAttenderEcoEventsByIdAction
} from 'src/app/store/actions/ecoEvents.actions';
import { IAppState } from 'src/app/store/state/app.state';
import { IEcoEventsState } from 'src/app/store/state/ecoEvents.state';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TagsArray } from 'src/app/main/component/events/models/event-consts';
import { EventPageResponceDto, TagDto, TagObj, EventDTO } from 'src/app/main/component/events/models/events.interface';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { EventsListItemModalComponent } from '@shared/components/events-list-item/events-list-item-modal/events-list-item-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogPopUpComponent } from 'src/app/shared/dialog-pop-up/dialog-pop-up.component';
import { TranslateService } from '@ngx-translate/core';
import { ReplaySubject, Subscription } from 'rxjs';
import { UserOwnAuthService } from '@auth-service/user-own-auth.service';
import { DatePipe } from '@angular/common';
import { EventsService } from 'src/app/main/component/events/services/events.service';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { AuthModalComponent } from '@global-auth/auth-modal/auth-modal.component';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { MaxTextLengthPipe } from 'src/app/ubs/ubs-admin/components/shared/max-text-length/max-text-length.pipe';

@Component({
  selector: 'app-one-event',
  templateUrl: './one-event.component.html',
  styleUrls: ['./one-event.component.scss'],
  providers: [MaxTextLengthPipe]
})
export class OneEventComponent {
  @Input() public event: EventPageResponceDto;
  @Input() public userId: number;
  private destroyed$: ReplaySubject<any> = new ReplaySubject<any>(1);
  public itemTags: Array<TagObj>;
  public activeTags: Array<TagObj>;
  profileIcons = userAssignedCardsIcons;

  ecoEvents$ = this.store.select((state: IAppState): IEcoEventsState => state.ecoEventsState);

  public title: string;
  public description: string;

  public rate: number;
  public author: string;

  public isRated: boolean;

  public isRegistered: boolean;
  public isReadonly = false;
  public isPosting: boolean;
  public isEventFavorite = false;
  public btnStyle: string;
  public nameBtn: string;

  public max = 3;

  public bsModalRef: BsModalRef;

  public langChangeSub: Subscription;
  public currentLang: string;
  public datePipe;
  public newDate;
  bookmarkSelected = false;
  public address;
  public addAttenderError: string;
  public isOnline: string;
  isOwner: boolean;
  isActive: boolean;
  attendeesAvatars = [];
  attendees = [];

  constructor(
    public router: Router,
    private localStorageService: LocalStorageService,
    private langService: LanguageService,
    private userOwnAuthService: UserOwnAuthService,
    private dialog: MatDialog,
    private store: Store,
    private eventService: EventsService,
    private translate: TranslateService,
    private maxTextLengthPipe: MaxTextLengthPipe
  ) {}

  ngOnInit(): void {
    this.isOwner = +this.userId === this.event.organizer.id;
    this.isActive = this.checkIsActive();
    this.itemTags = TagsArray.reduce((ac, cur) => [...ac, { ...cur }], []);
    this.title = this.maxTextLengthPipe.transform(this.event.title, 10);
    this.description = this.maxTextLengthPipe.transform(this.event.description, 90);
    this.userOwnAuthService.getDataFromLocalStorage();
    this.subscribeToLangChange();
    this.getAllAttendees();
    this.bindLang(this.localStorageService.getCurrentLanguage());
    this.address = this.event.dates[0].coordinates;
    this.isOnline = this.event.dates[0].onlineLink;
    this.ecoEvents$.subscribe((res: IEcoEventsState) => {
      this.addAttenderError = res.error;
    });
  }

  public checkIsActive(): boolean {
    const curentDate = new Date();
    const eventDates = this.event.dates.find((date) => curentDate <= new Date(date.finishDate));
    return !!eventDates;
  }

  public routeToEvent(): void {
    this.router.navigate(['/events', this.event.id, { isOwner: this.isOwner, isActive: this.isActive }]);
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
      this.newDate = this.datePipe.transform(this.event.creationDate, 'MMM dd, yyyy');
    });
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
    if (!this.isRegistered) {
      this.openAuthModalWindow('sign-in');
    } else {
      this.bookmarkSelected = !this.bookmarkSelected;
    }

    const sendEventDto = {
      isFavorite: this.bookmarkSelected
    };
    const formData: FormData = new FormData();
    const stringifiedDataToSend = JSON.stringify(sendEventDto);
    const dtoName = 'EventPageResponceDto';

    formData.append(dtoName, stringifiedDataToSend);
    this.eventService.editEvent(formData);
  }

  public openAuthModalWindow(page: string): void {
    this.dialog
      .open(AuthModalComponent, {
        hasBackdrop: true,
        closeOnNavigation: true,
        panelClass: ['custom-dialog-container'],
        data: {
          popUpName: page
        }
      })
      .afterClosed()
      .subscribe((result) => {
        this.isRegistered = !!result;
        if (this.isRegistered) {
          this.addToFavourite();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
    this.destroyed$.unsubscribe();
    this.langChangeSub.unsubscribe();
  }
}
