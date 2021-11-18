import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { OrderService } from '../../services/order.service';
import { MatDialog } from '@angular/material/dialog';
import { AddOrderCancellationReasonComponent } from '../../add-order-cancellation-reason/add-order-cancellation-reason.component';

@Component({
  selector: 'app-ubs-admin-order-status',
  templateUrl: './ubs-admin-order-status.component.html',
  styleUrls: ['./ubs-admin-order-status.component.scss']
})
export class UbsAdminOrderStatusComponent implements OnInit, OnDestroy {
  @Input() order;
  @Input() orderStatusForm: FormGroup;

  constructor(public orderService: OrderService, private dialog: MatDialog) {}
  private destroy$: Subject<boolean> = new Subject<boolean>();
  public availableOrderStatuses;

  ngOnInit() {
    this.availableOrderStatuses = this.orderService.getAvailableOrderStatuses(this.order.orderStatus);
  }

  onChangedOrderStatus(statusName) {
    this.orderService.setSelectedOrderStatus(statusName);
    if (statusName === 'CANCELLED') {
      this.openPopup();
    }
  }

  openPopup() {
    this.dialog
      .open(AddOrderCancellationReasonComponent, {
        hasBackdrop: true
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((discarded) => {
        console.log('oooooo');
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
