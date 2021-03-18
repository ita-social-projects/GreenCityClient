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
  bagSizeUbs: string;
  bagSumUbs: string;
  clothesBagXL: string;
  bagSizeClothesXL: string;
  bagSumClothesXL: string;
  clothesBagM: string;
  bagSizeClothesM: string;
  bagSumClothesM: string;
  ubsBagNum: number;
  clothesBagXLNum: number;
  clothesBagMNum: number;
  ubsBagPrice: number;
  clothesBagXLPrice: number;
  clothesBagMPrice: number;
  showTotal: string;
  showCertificateUsed: string;
  showPointsUsed: string;
  finalSum: string;
  ubsRow = false;
  XLRow = false;
  MRow = false;
  showCert = false;
  showPoints = false;


  constructor(
    private shareFormService: ShareFormService,
    private orderService: OrderService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.shareFormService.finalObject.subscribe(order => {this.finalOrder = order; this.initPersonalData(); });
    this.shareFormService.billObjectSource.subscribe(order => {this.bill = order; this.initPaymentData(); });
    this.paymentForm = this.fb.group({});
  }

  initPaymentData(): void {
    this.ubsBag = this.bill[0].name;
    this.bagSizeUbs = this.bill[0].size;
    this.bagSumUbs = this.bill[0].sum;
    this.clothesBagXL = this.bill[1].name;
    this.bagSizeClothesXL = this.bill[1].size;
    this.bagSumClothesXL = this.bill[1].sum;
    this.clothesBagM = this.bill[2].name;
    this.bagSizeClothesM = this.bill[2].size;
    this.bagSumClothesM = this.bill[2].sum;
    this.ubsBagPrice = this.bill[0].count;
    this.clothesBagXLPrice = this.bill[1].count;
    this.clothesBagMPrice = this.bill[2].count;
    this.showTotal = this.bill[3];
    this.showCertificateUsed = this.bill[4];
    this.showPointsUsed = this.bill[5];
    this.finalSum = this.bill[6];
    this.ubsBagNum = this.bill[0].amount;
    this.ubsBagNum > 0 ? this.ubsRow = true : this.ubsRow = false;
    this.clothesBagXLNum = this.bill[1].amount;
    this.clothesBagXLNum > 0 ? this.XLRow = true : this.XLRow = false;
    this.clothesBagMNum = this.bill[2].amount;
    this.clothesBagMNum > 0 ? this.MRow = true : this.MRow = false;
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
    this.houseCorpus - this.finalOrder.personalData.entranceNumber;
    this.comment = this.finalOrder.personalData.addressComment;
    this.finalOrder.certificates.length > 0 ? this.showCert = true : this.showCert = false;
    this.finalOrder.pointsToUse > 0 ? this.showPoints = true : this.showPoints = false;
  }
}
