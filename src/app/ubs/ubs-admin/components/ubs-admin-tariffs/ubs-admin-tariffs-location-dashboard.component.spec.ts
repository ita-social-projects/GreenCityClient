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
import { Store, StoreModule } from '@ngrx/store';
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
import { provideMockStore, MockStore, getMockStore } from '@ngrx/store/testing';
import { map } from 'rxjs/operator/map';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UbsAdminTariffsCourierPopUpComponent } from './ubs-admin-tariffs-courier-pop-up/ubs-admin-tariffs-courier-pop-up.component';
import { UbsAdminTariffsStationPopUpComponent } from './ubs-admin-tariffs-station-pop-up/ubs-admin-tariffs-station-pop-up.component';
import { UbsAdminTariffsLocationPopUpComponent } from './ubs-admin-tariffs-location-pop-up/ubs-admin-tariffs-location-pop-up.component';

describe('UbsAdminTariffsLocationDashboardComponent', () => {
  let component: UbsAdminTariffsLocationDashboardComponent;
  let fixture: ComponentFixture<UbsAdminTariffsLocationDashboardComponent>;
  let httpMock: HttpTestingController;
  let router: Router;
  let store: MockStore;

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
    locationsDto: {
      latitude: 0,
      locationId: 159,
      locationTranslationDtoList: {
        languageCode: 'ua',
        locationName: 'fake'
      }
    },
    regionId: 1,
    regionTranslationDtos: {
      regionName: 'ua',
      languageCode: 'fake'
    }
  };

  const initialState = { locations: [fakeLocations] };
  const fakeRegions = ['First region', 'Second region'];
  const fakeCities = ['First city', 'Second city'];

  const tariffsServiceMock = jasmine.createSpyObj('tariffsServiceMock', ['getCouriers', 'getAllStations']);
  tariffsServiceMock.getCouriers.and.returnValue(of([fakeCouriers]));
  tariffsServiceMock.getAllStations.and.returnValue(of([fakeStation]));

  const matDialogMock = jasmine.createSpyObj('matDialogMock', ['open']);
  matDialogMock.open.and.returnValue(dialogStub);

  const storeMock = jasmine.createSpyObj('Store', ['select', 'dispatch']);
  storeMock.select.and.returnValue(of({ locations: { locations: [fakeLocations] } }));

  const localStorageServiceMock = jasmine.createSpyObj('localStorageServiceMock', ['getCurrentLanguage']);
  localStorageServiceMock.getCurrentLanguage.and.returnValue(of('ua'));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminTariffsLocationDashboardComponent, FilterListByLangPipe, SearchPipe, OptionPipe],
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

  it('should call methods in OnInit', () => {
    const spy1 = spyOn(component, 'getLocations');
    const spy2 = spyOn(component, 'getCouriers');
    const spy3 = spyOn(component, 'getReceivingStation');
    const spy4 = spyOn(component, 'loadScript');
    component.ngOnInit();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalled();
  });

  // it('should filter correctly', async () => {
  //   component.regions = fakeRegions;
  //   component.cities = fakeCities;
  //   component.region.setValue('First');
  //   component.city.setValue('First');
  //   component.initFilter();
  //   expect(await component.filteredRegions).toEqual(['First region']);
  //   expect(await component.filteredCities).toEqual(['First city'])
  // });

  // it('should filter correctly and return empty array if option not match', () => {
  //   component.regions = fakeRegions;
  //   component.cities = fakeCities;
  //   component.region.setValue('Fake');
  //   component.city.setValue('Fake');
  //   component.initFilter();
  //   expect(component.filteredRegions).toEqual([]);
  //   expect(component.filteredCities).toEqual([]);
  // });

  it('should get all couriers', () => {
    component.getCouriers();
    expect(component.couriers).toEqual([['fakeCourier']]);
  });

  it('should get all stations', () => {
    component.getReceivingStation();
    expect(component.stations).toEqual([fakeStation]);
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
        headerText: 'addTemplate'
      }
    });
  });

  it('should call openEditLocation', () => {
    component.openEditLocation();
    expect(matDialogMock.open).toHaveBeenCalledWith(UbsAdminTariffsLocationPopUpComponent, {
      hasBackdrop: true,
      panelClass: 'address-matDialog-styles-w-100',
      data: {
        headerText: 'editTemplate'
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
