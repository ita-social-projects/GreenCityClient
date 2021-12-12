import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { IPaymentInfo, IPaymentInfoDtos, IOrderInfo } from '../../models/ubs-admin.interface';
import { OrderService } from '../../services/order.service';

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

  constructor(private orderService: OrderService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.overpayment) {
      this.message = this.orderService.getOverpaymentMsg(this.overpayment);
      this.overpayment = Math.abs(this.overpayment);
    }
  }

  openDetails() {
    this.pageOpen = !this.pageOpen;
  }
}
