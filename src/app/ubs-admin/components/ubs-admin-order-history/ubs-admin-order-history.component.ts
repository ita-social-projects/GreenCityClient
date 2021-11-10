import { Component, OnDestroy, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { OrderService } from '../../services/order.service';
import { IOrderHistory } from '../../models/ubs-admin.interface';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-ubs-admin-order-history',
  templateUrl: './ubs-admin-order-history.component.html',
  styleUrls: ['./ubs-admin-order-history.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UbsAdminOrderHistoryComponent implements OnInit, OnDestroy {
  @Input() order;

  private destroy$: Subject<boolean> = new Subject<boolean>();
  pageOpen: boolean;
  orderHistory: IOrderHistory[];
  testHistory: IOrderHistory = {
    authorName: 'someNewValue',
    eventDate: new Date().toString(),
    eventName: ' Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua.',
    id: 777
  };

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.getOrderHistory(this.order.id);
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
        data.push(this.testHistory);
        this.orderHistory = data;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
