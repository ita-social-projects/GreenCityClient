import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrderService } from 'src/app/main/component/ubs/services/order.service';
import { ResponceOrderFondyModel } from '../models/ResponceOrderFondyModel';
import { OrderFondyClientDto } from '../models/OrderFondyClientDto';
import { IOrderDetailsUser } from '../models/IOrderDetailsUser.interface';
import { ICertificate } from '../models/ICertificate.interface';

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
  public orderFondyClientDto: OrderFondyClientDto;

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

  constructor(private fb: FormBuilder, private orderService: OrderService, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.initForm();
    this.certificateStatus.push(true);
    this.orderFondyClientDto = new OrderFondyClientDto();
  }

  public createCertificateItem(): FormGroup {
    return this.fb.group({
      certificateCode: new FormControl('', [Validators.minLength(8), Validators.pattern(this.certificatePattern)]),
      certificateSum: new FormControl(0, [Validators.min(0)]),
      activeButtonState: new FormControl(true)
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

  public calculateCertificate(certificate: FormControl) {
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

  public processOrder(): void {
    this.orderFondyClientDto.orderId = this.userOrder.id;
    this.orderFondyClientDto.sum = this.userOrder.sum;

    if (this.formPaymentSystem.value === 'Fondy') {
      this.orderService.processOrderFondyFromUserOrderList(this.orderFondyClientDto).subscribe((responce: ResponceOrderFondyModel) => {
        document.location.href = responce.link;
      });
    }
  }
}
