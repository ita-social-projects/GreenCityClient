import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { IPaymentInfo, IPaymentInfoDtos, IOrderInfo } from '../../models/ubs-admin.interface';
import { OrderService } from '../../services/order.service';
import { AddPaymentComponent } from '../add-payment/add-payment.component';

@Component({
  selector: 'app-ubs-admin-order-payment',
  templateUrl: './ubs-admin-order-payment.component.html',
  styleUrls: ['./ubs-admin-order-payment.component.scss']
})
export class UbsAdminOrderPaymentComponent implements OnInit, OnChanges {
  message: string;
  pageOpen: boolean;
  @Input() overpayment: number;
  @Input() orderInfo: IOrderInfo;
  @Input() actualPrice: number;
  @Input() totalPaid: number;
  orderId: number;
  paidAmount: number;
  unPaidAmount: number;
  paymentInfo: IPaymentInfo;
  paymentsArray: IPaymentInfoDtos[];

  ngOnInit() {
    this.orderId = this.orderInfo.generalOrderInfo.id;
    this.paymentInfo = this.orderInfo.paymentTableInfoDto;
    this.paymentsArray = this.orderInfo.paymentTableInfoDto.paymentInfoDtos;
    this.paidAmount = this.paymentInfo.paidAmount;
    this.unPaidAmount = this.paymentInfo.unPaidAmount;
  }

  constructor(private orderService: OrderService, private dialog: MatDialog) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.overpayment) {
      this.message = this.orderService.getOverpaymentMsg(this.overpayment);
      this.overpayment = Math.abs(this.overpayment);
    }
  }

  openDetails() {
    this.pageOpen = !this.pageOpen;
  }

  openPopup(viewMode: boolean, paymentIndex?: number) {
    this.dialog
      .open(AddPaymentComponent, {
        hasBackdrop: true,
        panelClass: 'custom-dialog-container',
        data: {
          orderId: this.orderInfo.generalOrderInfo.id,
          viewMode,
          payment: viewMode ? this.paymentsArray[paymentIndex] : null
        }
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((res: IPaymentInfoDtos | number | null) => {
        if (typeof res === 'number') {
          this.paymentsArray = this.paymentsArray.filter((payment) => payment.id !== res);
        }
        if (res !== null && typeof res === 'object') {
          this.paymentsArray = this.paymentsArray.filter((payment) => payment.id === res.id).length
            ? this.paymentsArray.map((payment) => (payment.id === res.id ? res : payment))
            : [...this.paymentsArray, res];
        }
      });
  }
}
