import { Component } from '@angular/core';

@Component({
  selector: 'app-ubs-admin-order-payment',
  templateUrl: './ubs-admin-order-payment.component.html',
  styleUrls: ['./ubs-admin-order-payment.component.scss']
})
export class UbsAdminOrderPaymentComponent {
  pageOpen: boolean;

  openDetails() {
    this.pageOpen = !this.pageOpen;
  }
}
