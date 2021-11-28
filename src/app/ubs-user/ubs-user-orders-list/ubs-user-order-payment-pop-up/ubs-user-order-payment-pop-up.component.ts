import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrderService } from 'src/app/main/component/ubs/services/order.service';
import { ResponceOrderFondyModel } from '../models/ResponceOrderFondyModel';
import { OrderFondyClientDto } from '../models/OrderFondyClientDto';

@Component({
  selector: 'app-ubs-user-order-payment-pop-up',
  templateUrl: './ubs-user-order-payment-pop-up.component.html',
  styleUrls: ['./ubs-user-order-payment-pop-up.component.scss']
})
export class UbsUserOrderPaymentPopUpComponent implements OnInit {
  public totalSum = 0;
  public bonusValue = 0;
  public selectedRadio: string;
  public certificatePattern = /(?!0000)\d{4}-(?!0000)\d{4}/;
  public certificateMask = '0000-0000';
  public orderDetailsForm: FormGroup;
  public certificates: any = [];
  public certStatuses: boolean[] = [];
  public cancelCertBtn = false;
  public certificateError = false;
  public orderId = 0;
  public certificateStatusActive = false;
  public certificateSum = 0;
  public certificateDate: string;
  public orderFondyClientDto: OrderFondyClientDto;

  constructor(private fb: FormBuilder, private orderService: OrderService, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.initForm();
    this.totalSum = this.data.price;
    this.orderId = this.data.orderId;
    this.orderFondyClientDto = new OrderFondyClientDto();
  }

  public initForm() {
    this.orderDetailsForm = this.fb.group({
      bonus: new FormControl('no', [Validators.required]),
      paymentSystem: new FormControl('Fondy', [Validators.required]),
      formArrayCertificates: this.fb.array([new FormControl('', [Validators.minLength(8), Validators.pattern(this.certificatePattern)])])
    });
  }

  get formArrayCertificates(): FormArray {
    return this.orderDetailsForm.get('formArrayCertificates') as FormArray;
  }

  get formPaymentSystem(): FormControl {
    return this.orderDetailsForm.get('paymentSystem') as FormControl;
  }

  public certificateSubmit(index: number): void {
    if (!this.certificates.includes(this.formArrayCertificates.value[index])) {
      this.certificates.push(this.formArrayCertificates.value[index]);
      this.certStatuses.push(true);
      this.calculateCertificates(this.certificates);
    }
  }

  public calculateCertificates(certificates): void {
    this.certificateSum = 0;
    this.cancelCertBtn = true;
    this.certificateStatusActive = false;
    if (certificates.length > 0) {
      certificates.forEach((certificate, index) => {
        this.orderService.processCertificate(certificate).subscribe(
          (responce) => {
            if (responce.certificateStatus === 'ACTIVE') {
              this.certificateDate = responce.certificateDate;
              this.certificateSum = responce.certificatePoints;
              this.totalSum -= responce.certificatePoints;
              if (this.totalSum < 0) {
                this.totalSum = 0;
              }
              this.certificateStatusActive = true;
            } else {
              this.certificateError = true;
            }
          },
          (error) => {
            if (error.status === 404) {
              certificates.splice(index, 1);
              this.certificateError = true;
            }
          }
        );
      });
    }
  }

  public deleteCertificate(index: number): void {
    this.formArrayCertificates.controls[index].reset();
    this.totalSum += this.certificateSum;
    this.certificateStatusActive = false;
    this.certificateError = false;
    this.certificates.splice(index, 1);
    this.certStatuses.splice(index, 1);
    this.cancelCertBtn = false;
  }

  public processOrder(): void {
    this.orderFondyClientDto.orderId = this.orderId;
    this.orderFondyClientDto.sum = this.totalSum;

    if (this.formPaymentSystem.value === 'Fondy') {
      this.orderService.processOrderFondyFromUserOrderList(this.orderFondyClientDto).subscribe((responce: ResponceOrderFondyModel) => {
        document.location.href = responce.link;
      });
    }
  }
}
