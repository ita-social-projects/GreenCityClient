import { Component, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EventPageResponceDto, PaginationInterface } from '../../models/events.interface';
import { UserOwnAuthService } from '@auth-service/user-own-auth.service';
import { ReplaySubject } from 'rxjs';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/state/app.state';
import { IEcoEventsState } from 'src/app/store/state/ecoEvents.state';
import { GetEcoEventsByPageAction } from 'src/app/store/actions/ecoEvents.actions';
import { TagsArray, eventTimeList, eventStatusList, tempLocationList, selectedFilters, OptionItem } from '../../models/event-consts';
import { LanguageService } from '../../../../i18n/language.service';
import { Router } from '@angular/router';
import { AuthModalComponent } from '@global-auth/auth-modal/auth-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss']
})
export class EventsListComponent implements OnInit, OnDestroy {
  @ViewChild('timeFilter') timeList: MatSelect;
  @ViewChild('locationFilter') locationList: MatSelect;
  @ViewChild('statusFilter') statusesList: MatSelect;
  @ViewChild('typeFilter') typesList: MatSelect;

  public timeFilterControl = new FormControl();
  public locationFilterControl = new FormControl();
  public statusFilterControl = new FormControl();
  public typeFilterControl = new FormControl();

  public eventsList: EventPageResponceDto[] = [];

  public isLoggedIn: string;
  private destroyed$: ReplaySubject<any> = new ReplaySubject<any>(1);
  ecoEvents$ = this.store.select((state: IAppState): IEcoEventsState => state.ecoEventsState);

  private visitedPagesArr: number[];

  public items = 1;
  public total = 0;
  public page = 0;
  private eventsPerPage = 6;
  public selectedFilters = selectedFilters; // test data,should be deleted when back-end is ready
  public searchToggle = false;
  public bookmarkSelected = false;
  public selectedEventTime: any;
  public eventTimeList: OptionItem[] = eventTimeList;
  public typeList: OptionItem[] = TagsArray;
  public statusList: OptionItem[] = eventStatusList;
  public eventLocationList: OptionItem[] = tempLocationList;
  public allSelected = false;
  private optionsList: any;

  private dialog: MatDialog;

  public pageConfig(items: number, page: number, total: number): PaginationInterface {
    return {
      itemsPerPage: items,
      currentPage: page,
      totalItems: total
    };
  }

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

    this.ecoEvents$.subscribe((res: IEcoEventsState) => {
      this.visitedPagesArr = res.visitedPages;
      this.total = res.totalPages;
      this.page = res.pageNumber;
      this.eventsList = res.eventsList[this.page];
      if (!this.visitedPagesArr.some((it) => it === 0)) {
        this.store.dispatch(GetEcoEventsByPageAction({ currentPage: this.page, numberOfEvents: this.eventsPerPage }));
      }
    });
  }

  public toggleAllSelection(optionsList: any): void {
    this.allSelected = !this.allSelected;
    this.isSelectedOptions(optionsList);
  }

  public isSelectedOptions(optionsList: any): void {
    this.optionsList = optionsList;
    this.allSelected
      ? this.optionsList.options.forEach((item: MatOption) => item.select())
      : this.optionsList.options.forEach((item: MatOption) => item.deselect());
  }

  public search(): void {
    this.searchToggle = !this.searchToggle;
  }

  public showFavourite(): void {
    this.bookmarkSelected = !this.bookmarkSelected;
  }

  public deleteOneFilter(index): void {
    this.selectedFilters.splice(index, 1);
  }

  public resetAll(): void {
    this.selectedFilters.splice(0, this.selectedFilters.length);
  }

  public checkPagination(): boolean {
    return this.total > this.items;
  }

  private checkUserSingIn(): void {
    this.userOwnAuthService.credentialDataSubject.subscribe((data) => (this.isLoggedIn = data && data.userId));
  }

  public setPage(event: number): void {
    this.store.dispatch(GetEcoEventsByPageAction({ currentPage: event - 1, numberOfEvents: this.eventsPerPage }));
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

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
