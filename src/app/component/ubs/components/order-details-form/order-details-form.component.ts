import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IOrder } from './order.interface';
import { Order } from './order.model';
import { passwordValidator } from './password-validator';
import { wrongAmountValidator } from './shared/form-validator';

@Component({
  selector: 'app-order-details-form',
  templateUrl: './order-details-form.component.html',
  styleUrls: ['./order-details-form.component.scss']
})

export class OrderDetailsFormComponent implements OnInit {
  orderDetailsForm: FormGroup;
  total: number;
  displayMes: boolean = false;
  displayCert: boolean = false;
  displayShop: boolean = false;
  subBtn: boolean = true;
  order: {};

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.orderDetailsForm = this.fb.group({
      bagServiceUbs: [],
      // bagNumUbs: [0, [Validators.required, Validators.minLength(2), wrongAmountValidator]],
      bagNumUbs: [0],
      bagSizeUbs: ['120 л (250 грн)'],
      bagPriceUbs: [''],
      bagServiceClothesXL: [],
      bagNumClothesXL: [0, Validators.required],
      bagSizeClothesXL: ['120 л (300 грн)'],
      bagPriceClothesXL: [''],
      bagServiceClothesM: [],
      bagNumClothesM: [0],
      bagSizeClothesM: ['35 л (150 грн)'],
      bagPriceClothesM: [''],
      certificate: [],
      additionalOrder: [''],
      orderComment: [],
      password: [''],
      confirmPassword: [''],
      bonus: ['no'],
      shop: ['no']
    }, {validator: passwordValidator});

    //  console.log(this.orderDetailsForm.controls);

     this.orderDetailsForm.get('bonus').valueChanges
    // this.orderDetailsForm.controls.bonus.valueChanges
    .subscribe(checkedValue => {
      const certificate = this.orderDetailsForm.get('certificate');
      if (checkedValue==='yes') {
        certificate.setValidators(Validators.required);
        this.displayCert = true;
      } else {
        certificate.clearValidators();
        this.displayCert = false;
      }
      certificate.updateValueAndValidity();
    })

      this.orderDetailsForm.get('shop').valueChanges.
      subscribe(checkedValue => {
      const additionalOrder = this.orderDetailsForm.get('additionalOrder');
      if (checkedValue==='yes') {
        additionalOrder.setValidators(Validators.required);
        this.displayShop = true;
      } else {
        additionalOrder.clearValidators();
        this.displayShop = false;
      }
    })
  }


  calc() {
    this.orderDetailsForm.patchValue({
      bagPriceUbs: this.orderDetailsForm.value.bagNumUbs * 250,
      bagPriceClothesXL: this.orderDetailsForm.value.bagNumClothesXL * 300,
      bagPriceClothesM: this.orderDetailsForm.value.bagNumClothesM * 150
    });
    this.total = this.orderDetailsForm.value.bagNumUbs * 250 + this.orderDetailsForm.value.bagNumClothesXL * 300 +
      this.orderDetailsForm.value.bagNumClothesM * 150;
    if (this.total < 500) {
      this.displayMes = true;
      this.subBtn = true;
    } else {this.displayMes = false; this.subBtn = false;}
  }

  addOrder() {
    let ubs = Object.assign({id: 1, amount: this.orderDetailsForm.value.bagNumUbs});
    let clothesXL = Object.assign({id: 2, amount: this.orderDetailsForm.value.bagNumClothesXL});
    let clothesM = Object.assign({id: 3, amount: this.orderDetailsForm.value.bagNumClothesM})

    console.log(ubs, clothesXL, clothesM);

    const newOrder: IOrder = new Order([ubs, clothesXL, clothesM],
                                       1000,
                                       this.orderDetailsForm.value.certificate,
                                       this.orderDetailsForm.value.additionalOrder,
                                       this.orderDetailsForm.value.orderComment);
                                      console.log(newOrder)
  }

  onSubmit() {
    console.log(this.orderDetailsForm.value);
  }
}
