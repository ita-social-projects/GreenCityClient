import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
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

  constructor(private orderService: OrderService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.overpayment) {
      this.message = this.orderService.getOverpaymentMsg(this.overpayment);
      this.overpayment = Math.abs(this.overpayment);
    }
  }

  ngOnInit() {}

  openDetails() {
    this.pageOpen = !this.pageOpen;
  }
}
