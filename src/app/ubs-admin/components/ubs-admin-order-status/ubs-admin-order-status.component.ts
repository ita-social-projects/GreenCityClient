import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-ubs-admin-order-status',
  templateUrl: './ubs-admin-order-status.component.html',
  styleUrls: ['./ubs-admin-order-status.component.scss']
})
export class UbsAdminOrderStatusComponent implements OnInit, OnDestroy {
  @Input() order;
  @Input() orderStatusForm: FormGroup;

  constructor(public orderService: OrderService) {}
  private destroy$: Subject<boolean> = new Subject<boolean>();
  public availableOrderStatuses;

  ngOnInit() {
    this.availableOrderStatuses = this.orderService.getAvailableOrderStatuses(this.order.orderStatus);
  }

  onChangedOrderStatus(statusName) {
    this.orderService.setSelectedOrderStatus(statusName);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
