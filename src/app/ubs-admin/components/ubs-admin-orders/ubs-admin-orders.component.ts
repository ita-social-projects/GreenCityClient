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
  loading = false;
  public currentLanguage: string;

  constructor(private adminOrdersService: AdminOrdersService) {}

  ngOnInit() {
    this.loading = true;
    this.adminOrdersService
      .getOrders()
      .pipe(takeUntil(this.destroy))
      .subscribe((item) => {
        this.orders = item;
        this.currentOrders = this.orders.filter((order) => order.orderStatus === 'FORMED');
        this.orderHistory = this.orders.filter((order) => order.orderStatus === 'CANCELLED');
        this.loading = false;
      });
  }
}
