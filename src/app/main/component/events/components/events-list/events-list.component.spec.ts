import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EventsListComponent } from './events-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { UserOwnAuthService } from '@global-service/auth/user-own-auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Addresses, FilterItem } from '../../models/events.interface';
import { LangValueDirective } from 'src/app/shared/directives/lang-value/lang-value.directive';
import { MatSelect } from '@angular/material/select';
import { AuthModalComponent } from '@global-auth/auth-modal/auth-modal.component';
import { testCases } from '@assets/mocks/events/mock-events';

xdescribe('EventsListComponent', () => {
  let component: EventsListComponent;
  let fixture: ComponentFixture<EventsListComponent>;

  const addressesMock: Array<Addresses> = [
    {
      latitude: 50.4911190426373,
      longitude: 30.38957457031249,
      streetEn: 'Stetsenka Street',
      streetUa: 'вулиця Стеценка',
      houseNumber: '20',
      cityEn: 'Kyiv',
      cityUa: 'Київ',
      regionEn: 'Kyiv',
      regionUa: 'місто Київ',
      countryEn: 'Ukraine',
      countryUa: 'Україна',
      formattedAddressEn: 'Stetsenka St, 20, Kyiv, Ukraine, 02000',
      formattedAddressUa: 'вулиця Стеценка, 20, Київ, Україна, 02000'
    },
    {
      latitude: 49.8555208,
      longitude: 24.0340401,
      streetEn: 'Zavodska Street',
      streetUa: 'вулиця Заводська',
      houseNumber: '31',
      cityEn: 'Lviv',
      cityUa: 'Львів',
      regionEn: 'Lvivska oblast',
      regionUa: 'Львівська область',
      countryEn: 'Ukraine',
      countryUa: 'Україна',
      formattedAddressEn: 'Zavodska St, 31, Lviv, Lvivska oblast, Ukraine, 79000',
      formattedAddressUa: 'вулиця Заводська, 31, Львів, Львівська область, Україна, 79000'
    },
    {
      latitude: 49.7998806,
      longitude: 23.9901827,
      streetEn: 'Ivana Puliuia Street',
      streetUa: 'вулиця Івана Пулюя',
      houseNumber: '31',
      cityEn: 'Lviv',
      cityUa: 'Львів',
      regionEn: 'Lvivska oblast',
      regionUa: 'Львівська область',
      countryEn: 'Ukraine',
      countryUa: 'Україна',
      formattedAddressEn: `Ivana Puliuia St, 38, L'viv, L'vivs'ka oblast, Ukraine, 79000`,
      formattedAddressUa: 'вулиця Івана Пулюя, 38, Львів, Львівська область, Україна, 79000'
    },
    {
      latitude: 49.550731,
      longitude: 25.61935,
      streetEn: 'Stepana Bandery Avenue',
      streetUa: 'проспект Степана Бандери',
      houseNumber: '58',
      cityEn: 'Ternopil',
      cityUa: 'Тернопіль',
      regionEn: `Ternopil's'ka oblas`,
      regionUa: 'Тернопільська область',
      countryEn: 'Ukraine',
      countryUa: 'Україна',
      formattedAddressEn: `Stepana Bandery Ave, 58, Ternopil, Ternopil's'ka oblast, Ukraine, 46000`,
      formattedAddressUa: 'проспект Степана Бандери, 58, Тернопіль, Тернопільська область, Україна, 46000'
    }
  ];

  const MockData = {
    eventState: {},
    eventsList: [],
    visitedPages: [],
    totalPages: 0,
    pageNumber: 0,
    error: null
  };

  const createMockMatSelect = (options: { value: string }[]): MatSelect => {
    return {
      options: options.map((opt) => jasmine.createSpyObj('MatOption', ['deselect'], { value: opt.value }))
    } as unknown as MatSelect;
  };

  const UserOwnAuthServiceMock = jasmine.createSpyObj('UserOwnAuthService', ['getDataFromLocalStorage', 'credentialDataSubject']);
  UserOwnAuthServiceMock.credentialDataSubject = of({ userId: 3 });

  const storeMock = jasmine.createSpyObj('store', ['select', 'dispatch']);
  storeMock.select = () => of(MockData);

  const languageServiceMock = jasmine.createSpyObj('languageService', ['getLangValue']);
  languageServiceMock.getLangValue = (valUa: string, valEn: string) => {
    of(valEn);
  };
  const matDialogService: jasmine.SpyObj<MatDialog> = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EventsListComponent, LangValueDirective],
      imports: [TranslateModule.forRoot(), NgxPaginationModule, HttpClientTestingModule, RouterTestingModule, MatDialogModule],
      providers: [
        { provide: UserOwnAuthService, useValue: UserOwnAuthServiceMock },
        { provide: Store, useValue: storeMock },
        { provide: MatDialog, useValue: matDialogService }
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

  it('ngOnInit', () => {
    UserOwnAuthServiceMock.getDataFromLocalStorage.calls.reset();
    const spy = spyOn(component as any, 'checkUserSingIn');
    component.ngOnInit();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(UserOwnAuthServiceMock.getDataFromLocalStorage).toHaveBeenCalledTimes(1);
  });

  it('checkUserSingIn', () => {
    (component as any).checkUserSingIn();
    expect(component.isLoggedIn).toBe(3 as any);
  });

  it('should close search toggle when it opened', () => {
    component.searchToggle = true;
    component.search();
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

  it('should return unique locations', () => {
    const expectedLocations: FilterItem[] = [
      { type: 'location', nameEn: 'Online', nameUa: 'Онлайн' },
      { type: 'location', nameEn: 'Kyiv', nameUa: 'Київ' },
      { type: 'location', nameEn: 'Lviv', nameUa: 'Львів' },
      { type: 'location', nameEn: 'Ternopil', nameUa: 'Тернопіль' }
    ];
    expect(component.getUniqueLocations(addressesMock)).toEqual(expectedLocations);
  });

  it('should update selected filters list', () => {
    const clickedFiltersList: FilterItem[] = [
      { type: 'location', nameEn: 'Kyiv', nameUa: 'Київ' },
      { type: 'eventTimeStatus', nameEn: 'Future', nameUa: 'Майбутній' },
      { type: 'eventTimeStatus', nameEn: 'Past', nameUa: 'Завершений' },
      { type: 'location', nameEn: 'Lviv', nameUa: 'Львів' }
    ];
    component.selectedFilters = [];
    clickedFiltersList.forEach((clickedFilter) => {
      component.updateListOfFilters(clickedFilter);
    });
    expect(component.selectedFilters).toEqual(clickedFiltersList);
  });

  it('should remove all selection in type', () => {
    component.selectedFilters = [
      { type: 'eventTimeStatus', nameEn: 'Past', nameUa: 'Завершений' },
      { type: 'location', nameEn: 'Lviv', nameUa: 'Львів' }
    ];
    const expectedSelectedFiltersList: FilterItem[] = [{ type: 'eventTimeStatus', nameEn: 'Past', nameUa: 'Завершений' }];
    component.selectedEventTimeStatusFiltersList = ['Past'];
    component.selectedLocationFiltersList = ['Lviv'];
    component.unselectAllFiltersInType('location');
    expect(component.selectedFilters).toEqual(expectedSelectedFiltersList);
  });

  it('should reset all filters', () => {
    component.selectedFilters = [
      { type: 'eventTimeStatus', nameEn: 'Past', nameUa: 'Завершений' },
      { type: 'location', nameEn: 'Lviv', nameUa: 'Львів' },
      { type: 'type', nameEn: 'Economic', nameUa: 'Економічний' },
      { type: 'status', nameEn: 'Closed', nameUa: 'Закритa' }
    ];
    component.resetAllFilters();
    expect(component.selectedFilters.length).toEqual(0);
  });

  it('should return unique locations including Online', () => {
    const result = component.getUniqueLocations(addressesMock);
    expect(result).toContain({ type: 'location', nameEn: 'Online', nameUa: 'Онлайн' });
    expect(result).toContain({ type: 'location', nameEn: 'Kyiv', nameUa: 'Київ' });
    expect(result).toContain({ type: 'location', nameEn: 'Lviv', nameUa: 'Львів' });
  });

  it('should remove item from selected filters list', () => {
    const filter: FilterItem = { type: 'location', nameEn: 'Kyiv', nameUa: 'Київ' };
    component.selectedFilters = [filter];
    const index = 0;

    spyOn(component as any, 'updateSelectedFiltersList').and.callThrough();
    spyOn(component as any, 'updateListOfFilters').and.callThrough();

    component.removeItemFromSelectedFiltersList(filter, index);

    expect(component['updateSelectedFiltersList']).toHaveBeenCalledWith('Kyiv', index);
    expect(component['updateListOfFilters']).toHaveBeenCalledWith(filter);
  });

  it('should unselect all filters in type correctly', () => {
    const type = 'location';
    component.selectedLocationFiltersList = ['Kyiv', 'Lviv'];
    component.locationOptionList = [{ value: 'Kyiv' }, { value: 'Lviv' }] as any;

    spyOn(component as any, 'unselectCheckbox').and.callThrough();
    spyOn(component as any, 'updateSelectedFiltersList').and.callThrough();
    spyOn(component as any, 'cleanEventList').and.callThrough();
    spyOn(component as any, 'getEvents').and.callThrough();

    component.unselectAllFiltersInType(type);

    expect(component.selectedLocationFiltersList).toEqual([]);
    expect(component['unselectCheckbox']).toHaveBeenCalled();
    expect(component['updateSelectedFiltersList']).toHaveBeenCalledWith('Kyiv');
    expect(component['updateSelectedFiltersList']).toHaveBeenCalledWith('Lviv');
    expect(component['cleanEventList']).toHaveBeenCalled();
    expect(component['getEvents']).toHaveBeenCalled();
  });

  it('should toggle bookmarkSelected and call appropriate methods', () => {
    spyOn(component as any, 'getUserFavoriteEvents').and.callThrough();
    spyOn(component as any, 'cleanEventList').and.callThrough();
    spyOn(component as any, 'getEvents').and.callThrough();

    component.showSelectedEvents();
    expect(component.bookmarkSelected).toBeTrue();
    expect(component['cleanEventList']).toHaveBeenCalled();
    expect(component['getUserFavoriteEvents']).toHaveBeenCalled();

    component.showSelectedEvents();
    expect(component.bookmarkSelected).toBeFalse();
    expect(component['cleanEventList']).toHaveBeenCalledTimes(2);
    expect(component['getEvents']).toHaveBeenCalled();
  });

  it('should update the event time status filter list correctly', () => {
    const filter: FilterItem = { type: 'eventTimeStatus', nameEn: 'Upcoming', nameUa: 'Найближчий' };
    component.selectedEventTimeStatusFiltersList = ['Upcoming'];
    component.selectedFilters = [filter];
    component.eventTimeStatusOptionList = createMockMatSelect([{ value: 'Upcoming' }, { value: 'Past' }]);
    spyOn(component as any, 'unselectCheckbox').and.callThrough();
    spyOn(component as any, 'updateSelectedFiltersList').and.callThrough();
    spyOn(component as any, 'cleanEventList').and.callThrough();
    spyOn(component as any, 'getEvents').and.callThrough();

    component.updateListOfFilters(filter);

    expect(component.selectedEventTimeStatusFiltersList).not.toContain('Upcoming');
    expect(component.selectedFilters).not.toContain(filter);
    expect(component['unselectCheckbox']).toHaveBeenCalledWith(component.eventTimeStatusOptionList, 'Upcoming');
    expect(component['updateSelectedFiltersList']).toHaveBeenCalledWith('Upcoming');
    expect(component['cleanEventList']).toHaveBeenCalled();
    expect(component['getEvents']).toHaveBeenCalled();
  });

  it('should update the location filter list correctly', () => {
    const filter: FilterItem = { type: 'location', nameEn: 'Kyiv', nameUa: 'Київ' };
    component.selectedLocationFiltersList = ['Kyiv'];
    component.selectedFilters = [filter];

    component.locationOptionList = createMockMatSelect([{ value: 'Kyiv' }, { value: 'Lviv' }]);

    spyOn(component as any, 'unselectCheckbox').and.callThrough();
    spyOn(component as any, 'updateSelectedFiltersList').and.callThrough();
    spyOn(component as any, 'cleanEventList').and.callThrough();
    spyOn(component as any, 'getEvents').and.callThrough();

    component.updateListOfFilters(filter);

    expect(component.selectedLocationFiltersList).not.toContain('Kyiv');
    expect(component.selectedFilters).not.toContain(filter);
    expect(component['unselectCheckbox']).toHaveBeenCalledWith(component.locationOptionList, 'Kyiv');
    expect(component['updateSelectedFiltersList']).toHaveBeenCalledWith('Kyiv');
    expect(component['cleanEventList']).toHaveBeenCalled();
    expect(component['getEvents']).toHaveBeenCalled();
  });

  it('should update the status filter list correctly', () => {
    const filter: FilterItem = { type: 'status', nameEn: 'Active', nameUa: 'Активний' };
    component.selectedStatusFiltersList = ['Active'];
    component.selectedFilters = [filter];

    component.statusOptionList = createMockMatSelect([{ value: 'Active' }, { value: 'Inactive' }]);

    spyOn(component as any, 'unselectCheckbox').and.callThrough();
    spyOn(component as any, 'updateSelectedFiltersList').and.callThrough();
    spyOn(component as any, 'cleanEventList').and.callThrough();
    spyOn(component as any, 'getEvents').and.callThrough();

    component.updateListOfFilters(filter);

    expect(component.selectedStatusFiltersList).not.toContain('Active');
    expect(component.selectedFilters).not.toContain(filter);
    expect(component['unselectCheckbox']).toHaveBeenCalledWith(component.statusOptionList, 'Active');
    expect(component['updateSelectedFiltersList']).toHaveBeenCalledWith('Active');
    expect(component['cleanEventList']).toHaveBeenCalled();
    expect(component['getEvents']).toHaveBeenCalled();
  });

  it('should update the type filter list correctly', () => {
    const filter: FilterItem = { type: 'type', nameEn: 'Workshop', nameUa: 'Майстер-клас' };
    component.selectedTypeFiltersList = ['Workshop'];
    component.selectedFilters = [filter];

    component.typeOptionList = createMockMatSelect([{ value: 'Workshop' }, { value: 'Seminar' }]);

    spyOn(component as any, 'unselectCheckbox').and.callThrough();
    spyOn(component as any, 'updateSelectedFiltersList').and.callThrough();
    spyOn(component as any, 'cleanEventList').and.callThrough();
    spyOn(component as any, 'getEvents').and.callThrough();

    component.updateListOfFilters(filter);

    expect(component.selectedTypeFiltersList).not.toContain('Workshop');
    expect(component.selectedFilters).not.toContain(filter);
    expect(component['unselectCheckbox']).toHaveBeenCalledWith(component.typeOptionList, 'Workshop');
    expect(component['updateSelectedFiltersList']).toHaveBeenCalledWith('Workshop');
    expect(component['cleanEventList']).toHaveBeenCalled();
    expect(component['getEvents']).toHaveBeenCalled();
  });

  it('should unselect all filters of a type', () => {
    const filterType = 'eventTimeStatus';
    component.selectedEventTimeStatusFiltersList = ['Upcoming', 'Past'];

    spyOn(component as any, 'updateSelectedFiltersList').and.callThrough();
    spyOn(component as any, 'unselectCheckbox').and.callThrough();
    spyOn(component as any, 'cleanEventList').and.callThrough();
    spyOn(component as any, 'getEvents').and.callThrough();

    component.unselectAllFiltersInType(filterType);

    expect(component['updateSelectedFiltersList']).toHaveBeenCalledWith('Upcoming');
    expect(component['updateSelectedFiltersList']).toHaveBeenCalledWith('Past');
    expect(component['unselectCheckbox']).toHaveBeenCalled();
    expect(component['cleanEventList']).toHaveBeenCalled();
    expect(component['getEvents']).toHaveBeenCalled();
    expect(component.selectedEventTimeStatusFiltersList).toEqual([]);
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

  testCases.forEach((testCase, index) => {
    it(`should generate correct HttpParams for test case ${index + 1}`, () => {
      (component as any).page = 0;
      (component as any).eventsPerPage = 10;
      component.selectedLocationFiltersList = testCase.selectedLocationFiltersList;
      component.selectedEventTimeStatusFiltersList = testCase.selectedEventTimeStatusFiltersList;
      component.selectedStatusFiltersList = testCase.selectedStatusFiltersList;
      component.selectedTypeFiltersList = testCase.selectedTypeFiltersList;

      const generatedParams = (component as any).getEventsHttpParams(testCase.title);
      const generatedParamsMap = new Map<string, string>();
      generatedParams.keys().forEach((key) => {
        generatedParamsMap.set(key, generatedParams.get(key));
      });

      const expectedParamsMap = new Map<string, string>();
      testCase.expectedParams.keys().forEach((key) => {
        expectedParamsMap.set(key, testCase.expectedParams.get(key));
      });
      expect(generatedParamsMap).toEqual(expectedParamsMap);
    });
  });
});
