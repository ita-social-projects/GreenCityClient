import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { ShareFormService } from '../../services/share-form.service';
import { OrderDetailsFormComponent } from '../order-details-form/order-details-form.component';
import { IOrder } from '../order-details-form/order.interface';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.scss']
})
export class PaymentFormComponent implements OnInit {
  paymentForm: FormGroup;
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
  ubsRow: boolean = false;
  XLRow: boolean = false;
  MRow: boolean = false;


  constructor(private shareFormService: ShareFormService,
    private orderService: OrderService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    // this.orderService.getOrders().subscribe(data => { this.orders = data; this.initPaymentData(); });
    this.shareFormService.finalObject.subscribe(order => { this.finalOrder = order; this.initPersonalData(); });
    this.shareFormService.billObjectSource.subscribe(order => {this.bill = order; this.initPaymentData();});
    this.paymentForm = this.fb.group({});

  }

  initPaymentData(): void {
    // this.ubsBag = this.orders.allBags[0].name;
    // this.clothesBagXL = this.orders.allBags[1].name;
    // this.clothesBagM = this.orders.allBags[2].name;
    // this.ubsBagPrice = this.orders.allBags[0].price;
    // this.clothesBagXLPrice = this.orders.allBags[1].price;
    // this.clothesBagMPrice = this.orders.allBags[2].price;
    this.ubsBag = this.bill[0].name;
    this.clothesBagXL = this.bill[1].name;
    this.clothesBagM = this.bill[2].name;
    this.ubsBagPrice = this.bill[0].count;
    this.clothesBagXLPrice = this.bill[1].count;
    this.clothesBagMPrice = this.bill[2].count;
    this.usedPoints = this.bill[4];
    this.total = this.bill[3];
  }

  initPersonalData(): void {
    this.ubsBagNum = this.finalOrder.bags[0].amount;
    this.ubsBagNum > 0 ? this.ubsRow = true : this.ubsRow = false;
    this.clothesBagXLNum = this.finalOrder.bags[1].amount;
    this.clothesBagXLNum > 0 ? this.XLRow = true : this.XLRow = false;
    this.clothesBagMNum = this.finalOrder.bags[2].amount;
    this.clothesBagMNum > 0 ? this.MRow = true : this.MRow = false;
    this.usedPoints = this.finalOrder.pointsToUse;
    this.firstName = this.finalOrder.personalData.firstName;
    this.lastName = this.finalOrder.personalData.lastName;
    this.email = this.finalOrder.personalData.email;
    this.mobile = this.finalOrder.personalData.phoneNumber;
    this.city = this.finalOrder.personalData.city;
    this.district = this.finalOrder.personalData.district;
    this.street = this.finalOrder.personalData.street;
    this.houseNumber = this.finalOrder.personalData.houseNumber;
    this.houseCorpus - this.finalOrder.personalData.entranceNumber;
    this.comment = this.finalOrder.personalData.addressComment;
  }

}
