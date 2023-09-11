import { Component, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EventFilterCriteriaIntarface, EventPageResponceDto } from '../../models/events.interface';
import { UserOwnAuthService } from '@auth-service/user-own-auth.service';
import { ReplaySubject } from 'rxjs';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/state/app.state';
import { IEcoEventsState } from 'src/app/store/state/ecoEvents.state';
import { GetEcoEventsByPageAction } from 'src/app/store/actions/ecoEvents.actions';
import {
  TagsArray,
  eventTimeList,
  eventStatusList,
  OptionItem,
  allSelectedFlags,
  AllSelectedFlags,
  allSelectedFilter,
  EventFilterCriteria
} from '../../models/event-consts';
import { LanguageService } from '../../../../i18n/language.service';
import { Router } from '@angular/router';
import { AuthModalComponent } from '@global-auth/auth-modal/auth-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { UserFriendsService } from '@global-user/services/user-friends.service';
import { FriendModel } from '@global-user/models/friend.model';
import { takeUntil } from 'rxjs/operators';

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
  private eventFilterCriteria: EventFilterCriteriaIntarface = EventFilterCriteria;
  private allSelectedFilter = allSelectedFilter;
  public page = 0;
  public hasNext = true;
  public totalElements = 0;
  private eventsPerPage = 6;
  public elementsArePresent = true;
  public selectedFilters = [];
  public searchToggle = false;
  public bookmarkSelected = false;
  public allSelectedFlags: AllSelectedFlags = allSelectedFlags;
  public eventTimeList: OptionItem[] = eventTimeList;
  public typeList: OptionItem[] = TagsArray;
  public statusList: OptionItem[] = eventStatusList;
  public eventLocationList: OptionItem[] = [];
  public scroll: boolean;
  public userId: number;
  private dialog: MatDialog;
  private isFirstCityLoad = true;
  userFriends: FriendModel[];

  constructor(
    private store: Store,
    private userOwnAuthService: UserOwnAuthService,
    private languageService: LanguageService,
    private localStorageService: LocalStorageService,
    private router: Router,
    public injector: Injector,
    private userFriendsService: UserFriendsService
  ) {
    this.dialog = injector.get(MatDialog);
  }

  ngOnInit(): void {
    this.localStorageService.setEditMode('canUserEdit', false);
    this.checkUserSingIn();
    this.userOwnAuthService.getDataFromLocalStorage();
    this.scroll = false;
    this.dispatchStore(true);
    this.localStorageService.setCurentPage('previousPage', '/events');
    this.ecoEvents$.subscribe((res: IEcoEventsState) => {
      this.page = res.pageNumber;
      if (res.eventState) {
        this.eventsList = [...res.eventsList];
        const data = res.eventState;
        this.hasNext = data.hasNext;
        this.totalElements = data.totalElements;
        this.elementsArePresent = this.eventsList.length < data.totalElements;
        if (this.isFirstCityLoad) {
          this.eventLocationList = this.getUniqueCities(this.eventsList);
          this.isFirstCityLoad = false;
        }
      }
    });
    this.getUserFriendsList();
  }

  getUserFriendsList(): void {
    this.userFriendsService
      .getAllFriendsByUserId(this.userId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res) => {
        this.userFriends = res;
      });
  }

  public updateSelectedFilters(value: any, event, optionsList?: any, dropdownName?: string, filterList?: any): void {
    if (value.nameEn === 'Upcoming') {
      value.nameEn = 'Future';
    } else if (value.nameEn === 'Passed') {
      value.nameEn = 'Past';
    }
    const existingFilterIndex = this.selectedFilters.indexOf(value);
    const userInput = event.isUserInput && !event.source.selected;
    if (userInput && existingFilterIndex !== -1) {
      this.selectedFilters.splice(existingFilterIndex, 1);
      this.deleteFromEventFilterCriteria(value, dropdownName);
      this.checkAllSelectedFilters(value, optionsList, dropdownName, filterList);
    } else if (userInput) {
      this.checkAllSelectedFilters(value, optionsList, dropdownName, filterList);
    } else if (!event.source.selected) {
      this.deleteFromEventFilterCriteria(value, dropdownName);
    }
    if (!userInput && existingFilterIndex === -1) {
      this.selectedFilters.push(value);
      this.addToEventFilterCriteria(value, dropdownName);
      this.checkAllSelectedFilters(value, optionsList, dropdownName, filterList);
    }
    this.dispatchStore(true);
  }

  private checkAllSelectedFilters(value: any, optionsList: any, dropdownName: string, filterList: any) {
    if (this.allSelectedFlags[dropdownName]) {
      optionsList.options.first.deselect();
      filterList.forEach((item) => {
        if (item.nameEn !== value.nameEn) {
          this.addToEventFilterCriteria(item, dropdownName);
        }
      });
      this.selectedFilters = this.selectedFilters.filter((item) => this.allSelectedFilter[dropdownName].nameEn !== item.nameEn);
      this.selectedFilters = [...this.selectedFilters, ...filterList.filter((item) => item.nameEn !== value.nameEn)];
    }

    this.allSelectedFlags[dropdownName] = this.eventFilterCriteria[dropdownName].length >= filterList.length;

    if (this.allSelectedFlags[dropdownName]) {
      optionsList.options.first.select();
      this.selectedFilters = this.selectedFilters.filter((item1) => !filterList.some((item2) => item2.nameEn === item1.nameEn));
      this.selectedFilters.push(this.allSelectedFilter[dropdownName]);
      this.eventFilterCriteria[dropdownName] = [];
    }
  }

  private deleteFromEventFilterCriteria(value: any, dropdownName: string) {
    this.eventFilterCriteria = {
      ...this.eventFilterCriteria,
      [dropdownName]: this.eventFilterCriteria[dropdownName].filter((item) => item !== value.nameEn)
    };
  }

  private addToEventFilterCriteria(value: any, dropdownName: string) {
    this.eventFilterCriteria = {
      ...this.eventFilterCriteria,
      [dropdownName]: [...this.eventFilterCriteria[dropdownName], value.nameEn]
    };
  }

  public dispatchStore(res: boolean): void {
    if (this.hasNext && this.page !== undefined) {
      this.store.dispatch(
        GetEcoEventsByPageAction({
          currentPage: this.page,
          numberOfEvents: this.eventsPerPage,
          reset: res,
          filter: this.eventFilterCriteria
        })
      );
    }
  }

  getUniqueCities(events: EventPageResponceDto[]): OptionItem[] {
    const cities: OptionItem[] = [];
    events.forEach((event) => {
      if (event.dates[0].coordinates) {
        const { cityEn, cityUa } = event.dates[0].coordinates;
        const cityExists = cities.some((city) => {
          return city.nameEn === cityEn && city.nameUa === cityUa;
        });
        if (!cityExists) {
          cities.push({ nameEn: cityEn, nameUa: cityUa });
        }
      }
    });
    return cities;
  }

  public toggleAllSelection(optionsList: any, dropdownName: string): void {
    this.allSelectedFlags[dropdownName] = !this.allSelectedFlags[dropdownName];
    if (this.allSelectedFlags[dropdownName]) {
      optionsList.options.forEach((item: MatOption) => {
        if (item.value === 0) {
          this.selectedFilters.push(allSelectedFilter[dropdownName]);
        }
        if (!this.eventFilterCriteria[dropdownName]) {
          this.eventFilterCriteria[dropdownName] = [];
        }
        this.selectedFilters = this.selectedFilters.filter((value) => value !== item.value);
        item.select();
      });
    } else {
      optionsList.options.forEach((item: MatOption) => {
        item.deselect();
        this.selectedFilters = this.selectedFilters.filter((value) => value !== item.value && value !== allSelectedFilter[dropdownName]);
      });
    }
  }

  public search(): void {
    this.searchToggle = !this.searchToggle;
  }

  public deleteOneFilter(filter, index): void {
    let deleted = true;
    const keyMapping = {
      eventTime: 0,
      statuses: 1,
      cities: 2,
      tags: 3
    };
    [this.timeList, this.statusesList, this.locationList, this.typesList].forEach((list, arrayIndex) => {
      for (const dropdownName in this.allSelectedFilter) {
        if (this.allSelectedFilter[dropdownName].nameEn === filter.nameEn) {
          list.options.forEach((item) => {
            if (arrayIndex === keyMapping[dropdownName]) {
              item.deselect();
              this.allSelectedFlags[dropdownName] = false;
            }
          });
          if (deleted) {
            this.selectedFilters.splice(index, 1);
            deleted = false;
          }
        }
      }
      const item2 = list.options.find((option: MatOption) => filter.nameEn === option.value.nameEn);
      if (item2) {
        this.selectedFilters.splice(index, 1);
        item2.deselect();
      }
    });
  }

  public resetAll(): void {
    [this.timeList, this.statusesList, this.locationList, this.typesList].forEach((list) => {
      list.options.forEach((item: MatOption) => {
        item.deselect();
      });
    });
    this.selectedFilters.splice(0, this.selectedFilters.length);
    for (const criteria in this.eventFilterCriteria) {
      if (this.eventFilterCriteria.hasOwnProperty(criteria)) {
        this.eventFilterCriteria[criteria] = [];
      }
    }
    for (const dropdownName in this.allSelectedFlags) {
      if (this.allSelectedFlags.hasOwnProperty(dropdownName)) {
        this.allSelectedFlags[dropdownName] = false;
      }
    }
  }

  private checkUserSingIn(): void {
    this.userOwnAuthService.credentialDataSubject.subscribe((data) => {
      this.isLoggedIn = data && data.userId;
      this.userId = data.userId;
    });
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
    const isRemovedEvents = this.page * this.eventsPerPage !== this.eventsList.length;
    this.scroll = true;
    this.dispatchStore(isRemovedEvents);
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
