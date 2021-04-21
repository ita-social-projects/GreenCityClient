import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Bag, FinalOrder, OrderDetails, PersonalData } from '../../models/ubs.interface';
import { Order } from '../../models/ubs.model';
import { OrderService } from '../../services/order.service';
import { UBSOrderFormService } from '../../services/ubs-order-form.service';

@Component({
  selector: 'app-ubs-submit-order',
  templateUrl: './ubs-submit-order.component.html',
  styleUrls: ['./ubs-submit-order.component.scss']
})
export class UBSSubmitOrderComponent implements OnInit {
  paymentForm: FormGroup = this.fb.group({});
  bags: Bag[] = [];
  personalData: PersonalData;

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
  orders: OrderDetails;
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
    this.takeOrderDetails();


    // this.orderService.getOrders()
    //   .pipe(
    //     takeUntil(this.destroy)
    //   )
    //   .subscribe(data => {
    //     this.orders = data;
    //     this.initPaymentData();
    //   });

    this.shareFormService.finalObject
      .pipe(
        takeUntil(this.destroy)
      )
      .subscribe(order => {
        this.finalOrder = order;
        this.initPersonalData();
      });

    this.shareFormService.billObjectSource
      .pipe(
        takeUntil(this.destroy)
      )
      .subscribe(order => {
        this.bill = order;
      });
  }

  takeOrderDetails() {
    this.shareFormService.changedOrder.subscribe((orderDetails: OrderDetails) => {
      this.bags = orderDetails.bags;
    });
  }

  initPaymentData(): void {
    this.ubsBag = this.orders.bags[0].name;
    this.bagSizeUbs = this.orders.bags[0].capacity;
    this.clothesBagXL = this.orders.bags[1].name;
    this.bagSizeClothesXL = this.orders.bags[1].capacity;
    this.clothesBagM = this.orders.bags[2].name;
    this.bagSizeClothesM = this.orders.bags[2].capacity;
    this.ubsBagPrice = this.orders.bags[0].price;
    this.clothesBagXLPrice = this.orders.bags[1].price;
    this.clothesBagMPrice = this.orders.bags[2].price;
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
