import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { EventPageResponceDto, PaginationInterface } from '../../models/events.interface';
import { UserOwnAuthService } from '@auth-service/user-own-auth.service';
import { ReplaySubject } from 'rxjs';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/state/app.state';
import { IEcoEventsState } from 'src/app/store/state/ecoEvents.state';
import { GetEcoEventsByPageAction } from 'src/app/store/actions/ecoEvents.actions';
import { TagsArray, eventTimeList, eventStatusList, tempLocationList } from '../../models/event-consts';
import { LanguageService } from '../../../../i18n/language.service';
import { Router } from '@angular/router';
import { AuthModalComponent } from '@global-auth/auth-modal/auth-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss']
})
export class EventsListComponent implements OnInit, OnDestroy {
  public eventsList: EventPageResponceDto[] = [];

  public isLoggedIn: string;
  private destroyed$: ReplaySubject<any> = new ReplaySubject<any>(1);
  ecoEvents$ = this.store.select((state: IAppState): IEcoEventsState => state.ecoEventsState);

  private visitedPagesArr: number[];

  public page = 0;
  public hasNext = true;
  public remaining = 0;
  private eventsPerPage = 6;
  public elementsArePresent = true;
  selectedFilters = ['Lviv', 'Kyiv', 'Odesa', 'Kharkiv', 'Donetsk']; // test data,should be deleted when back-end is ready
  searchToggle = false;
  bookmarkSelected = false;
  selectedEventTime: any;
  eventTimeList = eventTimeList;
  typeList = TagsArray;
  statusList = eventStatusList;
  eventLocationList = tempLocationList;
  allSelected = false;
  public scroll: boolean;
  private dialog: MatDialog;

  constructor(
    private store: Store,
    private userOwnAuthService: UserOwnAuthService,
    private languageService: LanguageService,
    private localStorageService: LocalStorageService,
    private router: Router,
    public injector: Injector
  ) {
    this.dialog = injector.get(MatDialog);
  }

  ngOnInit(): void {
    this.localStorageService.setEditMode('canUserEdit', false);
    this.checkUserSingIn();
    this.userOwnAuthService.getDataFromLocalStorage();
    this.scroll = false;
    this.dispatchStore(true);

    this.ecoEvents$.subscribe((res: IEcoEventsState) => {
      this.page = res.pageNumber;
      if (res.eventState) {
        this.eventsList = [...res.eventsList];
        const data = res.eventState;
        this.hasNext = data.hasNext;
        this.remaining = data.totalElements;
        this.elementsArePresent = this.eventsList.length < data.totalElements;
      }
    });
  }

  public dispatchStore(res: boolean): void {
    if (this.hasNext && this.page !== undefined) {
      this.store.dispatch(GetEcoEventsByPageAction({ currentPage: this.page, numberOfEvents: this.eventsPerPage, reset: res }));
    }
  }

  toggleAllSelection(): void {
    this.allSelected = !this.allSelected;
    this.selectedEventTime = this.allSelected ? this.eventTimeList : [];
  }

  search(): void {
    this.searchToggle = !this.searchToggle;
  }

  showFavourite(): void {
    this.bookmarkSelected = !this.bookmarkSelected;
  }

  deleteOneFilter(index): void {
    this.selectedFilters.splice(index, 1);
  }

  resetAll(): void {
    this.selectedFilters.splice(0, this.selectedFilters.length);
  }

  private checkUserSingIn(): void {
    this.userOwnAuthService.credentialDataSubject.subscribe((data) => (this.isLoggedIn = data && data.userId));
  }

  public getLangValue(uaValue: string, enValue: string): string {
    return this.languageService.getLangValue(uaValue, enValue) as string;
  }

  public isUserLoggedRedirect(): void {
    this.isLoggedIn ? this.router.navigate(['/events', 'create-event']) : this.openAuthModalWindow('sign-in');
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

  public onScroll(): void {
    this.scroll = true;
    this.dispatchStore(false);
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
