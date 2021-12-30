import { async, ComponentFixture, TestBed } from '@angular/core/testing';
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
import { FilterListByLangPipe } from '../../../../shared/sort-list-by-lang/filter-list-by-lang.pipe';
import { UbsAdminTariffsAddTariffServicePopUpComponent } from './ubs-admin-tariffs-add-tariff-service-pop-up/ubs-admin-tariffs-add-tariff-service-pop-up.component';
import { ActivatedRoute } from '@angular/router';
import { TariffsService } from 'src/app/ubs-admin/services/tariffs.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { OrderService } from 'src/app/main/component/ubs/services/order.service';
import { VolumePipe } from 'src/app/shared/volume-pipe/volume.pipe';
import { LocalizedCurrencyPipe } from 'src/app/shared/localized-currency-pipe/localized-currency.pipe';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Locations } from 'src/app/main/component/ubs/models/ubs.interface';

describe('UbsAdminPricingPageComponent', () => {
  let component: UbsAdminTariffsPricingPageComponent;
  let fixture: ComponentFixture<UbsAdminTariffsPricingPageComponent>;
  let httpMock: HttpTestingController;
  let route: ActivatedRoute;

  const fakeEmployeeForm = new FormGroup({
    courierLimitsBy: new FormControl('fake'),
    minAmountOfOrder: new FormControl('fake'),
    maxAmountOfOrder: new FormControl('fake'),
    minAmountOfBigBag: new FormControl('fake'),
    maxAmountOfBigBag: new FormControl('fake'),
    limitDescription: new FormControl('fake')
  });
  const fakeLocations: Locations = {
    id: 123,
    name: 'fakeName',
    languageCode: 'ua'
  };
  const fakeService = {
    price: 555,
    commission: 333
  };
  const fakeBag = {
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
  const dialogStub = {
    afterClosed() {
      return of(true);
    }
  };

  const tariffsServiceMock = jasmine.createSpyObj('tariffsServiceMock', [
    'getLocations',
    'editInfo',
    'getAllTariffsForService',
    'getAllServices',
    'getCouriers'
  ]);
  tariffsServiceMock.getLocations = () => of([fakeLocations]);
  tariffsServiceMock.editInfo = () => of();
  tariffsServiceMock.getCouriers = () => of([fakeCouriers]);
  tariffsServiceMock.getAllServices = () => of([fakeService]);
  tariffsServiceMock.getAllTariffsForService = () => of([fakeBag]);

  const matDialogMock = jasmine.createSpyObj('matDialogMock', ['open']);
  matDialogMock.open.and.returnValue(dialogStub);

  const localStorageServiceMock = jasmine.createSpyObj('localStorageServiceMock', ['getCurrentLanguage']);
  localStorageServiceMock.languageBehaviourSubject = of();
  localStorageServiceMock.languageSubject = of('ua');

  const orderServiceMock = jasmine.createSpyObj('orderServiceMock', ['addLocation', 'completedLocation']);
  orderServiceMock.addLocation = () => of();
  orderServiceMock.locationSubject = of();

  const locationMock = jasmine.createSpyObj('locationMock', ['go']);

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
        RouterTestingModule,
        ReactiveFormsModule,
        FormsModule
      ],
      providers: [
        FormBuilder,
        { provide: MatDialog, useValue: matDialogMock },
        { provide: MatDialogRef, useValue: {} },
        { provide: TariffsService, useValue: tariffsServiceMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: OrderService, useValue: orderServiceMock },
        { provide: Location, useValue: locationMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminTariffsPricingPageComponent);
    component = fixture.componentInstance;
    component.locations = [fakeLocations];
    httpMock = TestBed.inject(HttpTestingController);
    route = TestBed.inject(ActivatedRoute);
    route.params = of(fakeParams);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('destroy Subject should be closed after ngOnDestroy()', () => {
    const destroy = 'destroy';
    component[destroy] = new Subject<boolean>();
    spyOn(component[destroy], 'unsubscribe');
    component.ngOnDestroy();
    expect(component[destroy].unsubscribe).toHaveBeenCalledTimes(1);
  });
});
