import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ubs-user-order-payment-pop-up',
  templateUrl: './ubs-user-order-payment-pop-up.component.html',
  styleUrls: ['./ubs-user-order-payment-pop-up.component.scss']
})
export class UbsUserOrderPaymentPopUpComponent implements OnInit {
  constructor() {}

  public selectedRadio = 'no';

  public radioChange(e) {
    console.log(this.selectedRadio);
    console.log(e);
  }

  ngOnInit(): void {}
}
