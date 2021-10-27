import { Component, Input, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-ubs-admin-order-status',
  templateUrl: './ubs-admin-order-status.component.html',
  styleUrls: ['./ubs-admin-order-status.component.scss']
})
export class UbsAdminOrderStatusComponent implements OnDestroy {
  @Input() order;
  @Input() orderStatusForm: FormGroup;

  constructor(public orderService: OrderService) {}
  private destroy$: Subject<boolean> = new Subject<boolean>();

  onChangedOrderStatus(statusName) {
    this.orderService.setSelectedOrderStatus(statusName);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
