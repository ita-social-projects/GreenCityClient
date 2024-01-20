import { Component, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Addresses, EventFilterCriteriaInterface, EventPageResponseDto, FilterItem } from '../../models/events.interface';
import { UserOwnAuthService } from '@auth-service/user-own-auth.service';
import { Observable, ReplaySubject, Subscription } from 'rxjs';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/state/app.state';
import { IEcoEventsState } from 'src/app/store/state/ecoEvents.state';
import { GetEcoEventsByPageAction } from 'src/app/store/actions/ecoEvents.actions';
import { typeFiltersData, timeStatusFiltersData, statusFiltersData } from '../../models/event-consts';
import { LanguageService } from '../../../../i18n/language.service';
import { Router } from '@angular/router';
import { AuthModalComponent } from '@global-auth/auth-modal/auth-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Patterns } from 'src/assets/patterns/patterns';
import { EventsService } from '../../services/events.service';
import { MatOption } from '@angular/material/core';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss']
})
export class EventsListComponent implements OnInit, OnDestroy {
  @ViewChild('timeFilter') eventTimeStatusOptionList: MatSelect;
  @ViewChild('locationFilter') locationOptionList: MatSelect;
  @ViewChild('statusFilter') statusOptionList: MatSelect;
  @ViewChild('typeFilter') typeOptionList: MatSelect;

  public eventTimeStatusFilterControl = new FormControl();
  public locationFilterControl = new FormControl();
  public statusFilterControl = new FormControl();
  public typeFilterControl = new FormControl();
  public searchEventControl = new FormControl('', [Validators.maxLength(30), Validators.pattern(Patterns.NameInfoPattern)]);

  public eventsList: EventPageResponseDto[] = [];

  public isLoggedIn: string;
  private destroyed$: ReplaySubject<any> = new ReplaySubject<any>(1);
  private ecoEvents$: Observable<IEcoEventsState> = this.store.select((state: IAppState): IEcoEventsState => state.ecoEventsState);
  public selectedEventTimeStatusFiltersList: string[] = [];
  public selectedLocationFiltersList: string[] = [];
  public selectedStatusFiltersList: string[] = [];
  public selectedTypeFiltersList: string[] = [];
  private page = 0;
  public hasNextPage = true;
  public countOfEvents = 0;
  private eventsPerPage = 6;
  public noEventsMatch = false;
  public selectedFilters: FilterItem[] = [];
  public searchToggle = false;
  public bookmarkSelected = false;
  public eventTimeStatusFiltersList: FilterItem[] = timeStatusFiltersData;
  public locationFiltersList: FilterItem[] = [];
  public statusFiltersList: FilterItem[] = [];
  public typeFiltersList: FilterItem[] = typeFiltersData;
  public userId: number;
  public isLoading = true;
  private searchResultSubscription: Subscription;
  private dialog: MatDialog;

  constructor(
    private store: Store,
    private userOwnAuthService: UserOwnAuthService,
    private languageService: LanguageService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private injector: Injector,
    private eventService: EventsService
  ) {
    this.dialog = injector.get(MatDialog);
  }

  ngOnInit(): void {
    this.localStorageService.setEditMode('canUserEdit', false);
    this.checkUserSingIn();
    this.userOwnAuthService.getDataFromLocalStorage();
    this.localStorageService.setCurentPage('previousPage', '/events');
    this.ecoEvents$.subscribe((res: IEcoEventsState) => {
      if (res.eventState) {
        this.isLoading = false;
        this.eventsList.push(...res.eventsList.slice(this.page * this.eventsPerPage));
        this.page++;
        this.countOfEvents = res.eventState.totalElements;
        this.hasNextPage = res.eventState.hasNext;
      }
    });
    this.getEvents();
    this.eventService.getAddresses().subscribe((addresses) => {
      this.locationFiltersList = this.getUniqueLocations(addresses);
    });
    this.searchEventControl.valueChanges.subscribe((value) => {
      if (this.searchResultSubscription) {
        this.searchResultSubscription.unsubscribe();
      }
      this.cleanEventList();
      value.trim() !== '' ? this.searchEventsByTitle(value.trim()) : this.getEvents();
    });
  }

  public getEvents(): void {
    if (this.bookmarkSelected) {
      this.getUserFavoriteEvents();
    } else {
      const searchTitle = this.searchEventControl.value.trim();
      if (!searchTitle.length) {
        const eventListFilterCriterias = this.createEventListFilterCriteriasObject();
        this.store.dispatch(
          GetEcoEventsByPageAction({
            currentPage: this.page,
            numberOfEvents: this.eventsPerPage,
            reset: false,
            filter: eventListFilterCriterias
          })
        );
      } else {
        this.searchEventsByTitle(searchTitle);
      }
    }
  }

  private searchEventsByTitle(searchTitle: string): void {
    const eventListFilterCriterias = this.createEventListFilterCriteriasObject();
    this.searchResultSubscription = this.eventService
      .getEvents(this.page, this.eventsPerPage, eventListFilterCriterias, searchTitle)
      .subscribe((res) => {
        this.isLoading = false;
        if (res.page.length > 0) {
          this.countOfEvents = res.totalElements;
          this.eventsList.push(...res.page);
          this.hasNextPage = res.hasNext;
        } else {
          this.noEventsMatch = true;
        }
      });
  }

  public search(): void {
    this.searchToggle = !this.searchToggle;
  }

  public cancelSearch(): void {
    this.searchEventControl.value.trim() === '' ? (this.searchToggle = false) : this.searchEventControl.setValue('');
  }

  public showSelectedEvents(): void {
    this.bookmarkSelected = !this.bookmarkSelected;
    if (this.bookmarkSelected) {
      this.cleanEventList();
      this.getUserFavoriteEvents();
    } else {
      this.cleanEventList();
      this.getEvents();
    }
  }

  private getUserFavoriteEvents(): void {
    this.eventService.getUserFavoriteEvents(this.page, this.eventsPerPage).subscribe((res) => {
      this.isLoading = false;
      this.eventsList.push(...res.page);
      this.page++;
      this.countOfEvents = res.totalElements;
      this.hasNextPage = res.hasNext;
    });
  }

  public getUniqueLocations(addresses: Array<Addresses>): FilterItem[] {
    const uniqueLocationsName = new Set<string>();
    const uniqueLocations: FilterItem[] = [];
    addresses.forEach((address: Addresses) => {
      if (address.cityEn && address.cityUa) {
        if (!uniqueLocationsName.has(address.cityEn) && !uniqueLocationsName.has(address.cityUa)) {
          uniqueLocationsName.add(address.cityEn);
          uniqueLocationsName.add(address.cityUa);
          uniqueLocations.push({ type: 'location', nameEn: address.cityEn, nameUa: address.cityUa });
        }
      }
    });
    return uniqueLocations;
  }

  public updateListOfFilters(filter: FilterItem): void {
    switch (filter.type) {
      case 'eventTimeStatus':
        if (this.selectedEventTimeStatusFiltersList.includes(filter.nameEn)) {
          const indexOfCriteria = this.selectedEventTimeStatusFiltersList.indexOf(filter.nameEn);
          this.selectedEventTimeStatusFiltersList.splice(indexOfCriteria, 1);
          [this.eventTimeStatusOptionList].forEach((optionList) => {
            this.unselectCheckbox(optionList, filter.nameEn);
          });
          this.updateSelectedFiltersList(filter.nameEn);
        } else {
          this.selectedEventTimeStatusFiltersList.push(filter.nameEn);
          this.selectedFilters.push(filter);
        }
        break;
      case 'location':
        if (this.selectedLocationFiltersList.includes(filter.nameEn)) {
          const indexOfCriteria = this.selectedLocationFiltersList.indexOf(filter.nameEn);
          this.selectedLocationFiltersList.splice(indexOfCriteria, 1);
          [this.locationOptionList].forEach((optionList) => {
            this.unselectCheckbox(optionList, filter.nameEn);
          });
          this.updateSelectedFiltersList(filter.nameEn);
        } else {
          this.selectedLocationFiltersList.push(filter.nameEn);
          this.selectedFilters.push(filter);
        }
        break;
      case 'status':
        if (this.selectedStatusFiltersList.includes(filter.nameEn)) {
          const indexOfCriteria = this.selectedStatusFiltersList.indexOf(filter.nameEn);
          this.selectedStatusFiltersList.splice(indexOfCriteria, 1);
          [this.statusOptionList].forEach((optionList) => {
            this.unselectCheckbox(optionList, filter.nameEn);
          });
          this.updateSelectedFiltersList(filter.nameEn);
        } else {
          this.selectedStatusFiltersList.push(filter.nameEn);
          this.selectedFilters.push(filter);
        }
        break;
      case 'type':
        if (this.selectedTypeFiltersList.includes(filter.nameEn)) {
          const indexOfCriteria = this.selectedTypeFiltersList.indexOf(filter.nameEn);
          this.selectedTypeFiltersList.splice(indexOfCriteria, 1);
          [this.typeOptionList].forEach((optionList) => {
            this.unselectCheckbox(optionList, filter.nameEn);
          });
          this.updateSelectedFiltersList(filter.nameEn);
        } else {
          this.selectedTypeFiltersList.push(filter.nameEn);
          this.selectedFilters.push(filter);
        }
        break;
    }
    this.cleanEventList();
    this.getEvents();
  }

  public removeItemFromSelectedFiltersList(filter: FilterItem, index?: number): void {
    this.updateSelectedFiltersList(filter.nameEn, index);
    this.updateListOfFilters(filter);
  }

  private updateSelectedFiltersList(filterName: string, index?: number): void {
    if (index) {
      this.selectedFilters.splice(index, 1);
    } else {
      if (this.selectedFilters.find((item) => item.nameEn === filterName)) {
        const indexOfItem = this.selectedFilters.findIndex((item) => item.nameEn === filterName);
        this.selectedFilters.splice(indexOfItem, 1);
      }
    }
  }

  public unselectAllFiltersInType(filterType: string): void {
    switch (filterType) {
      case 'eventTimeStatus':
        this.selectedEventTimeStatusFiltersList.forEach((item) => {
          this.updateSelectedFiltersList(item);
        });
        [this.eventTimeStatusOptionList].forEach((optionList) => {
          this.unselectCheckboxesInList(optionList);
        });
        this.selectedEventTimeStatusFiltersList = [];
        break;
      case 'location':
        this.selectedLocationFiltersList.forEach((item) => {
          this.updateSelectedFiltersList(item);
        });
        [this.locationOptionList].forEach((optionList) => {
          this.unselectCheckboxesInList(optionList);
        });
        this.selectedLocationFiltersList = [];
        break;
      case 'status':
        this.selectedStatusFiltersList.forEach((item) => {
          this.updateSelectedFiltersList(item);
        });
        [this.statusOptionList].forEach((optionList) => {
          this.unselectCheckboxesInList(optionList);
        });
        this.selectedStatusFiltersList = [];
        break;
      case 'type':
        this.selectedTypeFiltersList.forEach((item) => {
          this.updateSelectedFiltersList(item);
        });
        [this.typeOptionList].forEach((optionList) => {
          this.unselectCheckboxesInList(optionList);
        });
        this.selectedTypeFiltersList = [];
        break;
    }
    this.cleanEventList();
    this.getEvents();
  }

  private unselectCheckbox(checkboxList: MatSelect, optionName: string): void {
    checkboxList.options.find((option: MatOption) => option.value === optionName).deselect();
  }

  private unselectCheckboxesInList(checkboxList: MatSelect): void {
    checkboxList.options
      ?.filter((option: MatOption) => option.selected)
      .forEach((option: MatOption) => {
        option.deselect();
      });
  }

  public resetAllFilters(): void {
    this.selectedFilters = [];
    this.selectedEventTimeStatusFiltersList = [];
    this.selectedLocationFiltersList = [];
    this.selectedStatusFiltersList = [];
    this.selectedTypeFiltersList = [];
    [this.eventTimeStatusOptionList, this.statusOptionList, this.locationOptionList, this.typeOptionList].forEach((optionList) => {
      this.unselectCheckboxesInList(optionList);
    });
    this.cleanEventList();
    this.getEvents();
  }

  private cleanEventList(): void {
    this.isLoading = true;
    this.hasNextPage = true;
    this.page = 0;
    this.eventsList = [];
    this.noEventsMatch = false;
    this.countOfEvents = 0;
  }

  private createEventListFilterCriteriasObject(): EventFilterCriteriaInterface {
    return {
      eventTime: [...this.selectedEventTimeStatusFiltersList],
      cities: [...this.selectedLocationFiltersList],
      statuses: [...this.selectedStatusFiltersList],
      tags: [...this.selectedTypeFiltersList]
    };
  }

  private checkUserSingIn(): void {
    this.userOwnAuthService.credentialDataSubject.subscribe((data) => {
      this.isLoggedIn = data && data.userId;
      this.userId = data.userId;
      this.statusFiltersList = this.userId ? statusFiltersData : statusFiltersData.slice(0, 2);
    });
  }

  public getLangValue(uaValue: string, enValue: string): string {
    return this.languageService.getLangValue(uaValue, enValue) as string;
  }

  public isUserLoggedRedirect(): void {
    this.isLoggedIn ? this.router.navigate(['/events', 'create-event']) : this.openAuthModalWindow('sign-in');
    this.eventService.setBackFromPreview(false);
    this.eventService.setForm(null);
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
