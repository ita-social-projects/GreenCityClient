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
  totalPaidWithoutBonus: number;
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
    this.totalPaidWithoutBonus = this.orderInfo.orderCertificateTotalDiscount;
    this.totalPaidWithoutBonus += this.orderInfo.paymentTableInfoDto.paidAmount;
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

  setOverpayment(overpayment: number): void {
    this.message = this.orderService.getOverpaymentMsg(overpayment);
    this.overpayment = Math.abs(overpayment);
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
          this.paymentsArray = this.paymentsArray.filter((payment) => {
            if (payment.id === res) {
              this.totalPaid -= payment.amount;
              this.setOverpayment(this.totalPaid - this.actualPrice);
            }
            return payment.id !== res;
          });
        }
        if (res !== null && typeof res === 'object') {
          if (this.paymentsArray.filter((payment) => payment.id === res.id).length) {
            this.paymentsArray = this.paymentsArray.map((payment) => {
              if (payment.id === res.id) {
                this.totalPaid = this.totalPaid - payment.amount + res.amount;
                return res;
              }
              return payment;
            });
          } else {
            this.totalPaid += res.amount;
            this.paymentsArray = [...this.paymentsArray, res];
          }
          this.setOverpayment(this.totalPaid - this.actualPrice);
        }
      });
  }
}
