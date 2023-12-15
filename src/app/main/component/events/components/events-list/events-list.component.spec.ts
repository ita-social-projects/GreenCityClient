import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EventsListComponent } from './events-list.component';

import { EventsService } from '../../services/events.service';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { UserOwnAuthService } from '@global-service/auth/user-own-auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { MatLegacyDialog as MatDialog, MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { eventStatusList, TagsArray, eventTimeList } from '../../models/event-consts';
import { By } from '@angular/platform-browser';
import { MatLegacyOption as MatOption, MatLegacyOptionSelectionChange as MatOptionSelectionChange } from '@angular/material/legacy-core';
import { UntypedFormControl } from '@angular/forms';
import { Addresses, EventPageResponceDto } from '../../models/events.interface';

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
  const MockReqest = {
    page: [],
    totalElements: 4
  };

  const eventsMock: EventPageResponceDto[] = [
    {
      id: 7,
      title: 'TEst 2',
      organizer: {
        id: 3,
        name: 'AdminGreenCity',
        organizerRating: null
      },
      creationDate: '2023-04-10',
      description: 'efds',
      editorText: 'efds',
      dates: [
        {
          id: null,
          valid: true,
          event: null,
          startDate: '2023-04-11T21:00:00Z',
          finishDate: '2023-04-12T20:59:00Z',
          onlineLink: null,
          coordinates: {
            latitude: 0,
            longitude: 0,
            cityEn: 'Kyiv',
            cityUa: 'Київ',
            countryEn: 'Ukraine',
            countryUa: 'Україна',
            houseNumber: 55,
            regionEn: 'Lvivska oblast',
            regionUa: 'Львівська область',
            streetEn: 'Svobody Ave',
            streetUa: 'Свободи',
            formattedAddressEn: 'Свободи, 55, Львів, Львівська область, Україна',
            formattedAddressUa: 'Svobody Ave, 55, Lviv, Lvivska oblast, Ukraine'
          }
        }
      ],
      imgArray: [],
      imgArrayToPreview: [],
      tags: [
        {
          id: 12,
          nameUa: 'Соціальний',
          nameEn: 'Social'
        },
        {
          id: 13,
          nameUa: 'Екологічний',
          nameEn: 'Environmental'
        }
      ],
      titleImage: 'https://csb10032000a548f571.blob.core.windows.net/allfiles/73ef8707-3630-4cfc-a4a0-631e86bcfc7dbackground.jpg',
      additionalImages: [],
      isSubscribed: false,
      isFavorite: false,
      isActive: true,
      isRelevant: true,
      open: true,
      countComments: 5,
      likes: 6
    },
    {
      id: 7,
      title: 'TEst 2',
      organizer: {
        id: 3,
        name: 'AdminGreenCity',
        organizerRating: null
      },
      creationDate: '2023-04-10',
      description: 'efds',
      editorText: 'efds',
      dates: [
        {
          id: null,
          valid: true,
          event: null,
          startDate: '2023-04-11T21:00:00Z',
          finishDate: '2023-04-12T20:59:00Z',
          onlineLink: null,
          coordinates: {
            latitude: 50.454589,
            longitude: 30.506723,
            cityEn: 'Lviv',
            cityUa: 'Львів',
            countryEn: 'Ukraine',
            countryUa: 'Україна',
            houseNumber: 55,
            regionEn: 'Lvivska oblast',
            regionUa: 'Львівська область',
            streetEn: 'Svobody Ave',
            streetUa: 'Свободи',
            formattedAddressEn: 'Свободи, 55, Львів, Львівська область, Україна',
            formattedAddressUa: 'Svobody Ave, 55, Lviv, Lvivska oblast, Ukraine'
          }
        }
      ],
      imgArray: [],
      imgArrayToPreview: [],
      tags: [
        {
          id: 12,
          nameUa: 'Соціальний',
          nameEn: 'Social'
        },
        {
          id: 13,
          nameUa: 'Екологічний',
          nameEn: 'Environmental'
        }
      ],
      titleImage: 'https://csb10032000a548f571.blob.core.windows.net/allfiles/73ef8707-3630-4cfc-a4a0-631e86bcfc7dbackground.jpg',
      additionalImages: [],
      isSubscribed: false,
      isFavorite: false,
      isActive: true,
      isRelevant: true,
      open: true,
      countComments: 9,
      likes: 2
    }
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

  const timeFilterControl = new UntypedFormControl();
  const locationFilterControl = new UntypedFormControl();
  const statusFilterControl = new UntypedFormControl();
  const typeFilterControl = new UntypedFormControl();

  const EventsServiceMock = jasmine.createSpyObj('EventsService', ['createAddresses', 'getAddreses']);
  EventsServiceMock.createAddresses = () => of('');
  EventsServiceMock.getAddreses = () => of(addressesMock);

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

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EventsListComponent],
      imports: [TranslateModule.forRoot(), NgxPaginationModule, HttpClientTestingModule, RouterTestingModule, MatDialogModule],
      providers: [
        { provide: EventsService, useValue: EventsServiceMock },
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
    component.eventLocationList = [];
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
    component.eventLocationList = [];

    const spy = spyOn(component, 'deleteOneFilter');
    component.deleteOneFilter(filterRemoved, 1);
    component.selectedFilters.pop();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.selectedFilters).toEqual(res);
  });

  it('should check weather getUniqueCities works correctly', () => {
    const expected = [
      { nameEn: 'Kyiv', nameUa: 'Київ' },
      { nameEn: 'Lviv', nameUa: 'Львів' }
    ];
    expect(component.getUniqueCities(addressesMock)).toEqual(expected);
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
});
