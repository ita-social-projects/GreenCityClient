import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { OrderDetails } from './../../models/ubs.interface';
import { AfterViewInit, Component, ChangeDetectorRef, ViewChild, DoCheck, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UBSSubmitOrderComponent } from '../ubs-submit-order/ubs-submit-order.component';
import { UBSPersonalInformationComponent } from '../ubs-personal-information/ubs-personal-information.component';
import { UBSOrderDetailsComponent } from '../ubs-order-details/ubs-order-details.component';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { UBSOrderFormService } from './../../services/ubs-order-form.service';

@Component({
  selector: 'app-ubs-order-form',
  templateUrl: './ubs-order-form.component.html',
  styleUrls: ['./ubs-order-form.component.scss']
})
export class UBSOrderFormComponent implements AfterViewInit, DoCheck, OnDestroy {
  firstStepForm: FormGroup;
  secondStepForm: FormGroup;
  thirdStepForm: FormGroup;
  private destroy: Subject<boolean> = new Subject<boolean>();

  completed = false;

  @ViewChild('firstStep') stepOneComponent: UBSOrderDetailsComponent;
  @ViewChild('secondStep') stepTwoComponent: UBSPersonalInformationComponent;
  @ViewChild('thirdStep') stepThreeComponent: UBSSubmitOrderComponent;
  @ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;

  constructor(
    private cdr: ChangeDetectorRef,
    private shareFormService: UBSOrderFormService,
    private localStorageService: LocalStorageService
  ) {}

  @HostListener('window:beforeunload') onClose() {
    this.saveDataOnLocalStorage();
    return true;
  }

  ngAfterViewInit(): void {
    this.firstStepForm = this.stepOneComponent.orderDetailsForm;
    this.secondStepForm = this.stepTwoComponent.personalDataForm;
    this.thirdStepForm = this.stepThreeComponent.paymentForm;
    this.cdr.detectChanges();
  }

  ngDoCheck(): void {
    if (this.stepper?.selected.state === 'finalStep') {
      this.completed = true;
    }
  }

  saveDataOnLocalStorage() {
    if (!this.shareFormService.isDataSaved) {
      const currentPage = JSON.stringify(this.stepper.selectedIndex);
      const personalData = JSON.stringify(this.shareFormService.getPersonalData());
      const orderData = JSON.stringify(this.shareFormService.getOrderDetails());
      this.localStorageService.setUbsOrderData(personalData, orderData);
    } else {
      this.localStorageService.removeUbsOrderData();
    }
  }

  ngOnDestroy() {
    this.saveDataOnLocalStorage();
  }
}
