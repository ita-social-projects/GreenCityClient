import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { UbsAdminOrderComponent } from './ubs-admin-order.component';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Store, StoreModule } from '@ngrx/store';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { OrderService } from '../../services/order.service';
import { OrderInfoMockedData } from '../../services/orderInfoMock';
import { OrderStatus } from 'src/app/ubs/ubs/order-status.enum';
import { GeneralInfoMock } from '../../services/orderInfoMock';
import { Language } from 'src/app/main/i18n/Language';
import { employeePositionsName } from '../../models/ubs-admin.interface';
import { UbsAdminEmployeeService } from '../../services/ubs-admin-employee.service';

describe('UbsAdminOrderComponent', () => {
  let component: UbsAdminOrderComponent;
  let fixture: ComponentFixture<UbsAdminOrderComponent>;
  let localStorageService: LocalStorageService;
  let translate: TranslateService;
  let orderService: OrderService;

  const initialState = {
    employees: null,
    error: null,
    employeesPermissions: []
  };

  const mockData = ['SEE_BIG_ORDER_TABLE', 'SEE_CLIENTS_PAGE', 'SEE_CERTIFICATES', 'SEE_EMPLOYEES_PAGE', 'SEE_TARIFFS'];
  const storeMock = jasmine.createSpyObj('Store', ['select', 'dispatch']);
  storeMock.select.and.returnValue(of({ employees: { employeesPermissions: mockData } }));

  const OrderInfoMock = OrderInfoMockedData;

  const employeePositionsMock = [
    employeePositionsName.CallManager,
    employeePositionsName.ServiceManager,
    employeePositionsName.Logistician
  ];

  const employeePositionsAuthorities = {
    authorities: ['SEE_BIG_ORDER_TABLE', 'SEE_CLIENTS_PAGE', 'SEE_CERTIFICATES', 'SEE_EMPLOYEES_PAGE', 'SEE_TARIFFS'],
    positionId: [3, 4, 5]
  };

  const localStorageServiceMock = jasmine.createSpyObj('localStorageService', ['getCurrentLanguage']);
  localStorageServiceMock.languageSubject = new Subject<string>();
  localStorageServiceMock.languageBehaviourSubject = new BehaviorSubject('ua');
  localStorageServiceMock.getCurrentLanguage = () => 'ua' as Language;

  const ubsAdminEmployeeServiceMock = jasmine.createSpyObj('ubsAdminEmployeeServiceMock', [
    'employeePositions$',
    'employeePositionsAuthorities$'
  ]);
  ubsAdminEmployeeServiceMock.employeePositions$ = new BehaviorSubject(employeePositionsMock);
  ubsAdminEmployeeServiceMock.employeePositionsAuthorities$ = new BehaviorSubject(employeePositionsAuthorities);
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        MatSnackBarModule,
        BrowserAnimationsModule,
        MatDialogModule,
        RouterTestingModule,
        HttpClientTestingModule,
        StoreModule.forRoot({})
      ],
      declarations: [UbsAdminOrderComponent],
      providers: [
        provideMockStore({ initialState }),
        { provide: Store, useValue: storeMock },
        MatSnackBarComponent,
        FormBuilder,
        OrderService,
        provideMockStore({}),
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: UbsAdminEmployeeService, useValue: ubsAdminEmployeeServiceMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminOrderComponent);
    component = fixture.componentInstance;
    localStorageService = TestBed.inject(LocalStorageService);
    translate = TestBed.inject(TranslateService);
    orderService = TestBed.inject(OrderService);
    component.orderForm = new FormGroup({
      exportDetailsDto: new FormGroup({
        field1: new FormControl(),
        field2: new FormControl()
      }),
      responsiblePersonsForm: new FormGroup({
        name1: new FormControl(),
        name2: new FormControl()
      })
    });

    component.exportInfo = {
      allReceivingStations: [
        {
          createDate: '2022-04-14',
          createdBy: 'null',
          id: 1,
          name: 'Саперно-Слобідська'
        }
      ],
      dateExport: null,
      timeDeliveryFrom: null,
      timeDeliveryTo: null,
      receivingStationId: 1
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should invoke getOrderInfo() is ngOnInit', () => {
    component.orderId = 1;
    const spy = spyOn(component, 'getOrderInfo');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(component.orderId, false);
  });

  it('authoritiesSubscription expect will be invoke at onInit', () => {
    const spy = spyOn(component as any, 'authoritiesSubscription');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('setOrderDetails expect will be invoke at onCancelOrder', () => {
    const spy = spyOn(component as any, 'setOrderDetails');
    component.onCancelOrder();
    expect(spy).toHaveBeenCalled();
    expect(component.isOrderStatusChanged).toBeTruthy();
  });

  it('notRequiredFieldsStatuses expect will be invoke at onChangedOrderStatus', () => {
    const spy = spyOn(component as any, 'notRequiredFieldsStatuses');
    const spy2 = spyOn(component as any, 'getOrderStatusInfo');
    const status = 'FORMED';
    component.onChangedOrderStatus(status);
    expect(component.currentOrderStatus).toBe(status);
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('should disable exportDetailsDto and responsiblePersonsForm when currentOrderStatus is CANCELED', () => {
    component.currentOrderStatus = OrderStatus.CANCELED;
    component.orderForm.get('exportDetailsDto').setValue({ field1: 'value1', field2: 'value2' });
    component.statusCanceledOrDone();

    expect(component.orderForm.get('exportDetailsDto').disabled).toBeTruthy();
    expect(component.orderForm.get('responsiblePersonsForm').disabled).toBeTruthy();
  });

  it('should disable exportDetailsDto and responsiblePersonsForm when currentOrderStatus is DONE and all fields have values', () => {
    component.currentOrderStatus = OrderStatus.DONE;
    component.orderForm.get('exportDetailsDto').setValue({ field1: 'value1', field2: 'value2' });
    component.statusCanceledOrDone();

    expect(component.orderForm.get('exportDetailsDto').disabled).toBeTruthy();
    expect(component.orderForm.get('responsiblePersonsForm').disabled).toBeTruthy();
  });

  it('should enable exportDetailsDto and responsiblePersonsForm when currentOrderStatus is DONE but not all fields have values', () => {
    component.currentOrderStatus = OrderStatus.DONE;
    component.orderForm.get('exportDetailsDto').setValue({ field1: 'value1', field2: null });
    component.statusCanceledOrDone();

    expect(component.orderForm.get('exportDetailsDto').enabled).toBeTruthy();
    expect(component.orderForm.get('responsiblePersonsForm').enabled).toBeTruthy();
  });

  it('should clear validators, reset values, and set isFormResetted to true when currentOrderStatus is in statuses', () => {
    component.currentOrderStatus = OrderStatus.BROUGHT_IT_HIMSELF;
    component.notRequiredFieldsStatuses();

    expect(component.orderForm.get('exportDetailsDto.field1').validator).toBeNull();
    expect(component.orderForm.get('exportDetailsDto.field2').validator).toBeNull();
    expect(component.orderForm.get('responsiblePersonsForm.name1').validator).toBeNull();
    expect(component.orderForm.get('responsiblePersonsForm.name2').validator).toBeNull();
    expect(component.orderForm.get('exportDetailsDto').value).toEqual({ field1: null, field2: null });
    expect(component.orderForm.get('responsiblePersonsForm').value).toEqual({ name1: null, name2: null });
    expect((component as any).isFormResetted).toBeTruthy();
  });

  it('should return the order status info for the given status name', () => {
    const GeneralInfoFake = GeneralInfoMock;
    component.generalInfo = GeneralInfoFake as any;
    const result = (component as any).getOrderStatusInfo('DONE');

    expect(result).toEqual({ ableActualChange: false, key: OrderStatus.DONE, translation: 'Formed' });
  });

  it('should return an empty string if the map is empty', () => {
    const allCurrentEmployees = new Map<string, string>([
      ['id=1, name=John', 'John'],
      ['id=2, name=Mary', 'Mary'],
      ['id=3, name=Peter', 'Peter']
    ]);
    const employee = component.getEmployeeById(allCurrentEmployees, 1);
    expect(employee).toEqual('');
  });

  it('should return an empty string if the employee with the given id is not found', () => {
    const allCurrentEmployees = new Map<string, string>([
      ['id=1, name=John', 'John'],
      ['id=2, name=Mary', 'Mary'],
      ['id=3, name=Peter', 'Peter']
    ]);
    const employee = component.getEmployeeById(allCurrentEmployees, 4);
    expect(employee).toEqual('');
  });

  it('onUpdatePaymentStatus should update additionalPayment and mark orderForm as dirty', () => {
    const newPaymentStatus = 'paid';
    component.onUpdatePaymentStatus(newPaymentStatus);
    expect(component.additionalPayment).toEqual(newPaymentStatus);
    expect(component.orderForm.dirty).toBeTruthy();
  });

  it('onPaymentUpdate should update totalPaid', () => {
    const sum = 100;
    component.onPaymentUpdate(sum);
    expect(component.totalPaid).toEqual(sum);
  });

  it('changeOverpayment should update overpayment', () => {
    const sum = 50;
    component.changeOverpayment(sum);
    expect(component.overpayment).toEqual(sum);
  });

  it('onChangeCurrentPrice should update currentOrderPrice', () => {
    const sum = 500;
    component.onChangeCurrentPrice(sum);
    expect(component.currentOrderPrice).toEqual(sum);
  });

  it('onChangeCourierPrice should update ubsCourierPrice', () => {
    const sum = 10;
    component.onChangeCourierPrice(sum);
    expect(component.ubsCourierPrice).toEqual(sum);
  });

  it('setMinOrder should update isMinOrder', () => {
    const flag = true;
    component.setMinOrder(flag);
    expect(component.isMinOrder).toEqual(flag);
  });

  it('parseTimeToStr should return an empty string when given an empty string', () => {
    const dateStr = '';
    const formattedStr = component.parseTimeToStr(dateStr);
    expect(formattedStr).toEqual('');
  });

  it('onChangeWriteOffStation should update writeOffStationSum', () => {
    const sum = 25;
    component.onChangeWriteOffStation(sum);
    expect(component.writeOffStationSum).toEqual(sum);
  });

  it('getReceivingStationById should return the receiving station id for a given name', () => {
    const id = component.getReceivingStationIdByName('Саперно-Слобідська');
    expect(id).toEqual(1);
  });

  it('getReceivingStationById should return null if the receiving station id is not found', () => {
    const name = component.getReceivingStationById(4);
    expect(name).toBeNull();
  });

  it('getReceivingStationById should return the receiving station name for a given id', () => {
    const name = component.getReceivingStationById(1);
    expect(name).toEqual('Саперно-Слобідська');
  });

  it('getReceivingStationById should return null if the receiving station name is not found', () => {
    const name = component.getReceivingStationById(4);
    expect(name).toBeNull();
  });
});
