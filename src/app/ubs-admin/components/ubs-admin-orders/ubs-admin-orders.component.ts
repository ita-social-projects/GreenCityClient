import { AdminOrdersService } from './../../services/admin-orders.service';
import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-ubs-admin-orders',
  templateUrl: './ubs-admin-orders.component.html',
  styleUrls: ['./ubs-admin-orders.component.scss']
})
export class UbsAdminOrdersComponent implements OnInit {
  destroy: Subject<boolean> = new Subject<boolean>();
  orders: any[];
  currentOrders: any[];
  orderHistory: any[];
  orderDetails: any[];
  public currentLanguage: string;

  constructor(private adminOrdersService: AdminOrdersService) {}

  ngOnInit() {
    this.adminOrdersService
      .getOrders()
      .pipe(takeUntil(this.destroy))
      .subscribe((item) => {
        this.orders = item;
        this.currentOrders = this.orders.filter((order) => order.orderStatus === 'FORMED');
        this.orderHistory = this.orders.filter((order) => order.orderStatus === 'CANCELLED');
      });
  }

  changeCard(id) {
    this.currentLanguage = localStorage.getItem('language');

    this.adminOrdersService
      .getOrderDetails(id)
      .pipe(takeUntil(this.destroy))
      .subscribe((item) => {
        this.orderDetails = item.bags.filter((value) => value.code === this.currentLanguage);

        this.orders.map((el) => {
          el.id === id && el.extend ? (el.extend = false) : el.id === id ? (el.extend = true) : (el.extend = el.extend);
        });
      });
  }
}
