import { ChangeDetectorRef, ViewChild } from '@angular/core';
import { AfterViewInit, Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { UBSSubmitOrderComponent } from '../ubs-submit-order/ubs-submit-order.component';
import { UBSPersonalInformationComponent } from '../ubs-personal-information/ubs-personal-information.component';
import { UBSOrderDetailsComponent } from '../ubs-order-details/ubs-order-details.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-ubs-order-form',
  templateUrl: './ubs-order-form.component.html',
  styleUrls: ['./ubs-order-form.component.scss']
})
export class UBSOrderFormComponent implements AfterViewInit {
  firstStepForm: FormGroup;
  secondStepForm: FormGroup;
  thirdStepForm: FormGroup;

  @ViewChild('firstStep', {static: false}) stepOneComponent: UBSOrderDetailsComponent;
  @ViewChild('secondStep', {static: false}) stepTwoComponent: UBSPersonalInformationComponent;
  @ViewChild('thirdStep', {static: false}) stepThreeComponent: UBSSubmitOrderComponent;

  constructor(
    private cdr: ChangeDetectorRef,
    private translate: TranslateService
    ) { }

  ngAfterViewInit(): void {
    this.firstStepForm = this.stepOneComponent.orderDetailsForm;
    this.secondStepForm = this.stepTwoComponent.personalDataForm;
    this.thirdStepForm = this.stepThreeComponent.paymentForm;
    this.cdr.detectChanges();
  }
}
