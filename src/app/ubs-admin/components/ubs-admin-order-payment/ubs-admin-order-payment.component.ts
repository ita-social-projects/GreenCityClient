import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

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
  OVERPAYMENT_MESSAGE = 'order-payment.overpayment';
  UNDERPAYMENT_MESSAGE = 'order-payment.underpayment';

  ngOnChanges(changes: SimpleChanges) {
    if (changes.overpayment) {
      if (this.overpayment > 0) {
        this.message = this.OVERPAYMENT_MESSAGE;
      } else if (this.overpayment < 0) {
        this.message = this.UNDERPAYMENT_MESSAGE;
      }
      this.overpayment = Math.abs(this.overpayment);
    }
  }

  ngOnInit() {}

  openDetails() {
    this.pageOpen = !this.pageOpen;
  }
}
