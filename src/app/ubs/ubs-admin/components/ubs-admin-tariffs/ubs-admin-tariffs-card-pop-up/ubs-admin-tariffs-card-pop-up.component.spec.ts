import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { of, Subject } from 'rxjs';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Store } from '@ngrx/store';

import { UbsAdminTariffsCardPopUpComponent } from './ubs-admin-tariffs-card-pop-up.component';
import { TariffsService } from '../../../services/tariffs.service';
import { ModalTextComponent } from '../../shared/components/modal-text/modal-text.component';
import { Locations } from '../../../models/tariffs.interface';

describe('UbsAdminTariffsCardPopUpComponent', () => {
  let component: UbsAdminTariffsCardPopUpComponent;
  let fixture: ComponentFixture<UbsAdminTariffsCardPopUpComponent>;

  const locationItem = {
    location: 'Фейк',
    englishLocation: 'Fake',
    locationId: 0
  };

  const stationItem = {
    name: 'Фейк',
    id: 0
  };

  const fakeCouriers = {
    courierId: 1,
    courierStatus: 'fake',
    courierTranslationDtos: [
      {
        languageCode: 'ua',
        name: 'фейкКурєр'
      },
      {
        languageCode: 'en',
        name: 'fakeCourier'
      }
    ]
  };

  const fakeStation = {
    id: 1,
    name: 'fake'
  };

  const mockRegion = [
    {
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
      ],
      locationsDto: [
        {
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
      ]
    }
  ];

  const mockCities = [
    {
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

  const fakeTariffCard = {
    cardId: 0,
    courierId: 0,
    courierLimit: 'fake',
    courierTranslationDtos: [
      {
        languageCode: 'en',
        name: 'fake'
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
      value: 'fake'
    }
  };

  const matDialogMock = jasmine.createSpyObj('matDialog', ['open']);
  matDialogMock.open.and.returnValue({ afterClosed: () => of(true) });
  const fakeMatDialogRef = jasmine.createSpyObj(['close', 'afterClosed']);
  const afterClosedFake = fakeMatDialogRef.afterClosed.and.returnValue(of(true));

  const tariffsServiceMock = jasmine.createSpyObj('tariffsServiceMock', ['getCouriers', 'getAllStations', 'getCardInfo', 'createCard']);
  tariffsServiceMock.getCouriers.and.returnValue(of([fakeCouriers]));
  tariffsServiceMock.getAllStations.and.returnValue(of([fakeStation]));
  tariffsServiceMock.getCardInfo.and.returnValue(of([fakeTariffCard]));
  tariffsServiceMock.createCard.and.returnValue(of());

  const storeMock = jasmine.createSpyObj('store', ['select', 'dispatch']);
  storeMock.select.and.returnValue(of());

  const localStorageServiceStub = () => ({
    firstNameBehaviourSubject: { pipe: () => of('fakeName') }
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminTariffsCardPopUpComponent],
      imports: [MatDialogModule, TranslateModule.forRoot(), ReactiveFormsModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialog, useValue: matDialogMock },
        { provide: MatDialogRef, useValue: fakeMatDialogRef },
        { provide: LocalStorageService, useFactory: localStorageServiceStub },
        { provide: TariffsService, useValue: tariffsServiceMock },
        { provide: Store, useValue: storeMock },
        FormBuilder
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminTariffsCardPopUpComponent);
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
    const spy4 = spyOn(component, 'getExistingCard');
    const spy5 = spyOn(component, 'setStationPlaceholder');
    const spy6 = spyOn(component, 'setCountOfSelectedCity');
    component.ngOnInit();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalled();
    expect(spy5).toHaveBeenCalled();
    expect(spy6).toHaveBeenCalled();
  });

  it('should get all couriers', () => {
    component.getCouriers();
    expect(component.couriers).toEqual([fakeCouriers]);
    expect(component.couriersName).toEqual(['фейкКурєр']);
  });

  it('should set english courier name', () => {
    const mockEvent = {
      value: 'фейкКурєр'
    };
    component.onSelectCourier(mockEvent);
    expect(component.courierEnglishName).toEqual(['fakeCourier']);
  });

  it('should get all stations', () => {
    component.getReceivingStation();
    expect(component.stations).toEqual([fakeStation]);
  });

  it('should get locations', () => {
    component.getLocations();
    expect(storeMock.dispatch).toHaveBeenCalled();
  });

  it('should set english region name', () => {
    component.locations = mockRegion;
    const mockEvent = {
      value: 'Фейк область'
    };
    component.onRegionSelected(mockEvent);
    expect(component.regionEnglishName).toEqual(['Fake region']);
    expect(component.regionId).toEqual(1);
  });

  it('should get cities from selected region', () => {
    component.locations = mockRegion;
    const mockEvent = {
      value: 'Фейк область'
    };
    component.onRegionSelected(mockEvent);
    expect(component.filteredCities).toEqual(mockCities);
  });

  it('city should be disabled if region is not selected', () => {
    component.ngOnInit();
    expect(component.city.disabled).toEqual(true);
  });

  it('should enable city input if region selected', () => {
    component.locations = mockRegion;
    const mockEvent = {
      value: 'Фейк область'
    };
    component.onRegionSelected(mockEvent);
    expect(component.city.disabled).toEqual(false);
  });

  it('should get tariff cards', () => {
    const fakeExistingCard = {
      courierId: 0,
      receivingStationsIdList: [0],
      regionId: 0,
      locationIdList: [0]
    };
    component.existingCardObj = [];
    component.getExistingCard();
    expect(component.existingCardObj).toEqual([fakeExistingCard]);
  });

  it('should call method for selecting one city', () => {
    const spy1 = spyOn(component, 'selectCity');
    const spy2 = spyOn(component, 'setCountOfSelectedCity');
    const spy3 = spyOn(component, 'cityValidator');
    component.selected(eventMockCity as any);
    expect(spy1).toHaveBeenCalledWith(eventMockCity);
    expect(spy2).toHaveBeenCalledWith();
    expect(spy3).toHaveBeenCalledWith();
    expect(component.city.value).toEqual('');
    expect(component.blurOnOption).toEqual(false);
  });

  it('should remove selected city if it exists in list', () => {
    const eventMock = {
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
        },
        viewValue: 'перше'
      }
    };
    component.selectedCities = [
      { location: 'перше', englishLocation: 'first', locationId: 1 },
      { location: 'друге', englishLocation: 'second', locationId: 2 }
    ];
    component.selectCity(eventMock as any);
    expect(component.selectedCities).toEqual([{ location: 'друге', englishLocation: 'second', locationId: 2 }]);
  });

  it('should add new selected city if it does not exist in list', () => {
    component.selectedCities = [{ location: 'друге', englishLocation: 'second', locationId: 2 }];
    component.selectCity(eventMockCity as any);
    expect(component.selectedCities).toEqual([
      { location: 'друге', englishLocation: 'second', locationId: 2 },
      { location: 'перше', englishLocation: 'first', locationId: 1 }
    ]);
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

  it('should empty station value onSelectStation method', () => {
    component.onSelectStation(eventMockStation as any);
    expect(component.station.value).toEqual('');
    expect(component.blurOnOption).toEqual(false);
  });

  it('should set station placeholder', () => {
    component.selectedStation = [stationItem];
    component.setStationPlaceholder();
    expect(component.stationPlaceholder).toEqual('1 вибрано');
  });

  it('should set station placeholder', () => {
    component.selectedStation = [];
    component.setStationPlaceholder();
    expect(component.stationPlaceholder).toEqual('ubs-tariffs.placeholder-choose-station');
  });

  it('should set city placeholder', () => {
    component.selectedCities = [locationItem];
    component.setCountOfSelectedCity();
    expect(component.cityPlaceholder).toEqual('1 вибрано');
  });

  it('should set city placeholder', () => {
    component.selectedCities = [];
    component.setCountOfSelectedCity();
    expect(component.cityPlaceholder).toEqual('ubs-tariffs.placeholder-choose-city');
  });

  it('checkCity should return true if item is in selectedCities', () => {
    component.selectedCities = [locationItem];
    expect(component.checkCity('Фейк')).toEqual(true);
  });

  it('checkCity should return false if item is not in selectedCities', () => {
    component.selectedCities = [locationItem];
    expect(component.checkCity('Фейк1')).toEqual(false);
  });

  it('checkStation should return true if item is in selectedStation', () => {
    component.selectedStation = [stationItem];
    expect(component.checkStation('Фейк')).toEqual(true);
  });

  it('checkStation should return false if item is not in selectedStation', () => {
    component.selectedStation = [stationItem];
    expect(component.checkStation('Фейк1')).toEqual(false);
  });

  it('should delete city from the list', () => {
    const spy = spyOn(component, 'setCountOfSelectedCity');
    component.selectedCities.push(locationItem);
    component.deleteCity(0);
    expect(component.selectedCities.length).toEqual(0);
    expect(spy).toHaveBeenCalled();
    expect(component.city.errors).toEqual({ emptySelectedCity: true });
  });

  it('should delete station from the list', () => {
    const spy = spyOn(component, 'setStationPlaceholder');
    component.selectedStation.push(stationItem);
    component.deleteStation(0);
    expect(component.selectedStation.length).toEqual(0);
    expect(spy).toHaveBeenCalled();
    expect(component.station.errors).toEqual({ emptySelectedStation: true });
  });

  it('should add validation error to city', () => {
    component.selectedCities = [];
    component.cityValidator();
    expect(component.city.errors).toEqual({ emptySelectedCity: true });
  });

  it('should add validation error to station', () => {
    component.selectedStation = [];
    component.stationValidator();
    expect(component.station.errors).toEqual({ emptySelectedStation: true });
  });

  it('should return true if objects are equal', () => {
    expect(component.isObjectsEqual(locationItem, locationItem)).toEqual(true);
  });

  it('should return false if objects are not equal', () => {
    expect(component.isObjectsEqual(locationItem, stationItem)).toEqual(false);
  });

  it('should call functions on create card method', () => {
    const spy1 = spyOn(component, 'createCardDto');
    const spy2 = spyOn(component, 'isObjectsEqual');
    component.createCard();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('should check objects are equal on create card method', () => {
    const spy = spyOn(component, 'isObjectsEqual');
    spy.and.returnValue(true);
    component.createCard();
    expect(component.objectsAreEqual).toEqual(true);
  });

  it('should check objects are not equal on create card method', () => {
    const spy = spyOn(component, 'isObjectsEqual');
    spy.and.returnValue(false);
    component.createCard();
    expect(component.objectsAreEqual).toEqual(false);
    expect(fakeMatDialogRef.close).toHaveBeenCalled();
    expect(matDialogMock.open).toHaveBeenCalled();
  });

  it('should call createCardRequest after matDialogRef closed', () => {
    const spy = spyOn(component, 'createCardRequest');
    component.createCard();
    expect(spy).toHaveBeenCalled();
  });

  it('should filter options', () => {
    const mockStationsName = ['Фейк1', 'Фейк2'];
    const result = component._filterOptions('Фейк1', mockStationsName);
    expect(result).toEqual(['Фейк1']);
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

  it('method onNoClick should invoke destroyRef.close()', () => {
    component.selectedCities.push(locationItem);
    component.selectedStation.push(stationItem);
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
    component.selectedCities = [];
    component.selectedStation = [];
    component.onNoClick();
    expect(fakeMatDialogRef.close).toHaveBeenCalled();
  });

  it('should  change blurOnOption', () => {
    const eventMock = {
      relatedTarget: {
        localName: 'mat-option'
      }
    };
    component.onBlur(eventMock);
    expect(component.blurOnOption).toEqual(true);
  });

  it('should not change blurOnOption', () => {
    const eventMock = {
      relatedTarget: {
        localName: ''
      }
    };
    component.onBlur(eventMock);
    expect(component.blurOnOption).toEqual(false);
  });

  it('destroy Subject should be closed after ngOnDestroy()', () => {
    const unsubscribe = 'unsubscribe';
    component[unsubscribe] = new Subject<boolean>();
    spyOn(component[unsubscribe], 'complete');
    component.ngOnDestroy();
    expect(component[unsubscribe].complete).toHaveBeenCalledTimes(1);
  });
});
