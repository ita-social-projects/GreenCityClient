import { Component, Input } from '@angular/core';
import { UserOrdersService } from '../services/user-orders.service';
import { MatDialog } from '@angular/material/dialog';
import { UbsUserOrderPaymentPopUpComponent } from './ubs-user-order-payment-pop-up/ubs-user-order-payment-pop-up.component';

@Component({
  selector: 'app-ubs-user-orders-list',
  templateUrl: './ubs-user-orders-list.component.html',
  styleUrls: ['./ubs-user-orders-list.component.scss']
})
export class UbsUserOrdersListComponent {
  @Input() orders: any[];

  constructor(private userOrdersService: UserOrdersService, public dialog: MatDialog) {}

  isOrderFormed(order: any) {
    return order.generalOrderInfo.orderStatus === 'FORMED';
  }

  isOrderUnpaid(order: any) {
    return order.generalOrderInfo.orderStatus === 'DONE_UNPAID' || order.generalOrderInfo.orderStatus === 'FORMED';
  }

  isOrderDone(order: any) {
    return (
      order.generalOrderInfo.orderStatus === 'ON_THE_ROUTE' ||
      order.generalOrderInfo.orderStatus === 'CONFIRMED' ||
      order.generalOrderInfo.orderStatus === 'DONE'
    );
  }

  changeCard(id: number) {
    this.orders.forEach((order) => {
      if (order.generalOrderInfo.id === id) {
        order.extend = !order.extend;
      }
    });
  }

  deleteCard(orderId: number) {
    this.userOrdersService.deleteOrder(orderId).subscribe();
    for (let i = 0; i < this.orders.length; i++) {
      if (this.orders[i].generalOrderInfo.id === orderId) {
        this.orders.splice(i, 1);
        break;
      }
    }
  }

  openOrderPaymentDialog(order: any) {
    this.dialog.open(UbsUserOrderPaymentPopUpComponent, {
      data: {
        price: order.orderDiscountedPrice,
        orderId: order.generalOrderInfo.id
      }
    });
  }
}
