import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
      bagServiceUbs: ['Пакет УБС Кур’єр'],
      bagNumUbs: [0, Validators.required],
      bagSizeUbs: ['120 л (250 грн)'],
      bagPriceUbs: [''],
      bagServiceClothesXL: ['Пакет Безнадійний одяг'],
      bagNumClothesXL: [0, Validators.required],
      bagSizeClothesXL: ['120 л (300 грн)'],
      bagPriceClothesXL: [''],
      bagServiceClothesM: ['Пакет Безнадійний одяг'],
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
}
