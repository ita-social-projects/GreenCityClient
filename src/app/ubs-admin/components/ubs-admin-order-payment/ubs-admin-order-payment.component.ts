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
  @Input() paidPrice: number;
  @Input() overpayment: number;
  @Input() orderInfo: IOrderInfo;
  @Input() actualPrice: number;
  paidAmount: number;
  unPaidAmount: number;
  paymentInfo: IPaymentInfo;
  paymentsArray: IPaymentInfoDtos[];

  ngOnInit() {
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

  openPopup() {
    this.dialog
      .open(AddPaymentComponent, {
        hasBackdrop: true,
        data: this.orderInfo.generalOrderInfo.id
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((res) => {
        console.log(res);
      });
  }
}
