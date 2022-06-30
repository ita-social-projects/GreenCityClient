import { async, ComponentFixture, TestBed } from '@angular/core/testing';
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
import { SearchPipe } from 'src/app/shared/search-tariff/search-tariff.pipe';
import { OptionPipe } from 'src/app/shared/option-tariff/option-tariff.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MockStore } from '@ngrx/store/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UbsAdminTariffsCourierPopUpComponent } from './ubs-admin-tariffs-courier-pop-up/ubs-admin-tariffs-courier-pop-up.component';
import { UbsAdminTariffsStationPopUpComponent } from './ubs-admin-tariffs-station-pop-up/ubs-admin-tariffs-station-pop-up.component';
import { UbsAdminTariffsLocationPopUpComponent } from './ubs-admin-tariffs-location-pop-up/ubs-admin-tariffs-location-pop-up.component';
import { TariffStatusPipe } from '@pipe/tariff-status-pipe/tariff-status.pipe';

describe('UbsAdminTariffsLocationDashboardComponent', () => {
  let component: UbsAdminTariffsLocationDashboardComponent;
  let fixture: ComponentFixture<UbsAdminTariffsLocationDashboardComponent>;
  let httpMock: HttpTestingController;
  let router: Router;
  let store: MockStore;

  const mockRegion = [
    {
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
      regionId: 0,
      locationsDto: [
        {
          latitude: 0,
          locationId: 0,
          longitude: 0,
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
          latitude: 1,
          locationId: 1,
          longitude: 1,
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

  const mockFilteredLocation = [
    {
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
        }
      ]
    }
  ];

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
    name: 'fake'
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
        longitude: 0,
        locationId: 159,
        locationTranslationDtoList: [
          {
            languageCode: 'ua',
            locationName: 'fake'
          }
        ]
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

  const tariffsServiceMock = jasmine.createSpyObj('tariffsServiceMock', ['getCouriers', 'getAllStations', 'getCardInfo']);
  tariffsServiceMock.getCouriers.and.returnValue(of([fakeCouriers]));
  tariffsServiceMock.getAllStations.and.returnValue(of([fakeStation]));
  tariffsServiceMock.getCardInfo.and.returnValue(of());

  const matDialogMock = jasmine.createSpyObj('matDialogMock', ['open']);
  matDialogMock.open.and.returnValue(dialogStub);

  const storeMock = jasmine.createSpyObj('Store', ['select', 'dispatch']);
  storeMock.select.and.returnValue(of({ locations: { locations: [fakeLocations] } }));

  const localStorageServiceMock = jasmine.createSpyObj('localStorageServiceMock', ['getCurrentLanguage']);
  localStorageServiceMock.getCurrentLanguage.and.returnValue(of('ua'));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminTariffsLocationDashboardComponent, FilterListByLangPipe, SearchPipe, OptionPipe, TariffStatusPipe],
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
        { provide: Store, useValue: storeMock }
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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add new city item', () => {
    const eventMock = {
      value: ''
    };
    component.checkedCities = [];
    component.addItem(eventMock as any);
    expect(component.checkedCities.length).toEqual(0);
    expect(component.city.value).toEqual('');
  });

  it('should add new city item', () => {
    const eventMock = {
      value: 'First'
    };
    component.checkedCities = [];
    component.addItem(eventMock as any);
    expect(component.checkedCities.length).toEqual(1);
    expect(component.city.value).toEqual('');
  });

  it('should call method for selecting one city', () => {
    const eventMock = {
      option: {
        value: 'First'
      }
    };
    const spy = spyOn(component, 'selectCity');
    const spy1 = spyOn(component, 'positionsFilter');
    component.selected(eventMock as any);
    expect(spy).toHaveBeenCalledWith(eventMock);
    expect(spy1).toHaveBeenCalled();
    expect(component.city.value).toEqual('');
  });

  it('should call method for selecting all cities', () => {
    const eventMock = {
      option: {
        value: 'all'
      }
    };
    const spy = spyOn(component, 'toggleSelectAll');
    const spy1 = spyOn(component, 'positionsFilter');
    component.selected(eventMock as any);
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
    expect(component.city.value).toEqual('');
  });

  it('should remove selected city if it exists in list', () => {
    const eventMock = {
      option: {
        viewValue: 'First'
      }
    };
    component.checkedCities = ['First', 'Second'];
    component.selectCity(eventMock as any);
    expect(component.checkedCities).toEqual(['Second']);
  });

  it('should add new selected city if it doesnot exist in list', () => {
    const eventMock = {
      option: {
        viewValue: 'First'
      }
    };
    component.checkedCities = ['Second'];
    component.selectCity(eventMock as any);
    expect(component.checkedCities).toEqual(['Second', 'First']);
  });

  it('should check if all is not choosen', () => {
    component.checkedCities = ['First'];
    component.cities = ['First', 'Second'];
    const result = component.isChecked();
    expect(result).toEqual(false);
  });

  it('should check if all is choosen', () => {
    component.checkedCities = ['First', 'Second'];
    component.cities = ['First', 'Second'];
    const result = component.isChecked();
    expect(result).toEqual(true);
  });

  it('should add cards to cards array', () => {
    const mockCard = {
      courier: 'fake',
      station: 'fake',
      region: 'fake',
      city: ['fake'],
      tariff: 'fake',
      regionId: 0
    };
    component.cards = [];
    component.getExistingCard();
    expect(component.cards).toEqual([mockCard]);
  });

  it('should check if the list is not empty', () => {
    component.filteredLocations = mockRegion;
    const result = component.isEmpty();
    expect(result).toEqual(false);
  });

  it('should check if the list is empty', () => {
    component.filteredLocations = [];
    const result = component.isEmpty();
    expect(result).toEqual(true);
  });

  it('should not filter locations', () => {
    component.locations = mockRegion;
    component.checkedCities = [];
    component.positionsFilter();
    expect(component.filteredLocations).toEqual(mockRegion);
  });

  it('should filter locations', () => {
    const spy = spyOn(component, 'onPositionSelected').and.returnValue(mockFilteredLocation);
    component.checkedCities = ['Фейк1'];
    component.positionsFilter();
    expect(component.filteredLocations).toEqual(mockFilteredLocation);
    expect(spy).toHaveBeenCalled();
  });

  it('should return new list of locations', () => {
    component.locations = mockRegion;
    component.checkedCities = ['Фейк1'];
    const result = component.onPositionSelected();
    expect(result).toEqual(mockRegion);
  });

  it('should select all items of cities', () => {
    const spy = spyOn(component, 'isChecked').and.returnValue(false);
    component.cities = ['First', 'Second'];
    component.toggleSelectAll();
    expect(spy).toHaveBeenCalled();
    expect(component.checkedCities.length).toEqual(2);
    expect(component.checkedCities).toEqual(['First', 'Second']);
  });

  it('should not select all items of cities', () => {
    const spy = spyOn(component, 'isChecked').and.returnValue(true);
    component.toggleSelectAll();
    expect(spy).toHaveBeenCalled();
    expect(component.checkedCities.length).toBe(0);
  });

  it('should get locations', () => {
    component.filteredRegions = [];
    component.getLocations();
    expect(storeMock.dispatch).toHaveBeenCalled();
  });

  it('should call methods on changes of region', () => {
    const spy = spyOn(component, 'checkRegionValue');
    const spy1 = spyOn(component, 'positionsFilter');
    component.region.setValue('Fake region');
    expect(spy).toHaveBeenCalledWith('Fake region');
    expect(spy1).toHaveBeenCalled();
    expect(component.checkedCities).toEqual([]);
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
    const spy5 = spyOn(component, 'getExistingCard');
    component.ngOnInit();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalled();
    expect(spy5).toHaveBeenCalled();
  });

  it('should get all couriers', () => {
    component.getCouriers();
    expect(component.couriersName).toEqual(['fakeCourier']);
  });

  it('should get all stations', () => {
    component.getReceivingStation();
    expect(component.stationName).toEqual(['fake']);
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

  it('should call openDeactivateLocation', () => {
    component.openDeactivateLocation();
    expect(matDialogMock.open).toHaveBeenCalledWith(UbsAdminTariffsLocationPopUpComponent, {
      hasBackdrop: true,
      panelClass: 'address-matDialog-styles-w-100',
      data: {
        headerText: 'deactivateTemplate'
      }
    });
  });

  it('destroy Subject should be closed after ngOnDestroy()', () => {
    const destroy = 'destroy';
    component[destroy] = new Subject<boolean>();
    spyOn(component[destroy], 'unsubscribe');
    component.ngOnDestroy();
    expect(component[destroy].unsubscribe).toHaveBeenCalledTimes(1);
  });
});
