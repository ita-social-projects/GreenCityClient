import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { ShareFormService } from '../../services/share-form.service';
import { IOrder } from './order.interface';
import { IUserOrder } from './shared/userOrder.interface';
import { UserOrder } from './shared/userOrder.model';

@Component({
  selector: 'app-order-details-form',
  templateUrl: './order-details-form.component.html',
  styleUrls: ['./order-details-form.component.scss']
})

export class OrderDetailsFormComponent implements OnInit {
  orderDetailsForm: FormGroup;
  showTotal: string;
  total: any;
  finalSum: any;
  points: number;
  pointsUsed: any;
  showPointsUsed: any;
  displayMes: boolean = false;
  displayCert: boolean = false;
  displayShop: boolean = false;
  onSubmit: boolean = true;
  order: {};
  orders: IOrder;
  userOrder: IUserOrder;
  object: {};

  constructor(private fb: FormBuilder,
    private _orderService: OrderService,
    private _shareFormService: ShareFormService) { }

  ngOnInit(): void {

    this._shareFormService.objectSource.subscribe(object => this.object = object);
    this._orderService.getOrders()
      .subscribe(data => {
        this.orders = data;
        this.initForm();
      }
      );

    this.orderDetailsForm = this.fb.group({
      bagServiceUbs: [{ value: '', disabled: true }],
      bagNumUbs: [0],
      bagSizeUbs: [{ value: '', disabled: true }],
      bagPriceUbs: [{ value: '', disabled: true }],
      bagSumUbs: [{ value: '', disabled: true }],
      bagServiceClothesXL: [{ value: '', disabled: true }],
      bagNumClothesXL: [0, Validators.required],
      bagSizeClothesXL: [{ value: '', disabled: true }],
      bagPriceClothesXL: [{ value: '', disabled: true }],
      bagSumClothesXL: [{ value: '', disabled: true }],
      bagServiceClothesM: [{ value: '', disabled: true }],
      bagNumClothesM: [0],
      bagSizeClothesM: [{ value: '', disabled: true }],
      bagPriceClothesM: [{ value: '', disabled: true }],
      bagSumClothesM: [{ value: '', disabled: true }],
      certificate: [''],
      additionalOrder: [''],
      orderComment: [''],
      bonus: ['no'],
      shop: ['no'],
    });

    this.orderDetailsForm.get('shop').valueChanges.
      subscribe(checkedValue => {
        const additionalOrder = this.orderDetailsForm.get('additionalOrder');
        if (checkedValue === 'yes') {
          additionalOrder.setValidators(Validators.required);
          this.displayShop = true;
        } else {
          additionalOrder.clearValidators();
          this.displayShop = false;
        }
        additionalOrder.updateValueAndValidity();
      })
  }

  initForm(): void {
    this.orderDetailsForm.patchValue({
      bagServiceUbs: this.orders.allBags[0].name,
      bagSizeUbs: `${this.orders.allBags[0].capacity} л`,
      bagPriceUbs: `${this.orders.allBags[0].price} грн`,
      bagServiceClothesXL: this.orders.allBags[1].name,
      bagSizeClothesXL: `${this.orders.allBags[1].capacity} л`,
      bagPriceClothesXL: `${this.orders.allBags[1].price} грн`,
      bagServiceClothesM: this.orders.allBags[2].name,
      bagSizeClothesM: `${this.orders.allBags[2].capacity} л`,
      bagPriceClothesM: `${this.orders.allBags[2].price} грн`
    });
    this.points = this.orders.points;

  }

  calc() {
    this.orderDetailsForm.patchValue({
      bagSumUbs: `${this.orderDetailsForm.value.bagNumUbs * this.orders.allBags[0].price} грн`,
      bagSumClothesXL: `${this.orderDetailsForm.value.bagNumClothesXL * this.orders.allBags[1].price} грн`,
      bagSumClothesM: `${this.orderDetailsForm.value.bagNumClothesM * this.orders.allBags[2].price} грн`,
    });
    this.total = this.orderDetailsForm.value.bagNumUbs * this.orders.allBags[0].price +
      this.orderDetailsForm.value.bagNumClothesXL * this.orders.allBags[1].price +
      this.orderDetailsForm.value.bagNumClothesM * this.orders.allBags[2].price;
    this.showTotal = `До оплати: ${this.total} грн`;
    if (this.total < 500) {
      this.displayMes = true;
      this.onSubmit = true;
    } else { this.displayMes = false; this.onSubmit = false; }

  }

  calcPoints() {
    this.showTotal = `Загальна сума: ${this.total} грн`;
    this.points > this.total ? this.pointsUsed = this.total : this.pointsUsed = this.points;
    this.showPointsUsed = `Списано балів: ${this.pointsUsed}`;
    this.points > this.total ? this.points = this.points - this.total : this.points = 0;
    this.finalSum = `До оплати: ${this.total - this.pointsUsed} грн`;
    this.total = this.total - this.pointsUsed;
  }

  resetPoints() {
    this.showTotal = `До оплати: ${this.total} грн`;
    this.showPointsUsed = '';
    this.finalSum = '';
    this.points = this.orders.points;
  }

  submit() {
    const paymentBill = [{name: this.orderDetailsForm.get('bagServiceUbs').value,
                        amount: this.orderDetailsForm.get('bagNumUbs').value,
                        count: this.orderDetailsForm.get('bagPriceUbs').value},
                        {name: this.orderDetailsForm.get('bagServiceClothesXL').value,
                        amount: this.orderDetailsForm.get('bagNumClothesXL').value,
                        count: this.orderDetailsForm.get('bagPriceClothesXL').value},
                        {name: this.orderDetailsForm.get('bagServiceClothesM').value,
                        amount: this.orderDetailsForm.get('bagNumClothesM').value,
                        count: this.orderDetailsForm.get('bagPriceClothesM').value},
                        this.total, this.pointsUsed, ];
    let ubs = Object.assign({ id: 1, amount: this.orderDetailsForm.value.bagNumUbs });
    let clothesXL = Object.assign({ id: 2, amount: this.orderDetailsForm.value.bagNumClothesXL });
    let clothesM = Object.assign({ id: 3, amount: this.orderDetailsForm.value.bagNumClothesM });
    const newOrder: IUserOrder = new UserOrder([ubs, clothesXL, clothesM],
      this.pointsUsed,
      this.orderDetailsForm.value.certificate,
      this.orderDetailsForm.value.additionalOrder,
      this.orderDetailsForm.value.orderComment);
    this._shareFormService.changeObject(newOrder);
    this._shareFormService.finalBillObject(paymentBill);
    // console.log(this.orderDetailsForm.value, newOrder);
  }
}
