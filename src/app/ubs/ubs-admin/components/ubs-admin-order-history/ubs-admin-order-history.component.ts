import { Component, OnDestroy, Input, ViewEncapsulation, SimpleChanges, OnChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { OrderService } from '../../services/order.service';
import { IOrderHistory, IOrderInfo } from '../../models/ubs-admin.interface';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { AddOrderCancellationReasonComponent } from '../add-order-cancellation-reason/add-order-cancellation-reason.component';

@Component({
  selector: 'app-ubs-admin-order-history',
  templateUrl: './ubs-admin-order-history.component.html',
  styleUrls: ['./ubs-admin-order-history.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UbsAdminOrderHistoryComponent implements OnDestroy, OnChanges {
  @Input() orderInfo: IOrderInfo;

  private destroy$: Subject<boolean> = new Subject<boolean>();
  pageOpen: boolean;
  orderHistory: IOrderHistory[];
  public isHistory = true;
  public cancellationReason: string;
  public cancellationComment: string;

  constructor(private orderService: OrderService, private dialog: MatDialog) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.orderInfo) {
      this.getOrderHistory(this.orderInfo.generalOrderInfo.id);
    }
  }

  openDetails() {
    this.pageOpen = !this.pageOpen;
  }

  showPopup() {
    const selection = getSelection();
    const charClicked = (selection.focusNode as any).data;
    if (charClicked.includes('Скасовано')) {
      this.openCancelReason();
    }
  }

  openCancelReason() {
    this.orderService
      .getOrderCancelReason(this.orderInfo.generalOrderInfo.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((message) => {
        this.cancellationReason = message.cancellationReason;
        this.cancellationComment = message.cancellationComment;
      });
    this.dialog.open(AddOrderCancellationReasonComponent, {
      hasBackdrop: true,
      data: {
        orderInfo: this.orderInfo,
        isHistory: this.isHistory,
        isCancellationReason: this.cancellationReason,
        cancellationComment: this.cancellationComment
      }
    });
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
