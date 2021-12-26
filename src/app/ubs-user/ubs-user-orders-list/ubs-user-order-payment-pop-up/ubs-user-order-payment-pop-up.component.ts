import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrderService } from 'src/app/main/component/ubs/services/order.service';
import { ResponceOrderFondyModel } from '../models/ResponceOrderFondyModel';
import { OrderClientDto } from '../models/OrderClientDto';
import { IOrderDetailsUser } from '../models/IOrderDetailsUser.interface';
import { ICertificate } from '../models/ICertificate.interface';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ResponceOrderLiqPayModel } from '../models/ResponceOrderLiqPayModel';
import { Router } from '@angular/router';

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

  public userOrder: IOrderDetailsUser = {
    id: this.data.orderId,
    sum: this.data.price,
    bonusValue: 0
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
    @Inject(MAT_DIALOG_DATA) public data: any,
    public router: Router
  ) {}

  public ngOnInit(): void {
    this.initForm();
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

  public processOrder(): void {
    this.fillOrderClientDto();

    if (this.formPaymentSystem.value === 'Fondy') {
      this.orderService.processOrderFondyFromUserOrderList(this.orderClientDto).subscribe((responce: ResponceOrderFondyModel) => {
        responce.link === null ? this.router.navigate(['ubs', 'confirm']) : (document.location.href = responce.link);
      });
    } else {
      this.liqPayButton[0].click();
    }
  }

  public orderOptionPayment(event: Event): void {
    this.selectedPayment = (event.target as HTMLInputElement).value;
    this.fillOrderClientDto();

    if (this.selectedPayment === 'LiqPay') {
      this.dataLoadingLiqPay = true;
      this.orderService.processOrderLiqPayFromUserOrderList(this.orderClientDto).subscribe((responce: ResponceOrderLiqPayModel) => {
        this.liqPayButtonForm = this.sanitizer.bypassSecurityTrustHtml(responce.liqPayButton);
        setTimeout(() => {
          this.liqPayButton = document.getElementsByName('btn_text');
          this.dataLoadingLiqPay = false;
        }, 0);
      });
    }
  }
}
