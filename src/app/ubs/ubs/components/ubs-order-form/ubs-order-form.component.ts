import { AfterViewInit, Component, ChangeDetectorRef, ViewChild, DoCheck, HostListener, OnDestroy, OnInit } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { FormGroup } from '@angular/forms';
import { UBSSubmitOrderComponent } from '../ubs-submit-order/ubs-submit-order.component';
import { UBSPersonalInformationComponent } from '../ubs-personal-information/ubs-personal-information.component';
import { UBSOrderDetailsComponent } from '../ubs-order-details/ubs-order-details.component';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { UBSOrderFormService } from '../../services/ubs-order-form.service';

@Component({
  selector: 'app-ubs-order-form',
  templateUrl: './ubs-order-form.component.html',
  styleUrls: ['./ubs-order-form.component.scss']
})
export class UBSOrderFormComponent implements OnInit, AfterViewInit, DoCheck, OnDestroy {
  firstStepForm: FormGroup;
  secondStepForm: FormGroup;
  thirdStepForm: FormGroup;
  completed = false;
  isSecondStepDisabled = true;

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

  ngOnInit() {
    this.shareFormService.locationId = this.localStorageService.getLocationId();
    this.shareFormService.locations = this.localStorageService.getLocations();
  }

  ngAfterViewInit(): void {
    this.firstStepForm = this.stepOneComponent.orderDetailsForm;
    this.secondStepForm = this.stepTwoComponent.personalDataForm;
    this.thirdStepForm = this.stepThreeComponent.paymentForm;
    this.cdr.detectChanges();
  }

  ngDoCheck(): void {
    this.completed = this.stepper?.selected.state === 'finalStep';
  }

  saveDataOnLocalStorage(): void {
    this.shareFormService.isDataSaved = false;
    this.shareFormService.saveDataOnLocalStorage();
  }

  ngOnDestroy() {
    this.saveDataOnLocalStorage();
  }
}
