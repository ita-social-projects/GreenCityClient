import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { OrderService } from '../../services/order.service';
import { UbsAdminSeveralOrdersPopUpComponent } from './ubs-admin-several-orders-pop-up.component';

describe('UbsAdminSeveralOrdersPopUpComponent', () => {
  let fixture: ComponentFixture<UbsAdminSeveralOrdersPopUpComponent>;
  let component: UbsAdminSeveralOrdersPopUpComponent;

  const orderServiceMock = jasmine.createSpyObj('orderService', ['getOrderInfo']);

  const emptyFormValue = {
    exportDetailsDto: {
      receivingStationId: null,
      dateExport: null,
      timeDeliveryFrom: null,
      timeDeliveryTo: null
    },
    responsiblePersonsForm: {
      responsibleCaller: null,
      responsibleLogicMan: null,
      responsibleNavigator: null,
      responsibleDriver: null
    }
  };

  const orderInfo = {
    exportDetailsDto: {
      timeDeliveryFrom: null,
      timeDeliveryTo: null,
      dateExport: null,
      receivingStationId: null,
      allReceivingStations: []
    },
    employeePositionDtoRequest: {
      currentPositionEmployees: null,
      allPositionsEmployees: null,
      orderId: 0
    }
  };

  const matDialogMock = jasmine.createSpyObj('matDialogRef', ['open', 'close']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminSeveralOrdersPopUpComponent],
      imports: [TranslateModule.forRoot(), NoopAnimationsModule],
      providers: [{ provide: OrderService, useValue: orderServiceMock }, { provide: MatDialogRef, useValue: matDialogMock }, FormBuilder]
    }).compileComponents();

    fixture = TestBed.createComponent(UbsAdminSeveralOrdersPopUpComponent);
    component = fixture.debugElement.componentInstance;
    component.ordersId = [0];
    spyOn(component, 'setEmployeesByPosition').and.callFake(() => {});
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('initForm()', () => {
    component.initForm(emptyFormValue);
    expect(component.ordersForm.value).toEqual(emptyFormValue);
  });

  it('getInitialFormValues()', () => {
    spyOn(component, 'getInitialFormValues').and.callFake(() => emptyFormValue);
    expect(component.getInitialFormValues(orderInfo)).toEqual(emptyFormValue);
  });

  it('getEmployeeById()', () => {
    expect(component.getEmployeeById(undefined, 0)).toEqual(null);
  });

  it('should create order form', () => {
    component.initForm(emptyFormValue);
    expect(component.ordersForm.value).toEqual(emptyFormValue);
  });

  it('ordersService', () => {
    orderServiceMock.getOrderInfo.and.returnValue(of(orderInfo));
    component.ngOnInit();
    expect(orderServiceMock.getOrderInfo).toHaveBeenCalled();
  });

  it('loadOrderInfo()', () => {
    const spy = spyOn(component, 'loadOrderInfo');
    component.ngOnInit();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
