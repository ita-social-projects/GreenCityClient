import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UbsUserOrderPaymentPopUpComponent } from './ubs-user-order-payment-pop-up/ubs-user-order-payment-pop-up.component';
import { UbsUserOrderCancelPopUpComponent } from './ubs-user-order-cancel-pop-up/ubs-user-order-cancel-pop-up.component';
import { IOrderInfo } from 'src/app/ubs/ubs-admin/models/ubs-admin.interface';

@Component({
  selector: 'app-ubs-user-orders-list',
  templateUrl: './ubs-user-orders-list.component.html',
  styleUrls: ['./ubs-user-orders-list.component.scss']
})
export class UbsUserOrdersListComponent implements OnInit {
  @Input() orders: IOrderInfo[];

  constructor(public dialog: MatDialog) {}

  public ngOnInit(): void {
    this.sortingOrdersByData();
  }

  public isOrderPaid(order: IOrderInfo): boolean {
    return order.generalOrderInfo.orderPaymentStatus === 'UNPAID';
  }

  public isOrderHalfPaid(order: IOrderInfo): boolean {
    return order.generalOrderInfo.orderPaymentStatus === 'HALF_PAID';
  }

  public isOrderPriceGreaterThenZero(order: IOrderInfo): boolean {
    return order.orderDiscountedPrice > 0;
  }

  public isOrderPaymentAccess(order: IOrderInfo): boolean {
    return this.isOrderPriceGreaterThenZero(order) && (this.isOrderPaid(order) || this.isOrderHalfPaid(order));
  }

  isOrderDone(order: IOrderInfo) {
    return (
      order.generalOrderInfo.orderStatus === 'ON_THE_ROUTE' ||
      order.generalOrderInfo.orderStatus === 'CONFIRMED' ||
      order.generalOrderInfo.orderStatus === 'DONE'
    );
  }

  changeCard(id: number) {
    this.orders.forEach((order) => (order.extend = order.generalOrderInfo.id === id ? !order.extend : false));
  }

  openOrderPaymentDialog(order: IOrderInfo) {
    this.dialog.open(UbsUserOrderPaymentPopUpComponent, {
      data: {
        price: order.orderDiscountedPrice,
        orderId: order.generalOrderInfo.id
      }
    });
  }

  openOrderCancelDialog(order: IOrderInfo) {
    this.dialog.open(UbsUserOrderCancelPopUpComponent, {
      data: {
        orderId: order.generalOrderInfo.id,
        orders: this.orders
      }
    });
  }

  public sortingOrdersByData(): void {
    this.orders.sort((a: IOrderInfo, b: IOrderInfo): number => {
      return a.generalOrderInfo.dateFormed < b.generalOrderInfo.dateFormed ? 1 : -1;
    });
  }
}
