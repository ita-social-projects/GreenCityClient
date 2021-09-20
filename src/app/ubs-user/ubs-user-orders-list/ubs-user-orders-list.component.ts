import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ubs-user-orders-list',
  templateUrl: './ubs-user-orders-list.component.html',
  styleUrls: ['./ubs-user-orders-list.component.scss']
})
export class UbsUserOrdersListComponent {
  @Input()
  orders: any[];

  constructor() {}

  changeCard(id: number) {
    this.orders.map((el) => {
      el.id === id && el.extend ? (el.extend = false) : el.id === id ? (el.extend = true) : (el.extend = el.extend);
    });
  }
}
