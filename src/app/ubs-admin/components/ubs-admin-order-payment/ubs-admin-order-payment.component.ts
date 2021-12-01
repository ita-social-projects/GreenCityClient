import { Component, Input, OnInit } from '@angular/core';
import { IPaymentInfo, IPaymentInfoDtos } from '../../models/ubs-admin.interface';

@Component({
  selector: 'app-ubs-admin-order-payment',
  templateUrl: './ubs-admin-order-payment.component.html',
  styleUrls: ['./ubs-admin-order-payment.component.scss']
})
export class UbsAdminOrderPaymentComponent implements OnInit {
  @Input() orderInfo;
  paidAmount: number;
  unPaidAmount: number;
  pageOpen: boolean;
  paymentInfo: IPaymentInfo;
  paymentsArray: IPaymentInfoDtos[];

  ngOnInit() {
    this.paymentInfo = this.orderInfo.paymentTableInfoDto;
    this.paymentsArray = this.orderInfo.paymentTableInfoDto.paymentInfoDtos;
    this.paidAmount = this.paymentInfo.paidAmount;
    this.unPaidAmount = this.paymentInfo.unPaidAmount;
  }

  openDetails() {
    this.pageOpen = !this.pageOpen;
  }
}
