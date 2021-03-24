import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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
  total = 0;
  finalSum = 0;
  points: number;
  pointsUsed: number;
  showPointsUsed: string;
  displayCalc = false;
  displayMes = false;
  displayCert = false;
  displayBonus = false;
  displayShop = false;
  addCert = false;
  onSubmit = true;
  order: {};
  orders: IOrder;
  certificateMask = '0000-0000';
  certificatePattern = /(?!0000)\d{4}-(?!0000)\d{4}/;
  certificates = [];
  certificateSum = 0;
  certSize = false;
  showCertificateUsed: string;
  certificateLeft = 0;
  certMessage: string;
  userOrder: IUserOrder;
  object: {};
  private destroy: Subject<boolean> = new Subject<boolean>();

  constructor(private fb: FormBuilder,
    private orderService: OrderService,
    private shareFormService: ShareFormService) { }

  get additionalCertificates() {
    return this.orderDetailsForm.get('additionalCertificates') as FormArray;
  }

  get additionalOrders() {
    return this.orderDetailsForm.get('additionalOrders') as FormArray;
  }

  ngOnInit(): void {
    this.shareFormService.objectSource
      .pipe(
        takeUntil(this.destroy)
      )
      .subscribe(object => {
        this.object = object;
      });

    this.orderService.getOrders()
      .pipe(
        takeUntil(this.destroy)
      )
      .subscribe(data => {
        this.orders = data;
        this.initForm();
      });

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
      certificate: ['', [Validators.minLength(8), Validators.pattern(this.certificatePattern)]],
      orderComment: [''],
      bonus: ['no'],
      shop: ['no'],
      additionalCertificates: this.fb.array([]),
      additionalOrders: this.fb.array([])
    });

    this.addOrder();
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

  calculateTotal(): void {
    this.total = this.orderDetailsForm.value.bagNumUbs * this.orders.allBags[0].price +
      this.orderDetailsForm.value.bagNumClothesXL * this.orders.allBags[1].price +
      this.orderDetailsForm.value.bagNumClothesM * this.orders.allBags[2].price;
    this.showTotal = `${this.total} грн`;
    this.displayCalc = true;
    if (this.total < 500) {
      this.displayMes = true;
      this.onSubmit = true;
    } else {
      this.displayMes = false;
      this.onSubmit = false;
    }
    this.finalSum = this.total;
    if (this.certificateSum > 0) {
      if (this.total > this.certificateSum) {
        this.certificateLeft = 0;
        this.finalSum = this.total - this.certificateSum;
        this.showCertificateUsed = `-${this.certificateSum} грн`;
      } else {
        this.finalSum = 0;
        this.certificateLeft = this.certificateSum - this.total;
        this.showCertificateUsed = `-${this.total} грн`;
        this.points = this.orders.points + this.certificateLeft;
      }
      this.showCertificateUsed = `-${this.certificateSum} грн`;
    }
  }

  calculate(): void {
    this.orderDetailsForm.patchValue({
      bagSumUbs: `${this.orderDetailsForm.value.bagNumUbs * this.orders.allBags[0].price} грн`,
      bagSumClothesXL: `${this.orderDetailsForm.value.bagNumClothesXL * this.orders.allBags[1].price} грн`,
      bagSumClothesM: `${this.orderDetailsForm.value.bagNumClothesM * this.orders.allBags[2].price} грн`,
    });
    this.calculateTotal();
  }

  calculatePoints(): void {
    this.displayBonus = true;
    if (this.certificateSum <= 0) {
      this.showTotal = `${this.total} грн`;
      this.points > this.total ? this.pointsUsed = this.total : this.pointsUsed = this.points;
      this.showPointsUsed = `-${this.pointsUsed} грн`;
      this.points > this.total ? this.points = this.points - this.total : this.points = 0;
      this.finalSum = this.total - this.pointsUsed;
      this.total = this.total - this.pointsUsed;
    } else {
      this.showTotal = `${this.total} грн`;
      this.points > this.total ? this.points = this.points - this.total : this.points = 0;
      this.points > this.total ? this.pointsUsed = this.total - this.certificateSum : this.pointsUsed = this.points;
      this.showPointsUsed = `-${this.pointsUsed} грн`;
      this.finalSum = this.total - this.pointsUsed - this.certificateSum;
    }
  }

  resetPoints(): void {
    this.displayBonus = false;
    this.total = this.orderDetailsForm.value.bagNumUbs * this.orders.allBags[0].price +
      this.orderDetailsForm.value.bagNumClothesXL * this.orders.allBags[1].price +
      this.orderDetailsForm.value.bagNumClothesM * this.orders.allBags[2].price;
    this.showTotal = `${this.total} грн`;
    this.showPointsUsed = '';
    this.finalSum = this.total;
    this.points = this.orders.points;
    this.calculateTotal();
  }

  addOrder(): void {
    this.additionalOrders.push(this.fb.control('', [Validators.minLength(10)]));
  }


  addCertificate(): void {
    this.additionalCertificates.push(this.fb.control('', [Validators.minLength(8), Validators.pattern(/(?!0000)\d{4}-(?!0000)\d{4}/)]));
    this.addCert = false;
  }

  deleteCertificate(i): void {
    if (this.displayCert === false) {
      this.certificates.splice(i, 1);
      this.additionalCertificates.removeAt(i);
      this.calculateCertificates(this.certificates);
    } else {
      this.certificates.splice(i + 1, 1);
      this.additionalCertificates.removeAt(i);
      this.calculateCertificates(this.certificates);
    }
  }

  addedCertificateSubmit(i): void {
    if (!this.certificates.includes(this.additionalCertificates.value[i])) {
      this.certificates.push(this.additionalCertificates.value[i]);
      this.calculateCertificates(this.certificates);
    }
  }

  calculateCertificates(arr): void {
    if (arr.length > 0) {
      this.certificateSum = 0;
      for (const certificate of arr) {
        this.orderService.processCertificate(certificate)
          .pipe(
            takeUntil(this.destroy)
          )
          .subscribe(cert => {
            this.certificateMatch(cert);
            if (this.total > this.certificateSum) {
              this.addCert = true;
            } else {
              this.addCert = false;
              this.certSize = true;
            }
            this.calculateTotal();
          });
      }
    } else {
      this.certificateSum = 0;
      this.calculateTotal();
    }
  }

  certificateSubmit(): void {
    if (!this.certificates.includes(this.orderDetailsForm.value.certificate)) {
      this.certificates.push(this.orderDetailsForm.value.certificate);
      this.calculateCertificates(this.certificates);
    } else {
      this.orderDetailsForm.patchValue({ certificate: '' });
    }
  }

  certificateReset(): void {
    this.showCertificateUsed = '';
    this.addCert = false;
    this.displayCert = false;
    this.certificates.splice(0, 1);
    this.certMessage = '';
    this.orderDetailsForm.patchValue({ certificate: '' });
    this.calculateCertificates(this.certificates);
  }

  certificateMatch(cert): void {
    if (cert.certificateStatus === 'ACTIVE' || cert.certificateStatus === 'NEW') {
      this.certificateSum = this.certificateSum + cert.certificatePoints;
      this.certMessage = `Сертифiкат на cуму ${cert.certificatePoints} грн активовано. Строк дії сертифікату - до ${cert.certificateDate}`;
      this.displayCert = true;
    } else if (cert.certificateStatus === 'USED') {
      this.certificateSum = this.certificateSum;
      this.certMessage = `Сертифiкат вже використано. Строк дії сертифікату - до ${cert.certificateDate}`;
      this.displayCert = false;
    } else if (cert.certificateDate.startsWith('2020')) {
      this.certificateSum = this.certificateSum;
      this.certMessage = `Сертифікат не є дійсним. Строк дії сертифікату - до до ${cert.certificateDate}`;
      this.displayCert = false;
    }
  }

  submit(): void {
    const ubs = Object.assign({ id: 1, amount: this.orderDetailsForm.value.bagNumUbs });
    const clothesXL = Object.assign({ id: 2, amount: this.orderDetailsForm.value.bagNumClothesXL });
    const clothesM = Object.assign({ id: 3, amount: this.orderDetailsForm.value.bagNumClothesM });
    const newOrder: IUserOrder = new UserOrder(
      [ubs, clothesXL, clothesM],
      this.pointsUsed,
      this.certificates,
      this.additionalOrders.value,
      this.orderDetailsForm.value.orderComment);
    const paymentBill = [
      {
        name: this.orderDetailsForm.get('bagServiceUbs').value,
        size: this.orderDetailsForm.get('bagSizeUbs').value,
        amount: this.orderDetailsForm.get('bagNumUbs').value,
        count: this.orderDetailsForm.get('bagPriceUbs').value,
        sum: this.orderDetailsForm.get('bagSumUbs').value
      },
      {
        name: this.orderDetailsForm.get('bagServiceClothesXL').value,
        size: this.orderDetailsForm.get('bagSizeClothesXL').value,
        amount: this.orderDetailsForm.get('bagNumClothesXL').value,
        count: this.orderDetailsForm.get('bagPriceClothesXL').value,
        sum: this.orderDetailsForm.get('bagSumClothesXL').value
      },
      {
        name: this.orderDetailsForm.get('bagServiceClothesM').value,
        size: this.orderDetailsForm.get('bagSizeClothesM').value,
        amount: this.orderDetailsForm.get('bagNumClothesM').value,
        count: this.orderDetailsForm.get('bagPriceClothesM').value,
        sum: this.orderDetailsForm.get('bagSumClothesM').value
      },
      this.showTotal, this.showCertificateUsed, this.showPointsUsed, this.finalSum];
    this.shareFormService.changeObject(newOrder);
    this.shareFormService.finalBillObject(paymentBill);
  }
}
