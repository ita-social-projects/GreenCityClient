import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IOrder } from './order.interface';
import { Order } from './order.model';

@Component({
  selector: 'app-order-details-form',
  templateUrl: './order-details-form.component.html',
  styleUrls: ['./order-details-form.component.scss']
})

export class OrderDetailsFormComponent implements OnInit {
  orderDetailsForm: FormGroup;
  total: number;
  displayMes: boolean = false;
  subBtn: boolean = true;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.orderDetailsForm = this.fb.group({
      bagServiceUbs: [1],
      bagNumUbs: [0, Validators.required],
      bagSizeUbs: ['120 л (250 грн)'],
      bagPriceUbs: [''],
      bagServiceClothesXL: [2],
      bagNumClothesXL: [0, Validators.required],
      bagSizeClothesXL: ['120 л (300 грн)'],
      bagPriceClothesXL: [''],
      bagServiceClothesM: [3],
      bagNumClothesM: [0],
      bagSizeClothesM: ['35 л (150 грн)'],
      bagPriceClothesM: ['']
    });
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
    const id: number = this.orderDetailsForm.value.bagServiceUbs;
    const amount: number = this.orderDetailsForm.value.bagNumUbs;
    const id2: number = this.orderDetailsForm.value.bagServiceClothesXL;
    const amount2: number = this.orderDetailsForm.value.bagNumClothesXL;
    const id3: number = this.orderDetailsForm.value.bagServiceClothesM;
    const amount3: number = this.orderDetailsForm.value.bagNumClothesM;
    const newOrder: IOrder = new Order([{id, amount},
                                        {id2, amount2},
                                        {id3, amount3}
                                      ])
                                      console.log(newOrder)

  }
}

