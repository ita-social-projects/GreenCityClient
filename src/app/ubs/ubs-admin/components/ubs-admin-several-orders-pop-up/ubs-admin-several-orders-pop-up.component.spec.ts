import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
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

  const orderInfoEmpty = {
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

  const orderInfoFilledIn = {
    exportDetailsDto: {
      timeDeliveryFrom: '2022:02:10T10:00',
      timeDeliveryTo: '2022:02:10T20:00',
      dateExport: '22.12.2022',
      receivingStationId: 0,
      allReceivingStations: [{ id: 0, name: 'Default' }]
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

  it('initForm with null values if no info provided', () => {
    component.initForm(emptyFormValue);
    const { exportDetailsDto, responsiblePersonsForm } = emptyFormValue;
    const { exportDetailsDto: formExportDetails, responsiblePersonsForm: formResponsiblePersons } = component.ordersForm.value;

    expect(formExportDetails.receivingStationId).toEqual(exportDetailsDto.receivingStationId);
    expect(formExportDetails.dateExport).toEqual(exportDetailsDto.dateExport);
    expect(formExportDetails.timeDeliveryFrom).toEqual(exportDetailsDto.timeDeliveryFrom);
    expect(formExportDetails.timeDeliveryTo).toEqual(exportDetailsDto.timeDeliveryTo);
    expect(formResponsiblePersons.responsibleCaller).toEqual(responsiblePersonsForm.responsibleCaller);
    expect(formResponsiblePersons.responsibleLogicMan).toEqual(responsiblePersonsForm.responsibleLogicMan);
    expect(formResponsiblePersons.responsibleNavigator).toEqual(responsiblePersonsForm.responsibleNavigator);
    expect(formResponsiblePersons.responsibleDriver).toEqual(responsiblePersonsForm.responsibleDriver);
  });

  it('getInitialFormValues()', () => {
    spyOn(component, 'getInitialFormValues').and.callFake(() => emptyFormValue);
    expect(component.getInitialFormValues(orderInfoEmpty)).toEqual(emptyFormValue);
  });

  it('getEmployeeById()', () => {
    expect(component.getEmployeeById(undefined, 0)).toEqual(null);
  });

  it('should create order form', () => {
    component.initForm(emptyFormValue);
    expect(component.ordersForm.value).toEqual(emptyFormValue);
  });

  it('ordersService with empty order info', () => {
    orderServiceMock.getOrderInfo.and.returnValue(of(orderInfoEmpty));
    component.ngOnInit();
    expect(orderServiceMock.getOrderInfo).toHaveBeenCalled();
  });

  it('should fill in ordersForm with correct values', fakeAsync(() => {
    orderServiceMock.getOrderInfo.and.returnValue(of(orderInfoFilledIn));
    component.ngOnInit();

    const { exportDetailsDto: formExportDetails } = component.ordersForm.value;
    const { exportDetailsDto } = orderInfoFilledIn;

    const timeDeliveryFrom = exportDetailsDto.timeDeliveryFrom.split('T')[1];
    const timeDeliveryTo = exportDetailsDto.timeDeliveryTo.split('T')[1];
    const receivingStationId = exportDetailsDto.allReceivingStations[exportDetailsDto.receivingStationId]?.name;

    expect(formExportDetails.dateExport).toEqual(orderInfoFilledIn.exportDetailsDto.dateExport);
    expect(formExportDetails.timeDeliveryFrom).toEqual(timeDeliveryFrom);
    expect(formExportDetails.timeDeliveryTo).toEqual(timeDeliveryTo);
    expect(formExportDetails.receivingStationId).toEqual(receivingStationId);
  }));

  it('loadOrderInfo()', () => {
    const spy = spyOn(component, 'loadOrderInfo');
    component.ngOnInit();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should set isLoading to false after loading order info', fakeAsync(() => {
    component.ngOnInit();
    expect(component.isLoading).toEqual(false);
  }));
});
