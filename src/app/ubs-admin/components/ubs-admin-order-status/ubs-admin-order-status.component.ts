import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
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
  @Output() onChangedOrderStatus = new EventEmitter<any>();

  constructor(public orderService: OrderService) {}
  private destroy$: Subject<boolean> = new Subject<boolean>();

  onOrdrSttsChng(statusName) {
    const status = this.orderService.orderStatuses.filter((status) => status.name === statusName);
    console.log(...status);
    this.onChangedOrderStatus.emit(...status);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
