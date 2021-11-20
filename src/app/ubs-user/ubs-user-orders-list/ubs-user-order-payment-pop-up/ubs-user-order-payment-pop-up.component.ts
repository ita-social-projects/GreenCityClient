import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/main/component/ubs/services/order.service';

@Component({
  selector: 'app-ubs-user-order-payment-pop-up',
  templateUrl: './ubs-user-order-payment-pop-up.component.html',
  styleUrls: ['./ubs-user-order-payment-pop-up.component.scss']
})
export class UbsUserOrderPaymentPopUpComponent implements OnInit {
  public totalSum: number = 0.0;
  public bonusValue: number = 0.0;
  public selectedRadio: string = 'no';
  public certificatePattern: object = /(?!0000)\d{4}-(?!0000)\d{4}/;
  public certificateMask: string = '0000-0000';

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {}

  public radioChange(e) {
    console.log(this.selectedRadio);
    console.log(e);
  }
}
