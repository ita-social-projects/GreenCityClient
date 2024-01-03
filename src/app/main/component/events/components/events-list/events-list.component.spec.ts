import { async, ComponentFixture, TestBed } from '@angular/core/testing';
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
import { TagsArray, eventTimeList, OptionItem } from '../../models/event-consts';
import { By } from '@angular/platform-browser';
import { MatOption, MatOptionSelectionChange } from '@angular/material/core';
import { FormControl } from '@angular/forms';
import { Addresses } from '../../models/events.interface';

describe('EventsListComponent', () => {
  let component: EventsListComponent;
  let fixture: ComponentFixture<EventsListComponent>;
  const eventStatusList = [
    { nameEn: 'Open', nameUa: 'Відкритa' },
    { nameEn: 'Closed', nameUa: 'Закритa' },
    { nameEn: 'Joined', nameUa: 'Вже доєднані' },
    { nameEn: 'Created', nameUa: 'Створенa' },
    { nameEn: 'Saved', nameUa: 'Збережена' }
  ];

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

  const timeFilterControl = new FormControl();
  const locationFilterControl = new FormControl();
  const statusFilterControl = new FormControl();
  const typeFilterControl = new FormControl();

  const UserOwnAuthServiceMock = jasmine.createSpyObj('UserOwnAuthService', ['getDataFromLocalStorage', 'credentialDataSubject']);
  UserOwnAuthServiceMock.credentialDataSubject = of({ userId: 3 });

  const storeMock = jasmine.createSpyObj('store', ['select', 'dispatch']);
  storeMock.select = () => of(MockData);

  const languageServiceMock = jasmine.createSpyObj('languageService', ['getLangValue']);
  languageServiceMock.getLangValue = (valUa: string, valEn: string) => {
    of(valEn);
  };
  let matDialogService: jasmine.SpyObj<MatDialog>;
  matDialogService = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

  beforeEach(async(() => {
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

  it('should reset all filters', () => {
    component.eventTimeList = eventTimeList;
    component.typeList = TagsArray;
    component.statusList = eventStatusList;
    component.eventLocationsList = [];
    const spy = spyOn(component, 'resetAll');
    component.resetAll();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.selectedFilters).toEqual([]);
  });

  it('should check weather deleteOneFilter works correctly', () => {
    component.selectedFilters = [
      { nameEn: 'one', nameUa: 'один' },
      { nameEn: 'two', nameUa: 'два' },
      { nameEn: 'three', nameUa: 'три' }
    ];
    const filterRemoved = { nameEn: 'three', nameUa: 'три' };
    const res = [
      { nameEn: 'one', nameUa: 'один' },
      { nameEn: 'two', nameUa: 'два' }
    ];

    component.eventTimeList = eventTimeList;
    component.typeList = TagsArray;
    component.statusList = eventStatusList;
    component.eventLocationsList = [];

    const spy = spyOn(component, 'deleteOneFilter');
    component.deleteOneFilter(filterRemoved, 1);
    component.selectedFilters.pop();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.selectedFilters).toEqual(res);
  });

  it('should return unique locations', () => {
    const expectedLocations: OptionItem[] = [
      { nameEn: 'Kyiv', nameUa: 'Київ' },
      { nameEn: 'Lviv', nameUa: 'Львів' },
      { nameEn: 'Ternopil', nameUa: 'Тернопіль' }
    ];
    expect(component.getUniqueLocations(addressesMock)).toEqual(expectedLocations);
  });

  it('should select all options and push them to selectedFilters when allSelectedFlags is true', () => {
    const key = 'dropdown1';
    component.allSelectedFlags[key] = true;

    const options = fixture.debugElement.queryAll(By.directive(MatOption));
    options.forEach((option) => {
      spyOn(option.componentInstance, 'select');
      spyOn(component.selectedFilters, 'push');

      option.triggerEventHandler('click', null);

      expect(option.componentInstance.select).toHaveBeenCalled();
      expect(component.selectedFilters.push).toHaveBeenCalledWith(option.componentInstance.value);
    });
  });

  it('should deselect all options and remove them from selectedFilters when allSelectedFlags is false', () => {
    const key = 'dropdown1';
    component.allSelectedFlags[key] = false;

    const options = fixture.debugElement.queryAll(By.directive(MatOption));
    options.forEach((option) => {
      spyOn(option.componentInstance, 'deselect');
      spyOn(component.selectedFilters, 'filter');

      option.triggerEventHandler('click', null);

      expect(option.componentInstance.deselect).toHaveBeenCalled();
      expect(component.selectedFilters.filter).toHaveBeenCalledWith((value) => value !== option.componentInstance.value);
    });
  });

  it('should remove existing filter when deselected', () => {
    let mockEvent: MatOptionSelectionChange = {
      isUserInput: true,
      source: { selected: true } as MatOption
    };
    component.updateSelectedFilters(eventStatusList[0], mockEvent, component.statusesList, 'statuses', component.statusList);
    component.updateSelectedFilters(eventStatusList[1], mockEvent, component.statusesList, 'statuses', component.statusList);
    mockEvent = { isUserInput: true, source: { selected: false } as MatOption };
    component.updateSelectedFilters(eventStatusList[1], mockEvent, component.statusesList, 'statuses', component.statusList);
    expect(component.selectedFilters).toEqual([{ nameEn: 'Open', nameUa: 'Відкритa' }]);
  });

  it('should add new filter when selected', () => {
    const mockEvent: MatOptionSelectionChange = {
      isUserInput: true,
      source: { selected: true } as MatOption
    };
    component.updateSelectedFilters(eventStatusList[0], mockEvent, component.statusesList, 'statuses', component.statusList);
    component.updateSelectedFilters(eventStatusList[1], mockEvent, component.statusesList, 'statuses', component.statusList);
    expect(component.selectedFilters).toEqual([
      { nameEn: 'Open', nameUa: 'Відкритa' },
      { nameEn: 'Closed', nameUa: 'Закритa' }
    ]);
  });

  it('should check weather search works correctly', () => {
    component.searchToggle = false;
    component.search();
    expect(component.searchToggle).toEqual(true);
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
});
