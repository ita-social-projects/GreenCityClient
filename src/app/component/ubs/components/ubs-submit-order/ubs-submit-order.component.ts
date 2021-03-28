import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { IOrder } from '../../models/ubs.interface';
import { OrderService } from '../../services/order.service';
import { UBSOrderFormService } from '../../services/ubs-order-form.service';

@Component({
  selector: 'app-ubs-submit-order',
  templateUrl: './ubs-submit-order.component.html',
  styleUrls: ['./ubs-submit-order.component.scss']
})
export class UBSSubmitOrderComponent implements OnInit {
  paymentForm: FormGroup = this.fb.group({});
  displayMes = true;
  bill: any;
  finalOrder: any;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  city: string;
  district: string;
  street: string;
  houseNumber: any;
  houseCorpus: any;
  comment: string;
  orderComment: string;
  orders: IOrder;
  ubsBag: string;
  bagSizeUbs = 0;
  clothesBagXL: string;
  bagSizeClothesXL = 0;
  clothesBagM: string;
  bagSizeClothesM = 0;
  bagSumClothesM: string;
  ubsBagPrice: number;
  clothesBagXLPrice: number;
  clothesBagMPrice: number;
  additionalOrders = [];
  private destroy: Subject<boolean> = new Subject<boolean>();

  constructor(
    private shareFormService: UBSOrderFormService,
    private orderService: OrderService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.orderService.getOrders()
      .pipe(
        takeUntil(this.destroy)
      )
      .subscribe(data => {
        this.orders = data;
        this.initPaymentData();
      });

    this.shareFormService.finalObject
      .pipe(
        takeUntil(this.destroy)
      )
      .subscribe(order => {
        this.finalOrder = order; this.initPersonalData();
      });

    this.shareFormService.billObjectSource
      .pipe(
        takeUntil(this.destroy)
      )
      .subscribe(order => {
        this.bill = order;
      });
  }

  initPaymentData(): void {
    this.ubsBag = this.orders.allBags[0].name;
    this.bagSizeUbs = this.orders.allBags[0].capacity;
    this.clothesBagXL = this.orders.allBags[1].name;
    this.bagSizeClothesXL = this.orders.allBags[1].capacity;
    this.clothesBagM = this.orders.allBags[2].name;
    this.bagSizeClothesM = this.orders.allBags[2].capacity;
    this.ubsBagPrice = this.orders.allBags[0].price;
    this.clothesBagXLPrice = this.orders.allBags[1].price;
    this.clothesBagMPrice = this.orders.allBags[2].price;
  }

  initPersonalData(): void {
    this.firstName = this.finalOrder.personalData.firstName;
    this.lastName = this.finalOrder.personalData.lastName;
    this.email = this.finalOrder.personalData.email;
    this.mobile = this.finalOrder.personalData.phoneNumber;
    this.city = this.finalOrder.personalData.city;
    this.district = this.finalOrder.personalData.district;
    this.street = this.finalOrder.personalData.street;
    this.houseNumber = this.finalOrder.personalData.houseNumber;
    this.houseCorpus = this.finalOrder.personalData.entranceNumber;
    this.comment = this.finalOrder.personalData.addressComment;
    this.orderComment = this.finalOrder.orderComment;
    this.additionalOrders = this.finalOrder.additionalOrders;
  }
}
