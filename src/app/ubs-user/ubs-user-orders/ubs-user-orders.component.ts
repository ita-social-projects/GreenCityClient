import { UserOrdersService } from '../../ubs-user/services/user-orders.service';
import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';

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
  public currentLanguage: string;
  userId: number;

  constructor(private userOrdersService: UserOrdersService, private localStorageService: LocalStorageService) {}

  ngOnInit() {
    this.loading = true;
    this.userId = this.localStorageService.getUserId();
    this.userOrdersService
      .getAllUserOrders(this.userId)
      .pipe(takeUntil(this.destroy))
      .subscribe((item) => {
        this.orders = item;
        this.currentOrders = this.orders.filter((order) => order.orderStatus !== 'DONE');
        this.orderHistory = this.orders.filter((order) => order.orderStatus === 'DONE');
        this.loading = false;
      });
  }
}
