import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { UbsAdminOrderHistoryComponent } from './ubs-admin-order-history.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OrderService } from 'src/app/ubs/ubs/services/order.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { AddOrderCancellationReasonComponent } from '../add-order-cancellation-reason/add-order-cancellation-reason.component';

class MatDialogMock {
  open() {
    return {
      afterClosed: () => of(true)
    };
  }
}

describe('UbsAdminOrderHistoryComponent', () => {
  let component: UbsAdminOrderHistoryComponent;
  let fixture: ComponentFixture<UbsAdminOrderHistoryComponent>;
  let orderServiceMock: any;

  beforeEach(waitForAsync(() => {
    orderServiceMock = jasmine.createSpyObj('OrderService', ['getOrderHistory', 'getNotTakenOutReason', 'getOrderCancelReason']);
    orderServiceMock.getOrderHistory.and.returnValue(of([]));
    orderServiceMock.getNotTakenOutReason.and.returnValue(of({}));
    orderServiceMock.getOrderCancelReason.and.returnValue(of({ cancellationReason: '', cancellationComment: '' }));

    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        MatDialogModule,
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      declarations: [UbsAdminOrderHistoryComponent],
      providers: [
        { provide: OrderService, useValue: orderServiceMock },
        { provide: MatDialog, useClass: MatDialogMock },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        FormBuilder
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminOrderHistoryComponent);
    component = fixture.componentInstance;
    component.orderInfo = { generalOrderInfo: { id: 1 }, addresses: [] } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getOrderHistory when orderInfo changes', () => {
    spyOn(component, 'getOrderHistory');
    component.ngOnChanges({
      orderInfo: {
        currentValue: { generalOrderInfo: { id: 2 }, addresses: [] },
        previousValue: { generalOrderInfo: { id: 1 }, addresses: [] },
        firstChange: false,
        isFirstChange: () => false
      }
    });
    expect(component.getOrderHistory).toHaveBeenCalled();
  });

  it('should set pageOpen to true when openDetails is called', () => {
    component.pageOpen = false;
    component.openDetails();
    expect(component.pageOpen).toBeTrue();
  });

  it('should call openCancelReason when order status is Cancelled', () => {
    spyOn(component, 'openCancelReason');
    component.orderHistory = [{ id: 1, result: 'Скасовано' } as any];
    component.showPopup(1);
    expect(component.openCancelReason).toHaveBeenCalled();
  });

  it('should open dialog when openCancelReason is called', () => {
    const dialogSpy = spyOn(TestBed.inject(MatDialog), 'open');
    component.openCancelReason();
    expect(dialogSpy).toHaveBeenCalledWith(AddOrderCancellationReasonComponent, jasmine.any(Object));
  });

  it('should call getOrderCancelReason when getOrderCancelReason is triggered', () => {
    spyOn(component, 'showPopup');
    component.getOrderCancelReason(1);
    expect(component.showPopup).not.toHaveBeenCalled();
  });
});
