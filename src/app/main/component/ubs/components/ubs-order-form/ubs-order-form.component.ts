import { AfterViewInit, Component, ChangeDetectorRef, ViewChild, DoCheck, HostListener } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UBSSubmitOrderComponent } from '../ubs-submit-order/ubs-submit-order.component';
import { UBSPersonalInformationComponent } from '../ubs-personal-information/ubs-personal-information.component';
import { UBSOrderDetailsComponent } from '../ubs-order-details/ubs-order-details.component';
import { MatHorizontalStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-ubs-order-form',
  templateUrl: './ubs-order-form.component.html',
  styleUrls: ['./ubs-order-form.component.scss']
})
export class UBSOrderFormComponent implements AfterViewInit, DoCheck {
  firstStepForm: FormGroup;
  secondStepForm: FormGroup;
  thirdStepForm: FormGroup;

  completed = false;

  @ViewChild('firstStep', { static: false }) stepOneComponent: UBSOrderDetailsComponent;
  @ViewChild('secondStep', { static: false }) stepTwoComponent: UBSPersonalInformationComponent;
  @ViewChild('thirdStep', { static: false }) stepThreeComponent: UBSSubmitOrderComponent;
  @ViewChild(MatHorizontalStepper, { static: false }) stepper: MatHorizontalStepper;

  constructor(private cdr: ChangeDetectorRef) {}

  @HostListener('window:beforeunload') onClose() {
    return false;
  }

  ngAfterViewInit(): void {
    this.firstStepForm = this.stepOneComponent.orderDetailsForm;
    this.secondStepForm = this.stepTwoComponent.personalDataForm;
    this.thirdStepForm = this.stepThreeComponent.paymentForm;
    this.cdr.detectChanges();
  }

  ngDoCheck(): void {
    if (this.stepper && this.stepper.selected.state === 'finalStep') {
      this.completed = true;
    }
  }
}
