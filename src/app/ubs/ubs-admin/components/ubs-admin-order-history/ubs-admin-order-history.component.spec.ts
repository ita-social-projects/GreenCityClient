import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { UbsAdminOrderHistoryComponent } from './ubs-admin-order-history.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OrderService } from 'src/app/ubs/ubs/services/order.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OrderInfoMockedData } from './../../services/orderInfoMock';
import { IEmployee, INotTakenOutReason } from '../../models/ubs-admin.interface';
import { of, Subject } from 'rxjs';
import { UntypedFormBuilder } from '@angular/forms';
import { AddOrderNotTakenOutReasonComponent } from '../add-order-not-taken-out-reason/add-order-not-taken-out-reason.component';

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
  const orderServiceMock = jasmine.createSpyObj('orderService', ['getOrderHistory']);
  const MatDialogRefMock = { close: () => {} };
  const fakeAllPositionsEmployees: Map<string, IEmployee[]> = new Map();

  const orderNotTakenOutReasonMock: INotTakenOutReason = {
    description: 'string',
    images: ['string']
  };

  const OrderInfoMock = OrderInfoMockedData;

  const dialogStub = {
    afterClosed() {
      return of(true);
    }
  };

  const matDialogMock = jasmine.createSpyObj('dialog', ['open']);
  matDialogMock.open.and.returnValue(dialogStub);

  const fakeMatDialogRef = jasmine.createSpyObj(['close', 'afterClosed']);
  fakeMatDialogRef.afterClosed.and.returnValue(of(true));

  beforeEach(waitForAsync(() => {
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
        { provide: MatDialogRef, useValue: MatDialogRefMock },
        UntypedFormBuilder
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminOrderHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jasmine.createSpyObj('orderService', { getOrderHistory: OrderInfoMock });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getOrderHistory when orderInfo changes', () => {
    const spy = spyOn(component, 'getOrderHistory');
    component.orderInfo = OrderInfoMock;

    const changes = {
      orderInfo: {
        currentValue: true,
        firstChange: true,
        isFirstChange: () => true,
        previousValue: undefined
      }
    };
    component.ngOnChanges(changes);

    expect(spy).toHaveBeenCalledWith(1);
  });

  it('should call getNotTakenOutReason when orderInfo changes', () => {
    const spy = spyOn(component, 'getNotTakenOutReason');
    component.orderInfo = OrderInfoMock;

    const changes = {
      orderInfo: {
        currentValue: true,
        firstChange: true,
        isFirstChange: () => true,
        previousValue: undefined
      }
    };
    component.ngOnChanges(changes);

    expect(spy).toHaveBeenCalledWith(1);
  });

  it('should not call getOrderHistory when orderInfo does not change', () => {
    const spy = spyOn(component, 'getOrderHistory');
    component.orderInfo = OrderInfoMock;
    const changes = {};
    component.ngOnChanges(changes);

    expect(spy).not.toHaveBeenCalled();
  });

  it('should not call getNotTakenOutReason when orderInfo does not change', () => {
    const spy = spyOn(component, 'getNotTakenOutReason');
    component.orderInfo = OrderInfoMock;
    const changes = {};
    component.ngOnChanges(changes);

    expect(spy).not.toHaveBeenCalled();
  });

  it('should set pageOpen to true when initially false', () => {
    component.pageOpen = false;
    component.openDetails();

    expect(component.pageOpen).toBe(true);
  });

  it('should set pageOpen to false when initially true', () => {
    component.pageOpen = true;
    component.openDetails();

    expect(component.pageOpen).toBe(false);
  });

  it('should call showPopup when user click on special status', () => {
    const spy = spyOn(component, 'showPopup');
    component.showPopup(1);
    expect(spy).toHaveBeenCalled();
  });

  it('should  NOT to call openCancelReason when order history event name isnt "Скасовано"', () => {
    const orderHistoryId = 1;
    const orderHistoryMock = [
      {
        authorName: 'Kateryna',
        eventDate: '2022-09-11',
        eventName: 'На маршуті',
        id: orderHistoryId
      }
    ];
    const spy = spyOn(component, 'openCancelReason');
    component.orderHistory = orderHistoryMock;
    component.showPopup(orderHistoryId);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should  NOT to call openCancelReason when order history id doesn"t match orderHistoryMock', () => {
    const orderHistoryId = 1;
    const orderHistoryMock = [
      {
        authorName: 'Kateryna',
        eventDate: '2022-09-11',
        eventName: 'Скасовано',
        id: 3
      }
    ];
    const spy = spyOn(component, 'openCancelReason');
    component.orderHistory = orderHistoryMock;
    component.showPopup(orderHistoryId);
    expect(spy).not.toHaveBeenCalled();
  });

  it('openDialog should be called', () => {
    const spy = spyOn(MatDialogMock.prototype, 'open');
    MatDialogMock.prototype.open();
    expect(spy).toHaveBeenCalled();
  });

  it('openCancelReason should call dialog.open once', () => {
    const spy = spyOn((component as any).dialog, 'open');
    component.orderInfo = OrderInfoMock;
    component.openCancelReason();
    expect(spy).toHaveBeenCalled();
  });

  it('destroy Subject should be closed after ngOnDestroy()', () => {
    (component as any).destroy$ = new Subject<boolean>();
    spyOn((component as any).destroy$, 'next');
    component.ngOnDestroy();
    expect((component as any).destroy$.next).toHaveBeenCalledTimes(1);
  });
});
