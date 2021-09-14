import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ubs-client-orders-list',
  templateUrl: './ubs-client-orders-list.component.html',
  styleUrls: ['./ubs-client-orders-list.component.scss']
})
export class UbsClientOrdersListComponent {
  @Input()
  orders: any[];

  constructor() {}

  changeCard(id) {
    this.orders.map((el) => {
      el.id === id && el.extend ? (el.extend = false) : el.id === id ? (el.extend = true) : (el.extend = el.extend);
    });
  }
}
