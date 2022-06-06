import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { UbsAdminTariffsPricingPageComponent } from './ubs-admin-tariffs-pricing-page.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of, Subject } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { UbsAdminTariffsAddServicePopUpComponent } from './ubs-admin-tariffs-add-service-pop-up/ubs-admin-tariffs-add-service-pop-up.component';
import { FilterListByLangPipe } from '../../../../../shared/sort-list-by-lang/filter-list-by-lang.pipe';
import { UbsAdminTariffsAddTariffServicePopUpComponent } from './ubs-admin-tariffs-add-tariff-service-pop-up/ubs-admin-tariffs-add-tariff-service-pop-up.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TariffsService } from 'src/app/ubs/ubs-admin/services/tariffs.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { OrderService } from 'src/app/ubs/ubs/services/order.service';
import { VolumePipe } from 'src/app/shared/volume-pipe/volume.pipe';
import { LocalizedCurrencyPipe } from 'src/app/shared/localized-currency-pipe/localized-currency.pipe';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Bag, Locations } from 'src/app/ubs/ubs-admin/models/tariffs.interface';
import { Store } from '@ngrx/store';
import { UbsAdminTariffsLocationDashboardComponent } from '../ubs-admin-tariffs-location-dashboard.component';

describe('UbsAdminPricingPageComponent', () => {
  let component: UbsAdminTariffsPricingPageComponent;
  let fixture: ComponentFixture<UbsAdminTariffsPricingPageComponent>;
  let httpMock: HttpTestingController;
  let route: ActivatedRoute;
  let location: Location;
  let router: Router;

  const fakeCourerForm = new FormGroup({
    courierLimitsBy: new FormControl('fake'),
    minAmountOfOrder: new FormControl('fake'),
    maxAmountOfOrder: new FormControl('fake'),
    minAmountOfBigBag: new FormControl('fake'),
    maxAmountOfBigBag: new FormControl('fake'),
    limitDescription: new FormControl('fake')
  });
  const fakeLocations: Locations = {
    locationsDto: [{
      latitude: 0,
      longitude: 0,
      locationId: 159,
      locationTranslationDtoList: [{
        languageCode: 'ua',
        locationName: 'fake'
      }]
    }],
    regionId: 1,
    regionTranslationDtos: {
      regionName: 'ua',
      languageCode: 'fake'
    }
  };
  const fakeService = {
    locationId: 159,
    price: 555,
    commission: 333,
    languageCode: 'ua'
  };
  const fakeBag: Bag = {
    capacity: 111,
    price: 478,
    commission: 15
  };
  const fakeCouriers = {
    courierLimit: 'fake',
    minPriceOfOrder: 'fake',
    maxPriceOfOrder: 'fake',
    minAmountOfBigBags: 'fake',
    maxAmountOfBigBags: 'fake',
    limitDescription: 'fake'
  };
  const fakeParams = {
    id: '159'
  };
  const fakeAmount = {
    bagId: 1,
    courierId: 1,
    languageId: 1,
    courierLimitsBy: 'fake',
    limitDescription: 'fake',
    maxAmountOfBigBag: 'fake',
    maxAmountOfOrder: 'fake',
    minAmountOfBigBag: 'fake',
    minAmountOfOrder: 'fake',
    minimalAmountOfBagStatus: 'INCLUDE'
  };
  const dialogStub = {
    afterClosed() {
      return of(true);
    }
  };

  const tariffsServiceMock = jasmine.createSpyObj('tariffsServiceMock', [
    'getLocations',
    'editInfo',
    'getCouriers',
    'getAllServices',
    'getAllTariffsForService'
  ]);
  tariffsServiceMock.editInfo.and.returnValue(of([]));
  tariffsServiceMock.getCouriers.and.returnValue(of([fakeCouriers]));
  tariffsServiceMock.getAllServices.and.returnValue(of([fakeService]));
  tariffsServiceMock.getAllTariffsForService.and.returnValue(of([fakeBag]));

  const matDialogMock = jasmine.createSpyObj('matDialogMock', ['open']);
  matDialogMock.open.and.returnValue(dialogStub);

  const localStorageServiceMock = jasmine.createSpyObj('localStorageServiceMock', ['getCurrentLanguage']);
  localStorageServiceMock.languageBehaviourSubject = of();

  const orderServiceMock = jasmine.createSpyObj('orderServiceMock', ['completedLocation']);

  const storeMock = jasmine.createSpyObj('store', ['select', 'dispatch']);
  storeMock.select = () => of([fakeLocations]);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        UbsAdminTariffsPricingPageComponent,
        UbsAdminTariffsAddServicePopUpComponent,
        UbsAdminTariffsAddTariffServicePopUpComponent,
        FilterListByLangPipe,
        VolumePipe,
        LocalizedCurrencyPipe
      ],
      imports: [
        OverlayModule,
        MatDialogModule,
        MatRadioModule,
        MatProgressBarModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([{ path: 'ubs-admin/tariffs', component: UbsAdminTariffsLocationDashboardComponent }]),
        ReactiveFormsModule,
        FormsModule
      ],
      providers: [
        FormBuilder,
        { provide: MatDialog, useValue: matDialogMock },
        { provide: MatDialogRef, useValue: dialogStub },
        { provide: TariffsService, useValue: tariffsServiceMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: OrderService, useValue: orderServiceMock },
        { provide: Store, useValue: storeMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    orderServiceMock.locationSubject = new Subject<any>();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminTariffsPricingPageComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    route = TestBed.inject(ActivatedRoute);
    location = TestBed.inject(Location);
    router = TestBed.inject(Router);
    route.params = of(fakeParams);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call all methods in ngOnInit', () => {
    const spy = spyOn(component, 'routeParams');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should fillFields correctly', () => {
    component.couriers = [fakeCouriers];
    component.fillFields();
    expect(component.limitsForm.value).toEqual(fakeCourerForm.value);
  });

  it('should call saveChanges', () => {
    component.limitsForm.patchValue(fakeCourerForm.value);
    component.saveChanges();
    expect(tariffsServiceMock.editInfo).toHaveBeenCalled();
    expect(component.amount).toEqual(fakeAmount);
  });

  it('should take id from route', () => {
    expect(component.selectedLocationId).toEqual(159);
    expect(component.currentLocation).toEqual(159);
  });

  it('navigate to tariffs page', () => {
    const spy = spyOn(router, 'navigate');
    component.navigateToBack();
    expect(spy).toHaveBeenCalledWith(['ubs-admin/tariffs']);
  });

  it('should call openAddTariffForServicePopup', () => {
    component.currentLocation = 159;
    const addtariffData = {
      button: 'add',
      locationId: 159
    };
    component.openAddTariffForServicePopup();
    expect(matDialogMock.open).toHaveBeenCalledWith(UbsAdminTariffsAddTariffServicePopUpComponent, {
      data: addtariffData,
      hasBackdrop: true,
      disableClose: false,
      panelClass: 'address-matDialog-styles-pricing-page'
    });
  });

  it('should call openAddServicePopup', () => {
    component.currentLocation = 159;
    const addtariffData = {
      button: 'add',
      locationId: 159
    };
    component.openAddServicePopup();
    expect(matDialogMock.open).toHaveBeenCalledWith(UbsAdminTariffsAddServicePopUpComponent, {
      hasBackdrop: true,
      disableClose: false,
      panelClass: 'address-matDialog-styles-pricing-page',
      data: addtariffData
    });
  });

  it('should call openUpdateTariffForServicePopup', () => {
    const tariffData = {
      button: 'update',
      bagData: fakeBag
    };
    component.openUpdateTariffForServicePopup(fakeBag);
    expect(matDialogMock.open).toHaveBeenCalledWith(UbsAdminTariffsAddTariffServicePopUpComponent, {
      hasBackdrop: true,
      disableClose: false,
      panelClass: 'address-matDialog-styles-pricing-page',
      data: tariffData
    });
  });

  it('should call openUpdateServicePopup', () => {
    const tariffData = {
      button: 'update',
      serviceData: fakeService
    };
    component.openUpdateServicePopup(fakeService);
    expect(matDialogMock.open).toHaveBeenCalledWith(UbsAdminTariffsAddServicePopUpComponent, {
      hasBackdrop: true,
      disableClose: false,
      panelClass: 'address-matDialog-styles-pricing-page',
      data: tariffData
    });
  });

  it('should get all tariffs for service', () => {
    const spy = spyOn<any>(component, 'filterBags');
    component.bags = [];
    component.getAllTariffsForService();
    expect(component.isLoadBar).toEqual(false);
    expect(component.bags).toEqual([fakeBag]);
    expect(spy).toHaveBeenCalled();
  });

  it('should get all services', () => {
    const spy = spyOn<any>(component, 'filterServices');
    component.getServices();
    expect(component.isLoadBar1).toEqual(false);
    expect(component.services).toEqual([fakeService]);
    expect(spy).toHaveBeenCalled();
  });

  it('should get couriers', () => {
    const spy = spyOn(component, 'fillFields');
    component.getCouriers();
    expect(spy).toHaveBeenCalled();
    expect(component.couriers).toEqual([fakeCouriers]);
  });

  it('destroy Subject should be closed after ngOnDestroy()', () => {
    const destroy = 'destroy';
    component[destroy] = new Subject<boolean>();
    spyOn(component[destroy], 'unsubscribe');
    component.ngOnDestroy();
    expect(component[destroy].unsubscribe).toHaveBeenCalledTimes(1);
  });
});
