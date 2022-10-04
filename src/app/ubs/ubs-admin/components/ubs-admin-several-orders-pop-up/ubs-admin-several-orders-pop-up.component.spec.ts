import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { ResponsibleEmployee } from '../../models/ubs-admin.interface';
import { IInitialFormValues } from './ubs-admin-several-orders-pop-up.component';
import { OrderService } from '../../services/order.service';
import { UbsAdminSeveralOrdersPopUpComponent } from './ubs-admin-several-orders-pop-up.component';
import { IEmployee } from '../../models/ubs-admin.interface';

describe('UbsAdminSeveralOrdersPopUpComponent', () => {
  let fixture: ComponentFixture<UbsAdminSeveralOrdersPopUpComponent>;
  let component: UbsAdminSeveralOrdersPopUpComponent;

  const orderServiceMock = jasmine.createSpyObj('orderService', ['getOrderInfo']);

  const emptyFormValue: IInitialFormValues = {
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
      currentPositionEmployees: {
        'PositionDto(id=2, name=Менеджер обдзвону)': 'Call Manager',
        'PositionDto(id=3, name=Логіст)': 'Logistician',
        'PositionDto(id=4, name=Штурман)': 'Navigator',
        'PositionDto(id=5, name=Водій)': 'Driver'
      },
      allPositionsEmployees: null,
      orderId: 0
    }
  };

  const matDialogMock = jasmine.createSpyObj('matDialogRef', ['open', 'close']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminSeveralOrdersPopUpComponent],
      imports: [TranslateModule.forRoot(), NoopAnimationsModule],
      providers: [
        { provide: OrderService, useValue: orderServiceMock },
        { provide: MatDialogRef, useValue: matDialogMock },
        FormBuilder,
        { provide: ResponsibleEmployee, useValue: ResponsibleEmployee }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UbsAdminSeveralOrdersPopUpComponent);
    component = fixture.debugElement.componentInstance;
    component.ordersId = [0];
    spyOn(component, 'setEmployeesByPosition').and.callFake(() => {});
  }));

  it('ngOnInit()', () => {
    const spyLoadOrderInfo = spyOn(component, 'loadOrderInfo');
    const currentDate = new Date().toISOString().split('T')[0];

    component.ngOnInit();

    expect(component.currentDate).toEqual(currentDate);
    expect(spyLoadOrderInfo).toHaveBeenCalledTimes(1);
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
    expect(component.getEmployeeById(new Map(), 0)).toEqual(null);

    const fakeAllPositionsEmployees = { 'PositionDto(id=1, name=Менеджер послуги)': 'Admin' };

    expect(component.getEmployeeById(fakeAllPositionsEmployees, 1)).toEqual('Admin');
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
    tick();

    let {
      exportDetailsDto: { timeDeliveryFrom, timeDeliveryTo, receivingStationId, allReceivingStations, dateExport },
      employeePositionDtoRequest: { currentPositionEmployees, orderId }
    } = orderInfoFilledIn;

    timeDeliveryFrom = timeDeliveryFrom.split('T')[1];
    timeDeliveryTo = timeDeliveryTo.split('T')[1];
    const receivingStation = allReceivingStations[receivingStationId]?.name;

    const formExportDetailsDto = component.ordersForm.get('exportDetailsDto');
    const formResponsiblePersonsForm = component.ordersForm.get('responsiblePersonsForm');

    expect(formExportDetailsDto.get('dateExport').value).toEqual(dateExport);
    expect(formExportDetailsDto.get('timeDeliveryFrom').value).toEqual(timeDeliveryFrom);
    expect(formExportDetailsDto.get('timeDeliveryTo').value).toEqual(timeDeliveryTo);
    expect(formExportDetailsDto.get('receivingStationId').value).toEqual(receivingStation);

    expect(formResponsiblePersonsForm.get('responsibleCaller').value).toEqual('Call Manager');
    expect(formResponsiblePersonsForm.get('responsibleLogicMan').value).toEqual('Logistician');
    expect(formResponsiblePersonsForm.get('responsibleNavigator').value).toEqual('Navigator');
    expect(formResponsiblePersonsForm.get('responsibleDriver').value).toEqual('Driver');
  }));

  it('loadOrderInfo()', fakeAsync(() => {
    const spyGetInitialFormValues = spyOn(component, 'getInitialFormValues');
    const spyInitForm = spyOn(component, 'initForm');
    orderServiceMock.getOrderInfo.and.returnValue(of(orderInfoEmpty));

    component.loadOrderInfo();
    tick();

    expect(spyGetInitialFormValues).toHaveBeenCalledTimes(1);
    expect(spyInitForm).toHaveBeenCalledTimes(1);
  }));

  it('should set isLoading to false after loading order info', fakeAsync(() => {
    orderServiceMock.getOrderInfo.and.returnValue(of(orderInfoEmpty));
    component.ngOnInit();
    expect(component.isLoading).toEqual(false);
  }));
});
