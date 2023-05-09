import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Store } from '@ngrx/store';
import { UbsAdminTariffsCardPopUpComponent } from './ubs-admin-tariffs-card-pop-up.component';
import { TariffsService } from '../../../services/tariffs.service';
import { ModalTextComponent } from '../../shared/components/modal-text/modal-text.component';
import { Language } from 'src/app/main/i18n/Language';
import { HttpClientTestingModule } from '@angular/common/http/testing';

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
    nameUk: 'фейкКурєр',
    nameEn: 'fakeCourier',
    createDate: 'fake date',
    createdBy: 'fakeUser'
  };

  const fakeStation = {
    createDate: 'fake date',
    createdBy: 'fakeUser',
    stationStatus: 'ACTIVE',
    id: 1,
    name: 'fake'
  };

  const mockRegion = [
    {
      locationsDto: [
        {
          latitude: 12,
          locationId: 1,
          locationStatus: 'фейк',
          locationTranslationDtoList: [
            { languageCode: 'ua', locationName: 'Фейк1' },
            { languageCode: 'en', locationName: 'Fake1' }
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

  const mockCities = [
    {
      latitude: 12,
      locationId: 1,
      locationStatus: 'фейк',
      locationTranslationDtoList: [
        { languageCode: 'ua', locationName: 'Фейк1' },
        { languageCode: 'en', locationName: 'Fake1' }
      ],
      longitude: 13
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

  const modalData = {
    courierNameUk: 'Courier name',
    courierEnglishName: 'Courier English name',
    regionEnglishName: 'Region English name',
    station: 'Station name',
    regionNameUk: 'Region name'
  };

  const fakeCardForm = new FormGroup({
    courierName: new FormControl(modalData.courierNameUk),
    courierNameEng: new FormControl(modalData.courierEnglishName),
    regionNameUk: new FormControl(modalData.regionNameUk),
    station: new FormControl(modalData.station),
    regionNameEng: new FormControl(modalData.regionEnglishName)
  });

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

  const selectedCities = [{ locationId: 1 }, { locationId: 2 }, { locationId: 3 }];

  const matDialogMock = jasmine.createSpyObj('matDialog', ['open']);
  matDialogMock.open.and.returnValue({ afterClosed: () => of(true) });
  const fakeMatDialogRef = jasmine.createSpyObj(['close', 'afterClosed']);
  fakeMatDialogRef.afterClosed.and.returnValue(of(true));

  const tariffsServiceMock = jasmine.createSpyObj('tariffsServiceMock', [
    'getCouriers',
    'getAllStations',
    'checkIfCardExist',
    'createCard',
    'getCardInfo'
  ]);
  tariffsServiceMock.getCouriers.and.returnValue(of([fakeCouriers]));
  tariffsServiceMock.getAllStations.and.returnValue(of([fakeStation]));
  tariffsServiceMock.checkIfCardExist.and.returnValue(of());
  tariffsServiceMock.createCard.and.returnValue(of());
  tariffsServiceMock.getCardInfo.and.returnValue(of());

  const storeMock = jasmine.createSpyObj('store', ['select', 'dispatch']);
  storeMock.select.and.returnValue(of());

  const localStorageServiceMock = jasmine.createSpyObj('localeStorageService', ['getCurrentLanguage', 'getUserId']);
  localStorageServiceMock.firstNameBehaviourSubject = new BehaviorSubject('user');
  localStorageServiceMock.languageBehaviourSubject = new BehaviorSubject('ua');
  localStorageServiceMock.getCurrentLanguage = () => 'ua' as Language;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminTariffsCardPopUpComponent],
      imports: [MatDialogModule, TranslateModule.forRoot(), ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialog, useValue: matDialogMock },
        { provide: MatDialogRef, useValue: fakeMatDialogRef },
        { provide: LocalStorageService, useValue: localStorageServiceMock },
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
    const spy4 = spyOn(component, 'setStationPlaceholder');
    const spy5 = spyOn(component, 'setCountOfSelectedCity');
    component.ngOnInit();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalled();
    expect(spy5).toHaveBeenCalled();
  });

  it('should fill form fields with modal data', () => {
    component.modalData = modalData;
    component.fillFields(modalData);
    expect(component.CardForm.value).toEqual(fakeCardForm.value);
  });

  it('should return false when no cards have all selected locations', (done) => {
    component.selectedCities = selectedCities;
    const result = component.checkIfLocationUsed();

    expect(result).toBeFalsy();

    done();
  });

  it('should return false when there are no selected cities', (done) => {
    component.selectedCities = [];
    const result = component.checkIfLocationUsed();

    expect(result).toBeFalsy();

    done();
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
    expect(component.courierEnglishName).toEqual('fakeCourier');
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
  it('should get cities from selected region and clear selected cities list', () => {
    const spy = spyOn(component, 'setCountOfSelectedCity');
    component.locations = mockRegion;
    const mockEvent = {
      value: 'Фейк область'
    };
    component.onRegionSelected(mockEvent);
    component.filteredCities = mockCities;
    expect(component.filteredCities).toEqual(mockCities);
    expect(component.selectedCities).toEqual([]);
    expect(spy).toHaveBeenCalled();
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

  it('should call method for selecting one city', () => {
    const spy1 = spyOn(component, 'selectCity');
    const spy2 = spyOn(component, 'setCountOfSelectedCity');
    const spy3 = spyOn(component, 'cityValidator');
    component.selected(eventMockCity as any);
    expect(spy1).toHaveBeenCalledWith(eventMockCity);
    expect(spy2).toHaveBeenCalledWith();
    expect(spy3).toHaveBeenCalledWith();
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
    expect(component.stationPlaceholder).toEqual('1 обрано');
  });

  it('should set station placeholder', () => {
    component.selectedStation = [];
    component.setStationPlaceholder();
    expect(component.stationPlaceholder).toEqual('ubs-tariffs.placeholder-choose-station');
  });

  it('should set city placeholder', () => {
    component.selectedCities = [locationItem];
    component.setCountOfSelectedCity();
    expect(component.cityPlaceholder).toEqual('1 обрано');
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

  it('should call functions on create card method', () => {
    const spy = spyOn(component, 'createCardDto');
    component.createCard();
    expect(spy).toHaveBeenCalled();
    expect(tariffsServiceMock.checkIfCardExist).toHaveBeenCalled();
  });

  it('should check if card exist on create card method', fakeAsync(() => {
    tariffsServiceMock.checkIfCardExist.and.returnValue(of(true));
    component.createCard();
    tick();
    expect(component.isCardExist).toEqual(true);
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

  it('should filter options', () => {
    const mockStationsName = ['Фейк1', 'Фейк2'];
    const result = component._filterOptions('Фейк1', mockStationsName);
    expect(result).toEqual(['Фейк1']);
  });

  it('should call createCard', () => {
    const fakeNewCard = {
      courierId: 0,
      receivingStationsIdList: [0],
      regionId: 0,
      locationIdList: [0]
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
