import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ubs-user-order-payment-pop-up',
  templateUrl: './ubs-user-order-payment-pop-up.component.html',
  styleUrls: ['./ubs-user-order-payment-pop-up.component.scss']
})
export class UbsUserOrderPaymentPopUpComponent implements OnInit {
  public selectedRadio = 'no';
  public certificatePattern = /(?!0000)\d{4}-(?!0000)\d{4}/;
  public certificateMask = '0000-0000';

  constructor() {}

  ngOnInit(): void {}

  public radioChange(e) {
    console.log(this.selectedRadio);
    console.log(e);
  }
}
