import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { UBSOrderDetailsComponent } from './ubs-order-details.component';
import { Component } from '@angular/core';
import { limitStatus } from '@ubs/ubs-admin/components/ubs-admin-tariffs/ubs-tariffs.enum';
import { mockLocations, orderDetailsMock, ubsOrderServiseMock } from '@ubs/mocks/order-data-mock';

@Component({
  selector: 'app-spinner',
  template: '<div></div>'
})
export class MockSpinnerComponent {}

export function getMockStore() {
  return {
    dispatch: jasmine.createSpy('dispatch'),
    pipe: jasmine.createSpy('pipe').and.returnValue(new BehaviorSubject([]))
  };
}

describe('UBSOrderDetailsComponent', () => {
  let component: UBSOrderDetailsComponent;
  let fixture: ComponentFixture<UBSOrderDetailsComponent>;
  let store: Store;
  const storeMock = jasmine.createSpyObj('Store', ['select', 'dispatch']);
  storeMock.select.and.returnValue(of({ order: ubsOrderServiseMock }));
  let dialog: MatDialog;
  let route: ActivatedRoute;

  const orderServiceMock = jasmine.createSpyObj('OrderService', [
    'getOrders',
    'getPersonalData',
    'getTariffForExistingOrder',
    'setOrderDetailsFromState'
  ]);
  orderServiceMock.getOrders.and.returnValue(of());
  orderServiceMock.getPersonalData.and.returnValue(of(storeMock.personalData));
  orderServiceMock.getTariffForExistingOrder.and.returnValue(of());
  orderServiceMock.setOrderDetailsFromState.and.returnValue(of());

  const fakeLanguageSubject: Subject<string> = new Subject<string>();

  const localStorageService = jasmine.createSpyObj('localStorageService', [
    'getCurrentLanguage',
    'languageSubject',
    'getUbsOrderData',
    'getLocations',
    'removeUbsOrderAndPersonalData',
    'removeanotherClientData',
    'getLocationId',
    'getTariffId'
  ]);
  localStorageService.getUbsOrderData = () => null;
  localStorageService.languageSubject = fakeLanguageSubject;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UBSOrderDetailsComponent, MockSpinnerComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        FormsModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule
      ],
      providers: [
        FormBuilder,
        TranslateService,
        { provide: Store, useValue: getMockStore() },
        {
          provide: MatDialog,
          useValue: { open: () => ({ afterClosed: () => of(true) }) }
        },
        {
          provide: ActivatedRoute,
          useValue: { queryParams: of({ existingOrderId: 1 }) }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UBSOrderDetailsComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    dialog = TestBed.inject(MatDialog);
    route = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize listeners on init', () => {
    spyOn(component, 'initListeners');
    component.ngOnInit();
    expect(component.initListeners).toHaveBeenCalled();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should calculate final sum', () => {
    component.orderSum = 100;
    component.pointsUsed = 10;
    component.certificateUsed = 20;
    component.calculateFinalSum();
    expect(component.finalSum).toBe(70);
  });

  it('should add a new order', () => {
    const initialLength = component.additionalOrders.length;
    component.addOrder();
    expect(component.additionalOrders.length).toBe(initialLength + 1);
  });

  it('should delete an order', () => {
    component.addOrder('testOrder');
    const initialLength = component.additionalOrders.length;
    component.deleteOrder(0);
    expect(component.additionalOrders.length).toBe(initialLength - 1);
  });

  it('should open location dialog', () => {
    spyOn(dialog, 'open').and.callThrough();
    component.openLocationDialog();
    expect(dialog.open).toHaveBeenCalled();
  });

  it('should change second step disabled state', () => {
    spyOn(component.secondStepDisabledChange, 'emit');
    component['changeSecondStepDisabled'](true);
    expect(component.secondStepDisabledChange.emit).toHaveBeenCalledWith(true);
  });

  it('method checkOnNumber should return true if key is number', () => {
    const event: any = { key: '1' };
    fixture.detectChanges();
    const result = component.checkOnNumber(event);
    expect(result).toBe(true);
  });

  it('method addOrder should invoke ecoStoreValidation method', () => {
    spyOn(global, 'setTimeout');
    component.addOrder();
  });

  it('method setLimitsValues should set minOrderValue and maxOrderValue', () => {
    localStorageService.getLocations = jasmine.createSpy().and.returnValue(component.locations);
  });

  it('checkCourierLimit should check and set courierLimitByAmount', () => {
    mockLocations.courierLimit = limitStatus.limitByAmountOfBag;
    fixture.detectChanges();
  });

  it('check getFormValues should return boolean', () => {
    const spy = spyOn(component, 'getFormValues');
    (component as any).getFormValues();
    expect(spy).toBeTruthy();
  });

  it('getter additionalOrders should return formArray of orders', () => {
    const formArray = component.orderDetailsForm.controls.additionalOrders as FormArray;
    const spy = spyOnProperty(component, 'additionalOrders').and.returnValue(formArray);
    expect(component.additionalOrders).toBe(formArray);
    expect(spy).toHaveBeenCalled();
  });

  it('getter orderComment should return formArray of comments', () => {
    const formArray = component.orderDetailsForm.controls.orderComment as FormArray;
    const spy = spyOnProperty(component, 'orderComment').and.returnValue(formArray);
    expect(component.orderComment).toBe(formArray);
    expect(spy).toHaveBeenCalled();
  });

  it('updateBagsQuantyty should call updateOrderDetails method', () => {
    orderServiceMock.setOrderDetailsFromState(orderDetailsMock).subscribe((orderDet) => {});
  });
});
