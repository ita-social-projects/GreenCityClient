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
  @Input() currentOrderPrice: number;
  @Input() orderStatusForm: FormGroup;
  @Input() totalPaid: number;
  @Input() generalOrderInfo: IGeneralOrderInfo;
  @Output() changedOrderStatus = new EventEmitter<string>();

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
    this.changedOrderStatus.emit(statusName);
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
          this.onChangedOrderStatus(this.generalOrderInfo.orderStatus);
          this.orderStatusForm.get('orderStatus').setValue(this.generalOrderInfo.orderStatus);
          return;
        }
        this.orderStatusForm.get('cancellationReason').setValue(res.reason);
        if (res.reason === 'OTHER') {
          this.orderStatusForm.get('cancellationComment').setValue(res.comment);
        }
      });
  }

  public setOrderPaymentStatus(status: string) {
    let orderState: string;
    this.generalOrderInfo.orderStatusesDtos.find((status) => {
      if (status.key === this.generalOrderInfo.orderStatus) {
        orderState = status.ableActualChange ? 'actual' : 'confirmed';
      }
    });

    if (orderState === 'confirmed') {
      const confirmedPaidCondition1 = this.currentOrderPrice > 0 && this.totalPaid > 0 && this.currentOrderPrice <= this.totalPaid;
      const confirmedPaidCondition2 = this.currentOrderPrice === 0 && this.totalPaid >= 0 && this.currentOrderPrice <= this.totalPaid;
      let confirmedPaidCondition = confirmedPaidCondition1 || confirmedPaidCondition2;

      const confirmedUnpaidCondition = this.currentOrderPrice > 0 && this.totalPaid === 0;
      const confirmedHalfPaidCondition = this.currentOrderPrice > 0 && this.totalPaid > 0 && this.currentOrderPrice > this.totalPaid;

      if (confirmedPaidCondition) {
        this.generalOrderInfo.orderPaymentStatusName = 'PAID';
        return this.generalOrderInfo.orderPaymentStatusName === status;
      }

      if (confirmedUnpaidCondition) {
        this.generalOrderInfo.orderPaymentStatusName = 'UNPAID';
        return this.generalOrderInfo.orderPaymentStatusName === status;
      }

      if (confirmedHalfPaidCondition) {
        this.generalOrderInfo.orderPaymentStatusName = 'HALF_PAID';
        return this.generalOrderInfo.orderPaymentStatusName === status;
      }
    } else if (orderState === 'actual') {
      const actualPaidCondition1 = this.currentOrderPrice > 0 && this.totalPaid > 0 && this.currentOrderPrice <= this.totalPaid;
      const actualPaidCondition2 = this.currentOrderPrice === 0 && this.totalPaid >= 0 && this.currentOrderPrice <= this.totalPaid;
      let actualPaidCondition = actualPaidCondition1 || actualPaidCondition2;

      const actualUnpaidCondition = this.currentOrderPrice === 0 && this.totalPaid === 0;
      const actualHalfPaidCondition = this.currentOrderPrice > 0 && this.totalPaid >= 0 && this.currentOrderPrice > this.totalPaid;

      if (actualPaidCondition) {
        this.generalOrderInfo.orderPaymentStatusName = 'PAID';
        return this.generalOrderInfo.orderPaymentStatusName === status;
      }

      if (actualUnpaidCondition) {
        this.generalOrderInfo.orderPaymentStatusName = 'UNPAID';
        return this.generalOrderInfo.orderPaymentStatusName === status;
      }

      if (actualHalfPaidCondition) {
        this.generalOrderInfo.orderPaymentStatusName = 'HALF_PAID';
        return this.generalOrderInfo.orderPaymentStatusName === status;
      }

      // TODO: PAYMENT_REFUNDED CASE
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
