import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
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
  total: number = 0;
  finalSum: string = '0 грн';
  points: number;
  pointsUsed: any;
  showPointsUsed: any;
  displayCalc: boolean = false;
  displayMes: boolean = false;
  displayCert: boolean = false;
  displayBonus: boolean = false;
  displayShop: boolean = false;
  addCert: boolean = false;
  onSubmit: boolean = true;
  order: {};
  orders: IOrder;
  certificateMask = '0000-0000';
  certificates = [];
  certificateSum: number = 0;
  certSize: boolean = false;
  dataCert: any;
  showCertificateUsed: string;
  certificateLeft: number = 0;
  userOrder: IUserOrder;
  object: {};

  get additionalCertificates() {
    return this.orderDetailsForm.get('additionalCertificates') as FormArray;
  }

  get additionalOrders() {
    return this.orderDetailsForm.get('additionalOrders') as FormArray;
  }


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
      bagSumUbs: [{ value: '0 грн', disabled: true }],
      bagServiceClothesXL: [{ value: '', disabled: true }],
      bagNumClothesXL: [0, Validators.required],
      bagSizeClothesXL: [{ value: '', disabled: true }],
      bagPriceClothesXL: [{ value: '', disabled: true }],
      bagSumClothesXL: [{ value: '0 грн', disabled: true }],
      bagServiceClothesM: [{ value: '', disabled: true }],
      bagNumClothesM: [0],
      bagSizeClothesM: [{ value: '', disabled: true }],
      bagPriceClothesM: [{ value: '', disabled: true }],
      bagSumClothesM: [{ value: '0 грн', disabled: true }],
      certificate: ['', [Validators.minLength(8), Validators.pattern(/[^0000]\d{4}/)]],
      additionalOrder: [''],
      orderComment: [''],
      bonus: ['no'],
      shop: ['no'],
      additionalCertificates: this.fb.array([]),
      additionalOrders: this.fb.array(['']),
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
    console.log(this.additionalOrders.value);
    this.orderDetailsForm.patchValue({
      bagSumUbs: `${this.orderDetailsForm.value.bagNumUbs * this.orders.allBags[0].price} грн`,
      bagSumClothesXL: `${this.orderDetailsForm.value.bagNumClothesXL * this.orders.allBags[1].price} грн`,
      bagSumClothesM: `${this.orderDetailsForm.value.bagNumClothesM * this.orders.allBags[2].price} грн`,
    });
    this.total = this.orderDetailsForm.value.bagNumUbs * this.orders.allBags[0].price +
      this.orderDetailsForm.value.bagNumClothesXL * this.orders.allBags[1].price +
      this.orderDetailsForm.value.bagNumClothesM * this.orders.allBags[2].price;
    this.showTotal = `${this.total} грн`;
    this.finalSum = `${this.total} грн`;
    this.displayCalc = true;
    if (this.total < 500) {
      this.displayMes = true;
      this.onSubmit = true;
    } else { this.displayMes = false; this.onSubmit = false; }

  }

  calcPoints() {
    this.displayBonus = true;
    if(this.certificateSum <= 0) {
    this.showTotal = `${this.total} грн`;
    this.points > this.total ? this.pointsUsed = this.total : this.pointsUsed = this.points;
    this.showPointsUsed = `-${this.pointsUsed} грн`;
    this.points > this.total ? this.points = this.points - this.total : this.points = 0;
    this.finalSum = `${this.total - this.pointsUsed} грн`;
    this.total = this.total - this.pointsUsed}
    else {
      this.showTotal = `${this.total} грн`;
      this.points > this.total ? this.points = this.points - this.total : this.points = 0;
      this.points > this.total ? this.pointsUsed = this.total - this.certificateSum : this.pointsUsed = this.points;
      this.showPointsUsed = `-${this.pointsUsed} грн`;
      this.finalSum = `${this.total - this.pointsUsed - this.certificateSum} грн`;
    }
  }

  resetPoints() {
    this.displayBonus = false;
    this.total = this.orderDetailsForm.value.bagNumUbs * this.orders.allBags[0].price +
    this.orderDetailsForm.value.bagNumClothesXL * this.orders.allBags[1].price +
    this.orderDetailsForm.value.bagNumClothesM * this.orders.allBags[2].price;
    this.showTotal = `${this.total} грн`;
    this.showPointsUsed = '';
    this.finalSum = this.showTotal;
    this.points = this.orders.points;
  }

  addOrder() {
    this.additionalOrders.push(this.fb.control(''));
  }

  addCertificate() {
    this.additionalCertificates.push(this.fb.control(''));
    this.addCert = false;
  }

  deleteCertificate(i) {
    if(this.displayCert === false){
      this.certificates.splice(i, 1);
      this.additionalCertificates.removeAt(i);
      this.calcCertificates(this.certificates);
    } else {
    this.certificates.splice(i+1, 1);
    this.additionalCertificates.removeAt(i);
    console.log(this.certificates);
    this.calcCertificates(this.certificates);}
  }

  addedCertificateSubmit(i) {
    this.certificates.push(this.additionalCertificates.value[i]);
    this.calcCertificates(this.certificates);
    console.log(this.certificates);
    this.addCert = true;
  }

 calcCertificates(arr) {
   if(arr.length > 0){
    this.certificateSum = 0;
    for (const certificate of arr) {
      this._orderService.processCertificate(certificate).subscribe(certificate => {
        this.certificateMatch(certificate);
        if(this.total > this.certificateSum) {
          this.finalSum = `${this.total - this.certificateSum} грн`;
          this.showCertificateUsed = `-${this.certificateSum} грн`;
           this.addCert = true;
        } else {
          this.finalSum = `0 грн`;
          this.certificateLeft = this.certificateSum - this.total;
          this.showCertificateUsed = `-${this.total} грн`;
          this.points = this.orders.points + this.certificateLeft;
          this.addCert = false;
          this.certSize = true;
        }
      })
    }
  } else {
    this.certificateSum = 0;
    this.finalSum = `${this.total - this.certificateSum} грн`;
    console.log('empty');
  }
 }

  certificateSubmit() {
    this.certificates.push(this.orderDetailsForm.value.certificate);
    console.log(this.certificates);
    this.calcCertificates(this.certificates);
    this.displayCert = true;

  }

  certificateReset() {
    this.showCertificateUsed = '';
    this.addCert = false;
    this.displayCert = false;
    this.certificates.splice(0, 1);
    console.log(this.certificates);
    this.orderDetailsForm.patchValue({
      certificate: '',
    });
    this.calcCertificates(this.certificates);
  }

  certificateMatch(cert) {
      if(cert.certificateStatus){
        this.certificateSum = this.certificateSum + cert.certificatePoints;
        console.log(cert.certificatePoints);

      }else {console.log('invalid');
      }
  }


  submit() {
    const paymentBill = [{name: this.orderDetailsForm.get('bagServiceUbs').value,
                          size: this.orderDetailsForm.get('bagSizeUbs').value,
                        amount: this.orderDetailsForm.get('bagNumUbs').value,
                        count: this.orderDetailsForm.get('bagPriceUbs').value,
                        sum: this.orderDetailsForm.get('bagSumUbs').value},
                        {name: this.orderDetailsForm.get('bagServiceClothesXL').value,
                        size: this.orderDetailsForm.get('bagSizeClothesXL').value,
                        amount: this.orderDetailsForm.get('bagNumClothesXL').value,
                        count: this.orderDetailsForm.get('bagPriceClothesXL').value,
                        sum: this.orderDetailsForm.get('bagSumClothesXL').value},
                        {name: this.orderDetailsForm.get('bagServiceClothesM').value,
                        size: this.orderDetailsForm.get('bagSizeClothesM').value,
                        amount: this.orderDetailsForm.get('bagNumClothesM').value,
                        count: this.orderDetailsForm.get('bagPriceClothesM').value,
                        sum: this.orderDetailsForm.get('bagSumClothesM').value},
                      this.showTotal, this.showCertificateUsed, this.showPointsUsed, this.finalSum];
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
    console.log(this.orderDetailsForm.value, newOrder);
  }
}
