import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ubs-user-orders-list',
  templateUrl: './ubs-user-orders-list.component.html',
  styleUrls: ['./ubs-user-orders-list.component.scss']
})
export class UbsUserOrdersListComponent {
  @Input()
  orders: any[];

  isOrderFormed(order: any) {
    return order.orderStatus === 'FORMED';
  }

  isOrderUnpaid(order: any) {
    return order.orderStatus === 'DONE_UNPAID' || order.orderStatus === 'FORMED';
  }

  isOrderDone(order: any) {
    return order.orderStatus === 'ON_THE_ROUTE' || order.orderStatus === 'CONFIRMED' || order.orderStatus === 'DONE';
  }

  changeCard(id: number) {
    this.orders.forEach((order) => {
      if (order.id === id) {
        order.extend = !order.extend;
      }
    });
  }
}
