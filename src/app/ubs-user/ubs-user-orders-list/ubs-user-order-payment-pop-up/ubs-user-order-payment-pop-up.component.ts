import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  public certificatePattern = /(?!0000)\d{4}-(?!0000)\d{4}/;
  public certificateMask: string = '0000-0000';
  public orderDetailsForm: FormGroup;

  constructor(private fb: FormBuilder, private orderService: OrderService) {}

  ngOnInit(): void {
    this.initForm();
  }

  public initForm() {
    this.orderDetailsForm = this.fb.group({
      bonus: new FormControl('no', [Validators.required]),
      paymentSystem: new FormControl('Fondy', [Validators.required]),
      orderSum: new FormControl(0, [Validators.required, Validators.min(0)]),
      certificate: ['', [Validators.required, Validators.minLength(8), Validators.pattern(this.certificatePattern)]]
    });
  }

  public radioChange(e) {
    console.log(this.selectedRadio);
    console.log(e);
  }
}
