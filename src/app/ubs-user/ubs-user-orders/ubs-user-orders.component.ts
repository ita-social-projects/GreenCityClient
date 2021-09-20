import { UserOrdersService } from '../../ubs-user/services/user-orders.service';
import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-ubs-user-orders',
  templateUrl: './ubs-user-orders.component.html',
  styleUrls: ['./ubs-user-orders.component.scss']
})
export class UbsUserOrdersComponent implements OnInit {
  destroy: Subject<boolean> = new Subject<boolean>();
  orders: any[];
  currentOrders: any[];
  orderHistory: any[];
  loading = false;
  userId: number;

  constructor(private userOrdersService: UserOrdersService) {}

  ngOnInit() {
    this.userOrdersService
      .getAllUserOrders()
      .pipe(takeUntil(this.destroy))
      .subscribe(
        (item) => {
          this.orders = item;
          this.currentOrders = this.orders.filter((order) => order.orderStatus !== 'DONE' && order.orderStatus !== 'CANCELLED');
          this.orderHistory = this.orders.filter((order) => order.orderStatus === 'DONE' || order.orderStatus === 'CANCELLED');
          this.loading = false;
        },
        (err: any) => {
          console.log(err);
        }
      );
  }
}
