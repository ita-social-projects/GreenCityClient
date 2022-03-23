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
import { of } from 'rxjs';
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

describe('UbsAdminTariffsLocationDashboardComponent', () => {
  let component: UbsAdminTariffsLocationDashboardComponent;
  let fixture: ComponentFixture<UbsAdminTariffsLocationDashboardComponent>;
  let httpMock: HttpTestingController;
  let router: Router;
  let store: MockStore;

  const fakeCouriers = {
    courierLimit: 'fake',
    minPriceOfOrder: 'fake',
    maxPriceOfOrder: 'fake',
    minAmountOfBigBags: 'fake',
    maxAmountOfBigBags: 'fake',
    limitDescription: 'fake'
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

  const tariffsServiceMock = jasmine.createSpyObj('tariffsServiceMock', ['getCouriers']);
  tariffsServiceMock.getCouriers.and.returnValue(of([fakeCouriers]));

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
    // @ts-ignore
    expect(component).toBeTruthy();
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
});
