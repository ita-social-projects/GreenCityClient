import { Component, Input, OnInit } from '@angular/core';
import { IUserOrderInfo, PaymentStatusEn } from '../ubs-user-orders-list/models/UserOrder.interface';

@Component({
  selector: 'app-ubs-user-order-details',
  templateUrl: './ubs-user-order-details.component.html',
  styleUrls: ['./ubs-user-order-details.component.scss']
})
export class UbsUserOrderDetailsComponent implements OnInit {
  @Input() order: IUserOrderInfo;

  certificatesAmount: number;

  ngOnInit(): void {
    this.certificatesAmount = this.order.certificate.reduce((acc, item) => acc + item.points, 0);
  }

  isPaid(order: IUserOrderInfo): boolean {
    return order.paymentStatus === PaymentStatusEn.PAID;
  }
}
