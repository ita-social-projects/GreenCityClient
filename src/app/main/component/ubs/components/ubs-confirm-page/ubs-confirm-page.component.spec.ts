import { of } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { JwtService } from '@global-service/jwt/jwt.service';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { UbsConfirmPageComponent } from './ubs-confirm-page.component';
import { UBSOrderFormService } from '../../services/ubs-order-form.service';

describe('UbsConfirmPageComponent', () => {
  let component: UbsConfirmPageComponent;
  let fixture: ComponentFixture<UbsConfirmPageComponent>;
  let router: Router;
  const fakeSnackBar = jasmine.createSpyObj('fakeSnakBar', ['openSnackBar']);
  const fakeUBSOrderFormService = jasmine.createSpyObj('fakeUBSService', [
    'getOrderResponseErrorStatus',
    'getOrderStatus',
    'saveDataOnLocalStorage'
  ]);
  const fakeJwtService = jasmine.createSpyObj('fakeJwtService', ['']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsConfirmPageComponent],
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: MatSnackBarComponent, useValue: fakeSnackBar },
        { provide: UBSOrderFormService, useValue: fakeUBSOrderFormService },
        { provide: JwtService, useValue: fakeJwtService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsConfirmPageComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fakeUBSOrderFormService.orderId = of('123');
    fakeJwtService.userRole$ = of('ROLE_ADMIN');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should call renderView with oderID', () => {
    fakeUBSOrderFormService.getOrderResponseErrorStatus.and.returnValue(false);
    fakeUBSOrderFormService.getOrderStatus.and.returnValue(true);
    const renderViewMock = spyOn(component, 'renderView');
    component.ngOnInit();
    expect(renderViewMock).toHaveBeenCalled();
  });

  it('ngOnInit should call renderView without oderID', () => {
    const orderService = 'orderService';
    spyOn(component[orderService], 'getUbsOrderStatus').and.returnValue(of({ result: 'success', order_id: '123_456' }));
    const renderViewMock = spyOn(component, 'renderView');
    component.ngOnInit();
    expect(renderViewMock).toHaveBeenCalled();
  });

  it('in renderView should saveDataOnLocalStorage and openSnackBar be called', () => {
    component.orderStatusDone = false;
    component.orderResponseError = false;
    component.orderId = '132';
    const saveDataOnLocalStorageMock = spyOn(component, 'saveDataOnLocalStorage');
    component.renderView();
    expect(saveDataOnLocalStorageMock).toHaveBeenCalled();
    expect(fakeSnackBar.openSnackBar).toHaveBeenCalledWith('successConfirmSaveOrder', '132');
  });

  it('in renderView should saveDataOnLocalStorage when no error occurred', () => {
    component.orderStatusDone = true;
    component.orderResponseError = false;
    const saveDataOnLocalStorageMock = spyOn(component, 'saveDataOnLocalStorage');
    component.renderView();
    expect(saveDataOnLocalStorageMock).toHaveBeenCalled();
  });

  it('in saveDataOnLocalStorage should removeUbsOrderId and saveDataOnLocalStorage be called', () => {
    const localStorageService = 'localStorageService';
    const removeUbsOrderIdMock = spyOn(component[localStorageService], 'removeUbsOrderId');
    const removeUbsFondyOrderIdMock = spyOn(component[localStorageService], 'removeUbsFondyOrderId');
    component.saveDataOnLocalStorage();
    expect(removeUbsOrderIdMock).toHaveBeenCalled();
    expect(removeUbsFondyOrderIdMock).toHaveBeenCalled();
    expect(fakeUBSOrderFormService.saveDataOnLocalStorage).toHaveBeenCalled();
  });

  it('should redirect to order', () => {
    const navigateSpy = spyOn(router, 'navigateByUrl');
    component.returnToPayment();
    expect(navigateSpy).toHaveBeenCalledWith('/ubs/order');
  });

  it('should redirect to ubs-admin/orders', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const saveDataOnLocalStorageMock = spyOn(component, 'saveDataOnLocalStorage');
    component.toPersonalAccount();
    expect(saveDataOnLocalStorageMock).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['ubs-admin', 'orders']);
  });

  it('should redirect to ubs-user/orders', () => {
    fakeJwtService.userRole$ = of('ROLE_USER');
    const navigateSpy = spyOn(router, 'navigate');
    const saveDataOnLocalStorageMock = spyOn(component, 'saveDataOnLocalStorage');
    component.toPersonalAccount();
    expect(saveDataOnLocalStorageMock).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['ubs-user', 'orders']);
  });
});
