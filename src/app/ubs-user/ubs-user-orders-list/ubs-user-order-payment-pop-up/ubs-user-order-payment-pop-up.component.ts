import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrderService } from 'src/app/main/component/ubs/services/order.service';
import { ResponceOrderFondyModel } from '../models/ResponceOrderFondyModel';
import { OrderFondyClientDto } from '../models/OrderFondyClientDto';
import { IOrderDetailsUser } from '../models/IOrderDetailsUser.interface';

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
  public certificates: string[] = [];
  public certificateStatus: boolean[] = [];
  public certificateError = false;
  public certificateStatusActive = false;
  public currentCertificateSum = 0;
  public certificateSums: Map<number, number> = new Map();
  public certificateDate: string;
  public orderFondyClientDto: OrderFondyClientDto;

  public userOrder: IOrderDetailsUser = {
    id: this.data.orderId,
    sum: this.data.price,
    bonusValue: 0
  };

  constructor(private fb: FormBuilder, private orderService: OrderService, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.initForm();
    this.certificateStatus.push(true);
    this.orderFondyClientDto = new OrderFondyClientDto();
  }

  public initForm(): void {
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

  public certificateSubmit(index: number, certificate: FormControl): void {
    if (!this.certificates.includes(this.formArrayCertificates.value[index])) {
      this.certificates.push(this.formArrayCertificates.value[index]);
      this.calculateCertificate(index, certificate);
      this.certificateStatus[index] = false;
    }
  }

  public calculateCertificate(index: number, certificate: FormControl) {
    this.currentCertificateSum = 0;
    this.certificateStatusActive = false;
    this.orderService.processCertificate(certificate.value).subscribe(
      (responce) => {
        if (responce.certificateStatus === 'ACTIVE') {
          this.certificateDate = responce.certificateDate;
          this.currentCertificateSum = responce.certificatePoints;
          this.certificateSums.set(index, this.currentCertificateSum);
          this.userOrder.sum -= responce.certificatePoints;
          if (this.userOrder.sum < 0) {
            this.userOrder.sum = 0;
          }
          this.certificateStatusActive = true;
        } else {
          this.certificateError = true;
          this.certificateSums.set(index, this.currentCertificateSum);
        }
      },
      (error) => {
        if (error.status === 404) {
          this.certificateError = true;
        }
      }
    );
  }

  public deleteCertificate(index: number): void {
    this.userOrder.sum += this.certificateSums.get(index);
    this.certificateStatusActive = false;
    this.certificateSums.delete(index);
    this.certificateError = false;

    if (this.formArrayCertificates.controls.length > 1) {
      this.certificateStatus.splice(index, 1);
      this.formArrayCertificates.removeAt(index);
    } else {
      this.certificateStatus[index] = true;
      this.formArrayCertificates.controls[index].reset();
    }

    this.certificates.splice(index, 1);
  }

  addNewCertificate(): void {
    this.formArrayCertificates.push(this.fb.control('', [Validators.minLength(8), Validators.pattern(this.certificatePattern)]));
    this.certificateStatusActive = false;
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
