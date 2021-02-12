import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { ShareFormService } from '../../services/share-form.service';
import { IOrder } from './order.interface';
import { Order } from './order.model';
// import { passwordValidator } from './password-validator';
// import { wrongAmountValidator } from './shared/form-validator';

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
  subBtn: boolean = true;
  order: {};
  orders: IOrder;
  object: {};

  constructor(private fb: FormBuilder,
              private _orderService: OrderService,
              private _shareFormService: ShareFormService) { }

  ngOnInit(): void {

    this._shareFormService.objectSource.subscribe(object => this.object = object);
    // console.log(this.object);
    this._orderService.getOrders()
    .subscribe(data => {this.orders = data;
      // console.log(this.orders);
     this.initForm();}
      );

    this.orderDetailsForm = this.fb.group({
      bagServiceUbs: [''],
      bagNumUbs: [0],
      bagSizeUbs: [''],
      bagPriceUbs: [''],
      bagServiceClothesXL: [],
      bagNumClothesXL: [0, Validators.required],
      bagSizeClothesXL: [''],
      bagPriceClothesXL: [''],
      bagServiceClothesM: [],
      bagNumClothesM: [0],
      bagSizeClothesM: [''],
      bagPriceClothesM: [''],
      certificate: [''],
      additionalOrder: [''],
      orderComment: [''],
      bonus: ['no'],
      shop: ['no']
    });

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

  initForm(): void {
    this.orderDetailsForm.patchValue({
      bagServiceUbs: this.orders.allBags[0].name,
      bagSizeUbs: `${this.orders.allBags[0].capacity} (${this.orders.allBags[0].price} грн)`,
      bagServiceClothesXL: this.orders.allBags[1].name,
      bagSizeClothesXL: `${this.orders.allBags[1].capacity} (${this.orders.allBags[1].price} грн)`,
      bagServiceClothesM: this.orders.allBags[2].name,
      bagSizeClothesM: `${this.orders.allBags[2].capacity} (${this.orders.allBags[2].price} грн)`
    });
    this.points = this.orders.points;
  }

  calc() {
    this.orderDetailsForm.patchValue({
      bagPriceUbs: `${this.orderDetailsForm.value.bagNumUbs * this.orders.allBags[0].price} грн`,
      bagPriceClothesXL: `${this.orderDetailsForm.value.bagNumClothesXL * this.orders.allBags[1].price} грн`,
      bagPriceClothesM: `${this.orderDetailsForm.value.bagNumClothesM * this.orders.allBags[2].price} грн`,
    });
    this.total = this.orderDetailsForm.value.bagNumUbs * this.orders.allBags[0].price +
                 this.orderDetailsForm.value.bagNumClothesXL * this.orders.allBags[1].price +
                 this.orderDetailsForm.value.bagNumClothesM * this.orders.allBags[2].price;
                 this.showTotal = `До оплати: ${this.total} грн`;
    if (this.total < 500) {
      this.displayMes = true;
      this.subBtn = true;
    } else {this.displayMes = false; this.subBtn = false;}
  }

  calcPoints() {
     this.showTotal = `Загальна сума: ${this.total} грн`;
     this.points > this.total ? this.pointsUsed = this.total : this.pointsUsed = this.points;
     this.showPointsUsed = `Списано балів: ${this.pointsUsed}`;
     this.points > this.total ? this.points = this.points - this.total : this.points = 0;
     this.finalSum = `До оплати: ${this.total - this.pointsUsed} грн`;

  }

  resetPoints() {
    this.showTotal = `До оплати: ${this.total} грн`;
    this.showPointsUsed = '';
    this.finalSum = '';
    this.points = this.orders.points;
  }

  addOrder() {
    let ubs = Object.assign({id: 1, amount: this.orderDetailsForm.value.bagNumUbs});
    let clothesXL = Object.assign({id: 2, amount: this.orderDetailsForm.value.bagNumClothesXL});
    let clothesM = Object.assign({id: 3, amount: this.orderDetailsForm.value.bagNumClothesM});
    const newOrder: IOrder = new Order([ubs, clothesXL, clothesM],
                                       this.points,
                                       this.orderDetailsForm.value.certificate,
                                       this.orderDetailsForm.value.additionalOrder,
                                       this.orderDetailsForm.value.orderComment
    );
                                      // console.log(newOrder)
                                      this._shareFormService.changeObject(newOrder);

  }

  // shareForm() {
  //   this._shareFormService.changeObject();
  // }

  onSubmit() {
    console.log(this.orderDetailsForm.value);
  }
}
