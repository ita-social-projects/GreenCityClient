import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
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

describe('UbsMainPageComponent', () => {
  let component: UbsMainPageComponent;
  let fixture: ComponentFixture<UbsMainPageComponent>;
  let jwtServiceMock: JwtService;
  jwtServiceMock = jasmine.createSpyObj('JwtService', ['getUserRole']);
  jwtServiceMock.getUserRole = () => 'ROLE_UBS_EMPLOYEE';

  const localeStorageServiceMock = jasmine.createSpyObj('localeStorageService', [
    'setUbsRegistration',
    'getUserId',
    'removeUbsFondyOrderId',
    'getLocationId',
    'getTariffId'
  ]);
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
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [UbsMainPageComponent],
      providers: [
        { provide: Store, useValue: storeMock },
        { provide: MatDialog, useValue: matDialogMock },
        { provide: Router, useValue: routerMock },
        { provide: LocalStorageService, useValue: localeStorageServiceMock },
        { provide: CheckTokenService, useValue: checkTokenServiceMock },
        { provide: OrderService, useValue: orderServiceMock },
        { provide: JwtService, useValue: jwtServiceMock }
      ]
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

  it('checkIsAdmin()', () => {
    const spy = spyOn(component, 'checkIsAdmin');
    component.ngOnInit();
    expect(spy).toBeTruthy();
  });

  it('destroy Subject should be closed after ngOnDestroy()', () => {
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
  });
});
