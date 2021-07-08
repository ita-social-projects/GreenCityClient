import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { Bag, FinalOrder, OrderDetails } from '../../models/ubs.interface';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { OrderService } from '../../services/order.service';
import { UBSOrderFormService } from '../../services/ubs-order-form.service';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { CertificateStatus } from '../../certificate-status.enum';
import { FormBaseComponent } from '@shared/components/form-base/form-base.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-ubs-order-details',
  templateUrl: './ubs-order-details.component.html',
  styleUrls: ['./ubs-order-details.component.scss']
})
export class UBSOrderDetailsComponent extends FormBaseComponent implements OnInit, OnDestroy {
  orders: OrderDetails;
  bags: Bag[];
  orderDetailsForm: FormGroup;
  certStatuses = [];
  minOrderValue = 500;
  showTotal = 0;
  pointsUsed = 0;
  certificates = [];
  certificateSum = 0;
  total = 0;
  finalSum = 0;

  points: number;
  displayMes = false;
  displayCert = false;
  displayShop = false;
  addCert = false;
  onSubmit = true;
  order: {};
  certificateMask = '0000-0000';
  ecoStoreMask = '0000000000';
  servicesMask = '000';
  certificatePattern = /(?!0000)\d{4}-(?!0000)\d{4}/;
  commentPattern = /^(.){0,255}$/;
  additionalOrdersPattern = /^\d{10}$/;
  displayOrderBtn = false;

  certSize = false;
  showCertificateUsed = 0;
  certificateLeft = 0;
  certDate: string;
  certStatus: string;
  userOrder: FinalOrder;
  object: {};
  private destroy: Subject<boolean> = new Subject<boolean>();
  private destroyed$: ReplaySubject<any> = new ReplaySubject<any>(1);
  public currentLanguage: string;
  public certificateError = false;
  bonusesRemaining: boolean;
  popupConfig = {
    hasBackdrop: true,
    closeOnNavigation: true,
    disableClose: true,
    panelClass: 'popup-dialog-container',
    data: {
      popupTitle: 'confirmation.title',
      popupSubtitle: 'confirmation.subTitle',
      popupConfirm: 'confirmation.cancel',
      popupCancel: 'confirmation.dismiss'
    }
  };

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private shareFormService: UBSOrderFormService,
    private translate: TranslateService,
    private localStorageService: LocalStorageService,
    router: Router,
    dialog: MatDialog
  ) {
    super(router, dialog);
    this.initForm();
  }

  ngOnInit(): void {
    this.takeOrderData();
  }

  getFormValues(): boolean {
    return this.showTotal > 0;
  }

  translateWords(key: string, variable) {
    return this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((item) => (variable = item));
  }

  initForm() {
    this.orderDetailsForm = this.fb.group({
      certificate: new FormControl('', [Validators.minLength(8), Validators.pattern(this.certificatePattern)]),
      orderComment: new FormControl(''),
      bonus: new FormControl('no'),
      shop: new FormControl('no'),
      additionalCertificates: this.fb.array([]),
      additionalOrders: this.fb.array(['']),
      orderSum: new FormControl(0, [Validators.required, Validators.min(500)])
    });
  }

  public takeOrderData() {
    this.currentLanguage = this.localStorageService.getCurrentLanguage();
    this.orderService
      .getOrders(this.currentLanguage)
      .pipe(takeUntil(this.destroy))
      .subscribe((orderData: OrderDetails) => {
        this.orders = this.shareFormService.orderDetails;
        this.bags = this.orders.bags;
        this.points = this.orders.points;
        this.bags.forEach((bag) => {
          bag.quantity = null;
          this.orderDetailsForm.addControl('quantity' + String(bag.id), new FormControl(0, [Validators.min(0), Validators.max(999)]));
        });
      });
  }

  changeForm() {
    this.orderDetailsForm.patchValue({
      orderSum: this.showTotal
    });
  }

  changeOrderDetails() {
    this.shareFormService.orderDetails.pointsToUse = this.pointsUsed;
    this.shareFormService.orderDetails.certificates = this.certificates;
    this.shareFormService.orderDetails.additionalOrders = this.additionalOrders.value;
    this.shareFormService.orderDetails.orderComment = this.orderDetailsForm.value.orderComment;
    this.shareFormService.orderDetails.certificatesSum = this.showCertificateUsed;
    this.shareFormService.orderDetails.pointsSum = this.pointsUsed;
    this.shareFormService.orderDetails.total = this.showTotal;
    this.shareFormService.orderDetails.finalSum = this.finalSum;
    this.shareFormService.changeOrderDetails();
  }

  get certificate() {
    return this.orderDetailsForm.get('certificate');
  }

  get additionalCertificates() {
    return this.orderDetailsForm.get('additionalCertificates') as FormArray;
  }

  get additionalOrders() {
    return this.orderDetailsForm.get('additionalOrders') as FormArray;
  }

  get orderComment() {
    return this.orderDetailsForm.get('orderComment') as FormArray;
  }

  get shop() {
    return this.orderDetailsForm.get('shop') as FormArray;
  }

  private calculateTotal(): void {
    this.total = 0;
    this.bags.forEach((bag) => {
      this.total += bag.price * bag.quantity;
    });
    this.showTotal = this.total;
    this.changeForm();

    if (this.total < this.minOrderValue && this.orderDetailsForm.dirty) {
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
        this.finalSum = this.total - this.certificateSum - this.pointsUsed;
        this.showCertificateUsed = this.certificateSum;
      } else {
        this.finalSum = 0;
        this.certificateLeft = this.certificateSum - this.total;
        this.showCertificateUsed = this.total;
        this.points = this.orders.points + this.certificateLeft;
      }
      this.bonusesRemaining = this.certificateSum > 0;
      this.showCertificateUsed = this.certificateSum;
    }
    this.changeOrderDetails();
  }

  public ecoStoreValidation() {
    const orderValues = [...new Set(this.additionalOrders.value)];
    const checkDuplicate = orderValues.length === this.additionalOrders.length;
    let counter = 0;
    this.additionalOrders.controls.forEach((controller) => {
      if (controller.valid && controller.dirty && controller.value !== '' && checkDuplicate) {
        counter++;
      }
    });

    if (counter === this.additionalOrders.controls.length) {
      this.displayOrderBtn = true;
    } else {
      this.displayOrderBtn = false;
    }
  }

  public changeShopRadioBtn() {
    this.orderDetailsForm.controls.shop.setValue('yes');
  }

  clearOrderValues(): void {
    this.additionalOrders.controls[0].setValue('');
    if (this.additionalOrders.controls.length > 1) {
      this.additionalOrders.controls.splice(1);
    }
    this.ecoStoreValidation();
  }

  onQuantityChange(): void {
    this.bags.forEach((bag) => {
      const valueName = 'quantity' + String(bag.id);
      if (+this.orderDetailsForm.controls[valueName].value === 0) {
        bag.quantity = null;
      } else {
        bag.quantity = this.orderDetailsForm.controls[valueName].value;
      }
    });
    this.calculateTotal();
  }

  calculatePoints(): void {
    if (this.certificateSum <= 0) {
      this.showTotal = this.total;
      this.points > this.total ? (this.pointsUsed = this.total) : (this.pointsUsed = this.points);
      this.points > this.total ? (this.points = this.points - this.total) : (this.points = 0);
      this.points > this.total ? (this.total = 0) : (this.total = this.total - this.pointsUsed);
      this.finalSum = this.showTotal - this.pointsUsed - this.certificateSum;
    } else {
      this.points > this.total ? (this.pointsUsed = this.total - this.certificateSum) : (this.pointsUsed = this.points);
      this.points > this.total ? (this.total = 0) : (this.total = this.total - this.pointsUsed);
      this.points > this.showTotal ? (this.points = this.points - this.showTotal) : (this.points = 0);
      this.finalSum = this.showTotal - this.pointsUsed - this.certificateSum;
    }

    if (this.finalSum < 0) {
      this.finalSum = 0;
    }
  }

  resetPoints(): void {
    this.showTotal = this.total;
    this.certificateSum = 0;
    this.finalSum = this.total;
    this.points = this.orders.points;
    this.certificateReset(true);
    this.calculateTotal();
  }

  addOrder(): void {
    const additionalOrder = new FormControl('', [Validators.minLength(10)]);
    this.additionalOrders.push(additionalOrder);
    this.ecoStoreValidation();
  }

  addCertificate(): void {
    this.additionalCertificates.push(this.fb.control('', [Validators.minLength(8), Validators.pattern(/(?!0000)\d{4}-(?!0000)\d{4}/)]));
  }

  private clearAdditionalCertificate(index: number) {
    this.additionalCertificates.removeAt(index);
    this.certStatuses.splice(index, 1);
    this.calculateCertificates(this.certificates);
  }

  deleteCertificate(index: number): void {
    if (this.displayCert === false) {
      this.certificates.splice(index, 1);
      this.clearAdditionalCertificate(index);
    } else {
      this.certificates.splice(index + 1, 1);
      this.clearAdditionalCertificate(index);
    }
  }

  addedCertificateSubmit(index: number): void {
    if (!this.certificates.includes(this.additionalCertificates.value[index])) {
      this.certificates.push(this.additionalCertificates.value[index]);
      this.certStatuses.push(true);
      this.calculateCertificates(this.certificates);
    }
  }

  calculateCertificates(arr): void {
    if (arr.length > 0) {
      this.certificateSum = 0;
      arr.forEach((certificate, index) => {
        this.orderService
          .processCertificate(certificate)
          .pipe(takeUntil(this.destroy))
          .subscribe(
            (cert) => {
              this.certificateMatch(cert);
              if (this.total < this.certificateSum) {
                this.certSize = true;
              }
              this.certificateError = false;
              this.calculateTotal();
            },
            (error) => {
              if (error.status === 404) {
                arr.splice(index, 1);
                this.certificateError = true;
              }
            }
          );
      });
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

  certificateReset(resetMessage: boolean): void {
    if (resetMessage) {
      this.certDate = '';
      this.certStatus = '';
      this.addCert = true;
    }

    this.bonusesRemaining = false;
    this.showCertificateUsed = null;
    this.addCert = false;
    this.displayCert = false;
    this.certificates = [];
    this.certSize = false;
    this.certificateLeft = 0;
    this.certificateSum = 0;
    this.pointsUsed = 0;
    this.orderDetailsForm.patchValue({ certificate: '' });
    this.calculateCertificates(this.certificates);
  }

  certificateMatch(cert): void {
    if (cert.certificateStatus === CertificateStatus.ACTIVE || cert.certificateStatus === CertificateStatus.NEW) {
      this.certificateSum += cert.certificatePoints;
      this.certDate = cert.certificateDate;
      this.certStatus = cert.certificateStatus;
      this.displayCert = true;
      this.addCert = true;
    }

    if (cert.certificateStatus === CertificateStatus.USED || cert.certificateStatus === CertificateStatus.EXPIRED) {
      this.certDate = cert.certificateDate;
      this.certStatus = cert.certificateStatus;
    }
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
