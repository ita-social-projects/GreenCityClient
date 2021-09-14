import { ClientOrdersService } from '../../services/admin-orders.service';
import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';

@Component({
  selector: 'app-ubs-client-orders',
  templateUrl: './ubs-client-orders.component.html',
  styleUrls: ['./ubs-client-orders.component.scss']
})
export class UbsClientOrdersComponent implements OnInit {
  destroy: Subject<boolean> = new Subject<boolean>();
  orders: any[];
  currentOrders: any[];
  orderHistory: any[];
  loading = false;
  public currentLanguage: string;
  userId: number;

  constructor(private clientOrdersService: ClientOrdersService, private localStorageService: LocalStorageService) {}

  ngOnInit() {
    this.loading = true;
    this.userId = this.localStorageService.getUserId();
    this.clientOrdersService
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
