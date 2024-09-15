import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UbsMainPageComponent } from './ubs-main-page.component';
import { MatDialog } from '@angular/material/dialog';
import { of, Subject, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { CheckTokenService } from '@global-service/auth/check-token/check-token.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OrderService } from '../../services/order.service';
import { JwtService } from '@global-service/jwt/jwt.service';
import { activeCouriersMock } from 'src/app/ubs/ubs-admin/services/orderInfoMock';
import { AuthModalComponent } from '@global-auth/auth-modal/auth-modal.component';
import { Store } from '@ngrx/store';
import { ubsOrderServiseMock } from 'src/app/ubs/mocks/order-data-mock';
import { MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NO_ERRORS_SCHEMA } from '@angular/core';

xdescribe('UbsMainPageComponent', () => {
  let component: UbsMainPageComponent;
  let fixture: ComponentFixture<UbsMainPageComponent>;
  const jwtServiceMock: JwtService = jasmine.createSpyObj('JwtService', ['getUserRole']);
  jwtServiceMock.getUserRole = () => 'ROLE_UBS_EMPLOYEE';

  const localeStorageServiceMock = jasmine.createSpyObj('localeStorageService', [
    'setUbsRegistration',
    'getUserId',
    'removeUbsFondyOrderId',
    'getLocationId',
    'getTariffId'
  ]);
  localeStorageServiceMock.getCurrentLanguage = () => of('ua');
  const routerMock = jasmine.createSpyObj('router', ['navigate']);
  const matDialogMock = jasmine.createSpyObj('matDialog', ['open']);
  const checkTokenServiceMock = jasmine.createSpyObj('CheckTokenService', ['onCheckToken']);
  const dialogRefStub = {
    afterClosed() {
      return of({ data: true });
    }
  };
  const orderServiceMock = jasmine.createSpyObj('orderService', [
    'getLocations',
    'getAllActiveCouriers',
    'cleanPrevOrderState',
    'getOrders'
  ]);
  const orderData = [
    {
      id: 2,
      name: 'Текстильні відходи',
      capacity: 20,
      price: 110,
      nameEng: 'Textile waste',
      limitedIncluded: false,
      quantity: null
    },
    {
      id: 3,
      name: 'Текстильні відходи',
      capacity: 60,
      price: 220,
      nameEng: 'Textile waste',
      limitedIncluded: false,
      quantity: null
    },
    {
      id: 1,
      name: 'Мікс відходів',
      capacity: 120,
      price: 285,
      nameEng: 'Mix waste',
      limitedIncluded: true,
      quantity: null
    },
    {
      id: 7,
      name: 'Текстильні відходи',
      capacity: 30,
      price: 260,
      nameEng: 'Textile waste',
      limitedIncluded: false,
      quantity: null
    },
    {
      id: 8,
      name: 'Мікс відходів',
      capacity: 3,
      price: 473,
      nameEng: 'Mix Waste',
      limitedIncluded: false,
      quantity: null
    }
  ];
  const couriers = [];
  orderServiceMock.getOrders.and.returnValue(of(orderData));

  const activecouriersMock = activeCouriersMock;
  orderServiceMock.getAllActiveCouriers.and.returnValue(of(activecouriersMock));

  const initialState = {
    employees: null,
    error: null,
    employeesPermissions: []
  };

  const mockData = ['SEE_BIG_ORDER_TABLE', 'SEE_CLIENTS_PAGE', 'SEE_CERTIFICATES', 'SEE_EMPLOYEES_PAGE', 'SEE_TARIFFS'];
  const storeMock = jasmine.createSpyObj('Store', ['select', 'dispatch']);
  storeMock.select.and.returnValue(of({ emplpyees: { employeesPermissions: mockData } }));
  storeMock.select.and.returnValue(of({ order: ubsOrderServiseMock }));
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule, MatAutocompleteModule],
      declarations: [UbsMainPageComponent],
      providers: [
        { provide: Store, useValue: storeMock },
        { provide: MatDialog, useValue: matDialogMock },
        { provide: Router, useValue: routerMock },
        { provide: LocalStorageService, useValue: localeStorageServiceMock },
        { provide: CheckTokenService, useValue: checkTokenServiceMock },
        { provide: OrderService, useValue: orderServiceMock },
        { provide: JwtService, useValue: jwtServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsMainPageComponent);
    component = fixture.componentInstance;
    component.activeCouriers = activecouriersMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('checkIsAdmin()', () => {
    spyOn(component, 'findCourierByName').and.returnValue(activecouriersMock[0]);
    spyOn(component as any, 'getActiveLocationsToShow').and.returnValue(of());
    const spy = spyOn(component, 'checkIsAdmin');
    component.ngOnInit();
    expect(spy).toBeTruthy();
  });

  xit('destroy Subject should be closed after ngOnDestroy()', () => {
    (component as any).destroy = new Subject<boolean>();
    const nextSpy = spyOn((component as any).destroy, 'next');
    const unsubscribeSpy = spyOn((component as any).destroy, 'unsubscribe');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalledTimes(1);
    expect(unsubscribeSpy).toHaveBeenCalledTimes(1);
  });

  it('should make expected calls inside openLocationDialog', () => {
    matDialogMock.open.and.returnValue(dialogRefStub as any);
    component.openLocationDialog('fake locations' as any);
    expect(routerMock.navigate).toHaveBeenCalledWith(['ubs', 'order']);
  });

  it('should make expected calls inside redirectToOrder when userId is truthy', () => {
    (component as any).userId = 333;
    spyOn(component, 'getLocations').and.stub();
    component.redirectToOrder();

    expect(localeStorageServiceMock.setUbsRegistration).toHaveBeenCalledWith(true);
  });

  it('should open auth modal window inside redirectToOrder when userId is falsy', () => {
    (component as any).userId = null;
    component.redirectToOrder();

    expect(matDialogMock.open).toHaveBeenCalledWith(AuthModalComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      panelClass: ['custom-dialog-container'],
      data: {
        popUpName: 'sign-in'
      }
    });
  });

  describe('findCourierByName', () => {
    it('should return the courier with matching name', () => {
      const courierName = 'Test502';
      const result = component.findCourierByName(courierName);
      expect(result).toEqual(activecouriersMock[1]);
    });

    it('should return undefined when no courier with matching name is found', () => {
      const courierName = 'NonExistingCourier';
      const result = component.findCourierByName(courierName);
      expect(result).toBeUndefined();
    });
  });

  describe('getActiveCouriers', () => {
    it('should fetch active couriers from the order service', () => {
      component.getActiveCouriers();
      expect(orderServiceMock.getAllActiveCouriers).toHaveBeenCalled();
    });

    it('should set activeCouriers when getAllActiveCouriers returns data', () => {
      const mockCouriers = activecouriersMock;
      orderServiceMock.getAllActiveCouriers.and.returnValue(of(mockCouriers));
      component.getActiveCouriers().subscribe(() => {
        expect(component.activeCouriers).toEqual(mockCouriers);
      });
    });
  });

  it('should have expected activeCouriers after ngOnInit', () => {
    expect(component.activeCouriers).toEqual(activecouriersMock);
  });

  describe('getLocations', () => {
    it('should handle error from getLocations', () => {
      const courierName = 'Test502';
      orderServiceMock.getLocations.and.returnValue(throwError('error'));
      spyOn(console, 'error');
      component.getLocations(courierName);
      expect(console.error).toHaveBeenCalledWith('error');
    });

    it('should response from getLocations if user had orders', () => {
      const courierName = 'Test502';
      const res = { allActiveLocationsDtos: null, tariffsForLocationDto: null, orderIsPresent: true };
      orderServiceMock.getLocations.and.returnValue(of(res));
      const spy = spyOn(component, 'saveLocation');
      component.getLocations(courierName);
      expect(spy).toHaveBeenCalledWith(res);
      expect((component as any).router.navigate).toHaveBeenCalledWith(['ubs', 'order']);
    });

    it('should response from getLocations if user doesnt have any odreds', () => {
      const courierName = 'Test502';
      const res = { allActiveLocationsDtos: null, tariffsForLocationDto: null, orderIsPresent: false };
      orderServiceMock.getLocations.and.returnValue(of(res));
      const spy = spyOn(component, 'openLocationDialog');
      component.getLocations(courierName);
      expect(spy).toHaveBeenCalledWith(res);
    });
  });

  describe('getActiveLocationsToShow', () => {
    const location = {
      allActiveLocationsDtos: [
        {
          locations: [
            {
              locationId: 1,
              nameEn: 'location1',
              nameUk: 'локація1'
            }
          ],
          nameEn: 'region1',
          nameUk: 'регіон1',
          regionId: 2
        }
      ],
      tariffsForLocationDto: [],
      orderIsPresent: false
    };
    it('it should set locationsToShowBags when getActiveLocationsToShow is called', () => {
      component.activeCouriers = activecouriersMock;
      component.ubsCourierName = 'Test';
      orderServiceMock.getLocations.and.returnValue(of(location));
      (component as any).getActiveLocationsToShow().subscribe(() => {
        expect(component.locationsToShowBags).toEqual([{ locationId: 1, nameEn: 'location1, region1', nameUk: 'локація1, регіон1' }]);
      });
    });
  });

  it('should open dropdown with openAuto', () => {
    const event = new Event('click', { bubbles: true });
    const trigger = { openPanel: () => {} } as MatAutocompleteTrigger;
    const spy = spyOn(event, 'stopPropagation');
    const triggerSpy = spyOn(trigger, 'openPanel');
    component.openAuto(event, trigger);
    expect(spy).toHaveBeenCalled();
    expect(triggerSpy).toHaveBeenCalled();
  });
});
