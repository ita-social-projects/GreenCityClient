import { Component, Input } from '@angular/core';
import { UserOrdersService } from '../services/user-orders.service';
import { MatDialog } from '@angular/material/dialog';
import { UbsUserOrderPaymentPopUpComponent } from './ubs-user-order-payment-pop-up/ubs-user-order-payment-pop-up.component';
import { UbsUserOrderCancelPopUpComponent } from './ubs-user-order-cancel-pop-up/ubs-user-order-cancel-pop-up.component';
import { IOrderInfo } from 'src/app/ubs-admin/models/ubs-admin.interface';

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
    this.orders.forEach((order) => (order.extend = order.generalOrderInfo.id === id ? !order.extend : false));
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
}
