import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
export class UbsAdminOrderStatusComponent implements OnInit {
  @Input() order;
  @Input() orderStatusForm: FormGroup;
  @Output() changed = new EventEmitter<string>();

  constructor(public orderService: OrderService, private dialog: MatDialog) {}
  private destroy$: Subject<boolean> = new Subject<boolean>();

  public availableOrderStatuses;
  cancellationReason;
  cancellationComment;

  ngOnInit() {
    this.availableOrderStatuses = this.orderService.getAvailableOrderStatuses(this.order.orderStatus);
  }

  onChangedOrderStatus(statusName: string) {
    this.changed.emit(statusName);
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
      .subscribe((value) => {
        this.cancellationReason = value;
        if ((this.cancellationReason = 'OTHER')) {
          this.cancellationComment = '';
        }
        console.log(this.cancellationReason);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
