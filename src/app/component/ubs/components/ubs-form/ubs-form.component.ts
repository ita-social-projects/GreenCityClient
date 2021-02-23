import { ChangeDetectorRef, ViewChild } from '@angular/core';
import { AfterViewInit, Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PaymentFormComponent } from './../payment-form/payment-form.component';
import { PersonalDataFormComponent } from './../personal-data-form/personal-data-form.component';
import { OrderDetailsFormComponent } from './../order-details-form/order-details-form.component';

@Component({
  selector: 'app-ubs-form',
  templateUrl: './ubs-form.component.html',
  styleUrls: ['./ubs-form.component.scss']
})
export class UbsFormComponent implements AfterViewInit {
  firstStepForm: FormGroup;
  secondStepForm: FormGroup;
  thirdStepForm: FormGroup;

  @ViewChild('firstStep', {static: false}) stepOneComponent: OrderDetailsFormComponent;
  @ViewChild('secondStep', {static: false}) stepTwoComponent: PersonalDataFormComponent;
  @ViewChild('thirdStep', {static: false}) stepThreeComponent: PaymentFormComponent;

  constructor(private cdr: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this.firstStepForm = this.stepOneComponent.orderDetailsForm;
    this.secondStepForm = this.stepTwoComponent.personalDataForm;
    this.thirdStepForm = this.stepThreeComponent.paymentForm;
    this.cdr.detectChanges();
  }

}
