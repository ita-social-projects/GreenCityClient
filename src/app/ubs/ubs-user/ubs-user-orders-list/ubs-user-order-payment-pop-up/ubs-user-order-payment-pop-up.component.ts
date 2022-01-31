import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrderService } from 'src/app/ubs/ubs/services/order.service';
import { ResponceOrderFondyModel } from '../models/ResponceOrderFondyModel';
import { OrderClientDto } from '../models/OrderClientDto';
import { IOrderDetailsUser } from '../models/IOrderDetailsUser.interface';
import { ICertificate } from '../models/ICertificate.interface';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ResponceOrderLiqPayModel } from '../models/ResponceOrderLiqPayModel';
import { Router } from '@angular/router';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { IOrderData } from '../models/IOrderData.interface';
import { UBSOrderFormService } from 'src/app/ubs/ubs/services/ubs-order-form.service';
import { MatRadioChange } from '@angular/material/radio';
import { IBonusInfo } from '../models/IBonusInfo.interface';

@Component({
  selector: 'app-ubs-user-order-payment-pop-up',
  templateUrl: './ubs-user-order-payment-pop-up.component.html',
  styleUrls: ['./ubs-user-order-payment-pop-up.component.scss']
})
export class UbsUserOrderPaymentPopUpComponent implements OnInit {
  public selectedRadio: string;
  public certificatePattern = /(?!0000)\d{4}-(?!0000)\d{4}/;
  public certificateMask = '0000-0000';
  public orderDetailsForm: FormGroup;
  public certificateStatus: boolean[] = [];
  public orderClientDto: OrderClientDto;
  public selectedPayment: string;
  public isUseBonuses: boolean;
  public liqPayButtonForm: SafeHtml;
  public liqPayButton: NodeListOf<HTMLElement>;
  public dataLoadingLiqPay: boolean;
  public isLiqPayLink: boolean;

  public userOrder: IOrderDetailsUser = {
    id: this.data.orderId,
    sum: this.data.price,
    bonusValue: this.data.bonuses
  };

  public userCertificate: ICertificate = {
    certificateStatusActive: false,
    certificateError: false,
    certificateSum: 0,
    certificates: []
  };

  public bonusInfo: IBonusInfo = {
    left: 0,
    used: 0
  };

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: IOrderData,
    public dialogRef: MatDialogRef<UbsUserOrderPaymentPopUpComponent>,
    private localStorageService: LocalStorageService,
    private ubsOrderFormService: UBSOrderFormService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.isLiqPayLink = false;
    this.isUseBonuses = false;
    this.dataLoadingLiqPay = false;
    this.certificateStatus.push(true);
    this.orderClientDto = new OrderClientDto();
  }

  public createCertificateItem(): FormGroup {
    return this.fb.group({
      certificateCode: new FormControl('', [Validators.minLength(8), Validators.pattern(this.certificatePattern)]),
      certificateSum: new FormControl(0, [Validators.min(0)])
    });
  }

  public initForm(): void {
    this.orderDetailsForm = this.fb.group({
      bonus: new FormControl('no', [Validators.required]),
      paymentSystem: new FormControl('Fondy', [Validators.required]),
      formArrayCertificates: this.fb.array([this.createCertificateItem()])
    });
  }

  get formArrayCertificates(): FormArray {
    return this.orderDetailsForm.get('formArrayCertificates') as FormArray;
  }

  get formPaymentSystem(): FormControl {
    return this.orderDetailsForm.get('paymentSystem') as FormControl;
  }

  public certificateSubmit(index: number, certificate: FormControl): void {
    if (!this.userCertificate.certificates.includes(this.formArrayCertificates.value[index])) {
      this.userCertificate.certificates.push(this.formArrayCertificates.value[index]);
      this.calculateCertificate(certificate);
      this.certificateStatus[index] = false;
    }
  }

  public calculateCertificate(certificate: FormControl): void {
    this.userCertificate.certificateSum = 0;
    this.userCertificate.certificateStatusActive = false;
    this.orderService.processCertificate(certificate.value.certificateCode).subscribe(
      (response) => {
        if (response.certificateStatus === 'ACTIVE') {
          this.userCertificate.certificateSum = response.certificatePoints;
          this.userCertificate.certificateDate = response.certificateDate;
          certificate.value.certificateSum = response.certificatePoints;
          this.userOrder.sum -= response.certificatePoints;
          if (this.userOrder.sum < 0) {
            this.userOrder.sum = 0;
          }
          this.userCertificate.certificateStatusActive = true;
        } else {
          this.userCertificate.certificateError = true;
        }
      },
      (error) => {
        if (error.status === 404) {
          this.userCertificate.certificateError = true;
        }
      }
    );
  }

  public deleteCertificate(index: number, certificate: FormControl): void {
    this.userOrder.sum += certificate.value.certificateSum;
    this.userCertificate.certificateStatusActive = false;
    this.userCertificate.certificateError = false;

    if (this.formArrayCertificates.controls.length > 1) {
      this.certificateStatus.splice(index, 1);
      this.formArrayCertificates.removeAt(index);
    } else {
      this.certificateStatus[index] = true;
      this.formArrayCertificates.controls[index].reset();
    }

    this.userCertificate.certificates.splice(index, 1);
  }

  public addNewCertificate(): void {
    this.formArrayCertificates.push(this.createCertificateItem());
    this.userCertificate.certificateStatusActive = false;
    this.certificateStatus.push(true);
  }

  public fillOrderClientDto(): void {
    this.orderClientDto.orderId = this.userOrder.id;
    if (this.userCertificate.certificates.length) {
      this.orderClientDto.certificates = [];
      this.userCertificate.certificates.forEach((certificate) => {
        this.orderClientDto.certificates.push(certificate.certificateCode);
      });
    }
  }

  public formOrderWithoutPaymentSystems(id: number): void {
    this.ubsOrderFormService.transferOrderId(id);
    this.ubsOrderFormService.setOrderResponseErrorStatus(false);
    this.ubsOrderFormService.setOrderStatus(true);
  }

  public redirectionToConfirmPage(): void {
    this.formOrderWithoutPaymentSystems(this.orderClientDto.orderId);
    this.router.navigate(['ubs', 'confirm']);
  }

  public processOrder(): void {
    this.dataLoadingLiqPay = true;
    this.fillOrderClientDto();
    this.localStorageService.clearPaymentInfo();
    this.localStorageService.setUserPagePayment(true);

    if (this.formPaymentSystem.value === 'Fondy') {
      this.orderService.processOrderFondyFromUserOrderList(this.orderClientDto).subscribe(
        (response: ResponceOrderFondyModel) => {
          if (response.link) {
            this.localStorageService.setUbsFondyOrderId(this.orderClientDto.orderId);
            document.location.href = response.link;
          } else {
            this.redirectionToConfirmPage();
            this.dialogRef.close();
          }
        },
        () => {
          this.dataLoadingLiqPay = false;
        }
      );
    }

    if (this.formPaymentSystem.value === 'LiqPay') {
      this.orderService.processOrderLiqPayFromUserOrderList(this.orderClientDto).subscribe(
        (response: ResponceOrderLiqPayModel) => {
          if (!response.liqPayButton) {
            this.redirectionToConfirmPage();
            this.dialogRef.close();
          } else {
            this.isLiqPayLink = true;
            this.liqPayButtonForm = this.sanitizer.bypassSecurityTrustHtml(response.liqPayButton);
            setTimeout(() => {
              this.liqPayButton = document.getElementsByName('btn_text');
              this.localStorageService.setUbsOrderId(this.orderClientDto.orderId);
              this.liqPayButton[0].click();
            }, 0);
          }
        },
        () => {
          this.dataLoadingLiqPay = false;
        }
      );
    }
  }

  public orderOptionPayment(event: Event): void {
    this.selectedPayment = (event.target as HTMLInputElement).value;
    this.fillOrderClientDto();
  }

  public bonusOption(event: MatRadioChange): void {
    if (event.value === 'yes') {
      this.isUseBonuses = true;
      if (this.userOrder.sum > this.userOrder.bonusValue) {
        this.userOrder.sum -= this.userOrder.bonusValue;
        this.bonusInfo.used = this.userOrder.bonusValue;
      } else {
        this.bonusInfo.used = this.userOrder.sum;
        this.bonusInfo.left = this.userOrder.bonusValue - this.userOrder.sum;
        this.userOrder.sum = 0;
      }
      this.orderClientDto.pointsToUse = this.bonusInfo.used;
    } else {
      this.userOrder.sum += this.bonusInfo.used;
      this.bonusInfo.left = 0;
      this.bonusInfo.used = 0;
      this.isUseBonuses = false;
    }
  }
}
