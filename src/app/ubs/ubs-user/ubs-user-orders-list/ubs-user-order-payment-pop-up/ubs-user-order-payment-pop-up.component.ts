import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
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

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: IOrderData,
    private localStorageService: LocalStorageService,
    private ubsOrderFormService: UBSOrderFormService,
    public router: Router
  ) {}

  public ngOnInit(): void {
    this.initForm();
    this.isLiqPayLink = false;
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
      (responce) => {
        if (responce.certificateStatus === 'ACTIVE') {
          this.userCertificate.certificateSum = responce.certificatePoints;
          this.userCertificate.certificateDate = responce.certificateDate;
          certificate.value.certificateSum = responce.certificatePoints;
          this.userOrder.sum -= responce.certificatePoints;
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
    this.fillOrderClientDto();
    this.localStorageService.clearPaymentInfo();
    this.localStorageService.setUserPagePayment(true);

    if (this.formPaymentSystem.value === 'Fondy') {
      this.orderService.processOrderFondyFromUserOrderList(this.orderClientDto).subscribe((responce: ResponceOrderFondyModel) => {
        if (responce.link) {
          this.localStorageService.setUbsFondyOrderId(this.orderClientDto.orderId);
          document.location.href = responce.link;
        } else {
          this.redirectionToConfirmPage();
        }
      });
    } else {
      if (this.isLiqPayLink) {
        this.localStorageService.setUbsOrderId(this.orderClientDto.orderId);
        this.liqPayButton[0].click();
      } else {
        this.redirectionToConfirmPage();
      }
    }
  }

  public orderOptionPayment(event: Event): void {
    this.selectedPayment = (event.target as HTMLInputElement).value;
    this.fillOrderClientDto();

    if (this.selectedPayment === 'LiqPay') {
      this.dataLoadingLiqPay = true;
      this.orderService.processOrderLiqPayFromUserOrderList(this.orderClientDto).subscribe(async (responce: ResponceOrderLiqPayModel) => {
        if (!responce.liqPayButton) {
          this.isLiqPayLink = false;
        } else {
          this.isLiqPayLink = true;
          this.liqPayButtonForm = await this.sanitizer.bypassSecurityTrustHtml(responce.liqPayButton);
          this.liqPayButton = document.getElementsByName('btn_text');
          this.dataLoadingLiqPay = false;
        }
      });
    }
  }

  public bunusOption(event: MatRadioChange): void {}
}
