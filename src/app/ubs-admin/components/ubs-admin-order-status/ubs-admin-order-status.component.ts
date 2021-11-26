import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { IGeneralOrderInfo } from '../../models/ubs-admin.interface';
import { OrderService } from '../../services/order.service';
import { MatDialog } from '@angular/material/dialog';
import { AddOrderCancellationReasonComponent } from '../add-order-cancellation-reason/add-order-cancellation-reason.component';

@Component({
  selector: 'app-ubs-admin-order-status',
  templateUrl: './ubs-admin-order-status.component.html',
  styleUrls: ['./ubs-admin-order-status.component.scss']
})
export class UbsAdminOrderStatusComponent implements OnInit, OnDestroy {
  @Input() orderStatusForm: FormGroup;
  @Input() generalOrderInfo: IGeneralOrderInfo;
  @Output() changed = new EventEmitter<string>();

  constructor(public orderService: OrderService, private dialog: MatDialog) {}
  private destroy$: Subject<boolean> = new Subject<boolean>();

  public availableOrderStatuses;

  ngOnInit() {
    this.availableOrderStatuses = this.orderService.getAvailableOrderStatuses(
      this.generalOrderInfo.orderStatus,
      this.generalOrderInfo.orderStatusesDtos
    );
  }

  onChangedOrderStatus(statusName: string) {
    this.changed.emit(statusName);
    if (statusName === 'CANCELED') {
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
      .subscribe((res) => {
        if (res.action === 'cancel') {
          this.orderStatusForm.get('orderStatus').setValue(this.generalOrderInfo.orderStatus);
          return;
        }
        this.orderStatusForm.get('cancellationReason').setValue(res.reason);
        if (res.reason === 'OTHER') {
          this.orderStatusForm.get('cancellationComment').setValue(res.comment);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
