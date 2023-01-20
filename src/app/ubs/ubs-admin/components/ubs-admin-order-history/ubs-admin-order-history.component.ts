import { Component, OnDestroy, Input, ViewEncapsulation, SimpleChanges, OnChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { OrderService } from '../../services/order.service';
import { IOrderHistory, IOrderInfo } from '../../models/ubs-admin.interface';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-ubs-admin-order-history',
  templateUrl: './ubs-admin-order-history.component.html',
  styleUrls: ['./ubs-admin-order-history.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UbsAdminOrderHistoryComponent implements OnDestroy, OnChanges {
  @Input() orderId: number;
  @Input() orderInfo: IOrderInfo;

  private destroy$: Subject<boolean> = new Subject<boolean>();
  pageOpen: boolean;
  orderHistory: IOrderHistory[];

  constructor(private orderService: OrderService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.orderInfo) {
      this.getOrderHistory(this.orderId);
    }
  }

  openDetails() {
    this.pageOpen = !this.pageOpen;
  }

  showPopup(element: any, popup: any) {
    if (element.target.offsetWidth < element.target.scrollWidth) {
      popup.toggle();
    }
  }

  getOrderHistory(orderId: number) {
    this.orderService
      .getOrderHistory(orderId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: IOrderHistory[]) => {
        this.orderHistory = data;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
