import { Component, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EventPageResponceDto } from '../../models/events.interface';
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
  tempLocationList,
  OptionItem,
  allSelectedFlags,
  AllSelectedFlags
} from '../../models/event-consts';
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

  public page = 0;
  public hasNext = true;
  public remaining = 0;
  private eventsPerPage = 6;
  public elementsArePresent = true;
  public selectedFilters = []; // test data,should be deleted when back-end is ready
  public searchToggle = false;
  public bookmarkSelected = false;
  public allSelectedFlags: AllSelectedFlags = allSelectedFlags;
  public eventTimeList: OptionItem[] = eventTimeList;
  public typeList: OptionItem[] = TagsArray;
  public statusList: OptionItem[] = eventStatusList;
  public eventLocationList: OptionItem[] = tempLocationList;
  private optionsList: any;
  public scroll: boolean;
  public userId: number;
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
    this.subscribeOnFormControlsChanges();
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
        this.remaining = data.totalElements;
        this.elementsArePresent = this.eventsList.length < data.totalElements;
      }
    });
  }

  updateSelectedFilters(value: any, event): void {
    const existingFilterIndex = this.selectedFilters.indexOf(value);
    if (event.isUserInput && !event.source.selected && existingFilterIndex !== -1) {
      this.selectedFilters.splice(existingFilterIndex, 1);
    }
    if (event.isUserInput && event.source.selected && existingFilterIndex === -1) {
      this.selectedFilters.push(value);
    }
  }

  subscribeOnFormControlsChanges(): void {
    const formControls = [
      { control: this.timeFilterControl },
      { control: this.locationFilterControl },
      { control: this.statusFilterControl },
      { control: this.typeFilterControl }
    ];

    formControls.forEach((formControl) => {
      formControl.control.valueChanges.subscribe((value) => {
        this.updateSelectedFilters(value, Event);
      });
    });
  }

  public dispatchStore(res: boolean): void {
    if (this.hasNext && this.page !== undefined) {
      this.store.dispatch(GetEcoEventsByPageAction({ currentPage: this.page, numberOfEvents: this.eventsPerPage, reset: res }));
    }
  }

  public toggleAllSelection(optionsList: any, dropdownName: string): void {
    this.allSelectedFlags[dropdownName] = !this.allSelectedFlags[dropdownName];
    this.isSelectedOptions(optionsList, dropdownName);
  }

  public isSelectedOptions(optionsList: any, dropdownName: string): void {
    this.optionsList = optionsList;
    if (this.allSelectedFlags[dropdownName]) {
      this.optionsList.options.forEach((item: MatOption) => {
        if (item.value !== 0) {
          this.selectedFilters.push(item.value);
        }
        item.select();
        this.allSelectedFlags[dropdownName] = true;
      });
    } else {
      this.optionsList.options.forEach((item: MatOption) => {
        item.deselect();
        this.allSelectedFlags[dropdownName] = false;
        this.selectedFilters = this.selectedFilters.filter((value) => value !== item.value);
      });
    }
  }

  public search(): void {
    this.searchToggle = !this.searchToggle;
  }

  public showFavourite(): void {
    this.bookmarkSelected = !this.bookmarkSelected;
  }

  public deleteOneFilter(filter, index): void {
    [this.timeList, this.statusesList, this.locationList, this.typesList].forEach((list) => {
      const item = list.options.find((option: MatOption) => filter.nameEn === option.value.nameEn);
      if (item) {
        this.selectedFilters.splice(index, 1);
        item.deselect();
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
