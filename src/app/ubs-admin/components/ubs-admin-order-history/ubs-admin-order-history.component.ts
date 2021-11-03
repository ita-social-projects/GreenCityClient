import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { OrderService } from '../../services/order.service';
import { IOrderHistory } from '../../models/ubs-admin.interface';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-ubs-admin-order-history',
  templateUrl: './ubs-admin-order-history.component.html',
  styleUrls: ['./ubs-admin-order-history.component.scss']
})
export class UbsAdminOrderHistoryComponent implements OnInit, OnDestroy {
  @Input() order;

  private destroy$: Subject<boolean> = new Subject<boolean>();
  pageOpen: boolean;
  orderHistory;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.getOrderHistory(this.order.id);
  }

  openDetails() {
    this.pageOpen = !this.pageOpen;
  }

  getOrderHistory(orderId: number) {
    this.orderService
      .getOrderHistory(orderId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: IOrderHistory) => {
        this.orderHistory = data;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
