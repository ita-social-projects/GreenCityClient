import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { ShareFormService } from '../../services/share-form.service';
import { IOrder } from '../order-details-form/order.interface';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.scss']
})
export class PaymentFormComponent implements OnInit {
  paymentForm: FormGroup;
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
  orders: IOrder;
  ubsBag: string;
  clothesBagXL: string;
  clothesBagM: string;
  ubsBagNum: number;
  clothesBagXLNum: number;
  clothesBagMNum: number;
  ubsBagPrice: number;
  clothesBagXLPrice: number;
  clothesBagMPrice: number;
  usedPoints: number;
  total: number;

  constructor(private shareFormService: ShareFormService,
              private orderService: OrderService,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.orderService.getOrders()
    .subscribe(data => {this.orders = data; this.initPaymentData();});
    this.shareFormService.finalObject.subscribe(order => {this.finalOrder = order; this.initPersonalData();});
    this.paymentForm = this.fb.group({});
    // this.calc();

  }

  initPaymentData(): void {
    this.ubsBag = this.orders.allBags[0].name;
    this.clothesBagXL = this.orders.allBags[1].name;
    this.clothesBagM = this.orders.allBags[2].name;
    this.ubsBagPrice = this.orders.allBags[0].price;
    this.clothesBagXLPrice = this.orders.allBags[1].price;
    this.clothesBagMPrice = this.orders.allBags[2].price;
  }

  initPersonalData(): void {
    this.ubsBagNum = this.finalOrder.bags[0].amount;
    this.clothesBagXLNum = this.finalOrder.bags[1].amount;
    this.clothesBagMNum = this.finalOrder.bags[2].amount;
    this.firstName = this.finalOrder.personalData.firstName;
    this.lastName = this.finalOrder.personalData.lastName;
    this.email = this.finalOrder.personalData.email;
    this.mobile = this.finalOrder.personalData.phoneNumber;
    this.city = this.finalOrder.personalData.city;
    this.district = this.finalOrder.personalData.district;
    this.street = this.finalOrder.personalData.street;
    this.houseNumber = this.finalOrder.personalData.houseNumber;
    this.houseCorpus - this.finalOrder.personalData.houseCorpus;
    this.comment = this.finalOrder.personalData.addressComment;
    this.usedPoints = this.finalOrder.pointsToUse;

  }

  // calc(): void {
  //   this.total = this.ubsBagNum * this.ubsBagPrice +
  //    this.clothesBagXLNum * this.clothesBagXLPrice +
  //     this.clothesBagMNum * this.clothesBagMPrice - this.usedPoints
  // }

}
