import { AdminOrdersService } from './../../services/admin-orders.service';
import { Component, Input, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-ubs-admin-orders-list',
  templateUrl: './ubs-admin-orders-list.component.html',
  styleUrls: ['./ubs-admin-orders-list.component.scss']
})
export class UbsAdminOrdersListComponent {
  destroy: Subject<boolean> = new Subject<boolean>();

  @Input()
  orders: any[];
  orderDetails: any[];
  public currentLanguage: string;

  constructor(private adminOrdersService: AdminOrdersService) {}

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
