import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UbsUserOrderPaymentPopUpComponent } from './ubs-user-order-payment-pop-up/ubs-user-order-payment-pop-up.component';
import { UbsUserOrderCancelPopUpComponent } from './ubs-user-order-cancel-pop-up/ubs-user-order-cancel-pop-up.component';
import { IUserOrderInfo, CheckPaymentStatus } from './models/UserOrder.interface';

@Component({
  selector: 'app-ubs-user-orders-list',
  templateUrl: './ubs-user-orders-list.component.html',
  styleUrls: ['./ubs-user-orders-list.component.scss']
})
export class UbsUserOrdersListComponent implements OnInit {
  @Input() orders: IUserOrderInfo[];
  @Input() bonuses: number;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.sortingOrdersByData();
  }

  public isOrderPaid(order: IUserOrderInfo): boolean {
    return order.paymentStatus === CheckPaymentStatus.UNPAID;
  }

  public isOrderHalfPaid(order: IUserOrderInfo): boolean {
    return order.paymentStatus === CheckPaymentStatus.HALFPAID;
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
