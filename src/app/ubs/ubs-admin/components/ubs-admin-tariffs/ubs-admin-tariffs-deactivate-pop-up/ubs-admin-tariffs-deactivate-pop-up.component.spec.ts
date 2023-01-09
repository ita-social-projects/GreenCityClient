import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { of, Subject } from 'rxjs';
import { UbsAdminTariffsDeactivatePopUpComponent } from './ubs-admin-tariffs-deactivate-pop-up.component';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TariffsService } from '../../../services/tariffs.service';
import { ModalTextComponent } from '../../shared/components/modal-text/modal-text.component';
import { LanguageService } from 'src/app/main/i18n/language.service';

describe('UbsAdminTariffsDeactivatePopUpComponent', () => {
  let component: UbsAdminTariffsDeactivatePopUpComponent;
  let fixture: ComponentFixture<UbsAdminTariffsDeactivatePopUpComponent>;

  const locationItem = {
    id: 0,
    name: 'Фейк'
  };

  const stationItem = {
    id: 0,
    name: 'Фейк1'
  };

  const cityItem = {
    id: 0,
    name: 'Фейк місто'
  };

  const fakeCouriers = [
    {
      courierId: 1,
      courierStatus: 'fake1',
      nameUk: 'фейкКурєр1',
      nameEn: 'fakeCourier1',
      createDate: 'fakedate',
      createdBy: 'fakeadmin'
    },
    {
      courierId: 2,
      courierStatus: 'fake2',
      nameUk: 'фейкКурєр2',
      nameEn: 'fakeCourier2',
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

  const fakeLocation = {
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
  };

  const mockCities = [
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
  ];

  const fakeTariffCard = {
    cardId: 0,
    courierId: 0,
    courierLimit: 'fake',
    nameUk: 'фейк',
    nameEn: 'fake',
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
        name: 'Фейк1'
      }
    ],
    regionDto: {
      nameEn: 'fake',
      nameUk: 'фейк',
      regionId: 0
    },
    tariffStatus: 'fake'
  };

  const fakeFilteredTariffCards = [
    {
      cardId: 1,
      regionDto: {
        nameEn: 'fake',
        nameUk: 'Фейк',
        regionId: 0
      },
      locationInfoDtos: [
        {
          locationId: 0,
          nameEn: 'fake',
          nameUk: 'Фейк місто'
        }
      ],
      receivingStationDtos: [
        {
          createDate: 'date',
          createdBy: 'fakeAuthor',
          id: 0,
          name: 'Фейк1'
        }
      ],
      courierDto: {
        courierId: 2,
        courierStatus: 'fake',
        nameUk: 'fake',
        nameEn: 'fake',
        createDate: 'fake',
        createdBy: 'fake'
      },
      tariffStatus: 'fake',
      creator: 'fake',
      createdAt: 'fake',
      courierLimit: 'fake',
      minAmountOfBags: 1,
      maxAmountOfBags: 2,
      minPriceOfOrder: 10,
      maxPriceOfOrder: 100
    },
    {
      cardId: 1,
      regionDto: {
        nameEn: 'fake',
        nameUk: 'Фейк',
        regionId: 0
      },
      locationInfoDtos: [
        {
          locationId: 0,
          nameEn: 'fake',
          nameUk: 'Фейк місто'
        }
      ],
      receivingStationDtos: [
        {
          createDate: 'date',
          createdBy: 'fakeAuthor',
          id: 0,
          name: 'Фейк1'
        }
      ],
      courierDto: {
        courierId: 2,
        courierStatus: 'fake',
        nameUk: 'fake',
        nameEn: 'fake',
        createDate: 'fake',
        createdBy: 'fake'
      },
      tariffStatus: 'fake',
      creator: 'fake',
      createdAt: 'fake',
      courierLimit: 'fake',
      minAmountOfBags: 1,
      maxAmountOfBags: 2,
      minPriceOfOrder: 10,
      maxPriceOfOrder: 100
    },
    {
      cardId: 1,
      regionDto: {
        nameEn: 'fake',
        nameUk: 'Фейк',
        regionId: 0
      },
      locationInfoDtos: [
        {
          locationId: 0,
          nameEn: 'fake',
          nameUk: 'Фейк місто'
        }
      ],
      receivingStationDtos: [
        {
          createDate: 'date',
          createdBy: 'fakeAuthor',
          id: 0,
          name: 'Фейк1'
        }
      ],
      courierDto: {
        courierId: 2,
        courierStatus: 'fake',
        nameUk: 'fake',
        nameEn: 'fake',
        createDate: 'fake',
        createdBy: 'fake'
      },
      tariffStatus: 'fake',
      creator: 'fake',
      createdAt: 'fake',
      courierLimit: 'fake',
      minAmountOfBags: 1,
      maxAmountOfBags: 2,
      minPriceOfOrder: 10,
      maxPriceOfOrder: 100
    },
    {
      cardId: 1,
      regionDto: {
        nameEn: 'fake',
        nameUk: 'Фейк',
        regionId: 0
      },
      locationInfoDtos: [
        {
          locationId: 0,
          nameEn: 'fake',
          nameUk: 'Фейк місто'
        }
      ],
      receivingStationDtos: [
        {
          createDate: 'date',
          createdBy: 'fakeAuthor',
          id: 0,
          name: 'Фейк1'
        }
      ],
      courierDto: {
        courierId: 2,
        courierStatus: 'fake',
        nameUk: 'fake',
        nameEn: 'fake',
        createDate: 'fake',
        createdBy: 'fake'
      },
      tariffStatus: 'fake',
      creator: 'fake',
      createdAt: 'fake',
      courierLimit: 'fake',
      minAmountOfBags: 1,
      maxAmountOfBags: 2,
      minPriceOfOrder: 10,
      maxPriceOfOrder: 100
    }
  ];

  const fakeTariffCards = [
    {
      cardId: 1,
      regionDto: {
        nameEn: 'fake',
        nameUk: 'Фейк',
        regionId: 0
      },
      locationInfoDtos: [
        {
          locationId: 0,
          nameEn: 'fake',
          nameUk: 'Фейк місто'
        }
      ],
      receivingStationDtos: [
        {
          createDate: 'date',
          createdBy: 'fakeAuthor',
          id: 0,
          name: 'Фейк1'
        }
      ],
      courierDto: {
        courierId: 2,
        courierStatus: 'fake',
        nameUk: 'fake',
        nameEn: 'fake',
        createDate: 'fake',
        createdBy: 'fake'
      },
      tariffStatus: 'fake',
      creator: 'fake',
      createdAt: 'fake',
      courierLimit: 'fake',
      minAmountOfBags: 1,
      maxAmountOfBags: 2,
      minPriceOfOrder: 10,
      maxPriceOfOrder: 100
    },
    {
      cardId: 1,
      regionDto: {
        nameEn: 'fake',
        nameUk: 'Фейк',
        regionId: 0
      },
      locationInfoDtos: [
        {
          locationId: 0,
          nameEn: 'fake',
          nameUk: 'Фейк місто'
        }
      ],
      receivingStationDtos: [
        {
          createDate: 'date',
          createdBy: 'fakeAuthor',
          id: 0,
          name: 'Фейк1'
        }
      ],
      courierDto: {
        courierId: 2,
        courierStatus: 'fake',
        nameUk: 'fake',
        nameEn: 'fake',
        createDate: 'fake',
        createdBy: 'fake'
      },
      tariffStatus: 'fake',
      creator: 'fake',
      createdAt: 'fake',
      courierLimit: 'fake',
      minAmountOfBags: 1,
      maxAmountOfBags: 2,
      minPriceOfOrder: 10,
      maxPriceOfOrder: 100
    },
    {
      cardId: 1,
      regionDto: {
        nameEn: 'fake',
        nameUk: 'Фейк',
        regionId: 0
      },
      locationInfoDtos: [
        {
          locationId: 0,
          nameEn: 'fake',
          nameUk: 'Фейк місто'
        }
      ],
      receivingStationDtos: [
        {
          createDate: 'date',
          createdBy: 'fakeAuthor',
          id: 0,
          name: 'Фейк1'
        }
      ],
      courierDto: {
        courierId: 2,
        courierStatus: 'fake',
        nameUk: 'fake',
        nameEn: 'fake',
        createDate: 'fake',
        createdBy: 'fake'
      },
      tariffStatus: 'fake',
      creator: 'fake',
      createdAt: 'fake',
      courierLimit: 'fake',
      minAmountOfBags: 1,
      maxAmountOfBags: 2,
      minPriceOfOrder: 10,
      maxPriceOfOrder: 100
    },
    {
      cardId: 1,
      regionDto: {
        nameEn: 'fake',
        nameUk: 'Фейк',
        regionId: 0
      },
      locationInfoDtos: [
        {
          locationId: 0,
          nameEn: 'fake',
          nameUk: 'Фейк місто'
        }
      ],
      receivingStationDtos: [
        {
          createDate: 'date',
          createdBy: 'fakeAuthor',
          id: 0,
          name: 'Фейк1'
        }
      ],
      courierDto: {
        courierId: 2,
        courierStatus: 'fake',
        nameUk: 'fake',
        nameEn: 'fake',
        createDate: 'fake',
        createdBy: 'fake'
      },
      tariffStatus: 'fake',
      creator: 'fake',
      createdAt: 'fake',
      courierLimit: 'fake',
      minAmountOfBags: 1,
      maxAmountOfBags: 2,
      minPriceOfOrder: 10,
      maxPriceOfOrder: 100
    }
  ];

  const eventMockCity = {
    option: {
      value: 'ФейкМісто1'
    }
  };

  const eventMockCourier = {
    option: {
      value: 'фейкКурєр1'
    }
  };

  const eventMockStation = {
    option: {
      value: 'Фейк'
    }
  };

  const eventMockRegion = {
    option: {
      value: 'Фейк область'
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

  const languageServiceMock = jasmine.createSpyObj('languageServiceMock', ['getCurrentLanguage']);
  languageServiceMock.getCurrentLanguage.and.returnValue('ua');

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
        { provide: LanguageService, useValue: languageServiceMock },
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
    expect(component.locations).toEqual([fakeLocation]);
  });

  it('should get all tariff cards', fakeAsync(() => {
    component.getTariffCards();
    component.tariffCards = fakeTariffCards;
    tick(500);
    fixture.detectChanges();
    expect(component.tariffCards).toEqual(fakeFilteredTariffCards);
  }));

  it('should call method for selecting one courier', () => {
    component.couriers = fakeCouriers;
    const result = {
      id: 1,
      name: 'фейкКурєр1'
    };
    const spy = spyOn(component, 'onSelectedCourier');
    component.selectCourier(eventMockCourier as any);
    expect(component.selectedCourier).toEqual(result);
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

  it('should call method for selecting one station', () => {
    component.selectedStations.push(stationItem);
    const spy1 = spyOn(component, 'addSelectedStation');
    const spy2 = spyOn(component, 'setStationPlaceholder');
    const spy3 = spyOn(component, 'onStationsSelected');
    component.selectStation(eventMockStation as any);
    expect(spy1).toHaveBeenCalledWith(eventMockStation as any);
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
  });

  it('courier and region should be enabled when selectStations is empty', () => {
    component.selectedStations.push({ id: 1, name: 'Фейк' });
    const spy = spyOn(component, 'onDeletedField');
    component.selectStation(eventMockStation as any);
    expect(spy).toHaveBeenCalled();
    expect(component.courier.disabled).toEqual(false);
    expect(component.region.disabled).toEqual(false);
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
    component.tariffCards = [];
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

  it('should set station placeholder when there is one selected station', () => {
    component.selectedStations = [stationItem];
    component.setStationPlaceholder();
    expect(component.stationPlaceholder).toEqual('1 вибрано');
  });

  it('should set station placeholder when there is no selected station', () => {
    component.selectedStations = [];
    component.setStationPlaceholder();
    expect(component.stationPlaceholder).toEqual('ubs-tariffs.placeholder-choose-station');
  });

  it('checkStation should return true if item is in selectedStations', () => {
    component.selectedStations = [stationItem];
    expect(component.checkStation('Фейк1')).toEqual(true);
  });

  it('checkStation should return false if item is not in selectedStations', () => {
    component.selectedStations = [stationItem];
    expect(component.checkStation('Фейк2')).toEqual(false);
  });

  it('should delete station from the list, no selected station remained', () => {
    const spy1 = spyOn(component, 'setStationPlaceholder');
    const spy2 = spyOn(component, 'onDeletedField');
    component.selectedStations.push(stationItem);
    component.deleteStation(0);
    expect(component.selectedStations.length).toEqual(0);
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(component.courier.disabled).toEqual(false);
    expect(component.region.disabled).toEqual(false);
  });

  it('should delete station from the list, at least 1 selected station remained', () => {
    const spy1 = spyOn(component, 'setStationPlaceholder');
    const spy2 = spyOn(component, 'onStationsSelected');
    component.selectedStations = [
      { id: 0, name: 'Cтанція' },
      { id: 1, name: 'Фейк' }
    ];
    component.deleteStation(0);
    expect(component.selectedStations.length).toEqual(1);
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('should call method for selecting one region', () => {
    const spy1 = spyOn(component, 'addSelectedRegion');
    const spy2 = spyOn(component, 'setRegionsPlaceholder');
    component.selectRegion(eventMockRegion as any);
    expect(spy1).toHaveBeenCalledWith(eventMockRegion as any);
    expect(spy2).toHaveBeenCalled();
  });

  it('should empty region value selectRegion method', () => {
    component.selectRegion(eventMockRegion as any);
    expect(component.region.value).toEqual('');
  });

  it('city should be disabled if region is not selected', () => {
    component.ngOnInit();
    expect(component.city.disabled).toEqual(true);
  });

  it('should call onRegionSelected method when selectedRegions is equal to 1', () => {
    const spy = spyOn(component, 'onRegionSelected');
    component.selectRegion(eventMockRegion as any);
    expect(spy).toHaveBeenCalled();
  });

  it('should disable courier, station and city when selectedRegions is more than 1', () => {
    component.selectedRegions.push(locationItem);
    const spy1 = spyOn(component, 'disableCourier');
    const spy2 = spyOn(component, 'disableStation');
    const spy3 = spyOn(component, 'disableCity');
    component.selectRegion(eventMockRegion as any);
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
  });

  it('courier and station should be enabled, city should be disabled when selectedRegions is empty', () => {
    component.selectedRegions = [{ id: 1, name: 'Фейк область' }];
    const spy1 = spyOn(component, 'disableCity');
    const spy2 = spyOn(component, 'onDeletedField');
    component.selectRegion(eventMockRegion as any);
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(component.courier.disabled).toEqual(false);
    expect(component.station.disabled).toEqual(false);
  });

  it('should add new selected region if it does not exist in list', () => {
    component.selectedRegions = [{ id: 0, name: 'Фейк область 1' }];
    component.addSelectedRegion(eventMockRegion as any);
    expect(component.selectedRegions).toEqual([
      { id: 0, name: 'Фейк область 1' },
      { id: 1, name: 'Фейк область' }
    ]);
  });

  it('should remove selected region if it exists in list', () => {
    component.selectedRegions = [
      { id: 0, name: 'Фейк область 1' },
      { id: 1, name: 'Фейк область' }
    ];
    component.addSelectedRegion(eventMockRegion as any);
    expect(component.selectedRegions).toEqual([{ id: 0, name: 'Фейк область 1' }]);
  });

  it('the method onRegionSelected should get filtered cards', () => {
    component.tariffCards = [];
    const spy = spyOn(component, 'enableCity');
    const filteredTariffCards = component.filterTariffCards();
    component.onRegionSelected();
    expect(component.filterTariffCards()).toBeTruthy();
    expect(spy).toHaveBeenCalledWith(filteredTariffCards);
  });

  it('the method onRegionSelected should disable courier and station fields when there is no filtered tariff card', () => {
    component.tariffCards = [];
    const filteredTariffCards = component.filterTariffCards();
    const spy1 = spyOn(component, 'disableCourier');
    const spy2 = spyOn(component, 'disableStation');
    const spy3 = spyOn(component, 'enableCity');
    component.onRegionSelected();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalledWith(filteredTariffCards);
  });

  it('the method onRegionSelected should filter dropdown lists when there is filtered tariff card', () => {
    const spy1 = spyOn(component, 'selectAllCouriersInTariffCards');
    const spy2 = spyOn(component, 'selectAllStationsInTariffCards');
    const spy3 = spyOn(component, 'enableCity');
    const filteredTariffCards = component.filterTariffCards();
    component.onRegionSelected();
    expect(spy1).toHaveBeenCalledWith(filteredTariffCards);
    expect(spy2).toHaveBeenCalledWith(filteredTariffCards);
    expect(spy3).toHaveBeenCalledWith(filteredTariffCards);
    expect(component.courier.disabled).toEqual(false);
    expect(component.station.disabled).toEqual(false);
  });

  it('should get current cities and enable city field in enableCity method', () => {
    component.locations = [fakeLocation];
    component.selectedRegions = [{ id: 1, name: 'Фейк область' }];
    const filteredTariffCards = component.filterTariffCards();
    component.enableCity(filteredTariffCards);
    expect(component.currentCities).toEqual(mockCities);
    expect(component.city.disabled).toEqual(false);
  });

  it('should set current cities name and enable city field in enableCity method when station and courier fields is empty', () => {
    component.locations = [fakeLocation];
    component.selectedRegions = [{ id: 1, name: 'Фейк область' }];
    component.selectedStations = [];
    component.selectedCourier = null;
    const filteredTariffCards = component.filterTariffCards();
    component.enableCity(filteredTariffCards);
    expect(component.currentCitiesName).toEqual(['ФейкМісто1', 'ФейкМісто2']);
    expect(component.filteredCities).toEqual(['ФейкМісто1', 'ФейкМісто2']);
    expect(component.city.disabled).toEqual(false);
  });

  it('should set current cities name and enable city field in enableCity method', () => {
    component.locations = [fakeLocation];
    component.selectedRegions = [{ id: 1, name: 'Фейк область' }];
    component.selectedStations = [stationItem];
    const filteredTariffCards = [fakeTariffCard];
    component.enableCity(filteredTariffCards);
    expect(component.currentCitiesName).toEqual(['фейк']);
    expect(component.filteredCities).toEqual(['фейк']);
    expect(component.city.disabled).toEqual(false);
  });

  it('should set region placeholder when there is one selected region', () => {
    component.selectedRegions = [locationItem];
    component.setRegionsPlaceholder();
    expect(component.regionPlaceholder).toEqual('1 вибрано');
  });

  it('should set region placeholder when there is no selected region', () => {
    component.selectedRegions = [];
    component.setRegionsPlaceholder();
    expect(component.regionPlaceholder).toEqual('ubs-tariffs.placeholder-choose-region');
  });

  it('checkRegion should return true if item is in selectedRegions', () => {
    component.selectedRegions = [locationItem];
    expect(component.checkRegion('Фейк')).toEqual(true);
  });

  it('checkRegion should return false if item is not in selectedRegions', () => {
    component.selectedRegions = [locationItem];
    expect(component.checkRegion('Фейк1')).toEqual(false);
  });

  it('should delete region from the list, only 1 selected region remained', () => {
    const spy1 = spyOn(component, 'setRegionsPlaceholder');
    const spy2 = spyOn(component, 'onRegionSelected');
    component.selectedRegions = [
      { id: 0, name: 'Фейк область 1' },
      { id: 1, name: 'Фейк область' }
    ];
    component.deleteRegion(0);
    expect(component.selectedRegions.length).toEqual(1);
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('should delete region from the list, no selected region remained', () => {
    const spy1 = spyOn(component, 'setRegionsPlaceholder');
    const spy2 = spyOn(component, 'disableCity');
    const spy3 = spyOn(component, 'onDeletedField');
    component.selectedRegions.push(locationItem);
    component.deleteRegion(0);
    expect(component.selectedRegions.length).toEqual(0);
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(component.courier.disabled).toEqual(false);
    expect(component.station.disabled).toEqual(false);
  });

  it('should delete region from the list, more than 1 selected regions remained', () => {
    const spy1 = spyOn(component, 'setRegionsPlaceholder');
    const spy2 = spyOn(component, 'disableCity');
    const spy3 = spyOn(component, 'disableCourier');
    const spy4 = spyOn(component, 'disableStation');
    component.selectedRegions = [
      { id: 0, name: 'Фейк область' },
      { id: 1, name: 'Фейк область 1' },
      { id: 2, name: 'Фейк область 2' }
    ];
    component.deleteRegion(0);
    expect(component.selectedRegions.length).toEqual(2);
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalled();
  });

  it('should call method for selecting one city', () => {
    component.selectedCities.push(cityItem);
    const spy1 = spyOn(component, 'addSelectedCity');
    const spy2 = spyOn(component, 'setCityPlaceholder');
    const spy3 = spyOn(component, 'onCitiesSelected');
    component.selectCity(eventMockCity as any);
    expect(spy1).toHaveBeenCalledWith(eventMockCity as any);
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
  });

  it('courier and station should be enabled when selectedCities is empty', () => {
    component.selectedCities = [];
    const spy1 = spyOn(component, 'addSelectedCity');
    const spy2 = spyOn(component, 'onDeletedField');
    component.selectCity(eventMockCity as any);
    expect(spy1).toHaveBeenCalledWith(eventMockCity as any);
    expect(spy2).toHaveBeenCalled();
    expect(component.courier.disabled).toEqual(false);
    expect(component.station.disabled).toEqual(false);
  });

  it('should empty city value selectCity method', () => {
    const spy = spyOn(component, 'addSelectedCity');
    component.selectCity(eventMockCity as any);
    expect(component.city.value).toEqual('');
    expect(spy).toHaveBeenCalledWith(eventMockCity as any);
  });

  it('should add new selected city if it does not exist in list', () => {
    component.selectedCities = [{ id: 2, name: 'ФейкМісто2' }];
    component.currentCities = mockCities;
    component.addSelectedCity(eventMockCity as any);
    expect(component.selectedCities).toEqual([
      { id: 2, name: 'ФейкМісто2' },
      { id: 1, name: 'ФейкМісто1' }
    ]);
  });

  it('should remove selected city if it exists in list', () => {
    component.selectedCities = [
      { id: 2, name: 'ФейкМісто2' },
      { id: 1, name: 'ФейкМісто1' }
    ];
    component.currentCities = mockCities;
    component.addSelectedCity(eventMockCity as any);
    expect(component.selectedCities).toEqual([{ id: 2, name: 'ФейкМісто2' }]);
  });

  it('the method onCitiesSelected should get filtered cards', () => {
    component.tariffCards = [];
    component.onCitiesSelected();
    expect(component.filterTariffCards()).toBeTruthy();
  });

  it('the method onCitiesSelected should disable courier and station fields when there is no filtered tariff card', () => {
    component.tariffCards = [];
    const spy1 = spyOn(component, 'disableCourier');
    const spy2 = spyOn(component, 'disableStation');
    component.onCitiesSelected();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('the method onCitiesSelected should filter dropdown lists when there is filtered tariff card', () => {
    const spy1 = spyOn(component, 'selectAllCouriersInTariffCards');
    const spy2 = spyOn(component, 'selectAllRegionsInTariffCards');
    const spy3 = spyOn(component, 'selectAllStationsInTariffCards');
    const filteredTariffCards = component.filterTariffCards();
    component.onCitiesSelected();
    expect(spy1).toHaveBeenCalledWith(filteredTariffCards);
    expect(spy2).toHaveBeenCalledWith(filteredTariffCards);
    expect(spy3).toHaveBeenCalledWith(filteredTariffCards);
    expect(component.courier.disabled).toEqual(false);
    expect(component.station.disabled).toEqual(false);
  });

  it('should set city placeholder when there is one selected city', () => {
    component.selectedCities = [cityItem];
    component.setCityPlaceholder();
    expect(component.cityPlaceholder).toEqual('1 вибрано');
  });

  it('should set city placeholder when there is no selected city', () => {
    component.selectedCities = [];
    component.setCityPlaceholder();
    expect(component.cityPlaceholder).toEqual('ubs-tariffs.placeholder-choose-city');
  });

  it('checkCity should return true if item is in selectedCities', () => {
    component.selectedCities = [cityItem];
    expect(component.checkCity('Фейк місто')).toEqual(true);
  });

  it('checkCity should return false if item is not in selectedCities', () => {
    component.selectedCities = [cityItem];
    expect(component.checkCity('Фейк2')).toEqual(false);
  });

  it('should delete city from the list, no selected city remained', () => {
    const spy1 = spyOn(component, 'setCityPlaceholder');
    const spy2 = spyOn(component, 'onDeletedField');
    component.selectedCities.push(cityItem);
    component.deleteCity(0);
    expect(component.selectedCities.length).toEqual(0);
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(component.courier.disabled).toEqual(false);
    expect(component.station.disabled).toEqual(false);
  });

  it('should delete city from the list, at least 1 selected city remained', () => {
    const spy1 = spyOn(component, 'setCityPlaceholder');
    const spy2 = spyOn(component, 'onCitiesSelected');
    component.selectedCities = [
      { id: 0, name: 'Фейк місто ' },
      { id: 1, name: 'Фейк місто 1' }
    ];
    component.deleteCity(0);
    expect(component.selectedCities.length).toEqual(1);
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('should call method for filter tariff cards by courier when courier field is filled ', () => {
    component.tariffCards = [];
    component.courier.setValue('фейкКурєр1');
    component.selectedCourier = {
      id: 1,
      name: 'фейкКурєр1'
    };
    const fakeCard = fakeFilteredTariffCards;
    component.selectedStations = [];
    component.selectedRegions = [];
    component.selectedCities = [];
    expect(fakeCard).toEqual(fakeFilteredTariffCards);
  });

  it('should call method for filter tariff cards by stations when station field is filled ', () => {
    component.tariffCards = fakeTariffCards;
    component.selectedCourier = null;
    component.selectedStations = [stationItem];
    component.selectedRegions = [];
    component.selectedCities = [];
    component.filterTariffCards();
    expect(component.filterTariffCards()).toEqual(fakeFilteredTariffCards);
  });

  it('should call method for filter tariff cards by region when region field is filled ', () => {
    component.tariffCards = fakeTariffCards;
    component.selectedCourier = null;
    component.selectedStations = [];
    component.selectedRegions = [locationItem];
    component.selectedCities = [];
    component.filterTariffCards();
    expect(component.filterTariffCards()).toEqual(fakeFilteredTariffCards);
  });

  it('should call method for filter tariff cards by cities when city field is filled ', () => {
    component.tariffCards = fakeTariffCards;
    component.selectedCourier = null;
    component.selectedStations = [];
    component.selectedRegions = [];
    component.selectedCities = [cityItem];
    component.filterTariffCards();
    expect(component.filterTariffCards()).toEqual(fakeFilteredTariffCards);
  });

  it('should filter tariff cards by courier', () => {
    component.selectedCourier = {
      id: 1,
      name: 'фейкКурєр1'
    };
    const result = fakeTariffCards;
    expect(result).toEqual(fakeFilteredTariffCards);
  });

  it('should filter tariff cards by stations', () => {
    component.selectedStations = [stationItem];
    const result = component.filterTariffCardsByStations(fakeTariffCards);
    expect(result).toEqual(fakeFilteredTariffCards);
  });

  it('should filter tariff cards by region', () => {
    component.selectedRegions = [locationItem];
    const result = component.filterTariffCardsByRegion(fakeTariffCards);
    expect(result).toEqual(fakeFilteredTariffCards);
  });

  it('should filter tariff cards by cities', () => {
    component.selectedCities = [cityItem];
    const result = component.filterTariffCardsByCities(fakeTariffCards);
    expect(result).toEqual(fakeFilteredTariffCards);
  });

  it('should select all couriers name in filtered tariff cards', () => {
    component.selectAllCouriersInTariffCards(fakeFilteredTariffCards);
    expect(component.couriersName).toEqual(['fake']);
    expect(component.filteredCouriers).toEqual(['fake']);
  });

  it('should select all stations name in filtered tariff cards', () => {
    component.selectAllStationsInTariffCards(fakeFilteredTariffCards);
    expect(component.stationsName).toEqual(['Фейк1']);
    expect(component.filteredStations).toEqual(['Фейк1']);
  });

  it('should select all regions name in filtered tariff cards', () => {
    component.selectAllRegionsInTariffCards(fakeFilteredTariffCards);
    expect(component.regionsName).toEqual(['Фейк']);
    expect(component.filteredRegions).toEqual(['Фейк']);
  });

  it('should select all cities name in filtered tariff cards', () => {
    component.selectAllCitiesInTariffCards(fakeFilteredTariffCards);
    expect(component.currentCitiesName).toEqual(['Фейк місто']);
    expect(component.filteredCities).toEqual(['Фейк місто']);
  });

  it('should  disable courier field', () => {
    component.disableCourier();
    expect(component.courier.value).toEqual('');
    expect(component.selectedCourier).toEqual(null);
    expect(component.courier.disabled).toEqual(true);
    expect(component.filteredCouriers).toEqual([]);
    expect(component.couriersName).toEqual([]);
  });

  it('should  disable station field', () => {
    const spy = spyOn(component, 'setStationPlaceholder');
    component.disableStation();
    expect(component.station.value).toEqual('');
    expect(component.selectedStations).toEqual([]);
    expect(component.station.disabled).toEqual(true);
    expect(component.filteredStations).toEqual([]);
    expect(component.stationsName).toEqual([]);
    expect(spy).toHaveBeenCalled();
  });

  it('should  disable region field', () => {
    const spy = spyOn(component, 'setRegionsPlaceholder');
    component.disableRegion();
    expect(component.region.value).toEqual('');
    expect(component.selectedRegions).toEqual([]);
    expect(component.region.disabled).toEqual(true);
    expect(component.filteredRegions).toEqual([]);
    expect(component.regionsName).toEqual([]);
    expect(spy).toHaveBeenCalled();
  });

  it('should  disable city field', () => {
    const spy = spyOn(component, 'setCityPlaceholder');
    component.disableCity();
    expect(component.city.value).toEqual('');
    expect(component.selectedCities).toEqual([]);
    expect(component.city.disabled).toEqual(true);
    expect(component.filteredCities).toEqual([]);
    expect(component.currentCitiesName).toEqual([]);
    expect(spy).toHaveBeenCalled();
  });

  it('should return 0 when all fields are empty', () => {
    component.selectedCourier = null;
    component.selectedStations = [];
    component.selectedRegions = [];
    component.selectedCities = [];
    const result = component.checkFields();
    expect(result).toEqual(0);
  });

  it('should return 1 when 1 field is filled', () => {
    component.selectedCourier = null;
    component.selectedStations = [stationItem];
    component.selectedRegions = [];
    component.selectedCities = [];
    const result = component.checkFields();
    expect(result).toEqual(1);
  });

  it('should return 2 when 2 fields are filled', () => {
    component.selectedCourier = null;
    component.selectedStations = [stationItem];
    component.selectedRegions = [locationItem];
    component.selectedCities = [];
    const result = component.checkFields();
    expect(result).toEqual(2);
  });

  it('should set default dropdown list', () => {
    component.couriers = fakeCouriers;
    component.stations = [fakeStation];
    component.locations = [fakeLocation];
    component.setDefaultLists();
    expect(component.filteredCouriers).toEqual(['фейкКурєр1', 'фейкКурєр2']);
    expect(component.couriersName).toEqual(['фейкКурєр1', 'фейкКурєр2']);
    expect(component.filteredStations).toEqual(['Фейк']);
    expect(component.stationsName).toEqual(['Фейк']);
    expect(component.filteredRegions).toEqual(['Фейк область']);
    expect(component.regionsName).toEqual(['Фейк область']);
  });

  it('method filterByOneField should filter only by courier', () => {
    component.couriers = fakeCouriers;
    component.selectedCourier = {
      id: 1,
      name: 'fake'
    };
    component.selectedStations = [];
    component.selectedRegions = [];
    component.selectedCities = [];
    expect(component.filteredCouriers).toEqual(['fakeCourier1', 'fakeCourier2']);
    expect(component.couriersName).toEqual(['fakeCourier1', 'fakeCourier2']);
  });

  it('method filterByOneField should filter only by stations', () => {
    component.stations = [fakeStation];
    component.selectedCourier = null;
    component.selectedStations = [stationItem];
    component.selectedRegions = [];
    component.selectedCities = [];
    const filteredTatiffCards = component.filterTariffCards();
    const spy1 = spyOn(component, 'selectAllCouriersInTariffCards');
    const spy2 = spyOn(component, 'selectAllRegionsInTariffCards');
    const spy3 = spyOn(component, 'selectAllCitiesInTariffCards');
    component.filterByOneField();
    expect(component.filteredStations).toEqual(['Фейк']);
    expect(component.stationsName).toEqual(['Фейк']);
    expect(spy1).toHaveBeenCalledWith(filteredTatiffCards);
    expect(spy2).toHaveBeenCalledWith(filteredTatiffCards);
    expect(spy3).toHaveBeenCalledWith(filteredTatiffCards);
  });

  it('method filterByOneField should filter only by region', () => {
    component.locations = [fakeLocation];
    component.selectedCourier = null;
    component.selectedStations = [];
    component.selectedRegions = [locationItem];
    component.selectedCities = [];
    const filteredTatiffCards = component.filterTariffCards();
    const spy1 = spyOn(component, 'selectAllCouriersInTariffCards');
    const spy2 = spyOn(component, 'selectAllStationsInTariffCards');
    component.filterByOneField();
    expect(component.filteredRegions).toEqual(['Фейк область']);
    expect(component.regionsName).toEqual(['Фейк область']);
    expect(spy1).toHaveBeenCalledWith(filteredTatiffCards);
    expect(spy2).toHaveBeenCalledWith(filteredTatiffCards);
  });

  it('method filterByChosenFields should filter tariff cards by all filled fields', () => {
    const filteredTatiffCards = component.filterTariffCards();
    const spy1 = spyOn(component, 'selectAllCouriersInTariffCards');
    const spy2 = spyOn(component, 'selectAllStationsInTariffCards');
    const spy3 = spyOn(component, 'selectAllRegionsInTariffCards');
    const spy4 = spyOn(component, 'selectAllCitiesInTariffCards');
    component.filterByChosenFields();
    expect(spy1).toHaveBeenCalledWith(filteredTatiffCards);
    expect(spy2).toHaveBeenCalledWith(filteredTatiffCards);
    expect(spy3).toHaveBeenCalledWith(filteredTatiffCards);
    expect(spy4).toHaveBeenCalledWith(filteredTatiffCards);
  });

  it('method onDeletedField should call method for setting default dropdown lists when all fields are empty', () => {
    const spy = spyOn(component, 'setDefaultLists');
    component.selectedCourier = null;
    component.selectedStations = [];
    component.selectedRegions = [];
    component.selectedCities = [];
    component.onDeletedField();
    expect(spy).toHaveBeenCalled();
  });

  it('method onDeletedField should call method for filter items in  dropdown lists when only one field is filled', () => {
    const spy = spyOn(component, 'filterByOneField');
    component.selectedCourier = null;
    component.selectedStations = [stationItem];
    component.selectedRegions = [];
    component.selectedCities = [];
    component.onDeletedField();
    expect(spy).toHaveBeenCalled();
  });

  it('method onDeletedField should call method for filter items in  dropdown lists when only two or more fields are filled', () => {
    const spy = spyOn(component, 'filterByChosenFields');
    component.selectedCourier = null;
    component.selectedStations = [stationItem];
    component.selectedRegions = [locationItem];
    component.selectedCities = [];
    component.onDeletedField();
    expect(spy).toHaveBeenCalled();
  });

  it('should remove duplicates', () => {
    const arr = ['fake', 'fakeCity', 'fake'];
    const result = component.removeDuplicates(arr);
    expect(result).toEqual(['fake', 'fakeCity']);
  });

  it('should filter options', () => {
    const mockStationsName = ['Фейк1', 'Фейк2'];
    const result = component.filterOptions('Фейк1', mockStationsName);
    expect(result).toEqual(['Фейк1']);
  });

  it('method onNoClick should invoke destroyRef.close()', () => {
    component.selectedRegions.push(locationItem);
    component.selectedStations.push(stationItem);
    matDialogMock.open.and.returnValue(fakeMatDialogRef as any);
    component.onNoClick();
    expect(fakeMatDialogRef.close).toHaveBeenCalled();
    expect(matDialogMock.open).toHaveBeenCalledWith(ModalTextComponent, {
      hasBackdrop: true,
      panelClass: 'address-matDialog-styles-w-100',
      data: {
        name: 'cancel',
        title: 'modal-text.cancel',
        text: 'modal-text.cancel-message',
        action: 'modal-text.yes'
      }
    });
  });

  it('method onNoClick should invoke destroyRef.close() if selectedCities or selectedStation is empty', () => {
    component.selectedCourier = null;
    component.selectedStations = [];
    component.selectedRegions = [];
    component.selectedCities = [];
    component.onNoClick();
    expect(fakeMatDialogRef.close).toHaveBeenCalled();
  });

  it('destroy Subject should be closed after ngOnDestroy()', () => {
    const unsubscribe = 'unsubscribe';
    component[unsubscribe] = new Subject<boolean>();
    spyOn(component[unsubscribe], 'complete');
    component.ngOnDestroy();
    expect(component[unsubscribe].complete).toHaveBeenCalledTimes(1);
  });
});
