import { LocationTranslation } from './../../../ubs/models/ubs.interface';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { UbsAdminTariffsLocationDashboardComponent } from './ubs-admin-tariffs-location-dashboard.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { FilterListByLangPipe } from '../../../../shared/sort-list-by-lang/filter-list-by-lang.pipe';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TariffsService } from '../../services/tariffs.service';
import { of, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Locations } from '../../models/tariffs.interface';
import { MatMenuModule } from '@angular/material/menu';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MockStore } from '@ngrx/store/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UbsAdminTariffsCourierPopUpComponent } from './ubs-admin-tariffs-courier-pop-up/ubs-admin-tariffs-courier-pop-up.component';
import { UbsAdminTariffsStationPopUpComponent } from './ubs-admin-tariffs-station-pop-up/ubs-admin-tariffs-station-pop-up.component';
import { UbsAdminTariffsLocationPopUpComponent } from './ubs-admin-tariffs-location-pop-up/ubs-admin-tariffs-location-pop-up.component';
import { UbsAdminTariffsDeactivatePopUpComponent } from './ubs-admin-tariffs-deactivate-pop-up/ubs-admin-tariffs-deactivate-pop-up.component';
import { TariffStatusPipe } from '@pipe/tariff-status-pipe/tariff-status.pipe';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { TariffDeactivateConfirmationPopUpComponent } from '../shared/components/tariff-deactivate-confirmation-pop-up/tariff-deactivate-confirmation-pop-up.component';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

describe('UbsAdminTariffsLocationDashboardComponent', () => {
  let component: UbsAdminTariffsLocationDashboardComponent;
  let fixture: ComponentFixture<UbsAdminTariffsLocationDashboardComponent>;
  let httpMock: HttpTestingController;
  let router: Router;
  let store: MockStore;

  const mockRegion = [
    {
      locationsDto: [
        {
          latitude: 11,
          locationId: 1,
          locationStatus: 'фейк1',
          locationTranslationDtoList: [
            { languageCode: 'ua', locationName: 'Фейк1' },
            { languageCode: 'en', locationName: 'Fake1' }
          ],
          longitude: 12
        },
        {
          latitude: 12,
          locationId: 2,
          locationStatus: 'фейк2',
          locationTranslationDtoList: [
            { languageCode: 'ua', locationName: 'Фейк2' },
            { languageCode: 'en', locationName: 'Fake2' }
          ],
          longitude: 13
        }
      ],
      regionId: 1,
      regionTranslationDtos: [
        { regionName: 'Фейк область', languageCode: 'ua' },
        { regionName: 'Fake region', languageCode: 'en' }
      ]
    }
  ];

  const fakeTariffCard = {
    cardId: 0,
    courierId: 0,
    courierLimit: 'fake',
    courierTranslationDtos: [
      {
        name: 'фейк',
        nameEng: 'fake'
      }
    ],
    createdAt: 'date',
    creator: 'fakeAuthor',
    locationInfoDtos: [
      {
        locationId: 0,
        nameEn: 'fake',
        nameUk: 'фейк'
      }
    ],
    maxAmountOfBags: 0,
    maxPriceOfOrder: 0,
    minAmountOfBags: 0,
    minPriceOfOrder: 0,
    receivingStationDtos: [
      {
        createDate: 'date',
        createdBy: 'fakeAuthor',
        id: 0,
        name: 'фейк'
      }
    ],
    regionDto: {
      nameEn: 'fake',
      nameUk: 'фейк',
      regionId: 0
    },
    tariffStatus: 'fake'
  };

  const fakeCouriers = {
    courierId: 1,
    courierStatus: 'fake',
    courierTranslationDtos: [
      {
        languageCode: 'ua',
        name: 'fakeCourier'
      }
    ]
  };

  const fakeStation = {
    id: 1,
    name: 'fake',
    createdBy: 'Fake',
    createdAt: 'fake'
  };

  const dialogStub = {
    afterClosed() {
      return of(true);
    }
  };

  const fakeLocations: Locations = {
    locationsDto: [
      {
        latitude: 0,
        locationId: 159,
        locationStatus: 'active',
        locationTranslationDtoList: [
          { languageCode: 'ua', locationName: 'фейк' },
          { languageCode: 'en', locationName: 'fake' }
        ],
        longitude: 0
      },
      {
        latitude: 0,
        locationId: 0,
        locationStatus: 'active',
        locationTranslationDtoList: [
          { languageCode: 'ua', locationName: 'фейк2' },
          { languageCode: 'en', locationName: 'fake' }
        ],
        longitude: 0
      }
    ],
    regionId: 1,
    regionTranslationDtos: [
      {
        regionName: 'fake',
        languageCode: 'ua'
      }
    ]
  };

  const eventMockStation = {
    option: {
      value: 'fake'
    }
  };

  const tariffsServiceMock = jasmine.createSpyObj('tariffsServiceMock', [
    'getCouriers',
    'getAllStations',
    'getFilteredCard',
    'checkIfCardExist',
    'createCard'
  ]);
  tariffsServiceMock.getCouriers.and.returnValue(of([fakeCouriers]));
  tariffsServiceMock.getAllStations.and.returnValue(of([fakeStation]));
  tariffsServiceMock.getFilteredCard.and.returnValue(of([fakeTariffCard]));
  tariffsServiceMock.createCard.and.returnValue(of());
  tariffsServiceMock.checkIfCardExist.and.returnValue(of());

  const matDialogMock = jasmine.createSpyObj('matDialogMock', ['open']);
  matDialogMock.open.and.returnValue(dialogStub);

  const fakeMatDialogRef = jasmine.createSpyObj(['close', 'afterClosed']);
  fakeMatDialogRef.afterClosed.and.returnValue(of(true));

  const storeMock = jasmine.createSpyObj('Store', ['select', 'dispatch']);
  storeMock.select.and.returnValue(of({ locations: { locations: [fakeLocations] } }));

  const localStorageServiceMock = jasmine.createSpyObj('localStorageServiceMock', ['getCurrentLanguage', 'languageBehaviourSubject']);
  localStorageServiceMock.getCurrentLanguage.and.returnValue(of('ua'));
  localStorageServiceMock.languageBehaviourSubject = new BehaviorSubject('ua');

  const languageServiceMock = jasmine.createSpyObj('languageServiceMock', ['getCurrentLanguage', 'getCurrentLangObs']);
  languageServiceMock.getCurrentLangObs.and.returnValue(of('ua'));
  languageServiceMock.getCurrentLanguage.and.returnValue('ua');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminTariffsLocationDashboardComponent, FilterListByLangPipe, TariffStatusPipe],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        MatMenuModule,
        MatAutocompleteModule,
        MatSelectModule,
        BrowserAnimationsModule,
        MatCheckboxModule,
        MatIconModule,
        MatChipsModule
      ],
      providers: [
        TranslateService,
        FormBuilder,
        { provide: MatDialog, useValue: matDialogMock },
        { provide: MatDialogRef, useValue: dialogStub },
        { provide: TariffsService, useValue: tariffsServiceMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: Store, useValue: storeMock },
        { provide: LanguageService, useValue: languageServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminTariffsLocationDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router);
    httpMock = TestBed.inject(HttpTestingController);
    store = TestBed.inject(Store) as MockStore;
    component.locations = [fakeLocations];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add new city item', () => {
    const eventMock = {
      value: ''
    };
    component.selectedCities = [];
    component.addItem(eventMock as any);
    expect(component.selectedCities.length).toEqual(0);
    expect(component.city.value).toEqual('');
  });

  it('should add new city item', () => {
    const eventMock = {
      value: 'First'
    };
    component.selectedCities = [];
    component.addItem(eventMock as any);
    expect(component.selectedCities.length).toEqual(1);
    expect(component.city.value).toEqual('');
  });

  it('should call method for selecting one city', () => {
    const eventMock = {
      option: {
        value: 'First'
      }
    };
    const spy = spyOn(component, 'selectCity');
    component.onSelectCity(eventMock as any);
    expect(spy).toHaveBeenCalledWith(eventMock);
    expect(component.city.value).toEqual('');
  });

  it('should call method for selecting all cities', () => {
    const eventMock = {
      option: {
        value: 'all'
      }
    };
    const spy = spyOn(component, 'toggleSelectAllCity');
    component.onSelectCity(eventMock as any);
    expect(spy).toHaveBeenCalled();
    expect(component.city.value).toEqual('');
  });

  it('should remove selected city if it exists in list', () => {
    const eventMock = {
      option: {
        viewValue: 'fake'
      }
    };
    component.selectedCities = [
      { name: 'fake', id: 159, englishName: 'fake' },
      { name: 'fake2', id: 0, englishName: 'fake2' }
    ];
    component.selectCity(eventMock as any);
    expect(component.selectedCities).toEqual([{ name: 'fake2', id: 0, englishName: 'fake2' }]);
  });

  it('should add new selected city if it doesnot exist in list', () => {
    const eventMock = {
      option: {
        viewValue: 'fake'
      }
    };
    component.selectedCities = [{ name: 'фейк2', id: 0, ukrainianName: 'фейк2', englishName: 'fake2' }];
    component.selectCity(eventMock as any);
    expect(component.selectedCities).toEqual([
      { name: 'фейк2', id: 0, ukrainianName: 'фейк2', englishName: 'fake2' },
      { name: 'фейк', id: 159, ukrainianName: 'фейк', englishName: 'fake' }
    ]);
  });

  it('should check if all is not choosen', () => {
    component.selectedCities = [{ name: 'fake', id: 159, englishName: 'fake' }];
    component.cities = [
      { name: 'fake', id: 159 },
      { name: 'fake2', id: 0 }
    ];
    const result = component.isCityChecked();
    expect(result).toEqual(false);
  });

  it('should check if all is choosen', () => {
    component.selectedCities = [
      { name: 'fake', id: 159, englishName: 'fake' },
      { name: 'fake2', id: 0, englishName: 'fake2' }
    ];
    component.cities = [
      { name: 'fake', id: 159 },
      { name: 'fake2', id: 0 }
    ];
    const result = component.isCityChecked();
    expect(result).toEqual(true);
  });

  it('should check if all is not choosen', () => {
    component.selectedStation = [{ name: 'First', id: 0 }];
    component.stationName = ['First', 'Second'];
    const result = component.isStationChecked();
    expect(result).toEqual(false);
  });

  it('should add new selected station if it does not exist in list', () => {
    component.selectedStation = [{ name: 'station', id: 0 }];
    component.onSelectStation(eventMockStation as any);
    expect(component.selectedStation).toEqual([
      { name: 'station', id: 0 },
      { name: 'fake', id: 1 }
    ]);
  });

  it('should remove selected station if it exists in list', () => {
    component.selectedStation = [
      { name: 'station', id: 0 },
      { name: 'fake', id: 1 }
    ];
    component.onSelectStation(eventMockStation as any);
    expect(component.selectedStation).toEqual([{ name: 'station', id: 0 }]);
  });

  it('should check if all is choosen', () => {
    component.selectedStation = [
      { name: 'First', id: 1 },
      { name: 'Second', id: 2 }
    ];
    component.stationName = ['First', 'Second'];
    const result = component.isStationChecked();
    expect(result).toEqual(true);
  });

  it('should map cities from region', () => {
    const result = component.mapCities(mockRegion);
    expect(result).toEqual([
      {
        id: 1,
        name: 'Фейк1',
        locationTranslationDtoList: [
          { languageCode: 'ua', locationName: 'Фейк1' },
          { languageCode: 'en', locationName: 'Fake1' }
        ]
      },
      {
        id: 2,
        name: 'Фейк2',
        locationTranslationDtoList: [
          { languageCode: 'ua', locationName: 'Фейк2' },
          { languageCode: 'en', locationName: 'Fake2' }
        ]
      }
    ]);
  });

  it('should filter options', () => {
    const mockCities = ['Фейк1', 'Фейк2'];
    const result = component._filter('Фейк1', mockCities);
    expect(result).toEqual(['Фейк1']);
  });

  it('should add cards to cards array', () => {
    const mockCard = {
      cardId: 0,
      courier: 'фейк',
      station: ['фейк'],
      region: 'фейк',
      city: ['фейк'],
      tariff: 'fake',
      regionId: 0
    };
    component.cards = [];
    component.getExistingCard({});
    expect(component.cards).toEqual([mockCard]);
  });

  it('should call method for filtering card with chosen courier', () => {
    const eventMock = {
      value: 'fakeCourier'
    };
    const fakeFilterData = {
      status: 'ACTIVE',
      courier: 1
    };
    const spy = spyOn(component, 'getExistingCard');
    component.onSelectCourier(eventMock);
    expect(spy).toHaveBeenCalledWith(fakeFilterData);
  });

  it('should call method for filtering card with chosen all couriers', () => {
    const eventMock = {
      value: 'all'
    };
    const fakeFilterData = {
      status: 'ACTIVE',
      courier: ''
    };
    const spy = spyOn(component, 'getExistingCard');
    component.onSelectCourier(eventMock);
    expect(spy).toHaveBeenCalledWith(fakeFilterData);
  });

  it('should call method for filtering card with chosen region', () => {
    const eventMock = {
      option: {
        value: 'fake'
      }
    };
    const fakeFilterData = {
      status: 'ACTIVE',
      region: 1
    };
    const spy = spyOn(component, 'getExistingCard');
    component.regionSelected(eventMock);
    expect(spy).toHaveBeenCalledWith(fakeFilterData);
  });

  it('should call method for filtering card with chosen all regions', () => {
    const eventMock = {
      option: {
        value: 'Усі'
      }
    };
    const fakeFilterData = {
      status: 'ACTIVE',
      region: ''
    };
    const spy = spyOn(component, 'getExistingCard');
    component.regionSelected(eventMock);
    expect(spy).toHaveBeenCalledWith(fakeFilterData);
  });

  it('should call method for filtering card with chosen all stations', () => {
    const eventMockStationAll = {
      option: {
        value: 'all'
      }
    };
    const fakeFilterData = {
      status: 'ACTIVE',
      receivingStation: [1]
    };
    const spy = spyOn(component, 'getExistingCard');
    component.stationSelected(eventMockStationAll as any);
    expect(spy).toHaveBeenCalledWith(fakeFilterData);
  });

  it('should call method for filtering card with chosen stations', () => {
    const eventMock = {
      option: {
        value: 'fake'
      }
    };
    const fakeFilterData = {
      status: 'ACTIVE',
      receivingStation: [1]
    };
    const spy = spyOn(component, 'getExistingCard');
    component.stationSelected(eventMock as any);
    expect(spy).toHaveBeenCalledWith(fakeFilterData);
  });

  it('should call method for filtering card with chosen all cities', () => {
    const eventMock = {
      option: {
        value: 'all'
      }
    };
    const fakeFilterData = {
      status: 'ACTIVE',
      location: [159, 0]
    };
    const spy = spyOn(component, 'getExistingCard');
    component.onSelectCity(eventMock as any);
    expect(spy).toHaveBeenCalledWith(fakeFilterData);
  });

  it('should call method for filtering card with chosen cities', () => {
    component.locations = [fakeLocations];
    const eventMock = {
      option: {
        viewValue: 'fake'
      }
    };
    const fakeFilterData = {
      status: 'ACTIVE',
      location: [159]
    };
    const spy = spyOn(component, 'getExistingCard');
    component.onSelectCity(eventMock as any);
    expect(spy).toHaveBeenCalledWith(fakeFilterData);
  });

  it('should select all items of cities', () => {
    const spy = spyOn(component, 'isCityChecked').and.returnValue(false);
    component.cities = [
      {
        name: 'First',
        id: 1,
        locationTranslationDtoList: [
          {
            locationName: 'Фейк1',
            languageCode: 'ua'
          },
          {
            locationName: 'Fake1',
            languageCode: 'en'
          }
        ]
      },
      {
        name: 'Second',
        id: 2,
        locationTranslationDtoList: [
          {
            locationName: 'Фейк2',
            languageCode: 'ua'
          },
          {
            locationName: 'Fake2',
            languageCode: 'en'
          }
        ]
      }
    ];
    component.toggleSelectAllCity();
    expect(spy).toHaveBeenCalled();
    expect(component.selectedCities.length).toEqual(2);
    expect(component.selectedCities).toEqual([
      {
        name: 'Фейк1',
        id: 1,
        englishName: 'Fake1',
        ukrainianName: 'Фейк1'
      },
      {
        name: 'Фейк2',
        id: 2,
        englishName: 'Fake2',
        ukrainianName: 'Фейк2'
      }
    ]);
  });

  it('should cities in correct language', () => {
    const city = {
      name: 'First',
      id: 1,
      locationTranslationDtoList: [
        {
          locationName: 'Фейк1',
          languageCode: 'ua'
        },
        {
          locationName: 'Fake1',
          languageCode: 'en'
        }
      ]
    };
    expect(component.transformCityToSelectedCity(city, 'ua')).toEqual({
      name: 'Фейк1',
      id: 1,
      englishName: 'Fake1',
      ukrainianName: 'Фейк1'
    });
    expect(component.transformCityToSelectedCity(city, 'en')).toEqual({
      name: 'Fake1',
      id: 1,
      englishName: 'Fake1',
      ukrainianName: 'Фейк1'
    });
  });

  it('should return name of the city in correct language', () => {
    const city = {
      name: 'First',
      id: 1,
      locationTranslationDtoList: [
        {
          locationName: 'Фейк1',
          languageCode: 'ua'
        },
        {
          locationName: 'Fake1',
          languageCode: 'en'
        }
      ]
    };
    expect(component.getSelectedCityName(city, 'ua')).toEqual('Фейк1');
    expect(component.getSelectedCityName(city, 'en')).toEqual('Fake1');
  });

  it('should select all items of cities', () => {
    const city = {
      name: 'Фейк1',
      id: 1,
      englishName: 'Fake1',
      ukrainianName: 'Фейк1'
    };
    const spy = spyOn(component, 'isCityChecked').and.returnValue(false);
    // const spy2 = spyOn(component, 'transformCityToSelectedCity').and.returnValue(city);
    component.cities = [
      {
        name: 'First',
        id: 1,
        locationTranslationDtoList: [
          {
            locationName: 'Фейк1',
            languageCode: 'ua'
          },
          {
            locationName: 'Fake1',
            languageCode: 'en'
          }
        ]
      }
    ];
    component.toggleSelectAllCity();
    expect(spy).toHaveBeenCalled();
    // expect(spy2).toHaveBeenCalled();
    expect(component.selectedCities).toContain(city);
  });

  it('should not select all items of cities', () => {
    const spy = spyOn(component, 'isCityChecked').and.returnValue(true);
    component.toggleSelectAllCity();
    expect(spy).toHaveBeenCalled();
    expect(component.selectedCities.length).toBe(0);
  });

  it('should select all items of stations', () => {
    const spy = spyOn(component, 'isStationChecked').and.returnValue(false);
    component.stations = [
      { name: 'First', createDate: '0', createdBy: 'Fake', id: 1 },
      { name: 'Second', createDate: '0', createdBy: 'Fake', id: 2 }
    ];
    component.toggleSelectAllStation();
    expect(spy).toHaveBeenCalled();
    expect(component.selectedStation.length).toEqual(2);
    expect(component.selectedStation).toEqual([
      { name: 'First', id: 1 },
      { name: 'Second', id: 2 }
    ]);
  });

  it('should not select all items of stations', () => {
    const spy = spyOn(component, 'isStationChecked').and.returnValue(true);
    component.toggleSelectAllStation();
    expect(spy).toHaveBeenCalled();
    expect(component.selectedStation.length).toBe(0);
  });

  it('should empty station value onSelectStation method', () => {
    component.stationSelected(eventMockStation as any);
    expect(component.station.value).toEqual('');
  });

  it('should call setStationPlaceholder when station selected', () => {
    const spy = spyOn(component, 'setStationPlaceholder');
    component.stationSelected(eventMockStation as any);
    expect(spy).toHaveBeenCalled();
  });

  it('should call onSelectStation when station option was selected not all option', () => {
    const spy = spyOn(component, 'onSelectStation');
    component.stationSelected(eventMockStation as any);
    expect(spy).toHaveBeenCalled();
  });

  it('should call toggleSelectAllStation when station all option was selected', () => {
    const eventMockStationAll = {
      option: {
        value: 'all'
      }
    };
    const spy = spyOn(component, 'toggleSelectAllStation');
    component.stationSelected(eventMockStationAll as any);
    expect(spy).toHaveBeenCalled();
  });

  it('should get locations', () => {
    component.getLocations();
    expect(storeMock.dispatch).toHaveBeenCalled();
  });

  it('should call methods on changes of region', () => {
    const spy = spyOn(component, 'checkRegionValue');
    component.region.setValue('Fake region');
    expect(spy).toHaveBeenCalledWith('Fake region');
    expect(component.selectedCities).toEqual([]);
  });

  it('navigate to pricing page', () => {
    const spy = spyOn(router, 'navigate');
    component.page(1);
    expect(spy).toHaveBeenCalledWith([`ubs-admin/tariffs/location/1`]);
  });

  it('should call methods in OnInit', () => {
    const spy1 = spyOn(component, 'getLocations');
    const spy2 = spyOn(component, 'getCouriers');
    const spy3 = spyOn(component, 'getReceivingStation');
    const spy4 = spyOn(component, 'loadScript');
    const spy6 = spyOn(component, 'setCountOfCheckedCity');
    const spy7 = spyOn(component, 'setStationPlaceholder');
    const spy8 = spyOn(component, 'setStateValue');
    component.ngOnInit();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalled();
    expect(spy6).toHaveBeenCalled();
    expect(spy7).toHaveBeenCalled();
    expect(spy8).toHaveBeenCalled();
  });

  it('should get all couriers', () => {
    component.getCouriers();
    console.log('getCourirs');
    console.log(component.couriers);
    console.log(component.couriersName);
    expect(component.couriersName).toEqual(['fakeCourier']);
  });

  it('should set  default value for filtering', () => {
    const result = { status: 'ACTIVE' };
    component.setStateValue();
    expect(component.filterData).toEqual(result);
  });

  it('should create new card on create card method', fakeAsync(() => {
    const spy1 = spyOn(component, 'createCardRequest');
    const spy2 = spyOn(component, 'getExistingCard');
    const spy3 = spyOn(component, 'setCountOfCheckedCity');
    const spy4 = spyOn(component, 'setStationPlaceholder');
    matDialogMock.open.and.returnValue(fakeMatDialogRef as any);
    component.createTariffCard();
    expect(fakeMatDialogRef.afterClosed).toHaveBeenCalled();
    tick();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalledWith({});
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalled();
    expect(component.region.value).toEqual('');
    expect(component.courier.value).toEqual('');
    expect(component.selectedCities).toEqual([]);
    expect(component.selectedStation).toEqual([]);
    expect(component.isCardExist).toEqual(false);
  }));

  it('should call create Card Object', () => {
    component.createCardDto();
    const fakeNewCard = {
      courierId: component.courierId,
      receivingStationsIdList: component.selectedStation.map((it) => it.id).sort(),
      regionId: component.regionId,
      locationIdList: component.selectedCities.map((it) => it.id).sort()
    };
    expect(component.createCardObj).toEqual(fakeNewCard);
  });

  it('should call createCard', () => {
    const fakeCard = {
      courierId: 0,
      receivingStationsIdList: [0],
      regionId: 0,
      locationIdList: [0]
    };
    component.createCardRequest(fakeCard);
    expect(tariffsServiceMock.createCard).toHaveBeenCalled();
  });

  it('should change isFieldFilled to true if all fields are filled', () => {
    component.region.setValue('fake');
    component.courier.setValue('fake');
    component.selectedStation = [{ name: 'stationItem', id: 1 }];
    component.selectedCities = [{ name: 'fake', id: 159, englishName: 'fake' }];
    component.checkisCardExist();
    expect(component.isFieldFilled).toBe(true);
  });

  it('should call functions on checkisCardExist', () => {
    component.region.setValue('fake');
    component.courier.setValue('fake');
    component.selectedStation = [{ name: 'stationItem', id: 1 }];
    component.selectedCities = [{ name: 'fake', id: 159, englishName: 'fake' }];
    const spy = spyOn(component, 'createCardDto');
    component.checkisCardExist();
    expect(spy).toHaveBeenCalled();
    expect(tariffsServiceMock.checkIfCardExist).toHaveBeenCalled();
  });

  it('should call function on create card method', () => {
    const spy1 = spyOn(component, 'createCardDto');
    component.createTariffCard();
    expect(spy1).toHaveBeenCalled();
  });

  it('should call createCard', () => {
    const fakeNewCard = {
      courierId: 0,
      receivingStationsIdList: 0,
      regionId: 0,
      locationIdList: 0
    };
    component.createCardRequest(fakeNewCard);
    expect(tariffsServiceMock.createCard).toHaveBeenCalled();
  });

  it('should call createCardRequest after matDialogRef closed', () => {
    const spy = spyOn(component, 'createCardRequest');
    component.createTariffCard();
    expect(spy).toHaveBeenCalled();
  });

  it('should return false if card do not exist', () => {
    component.region.setValue('Fake1');
    component.courier.setValue('Fake1');
    component.selectedCities = [{ name: 'fake1', id: 12 }];
    component.selectedStation = [{ name: 'stationItem1', id: 12 }];
    component.cards = [];
    component.checkisCardExist();
    tariffsServiceMock.checkIfCardExist.and.returnValue(of(false));
    expect(component.isCardExist).toBe(false);
  });

  it('should reset region and sity value', () => {
    const spy1 = spyOn(component, 'setCountOfCheckedCity');
    const spy2 = spyOn(component, 'getExistingCard');
    component.region.setValue('Fake1');
    component.selectedCities = [{ name: 'fake', id: 12, englishName: 'fake' }];
    component.resetRegionValue();
    expect(component.region.value).toEqual('');
    expect(component.selectedCities).toEqual([]);
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('should call openAddCourierDialog', () => {
    component.openAddCourierDialog();
    expect(matDialogMock.open).toHaveBeenCalledWith(UbsAdminTariffsCourierPopUpComponent, {
      hasBackdrop: true,
      panelClass: 'address-matDialog-styles-w-100',
      data: {
        headerText: 'addCourier',
        edit: false
      }
    });
  });

  it('should call openEditCourier', () => {
    component.openEditCourier();
    expect(matDialogMock.open).toHaveBeenCalledWith(UbsAdminTariffsCourierPopUpComponent, {
      hasBackdrop: true,
      panelClass: 'address-matDialog-styles-w-100',
      data: {
        headerText: 'editCourier',
        edit: true
      }
    });
  });

  it('should call openAddStationDialog', () => {
    component.openAddStationDialog();
    expect(matDialogMock.open).toHaveBeenCalledWith(UbsAdminTariffsStationPopUpComponent, {
      hasBackdrop: true,
      panelClass: 'address-matDialog-styles-w-100',
      data: {
        headerText: 'addStation',
        edit: false
      }
    });
  });

  it('should call openEditStation', () => {
    component.openEditStation();
    expect(matDialogMock.open).toHaveBeenCalledWith(UbsAdminTariffsStationPopUpComponent, {
      hasBackdrop: true,
      panelClass: 'address-matDialog-styles-w-100',
      data: {
        headerText: 'editStation',
        edit: true
      }
    });
  });

  it('should call openAddLocation', () => {
    component.openAddLocation();
    expect(matDialogMock.open).toHaveBeenCalledWith(UbsAdminTariffsLocationPopUpComponent, {
      hasBackdrop: true,
      panelClass: 'address-matDialog-styles-w-100',
      data: {
        headerText: 'addLocation',
        edit: false
      }
    });
  });

  it('should call openEditLocation', () => {
    component.openEditLocation();
    expect(matDialogMock.open).toHaveBeenCalledWith(UbsAdminTariffsLocationPopUpComponent, {
      hasBackdrop: true,
      panelClass: 'address-matDialog-styles-w-100',
      data: {
        headerText: 'editLocation',
        edit: true
      }
    });
  });

  it('should call openDeactivatePopUp', () => {
    component.openDeactivatePopUp();
    expect(matDialogMock.open).toHaveBeenCalledWith(UbsAdminTariffsDeactivatePopUpComponent, {
      hasBackdrop: true,
      panelClass: 'address-matDialog-styles-w-100',
      data: {
        headerText: 'deactivateTemplate'
      }
    });
  });

  it('should set city placeholder', () => {
    component.selectedCities = ['Фейк'];
    component.setCountOfCheckedCity();
    expect(component.cityPlaceholder).toEqual('1 ubs-tariffs.selected');
  });

  it('should set city placeholder', () => {
    component.selectedCities = [];
    component.setCountOfCheckedCity();
    expect(component.cityPlaceholder).toEqual('ubs-tariffs.placeholder-locality');
  });

  it('should set station placeholder', () => {
    component.selectedStation = ['stationItem'];
    component.setStationPlaceholder();
    expect(component.stationPlaceholder).toEqual('1 ubs-tariffs.selected');
  });

  it('should set station placeholder', () => {
    component.selectedStation = [];
    component.setStationPlaceholder();
    expect(component.stationPlaceholder).toEqual('ubs-tariffs.placeholder-choose-station');
  });

  it('checkSelectedItem should return true if item is in selectedStation', () => {
    const selectedStation = [{ name: 'stationItem', id: 1 }];
    expect(component.checkSelectedItem('stationItem', selectedStation)).toEqual(true);
  });

  it('checkSelectedItem should return false if item is not in selectedStation', () => {
    const selectedStation = [{ name: 'stationItem', id: 1 }];
    expect(component.checkSelectedItem('Фейк', selectedStation)).toEqual(false);
  });

  it('destroy Subject should be closed after ngOnDestroy()', () => {
    const destroy = 'destroy';
    component[destroy] = new Subject<boolean>();
    spyOn(component[destroy], 'next');
    spyOn(component[destroy], 'complete');
    component.ngOnDestroy();
    expect(component[destroy].next).toHaveBeenCalledTimes(1);
    expect(component[destroy].complete).toHaveBeenCalledTimes(1);
  });
});
