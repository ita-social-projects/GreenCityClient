import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { of, Subject } from 'rxjs';
import { UbsAdminTariffsDeactivatePopUpComponent } from './ubs-admin-tariffs-deactivate-pop-up.component';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TariffsService } from '../../../services/tariffs.service';
import { Store } from '@ngrx/store';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

describe('UbsAdminTariffsDeactivatePopUpComponent', () => {
  let component: UbsAdminTariffsDeactivatePopUpComponent;
  let fixture: ComponentFixture<UbsAdminTariffsDeactivatePopUpComponent>;

  const locationItem = {
    id: 0,
    name: 'Фейк'
  };

  const stationItem = {
    id: 0,
    name: 'Фейк'
  };

  const fakeCouriers = [
    {
      courierId: 1,
      courierStatus: 'fake1',
      courierTranslationDtos: [
        {
          name: 'фейкКурєр1',
          nameEng: 'fakeCourier1'
        }
      ],
      createDate: 'fakedate',
      createdBy: 'fakeadmin'
    },
    {
      courierId: 2,
      courierStatus: 'fake2',
      courierTranslationDtos: [
        {
          name: 'фейкКурєр2',
          nameEng: 'fakeCourier2'
        }
      ],
      createDate: 'fakedate',
      createdBy: 'fakeadmin'
    }
  ];

  const fakeStation = {
    id: 1,
    name: 'Фейк',
    createdBy: 'ФейкАдмін',
    createDate: '2022-05-28'
  };

  const fakeLocation = [
    {
      locationsDto: [
        {
          latitude: 0,
          locationId: 1,
          locationStatus: 'fakeStatus',
          locationTranslationDtoList: [
            {
              languageCode: 'ua',
              locationName: 'ФейкМісто1'
            },
            {
              languageCode: 'en',
              locationName: 'FakeCity1'
            }
          ],
          longitude: 0
        },
        {
          latitude: 1,
          locationId: 2,
          locationStatus: 'fakeStatus',
          locationTranslationDtoList: [
            {
              languageCode: 'ua',
              locationName: 'ФейкМісто2'
            },
            {
              languageCode: 'en',
              locationName: 'FakeCity2'
            }
          ],
          longitude: 1
        }
      ],
      regionId: 1,
      regionTranslationDtos: [
        {
          regionName: 'Фейк область',
          languageCode: 'ua'
        },
        {
          regionName: 'Fake region',
          languageCode: 'en'
        }
      ]
    }
  ];

  const mockCities = [
    {
      locationTranslationDtoList: [
        {
          locationName: 'ФейкМісто1',
          languageCode: 'ua'
        },
        {
          locationName: 'FakeCity1',
          languageCode: 'en'
        }
      ]
    },
    {
      locationTranslationDtoList: [
        {
          locationName: 'ФейкМісто2',
          languageCode: 'ua'
        },
        {
          locationName: 'FakeCity2',
          languageCode: 'en'
        }
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
        name: 'fake'
      }
    ],
    regionDto: {
      nameEn: 'fake',
      nameUk: 'фейк',
      regionId: 0
    },
    tariffStatus: 'fake'
  };

  const eventMockCity = {
    option: {
      value: {
        latitude: 0,
        locationId: 1,
        locationStatus: 'ACTIVE',
        locationTranslationDtoList: [
          { locationName: 'перше', languageCode: 'ua' },
          { locationName: 'first', languageCode: 'en' }
        ],
        longitude: 0
      }
    }
  };

  const eventMockStation = {
    option: {
      value: 'Фейк'
    }
  };

  const matDialogMock = jasmine.createSpyObj('matDialog', ['open']);
  matDialogMock.open.and.returnValue({ afterClosed: () => of(true) });
  const fakeMatDialogRef = jasmine.createSpyObj(['close', 'afterClosed']);
  fakeMatDialogRef.afterClosed.and.returnValue(of(true));

  const tariffsServiceMock = jasmine.createSpyObj('tariffsServiceMock', [
    'getCouriers',
    'getAllStations',
    'getActiveLocations',
    'getCardInfo'
  ]);
  tariffsServiceMock.getCouriers.and.returnValue(of(fakeCouriers));
  tariffsServiceMock.getAllStations.and.returnValue(of([fakeStation]));
  tariffsServiceMock.getActiveLocations.and.returnValue(of([fakeLocation]));
  tariffsServiceMock.getCardInfo.and.returnValue(of([fakeTariffCard]));

  const localStorageServiceStub = () => ({
    firstNameBehaviourSubject: { pipe: () => of('fakeName') }
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminTariffsDeactivatePopUpComponent],
      imports: [MatDialogModule, TranslateModule.forRoot(), ReactiveFormsModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialog, useValue: matDialogMock },
        { provide: MatDialogRef, useValue: fakeMatDialogRef },
        { provide: LocalStorageService, useFactory: localStorageServiceStub },
        { provide: TariffsService, useValue: tariffsServiceMock },
        FormBuilder
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminTariffsDeactivatePopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call methods in OnInit', () => {
    const spy1 = spyOn(component, 'getLocations');
    const spy2 = spyOn(component, 'getCouriers');
    const spy3 = spyOn(component, 'getReceivingStation');
    const spy4 = spyOn(component, 'setStationPlaceholder');
    const spy5 = spyOn(component, 'setRegionsPlaceholder');
    const spy6 = spyOn(component, 'setCityPlaceholder');
    const spy7 = spyOn(component, 'getTariffCards');
    component.ngOnInit();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalled();
    expect(spy5).toHaveBeenCalled();
    expect(spy6).toHaveBeenCalled();
    expect(spy7).toHaveBeenCalled();
  });

  // Gettiong data

  it('should get all couriers', () => {
    component.getCouriers();
    expect(component.couriers).toEqual(fakeCouriers);
    expect(component.couriersName).toEqual(['фейкКурєр1', 'фейкКурєр2']);
  });

  it('should get all stations', () => {
    component.getReceivingStation();
    expect(component.stations).toEqual([fakeStation]);
    expect(component.stationsName).toEqual(['Фейк']);
  });

  it('should get locations', () => {
    component.getLocations();
    expect(component.locations).toEqual(fakeLocation);
  });

  it('should get all tariff cards', () => {
    component.getTariffCards();
    expect(component.tariffCards).toEqual([fakeTariffCard]);
  });

  // Courier

  it('the method selectCourier should set courier id and call onSelectedCourier', () => {
    component.couriers = fakeCouriers;
    const spy = spyOn(component, 'onSelectedCourier');
    const mockEvent: MatAutocompleteSelectedEvent = {
      option: {
        value: 'фейкКурєр1'
      }
    } as MatAutocompleteSelectedEvent;
    component.selectCourier(mockEvent);
    expect(component.courierId).toEqual(1);
    expect(spy).toHaveBeenCalled();
  });

  it('the method onSelectedCourier should get filtered cards', () => {
    component.onSelectedCourier();
    expect(component.filterTariffCards()).toBeTruthy();
  });

  it('the method onSelectedCourier should disable station and region fields when there is no filtered tariff card', () => {
    component.tariffCards = [];
    const spy1 = spyOn(component, 'disableStation');
    const spy2 = spyOn(component, 'disableRegion');
    component.onSelectedCourier();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('the method onSelectedCourier should filter dropdown lists when there is filtered tariff card', () => {
    const spy1 = spyOn(component, 'selectAllStationsInTariffCards');
    const spy2 = spyOn(component, 'selectAllRegionsInTariffCards');
    const spy3 = spyOn(component, 'selectAllCitiesInTariffCards');
    const filteredTariffCards = component.filterTariffCards();
    component.onSelectedCourier();
    expect(spy1).toHaveBeenCalledWith(filteredTariffCards);
    expect(spy2).toHaveBeenCalledWith(filteredTariffCards);
    expect(spy3).toHaveBeenCalledWith(filteredTariffCards);
  });

  // Station

  it('the method selectStation should be called', () => {
    component.selectedStations.push(stationItem);
    const spy1 = spyOn(component, 'addSelectedStation');
    const spy2 = spyOn(component, 'setStationPlaceholder');
    const spy3 = spyOn(component, 'onStationsSelected');
    component.selectStation(eventMockStation as any);
    expect(spy1).toHaveBeenCalledWith(eventMockStation as any);
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
  });

  it('should empty station value selectStation method', () => {
    component.selectStation(eventMockStation as any);
    expect(component.station.value).toEqual('');
  });

  it('should add new selected station if it does not exist in list', () => {
    component.selectedStations = [{ id: 0, name: 'Cтанція' }];
    component.addSelectedStation(eventMockStation as any);
    expect(component.selectedStations).toEqual([
      { id: 0, name: 'Cтанція' },
      { id: 1, name: 'Фейк' }
    ]);
  });

  it('should remove selected station if it exists in list', () => {
    component.selectedStations = [
      { id: 0, name: 'Cтанція' },
      { id: 1, name: 'Фейк' }
    ];
    component.addSelectedStation(eventMockStation as any);
    expect(component.selectedStations).toEqual([{ id: 0, name: 'Cтанція' }]);
  });

  it('the method onStationsSelected should get filtered cards', () => {
    component.onStationsSelected();
    expect(component.filterTariffCards()).toBeTruthy();
  });

  it('the method onStationsSelected should disable courier and region fields when there is no filtered tariff card', () => {
    component.tariffCards = [];
    const spy1 = spyOn(component, 'disableCourier');
    const spy2 = spyOn(component, 'disableRegion');
    component.onStationsSelected();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('the method onStationsSelected should filter dropdown lists when there is filtered tariff card', () => {
    const spy1 = spyOn(component, 'selectAllCouriersInTariffCards');
    const spy2 = spyOn(component, 'selectAllRegionsInTariffCards');
    const spy3 = spyOn(component, 'selectAllCitiesInTariffCards');
    const filteredTariffCards = component.filterTariffCards();
    component.onStationsSelected();
    expect(spy1).toHaveBeenCalledWith(filteredTariffCards);
    expect(spy2).toHaveBeenCalledWith(filteredTariffCards);
    expect(spy3).toHaveBeenCalledWith(filteredTariffCards);
  });

  it('should set station placeholder', () => {
    component.selectedStations = [stationItem];
    component.setStationPlaceholder();
    expect(component.stationPlaceholder).toEqual('1 вибрано');
  });

  it('should set station placeholder', () => {
    component.selectedStations = [];
    component.setStationPlaceholder();
    expect(component.stationPlaceholder).toEqual('ubs-tariffs.placeholder-choose-station');
  });

  it('checkStation should return true if item is in selectedStation', () => {
    component.selectedStations = [stationItem];
    expect(component.checkStation('Фейк')).toEqual(true);
  });

  it('checkStation should return false if item is not in selectedStation', () => {
    component.selectedStations = [stationItem];
    expect(component.checkStation('Фейк1')).toEqual(false);
  });

  // Region

  it('should filter options', () => {
    const mockStationsName = ['Фейк1', 'Фейк2'];
    const result = component.filterOptions('Фейк1', mockStationsName);
    expect(result).toEqual(['Фейк1']);
  });

  it('destroy Subject should be closed after ngOnDestroy()', () => {
    const unsubscribe = 'unsubscribe';
    component[unsubscribe] = new Subject<boolean>();
    spyOn(component[unsubscribe], 'complete');
    component.ngOnDestroy();
    expect(component[unsubscribe].complete).toHaveBeenCalledTimes(1);
  });
});
