import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { IInitialFormValues } from './ubs-admin-several-orders-pop-up.component';
import { OrderService } from '../../services/order.service';
import { UbsAdminSeveralOrdersPopUpComponent } from './ubs-admin-several-orders-pop-up.component';

describe('UbsAdminSeveralOrdersPopUpComponent', () => {
  let fixture: ComponentFixture<UbsAdminSeveralOrdersPopUpComponent>;
  let component: UbsAdminSeveralOrdersPopUpComponent;

  const OrderServiceMock = {
    updateOrdersInfo: jasmine.createSpy('updateOrdersInfo'),
    getOrderInfo: jasmine.createSpy('getOrderInfo'),
    matchProps: jasmine.createSpy('matchProps')
  };

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

  // const initialValues: IInitialFormValues = {
  //   exportDetailsDto: {
  //     receivingStationId: InputValue;
  //     dateExport: InputValue;
  //     timeDeliveryFrom: InputValue;
  //     timeDeliveryTo: InputValue;
  //   },
  //   responsiblePersonsForm: {
  //     responsibleCaller: InputValue;
  //     responsibleLogicMan: InputValue;
  //     responsibleNavigator: InputValue;
  //     responsibleDriver: InputValue;
  //   }
  // }

  const matDialogMock = jasmine.createSpyObj('matDialogRef', ['open', 'close']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminSeveralOrdersPopUpComponent],
      imports: [TranslateModule.forRoot(), NoopAnimationsModule],
      providers: [{ provide: OrderService, useValue: OrderServiceMock }, { provide: MatDialogRef, useValue: matDialogMock }, FormBuilder]
    }).compileComponents();

    fixture = TestBed.createComponent(UbsAdminSeveralOrdersPopUpComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getInitialFormValues()', () => {
    expect(component.getInitialFormValues(orderInfo)).toEqual(emptyFormValue);
  });

  it('getEmployeeById()', () => {
    expect(component.getEmployeeById(undefined, 0)).toEqual(null);
  });
});
