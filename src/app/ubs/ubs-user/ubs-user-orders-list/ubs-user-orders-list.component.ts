import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UbsUserOrderPaymentPopUpComponent } from './ubs-user-order-payment-pop-up/ubs-user-order-payment-pop-up.component';
import { UbsUserOrderCancelPopUpComponent } from './ubs-user-order-cancel-pop-up/ubs-user-order-cancel-pop-up.component';
import { IUserOrderInfo, CheckPaymentStatus } from './models/UserOrder.interface';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-ubs-user-orders-list',
  templateUrl: './ubs-user-orders-list.component.html',
  styleUrls: ['./ubs-user-orders-list.component.scss']
})
export class UbsUserOrdersListComponent implements OnInit, OnDestroy {
  @Input() orders: IUserOrderInfo[];
  @Input() bonuses: number;

  public currentLanguage: string;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(public dialog: MatDialog, private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.currentLanguage = this.localStorageService.getCurrentLanguage();
    this.localStorageService.languageSubject.pipe(takeUntil(this.destroy$)).subscribe((lang: string) => {
      this.currentLanguage = lang;
    });
    this.sortingOrdersByData();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  public isOrderPaid(order: IUserOrderInfo): boolean {
    return order.paymentStatusEng === CheckPaymentStatus.UNPAID;
  }

  public isOrderHalfPaid(order: IUserOrderInfo): boolean {
    return order.paymentStatusEng === CheckPaymentStatus.HALFPAID;
  }

  public isOrderPriceGreaterThenZero(order: IUserOrderInfo): boolean {
    return order.orderFullPrice > 0;
  }

  public isOrderPaymentAccess(order: IUserOrderInfo): boolean {
    return this.isOrderPriceGreaterThenZero(order) && (this.isOrderPaid(order) || this.isOrderHalfPaid(order));
  }

  public changeCard(id: number): void {
    this.orders.forEach((order) => (order.extend = order.id === id ? !order.extend : false));
  }

  public openOrderPaymentDialog(order: IUserOrderInfo): void {
    this.dialog.open(UbsUserOrderPaymentPopUpComponent, {
      data: {
        orderId: order.id,
        price: order.orderFullPrice,
        bonuses: this.bonuses
      }
    });
  }

  public openOrderCancelDialog(order: IUserOrderInfo): void {
    this.dialog.open(UbsUserOrderCancelPopUpComponent, {
      data: {
        orderId: order.id,
        orders: this.orders
      }
    });
  }

  public sortingOrdersByData(): void {
    this.orders.sort((a: IUserOrderInfo, b: IUserOrderInfo): number => {
      return a.dateForm < b.dateForm ? 1 : -1;
    });
  }
}
