import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EventsListComponent } from './events-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { UserOwnAuthService } from 'src/app/shared/services/auth/user-own-auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FilterItem } from '../../models/events.interface';
import { LangValueDirective } from 'src/app/shared/directives/lang-value/lang-value.directive';
import { AuthModalComponent } from '@global-auth/auth-modal/auth-modal.component';
import { addressesMock, eventStateMock } from '@assets/mocks/events/mock-events';
import { EventStoreService } from '../../services/event-store.service';
import { MatNativeDateModule } from '@angular/material/core';
import { Language } from 'src/app/shared/i18n/Language';

describe('EventsListComponent', () => {
  let component: EventsListComponent;
  let fixture: ComponentFixture<EventsListComponent>;

  const UserOwnAuthServiceMock = jasmine.createSpyObj('UserOwnAuthService', ['getDataFromLocalStorage', 'credentialDataSubject']);
  UserOwnAuthServiceMock.credentialDataSubject = of({ userId: 3 });

  const storeMock = jasmine.createSpyObj('store', ['select', 'dispatch']);
  storeMock.select = () => of(eventStateMock);

  const languageServiceMock = jasmine.createSpyObj('languageService', ['getLangValue']);
  languageServiceMock.getLangValue = (valUa: string, valEn: string) => {
    return of(valEn);
  };
  const matDialogService: jasmine.SpyObj<MatDialog> = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
  const eventStoreServiceMock: jasmine.SpyObj<EventStoreService> = jasmine.createSpyObj<EventStoreService>('EventStoreService', [
    'setEditorValues'
  ]);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EventsListComponent, LangValueDirective],
      imports: [
        TranslateModule.forRoot(),
        NgxPaginationModule,
        HttpClientTestingModule,
        RouterTestingModule,
        MatDialogModule,
        MatNativeDateModule
      ],
      providers: [
        { provide: UserOwnAuthService, useValue: UserOwnAuthServiceMock },
        { provide: Store, useValue: storeMock },
        { provide: MatDialog, useValue: matDialogService },
        { provide: EventStoreService, useValue: eventStoreServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close search toggle when it opened', () => {
    component.searchToggle = true;
    component.toggleSearch();
    expect(component.searchToggle).toEqual(false);
  });

  it('should hide search input if it is empty', () => {
    component.searchToggle = true;
    component.searchEventControl.setValue('');
    component.cancelSearch();
    expect(component.searchToggle).toEqual(false);
  });

  it('should remove the value of search input if it contains text', () => {
    component.searchEventControl.setValue('Some test text');
    component.searchToggle = true;
    component.cancelSearch();
    expect(component.searchEventControl.value).toEqual('');
    expect(component.searchToggle).toEqual(true);
  });

  it('should show selected events', () => {
    component.bookmarkSelected = false;
    component.showSelectedEvents();
    expect(component.bookmarkSelected).toEqual(true);
  });

  it('should add dateRangeFilter when date range is selected', () => {
    const startDate = new Date('2023-10-10');
    const endDate = new Date('2023-10-20');
    spyOn(component, 'updateListOfFilters').and.callThrough();
    spyOn((component as any).eventService, 'getEvents').and.returnValue(of({ page: [], totalElements: 0, hasNext: false }));

    component.dateRangeFilterForm.setValue({ from: startDate, to: endDate });

    expect(component.updateListOfFilters).toHaveBeenCalled();
    expect((component as any).eventService.getEvents).toHaveBeenCalledWith(
      jasmine.stringMatching(/from=2023-10-10T00:00:00.000Z&to=2023-10-20T00:00:00.000Z/)
    );
  });

  it('should change dateAdapter locale on language change', () => {
    const dateAdapter = (component as any).dateAdapter;
    const langSubject = new BehaviorSubject<string>('en');
    (component as any).languageService.getCurrentLangObs = () => langSubject.asObservable();
    spyOn(dateAdapter, 'setLocale');

    (component as any).languageService.changeCurrentLanguage(Language.UK);

    expect(dateAdapter.setLocale).toHaveBeenCalledWith('uk-UA');
  });

  it('should set en-US dateAdapter locale if language is undefined', () => {
    const dateAdapter = (component as any).dateAdapter;
    const langSubject = new BehaviorSubject<string>('en');
    (component as any).languageService.getCurrentLangObs = () => langSubject.asObservable();
    spyOn(dateAdapter, 'setLocale');

    (component as any).languageService.changeCurrentLanguage(undefined);

    expect(dateAdapter.setLocale).toHaveBeenCalledWith('en-US');
  });

  it('should return unique locations', () => {
    const expectedLocations: FilterItem[] = [
      { type: 'location', nameEn: 'Online', nameUk: 'Онлайн' },
      { type: 'location', nameEn: 'Kyiv', nameUk: 'Київ' },
      { type: 'location', nameEn: 'Lviv', nameUk: 'Львів' },
      { type: 'location', nameEn: 'Ternopil', nameUk: 'Тернопіль' }
    ];
    expect(component.getUniqueLocations(addressesMock)).toEqual(expectedLocations);
  });

  it('should add selected filter in dateRange case if it is not exist in selectedFilters list', () => {
    component.selectedFilters = [];

    component.dateRangeFilterForm.setValue({ from: new Date('2023.10.10'), to: new Date('2023.11.10') });

    expect(component.selectedFilters).toEqual([
      { type: 'dateRange', nameEn: '10/10/2023 - 11/10/2023', nameUk: '10.10.2023 - 10.11.2023' }
    ]);
  });

  it('should update selected filter in dateRange case if it exist in selectedFilters list', () => {
    component.selectedFilters = [{ type: 'dateRange', nameEn: '10/10/2023 - 11/10/2023', nameUk: '10.10.2023 - 10.11.2023' }];

    component.dateRangeFilterForm.setValue({ from: new Date('2023.10.10'), to: new Date('2023.12.10') });

    expect(component.selectedFilters).toEqual([
      { type: 'dateRange', nameEn: '10/10/2023 - 12/10/2023', nameUk: '10.10.2023 - 10.12.2023' }
    ]);
  });

  it('should update selected filters list', () => {
    const clickedFiltersList: FilterItem[] = [
      { type: 'location', nameEn: 'Kyiv', nameUk: 'Київ' },
      { type: 'eventTimeStatus', nameEn: 'Upcoming', nameUk: 'Майбутній' },
      { type: 'eventTimeStatus', nameEn: 'Past', nameUk: 'Завершений' },
      { type: 'location', nameEn: 'Lviv', nameUk: 'Львів' }
    ];
    component.selectedFilters = [];
    clickedFiltersList.forEach((clickedFilter) => {
      component.updateListOfFilters(clickedFilter);
    });
    expect(component.selectedFilters).toEqual(clickedFiltersList);
  });

  it('should remove all selection in type', () => {
    component.selectedFilters = [
      { type: 'eventTimeStatus', nameEn: 'Past', nameUk: 'Завершений' },
      { type: 'location', nameEn: 'Lviv', nameUk: 'Львів' }
    ];
    const expectedSelectedFiltersList: FilterItem[] = [{ type: 'eventTimeStatus', nameEn: 'Past', nameUk: 'Завершений' }];
    component.selectedEventTimeStatusFiltersList = ['Past'];
    component.selectedLocationFiltersList = ['Lviv'];
    component.unselectAllFiltersInType('location');
    expect(component.selectedFilters).toEqual(expectedSelectedFiltersList);
  });

  it('should reset all filters', () => {
    component.selectedFilters = [
      { type: 'eventTimeStatus', nameEn: 'Past', nameUk: 'Завершений' },
      { type: 'location', nameEn: 'Lviv', nameUk: 'Львів' },
      { type: 'type', nameEn: 'Economic', nameUk: 'Економічний' },
      { type: 'status', nameEn: 'Closed', nameUk: 'Закритa' }
    ];
    component.resetAllFilters();
    expect(component.selectedFilters.length).toEqual(0);
  });

  it('should return unique locations including Online', () => {
    const result = component.getUniqueLocations(addressesMock);
    expect(result).toContain({ type: 'location', nameEn: 'Online', nameUk: 'Онлайн' });
    expect(result).toContain({ type: 'location', nameEn: 'Kyiv', nameUk: 'Київ' });
    expect(result).toContain({ type: 'location', nameEn: 'Lviv', nameUk: 'Львів' });
  });

  it('should open auth modal with correct page name', () => {
    component.openAuthModalWindow('sign-up');

    expect(matDialogService.open).toHaveBeenCalledWith(AuthModalComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      panelClass: ['custom-dialog-container'],
      data: {
        popUpName: 'sign-up'
      }
    });
  });

  it('should set isGalleryView to true for gallery view mode', () => {
    component.changeViewMode('gallery');
    expect(component.isGalleryView).toBeTrue();
  });

  it('should set isGalleryView to false for list view mode', () => {
    component.changeViewMode('list');
    expect(component.isGalleryView).toBeFalse();
  });

  it('should clear selected filters for eventTimeStatus', () => {
    component.unselectAllFiltersInType('eventTimeStatus');
    expect(component.selectedEventTimeStatusFiltersList).toEqual([]);
  });

  it('should clear selected filters for location', () => {
    component.unselectAllFiltersInType('location');
    expect(component.selectedLocationFiltersList).toEqual([]);
  });

  it('should clear selected filters for status', () => {
    component.unselectAllFiltersInType('status');
    expect(component.selectedStatusFiltersList).toEqual([]);
  });

  it('should clear selected filters for type', () => {
    component.unselectAllFiltersInType('type');
    expect(component.selectedTypeFiltersList).toEqual([]);
  });

  it('should reset all filter lists and unselect all checkboxes', () => {
    component.resetAllFilters();
    expect(component.selectedFilters).toEqual([]);
    expect(component.selectedEventTimeStatusFiltersList).toEqual([]);
    expect(component.selectedLocationFiltersList).toEqual([]);
    expect(component.selectedStatusFiltersList).toEqual([]);
    expect(component.selectedTypeFiltersList).toEqual([]);
  });
});
