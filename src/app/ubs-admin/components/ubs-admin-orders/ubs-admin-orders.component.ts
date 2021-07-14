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
  orders = [];
  isAnyOrders: boolean;

  constructor(private adminOrdersService: AdminOrdersService) {}

  ngOnInit() {
    this.adminOrdersService
      .getOrders()
      .pipe(takeUntil(this.destroy))
      .subscribe((item) => {
        this.orders = item;
      });
  }

  changeCard(id) {
    this.orders.map((el) => {
      el.id === id && el.extend ? (el.extend = false) : el.id === id ? (el.extend = true) : (el.extend = el.extend);
    });
  }
}
