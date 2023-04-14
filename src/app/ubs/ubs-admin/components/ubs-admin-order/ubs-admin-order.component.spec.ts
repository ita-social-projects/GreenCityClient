import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FormGroup, FormControl, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { UbsAdminOrderComponent } from './ubs-admin-order.component';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Store, StoreModule } from '@ngrx/store';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { OrderService } from '../../services/order.service';
import { OrderInfoMockedData } from '../../services/orderInfoMock';
import { OrderStatus } from 'src/app/ubs/ubs/order-status.enum';
import { GeneralInfoMock } from '../../services/orderInfoMock';

describe('UbsAdminCabinetComponent', () => {
  let component: UbsAdminOrderComponent;
  let fixture: ComponentFixture<UbsAdminOrderComponent>;
  let localStorageService: LocalStorageService;
  let translate: TranslateService;
  let orderService: OrderService;

  const OrderInfoMock = OrderInfoMockedData;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        MatSnackBarModule,
        BrowserAnimationsModule,
        MatDialogModule,
        RouterTestingModule,
        HttpClientModule,
        StoreModule.forRoot({})
      ],
      declarations: [UbsAdminOrderComponent],
      providers: [MatSnackBarComponent, FormBuilder, OrderService, provideMockStore({})]
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
    const result = (component as any).getOrderStatusInfo(OrderStatus.DONE);

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
