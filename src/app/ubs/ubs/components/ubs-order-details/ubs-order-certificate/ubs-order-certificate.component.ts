import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { OrderService } from '../../../services/order.service';
import { Subject } from 'rxjs';
import { CertificateStatus } from '../../../certificate-status.enum';
import { Bag, ICertificateResponse, Locations, OrderDetails, Certificate } from '../../../models/ubs.interface';
import { UBSOrderFormService } from '../../../services/ubs-order-form.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Masks, Patterns } from 'src/assets/patterns/patterns';

@Component({
  selector: 'app-ubs-order-certificate',
  templateUrl: './ubs-order-certificate.component.html',
  styleUrls: ['./ubs-order-certificate.component.scss']
})
export class UbsOrderCertificateComponent implements OnInit, OnDestroy {
  @Input() showTotal;
  @Input() bags: Bag[];
  @Input() defaultPoints: number;
  @Input() points: number;
  @Input() pointsUsed: number;
  @Input() sumForActCertificate: number;
  @Output() newItemEvent = new EventEmitter<object>();
  fullCertificate: number;

  public certificates: Certificate = {
    codes: [],
    points: [],
    activatedStatus: [],
    creationDates: [],
    dateOfUses: [],
    expirationDates: [],
    failed: [],
    status: [],
    error: []
  };

  orders: OrderDetails;
  orderDetailsForm: FormGroup;
  minOrderValue = 500;
  certificateSum = 0;
  total = 0;
  finalSum = 0;
  cancelCertBtn = false;
  displayMinOrderMes = false;
  displayCert = false;
  addCert: boolean;
  onSubmit = true;
  order: {};
  certificateMask = Masks.certificateMask;
  ecoStoreMask = Masks.ecoStoreMask;
  servicesMask = Masks.servicesMask;
  certificatePattern = Patterns.serteficatePattern;
  commentPattern = Patterns.ubsCommentPattern;
  additionalOrdersPattern = Patterns.ordersPattern;
  certSize = false;
  showCertificateUsed = 0;
  certificateLeft = 0;
  public destroy: Subject<boolean> = new Subject<boolean>();
  bonusesRemaining: boolean;
  public locations: Locations[];
  clickOnYes = true;
  clickOnNo = true;
  public alreadyEnteredCert: string[] = [];
  public isNotExistCertificate = false;

  constructor(
    private fb: FormBuilder,
    public orderService: OrderService,
    public shareFormService: UBSOrderFormService,
    private localStorageService: LocalStorageService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    localStorage.removeItem('UBSorderData');
    this.shareFormService.addCert.pipe(takeUntil(this.destroy)).subscribe((item: boolean) => {
      this.addCert = item;
    });
    this.orderService.locationSubject.pipe(takeUntil(this.destroy)).subscribe(() => {
      if (this.localStorageService.getUbsOrderData()) {
        this.calculateTotal();
      }
    });
  }

  public disableAddCertificate() {
    return this.certificates.codes.length === this.formArrayCertificates.length;
  }

  initForm() {
    this.orderDetailsForm = this.fb.group({
      bonus: new FormControl('no'),
      formArrayCertificates: this.fb.array([new FormControl('', [Validators.minLength(8), Validators.pattern(this.certificatePattern)])])
    });
  }

  get formArrayCertificates() {
    return this.orderDetailsForm.get('formArrayCertificates') as FormArray;
  }

  private certificateDateTreat(date: string): string {
    return date?.split('-').reverse().join('.');
  }

  public setNewValue(value: object) {
    this.newItemEvent.emit(value);
  }

  sendDataToParents() {
    const certificateObj = {
      certificates: this.formArrayCertificates.value[0] ? this.formArrayCertificates.value : [],
      showCertificateUsed: this.showCertificateUsed,
      certificateSum: this.fullCertificate,
      displayCert: this.displayCert,
      finalSum: this.finalSum,
      pointsUsed: this.pointsUsed,
      points: this.points,
      isBonus: this.orderDetailsForm.get('bonus').value
    };
    this.setNewValue(certificateObj);
  }

  certificateMatch(cert: ICertificateResponse): void {
    if (cert.certificateStatus === CertificateStatus.ACTIVE || cert.certificateStatus === CertificateStatus.NEW) {
      this.certificateSum += cert.points;
      this.displayCert = true;
      this.shareFormService.changeAddCertButtonVisibility(true);
    }
    this.certificates.failed.push(
      cert.certificateStatus === CertificateStatus.EXPIRED || cert.certificateStatus === CertificateStatus.USED
    );
    if (this.certificates.failed[this.certificates.failed.length - 1]) {
      this.certificates.codes.splice(-1);
    }
    this.certificateSum =
      this.certificates.failed[this.certificates.failed.length - 1] && this.formArrayCertificates.length === 1 ? 0 : this.certificateSum;
    this.certificates.creationDates.push(this.certificateDateTreat(cert.creationDate));
    this.certificates.dateOfUses.push(this.certificateDateTreat(cert.dateOfUse));
    this.certificates.expirationDates.push(this.certificateDateTreat(cert.expirationDate));
    this.certificates.points.push(cert.points);
    this.certificates.status.push(cert.certificateStatus);
    this.fullCertificate = this.certificateSum;
  }

  public calculateTotal(): void {
    this.total = 0;
    this.bags.forEach((bag) => {
      this.total += bag.price * bag.quantity;
    });
    this.showTotal = this.total;
    this.displayMinOrderMes = this.total < this.minOrderValue && this.orderDetailsForm.dirty;
    this.onSubmit = this.displayMinOrderMes;
    this.finalSum = this.total - this.pointsUsed;
    if (this.certificateSum > 0) {
      if (this.total > this.certificateSum) {
        this.certificateLeft = 0;
        if (this.finalSum <= this.certificateSum && this.pointsUsed > 0) {
          this.points = this.pointsUsed - this.finalSum;
          this.pointsUsed = this.finalSum;
          this.finalSum = 0;
        } else {
          this.finalSum = this.total - this.certificateSum - this.pointsUsed;
        }
        this.showCertificateUsed = this.certificateSum;
      } else {
        this.finalSum = 0;
        this.points = this.points + this.pointsUsed;
        this.pointsUsed = 0;
        this.orderDetailsForm.controls.bonus.setValue('no');
        this.certificateLeft = this.certificateSum - this.total;
        this.showCertificateUsed = this.total;
      }
      this.bonusesRemaining = this.certificateSum > 0;
    } else {
      this.certificateLeft = 0;
      this.finalSum = this.total - this.pointsUsed;
      this.showCertificateUsed = this.certificateSum;
      if (this.finalSum < 0) {
        this.points = -this.finalSum;
        this.pointsUsed = this.total;
        this.finalSum = 0;
      }
    }
    if (this.orderDetailsForm.controls.bonus.value === 'yes') {
      this.resetPoints();
      this.calculatePoints();
    } else {
      this.sendDataToParents();
    }
    this.changeOrderDetails();
  }

  changeOrderDetails() {
    this.shareFormService.orderDetails.pointsToUse = this.pointsUsed;
    this.shareFormService.orderDetails.certificates = this.certificates.codes;
    this.shareFormService.orderDetails.certificatesSum = this.showCertificateUsed;
    this.shareFormService.orderDetails.pointsSum = this.pointsUsed;
    this.shareFormService.orderDetails.total = this.showTotal;
    this.shareFormService.orderDetails.finalSum = this.finalSum;
    this.shareFormService.changeOrderDetails();
  }

  public particalResetStoragedCertificates(): void {
    this.certificates.creationDates = [];
    this.certificates.dateOfUses = [];
    this.certificates.expirationDates = [];
    this.certificates.points = [];
    this.certificates.failed = [];
    this.certificates.status = [];
  }

  calculateCertificates(): void {
    if (this.certificates.codes.length) {
      this.cancelCertBtn = true;
      this.particalResetStoragedCertificates();

      this.certificates.codes.forEach((certificate, index) => {
        this.orderService
          .processCertificate(certificate)
          .pipe(takeUntil(this.destroy))
          .subscribe(
            (cert) => {
              this.certificateMatch(cert);
              if (this.total < this.certificateSum) {
                this.certSize = true;
              }
              this.calculateTotal();
              this.cancelCertBtn = false;
            },
            (error) => {
              this.cancelCertBtn = false;
              if (error.status === 404) {
                this.isNotExistCertificate = true;
                this.certificates.codes.splice(index, 1);
                this.certificates.activatedStatus.splice(index, 1);
                this.certificates.creationDates.splice(index, 1);
                this.certificates.dateOfUses.splice(index, 1);
                this.certificates.expirationDates.splice(index, 1);

                this.certificates.points.splice(index, 1);
                this.certificates.status.splice(index, 1);

                this.certificates.error.push(true);
                this.certificates.failed.push(true);
              }
            }
          );
      });
    } else {
      this.calculateTotal();
    }
    this.certificateSum = 0;
  }

  addNewCertificate(): void {
    this.formArrayCertificates.push(this.fb.control('', [Validators.minLength(8), Validators.pattern(this.certificatePattern)]));
  }

  certificateReset(): void {
    const fullBonus = this.pointsUsed + this.points;
    if (this.finalSum === 0 && this.pointsUsed + this.points >= this.certificateSum && this.pointsUsed !== 0) {
      this.finalSum = this.showTotal;
      this.finalSum -= fullBonus;
      this.pointsUsed = fullBonus;
      this.points = 0;
    }
    this.clickOnYes = true;
    this.bonusesRemaining = false;
    this.showCertificateUsed = null;
    this.shareFormService.changeAddCertButtonVisibility(false);
    this.displayCert = false;

    for (const key of Object.keys(this.certificates)) {
      this.certificates[key] = [];
    }

    this.certSize = false;
    this.certificateLeft = 0;
    this.certificateSum = 0;
    this.fullCertificate = 0;
    this.formArrayCertificates.patchValue(['']);
    this.formArrayCertificates.markAsUntouched();
  }

  deleteCertificate(index: number): void {
    for (const key of Object.keys(this.certificates)) {
      this.certificates[key].splice(index, 1);
    }

    if (this.formArrayCertificates.length > 1) {
      this.formArrayCertificates.removeAt(index);
    } else {
      this.certificateReset();
    }
    this.calculateCertificates();
    this.isNotExistCertificate = false;
  }

  showCancelButton(i: number): boolean {
    const isCertActivated = this.certificates.activatedStatus[i];
    const isCertFilled = this.formArrayCertificates.controls[i].value.length > 0;
    const hasMultipleCertificates = this.formArrayCertificates.controls.length > 1;
    const isCertAlreadyEntered = this.showMessageForAlreadyEnteredCert(i);

    return (
      (isCertActivated && isCertFilled) || (hasMultipleCertificates && !isCertFilled) || isCertAlreadyEntered || this.isNotExistCertificate
    );
  }

  certificateSubmit(index: number): void {
    if (!this.certificates.codes.includes(this.formArrayCertificates.value[index])) {
      this.particalResetStoragedCertificates();

      this.certificates.codes.push(this.formArrayCertificates.value[index]);
      this.certificates.activatedStatus.push(true);
      this.certificates.error.push(false);
      this.calculateCertificates();
      this.alreadyEnteredCert.splice(0, this.alreadyEnteredCert.length);
    } else {
      this.alreadyEnteredCert.push(this.formArrayCertificates.value[index]);
    }
  }

  showMessageForAlreadyEnteredCert(i: number): boolean {
    const isCertificateExists = this.certificates.codes.includes(this.formArrayCertificates.value[i]);
    const isAlreadyEnteredCert = this.alreadyEnteredCert.length === 1;

    return isCertificateExists && isAlreadyEnteredCert && !this.showActivateCetificate(i);
  }

  showMessageForAlreadyUsedCert(i: number): boolean {
    const isUsed = this.certificates.status[i] === 'USED';
    const hasFailed = !!this.certificates.failed[i];
    const isAlreadyEntered = this.showMessageForAlreadyEnteredCert(i);
    const isNotInclude = !this.certificates.codes.includes(this.formArrayCertificates.value[i]);

    return isUsed && hasFailed && !isAlreadyEntered && isNotInclude;
  }

  showActivateButton(i: number): boolean {
    const isNotActivated = !this.certificates.activatedStatus[i];
    const isFilled = this.formArrayCertificates.controls[i].value;
    const isNotDisabledBtn = !this.disableAddCertificate();
    const isSingleCertificate = this.formArrayCertificates.controls.length === 1;
    const isAlreadyEnteredCert = !this.showMessageForAlreadyEnteredCert(i);

    const shouldShowButton = isNotActivated && isFilled && isNotDisabledBtn && !this.isNotExistCertificate;
    const isSingleCertificateAndEmpty = isSingleCertificate && !isFilled;

    return (shouldShowButton || isSingleCertificateAndEmpty) && isAlreadyEnteredCert;
  }

  public selectPointsRadioBtn(event: KeyboardEvent, radioButtonValue: string) {
    if (['Enter', 'Space', 'NumpadEnter'].includes(event.code)) {
      this.orderDetailsForm.controls.bonus.setValue(radioButtonValue);
      if (radioButtonValue === 'yes') {
        this.calculatePoints();
      } else {
        this.resetPoints();
      }
    }
  }

  public calculatePointsWithoutCertificate() {
    this.finalSum = this.showTotal;
    const totalSumIsBiggerThanPoints = this.defaultPoints > this.showTotal;
    if (totalSumIsBiggerThanPoints) {
      this.pointsUsed += this.finalSum;
      this.points = this.defaultPoints - this.finalSum;
      this.finalSum = 0;
      return;
    }
    this.pointsUsed = this.defaultPoints;
    this.points = 0;
    this.finalSum = this.showTotal - this.pointsUsed;
  }

  public calculatePointsWithCertificate() {
    this.finalSum = this.showTotal;
    const totalSumIsBiggerThanPoints = this.defaultPoints > this.finalSum - this.certificateSum;
    if (totalSumIsBiggerThanPoints) {
      this.pointsUsed = this.finalSum - this.certificateSum;
      this.points = this.defaultPoints - this.pointsUsed;
      this.finalSum = 0;
    } else {
      this.pointsUsed = this.defaultPoints;
      this.finalSum = this.finalSum - this.pointsUsed - this.certificateSum;
      this.points = 0;
    }
    if (this.finalSum < 0) {
      this.finalSum = 0;
    }
  }

  calculatePoints(): void {
    this.fullCertificate = this.certificateSum;
    if (this.certificateSum >= this.showTotal) {
      this.orderDetailsForm.controls.bonus.setValue('no');
    }
    if (this.clickOnYes && this.certificateSum < this.showTotal) {
      this.orderDetailsForm.controls.bonus.setValue('yes');
      this.clickOnNo = true;
      if (this.certificateSum <= 0) {
        this.calculatePointsWithoutCertificate();
      } else {
        this.calculatePointsWithCertificate();
      }
      if (this.finalSum < 0) {
        this.finalSum = 0;
      }
      this.sendDataToParents();
      this.clickOnYes = false;
    }
  }

  resetPoints(): void {
    if (this.clickOnNo) {
      if (this.certificateSum < this.showTotal) {
        this.orderDetailsForm.get('bonus').setValue('no');
        this.clickOnYes = true;
        this.finalSum = this.showTotal;
        this.points = this.pointsUsed + this.points;
        this.pointsUsed = 0;
        if (this.certificateSum > 0) {
          this.finalSum -= this.certificateSum;
        }
        this.sendDataToParents();
        this.points = this.showTotal + this.points;
      }
      this.clickOnNo = false;
    }
  }

  public showActivateCetificate(i: number): boolean {
    const isCertificateNotExpired = !!this.certificates.expirationDates[i];
    const isCertSize = !!this.certSize;
    const isCertNotFailed = !this.certificates.failed[i];
    const isShowTotal = this.certificateSum <= this.showTotal;

    return isCertificateNotExpired && isCertSize && isCertNotFailed && isShowTotal;
  }

  public showActivateCetificateOversum(i: number): boolean {
    return this.certSize && this.certificateSum > this.showTotal && i === this.certificates.codes.length - 1;
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
