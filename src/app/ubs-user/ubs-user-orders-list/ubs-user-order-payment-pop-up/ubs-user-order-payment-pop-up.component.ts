import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrderService } from 'src/app/main/component/ubs/services/order.service';

@Component({
  selector: 'app-ubs-user-order-payment-pop-up',
  templateUrl: './ubs-user-order-payment-pop-up.component.html',
  styleUrls: ['./ubs-user-order-payment-pop-up.component.scss']
})
export class UbsUserOrderPaymentPopUpComponent implements OnInit {
  public totalSum: number = 0;
  public bonusValue: number = 0;
  public selectedRadio: string = 'no';
  public certificatePattern = /(?!0000)\d{4}-(?!0000)\d{4}/;
  public certificateMask: string = '0000-0000';
  public orderDetailsForm: FormGroup;
  public certificates: any = [];
  public certStatuses: boolean[] = [];
  public cancelCertBtn: boolean = false;
  public certificateError: boolean = false;

  constructor(private fb: FormBuilder, private orderService: OrderService, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.totalSum = this.data.price;
    this.initForm();
  }

  public initForm() {
    this.orderDetailsForm = this.fb.group({
      bonus: new FormControl('no', [Validators.required]),
      paymentSystem: new FormControl('Fondy', [Validators.required]),
      formArrayCertificates: this.fb.array([new FormControl('', [Validators.minLength(8), Validators.pattern(this.certificatePattern)])])
    });
  }

  get formArrayCertificates() {
    return this.orderDetailsForm.get('formArrayCertificates') as FormArray;
  }

  public certificateSubmit(index: number): void {
    if (!this.certificates.includes(this.formArrayCertificates.value[index])) {
      this.certificates.push(this.formArrayCertificates.value[index]);
      this.certStatuses.push(true);
      this.calculateCertificates(this.certificates);
    }
  }

  public calculateCertificates(arr): void {
    this.cancelCertBtn = true;
    console.log(arr);
    if (arr.length > 0) {
      arr.forEach((certificate, index) => {
        this.orderService.processCertificate(certificate).subscribe(
          (responce) => {
            console.log(responce);
            console.log('Index = ', index);
            if (responce.certificateStatus === 'ACTIVE') {
              this.totalSum -= responce.certificatePoints;
            } else {
              this.certificateError = true;
            }
          },
          (error) => {
            if (error.status === 404) {
              arr.splice(index, 1);
              this.certificateError = true;
            }
          }
        );
      });
    }
  }

  public deleteCertificate(index: number): void {
    this.certificateError = false;
    this.certificates.splice(index, 1);
    this.cancelCertBtn = false;
  }
}
