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

describe('EventsListComponent', () => {
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
      declarations: [EventsListComponent],
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
});
