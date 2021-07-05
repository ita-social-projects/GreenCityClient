import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ubs-admin-orders',
  templateUrl: './ubs-admin-orders.component.html',
  styleUrls: ['./ubs-admin-orders.component.scss']
})
export class UbsAdminOrdersComponent implements OnInit {
  orders = [
    {
      id: 1,
      order: 11111,
      status: 'Оплачено',
      sum: '300 грн',
      extend: false
    },
    {
      id: 2,
      order: 2222222222,
      status: 'Неоплачено',
      sum: '132200 грн',
      extend: false
    },
    {
      id: 3,
      order: 3333333333,
      status: 'Виконано/Неоплачено',
      sum: '12220000 грн',
      extend: false
    },
    {
      id: 4,
      order: 4444444444,
      status: 'Оплачено',
      sum: '500 грн',
      extend: false
    },
    {
      id: 5,
      order: 5555555555,
      status: 'Неоплачено Оплачено',
      sum: '100 грн',
      extend: false
    }
  ];

  constructor() {}

  ngOnInit() {}

  changeCard(id) {
    this.orders.map((el) => {
      el.id === id && el.extend ? (el.extend = false) : el.id === id ? (el.extend = true) : el.extend;
    });
  }
}
