import { AfterViewInit, Component, ChangeDetectorRef, ViewChild, DoCheck, HostListener, OnDestroy, OnInit } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { FormGroup } from '@angular/forms';
import { UBSSubmitOrderComponent } from '../ubs-submit-order/ubs-submit-order.component';
import { UBSPersonalInformationComponent } from '../ubs-personal-information/ubs-personal-information.component';
import { UBSOrderDetailsComponent } from '../ubs-order-details/ubs-order-details.component';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { UBSOrderFormService } from '../../services/ubs-order-form.service';
import { Store, select } from '@ngrx/store';
import { IAppState } from 'src/app/store/state/app.state';
import { OrderDetails, PersonalData } from '../../models/ubs.interface';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-ubs-order-form',
  templateUrl: './ubs-order-form.component.html',
  styleUrls: ['./ubs-order-form.component.scss']
})
export class UBSOrderFormComponent implements OnInit, AfterViewInit, DoCheck, OnDestroy {
  currentStepId: number;
  firstStepForm: FormGroup;
  secondStepForm: FormGroup;
  thirdStepForm: FormGroup;
  completed = false;
  isSecondStepDisabled = true;
  private statePersonalData: PersonalData;
  private stateOrderDetails: OrderDetails;

  @ViewChild('firstStep') stepOneComponent: UBSOrderDetailsComponent;
  @ViewChild('secondStep') stepTwoComponent: UBSPersonalInformationComponent;
  @ViewChild('thirdStep') stepThreeComponent: UBSSubmitOrderComponent;
  @ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;

  constructor(
    private cdr: ChangeDetectorRef,
    private shareFormService: UBSOrderFormService,
    private localStorageService: LocalStorageService,
    private store: Store,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  @HostListener('window:beforeunload') onClose() {
    this.saveDataOnLocalStorage();
    return true;
  }

  ngOnInit() {
    this.initStepperPosition();
    this.shareFormService.locationId = this.localStorageService.getLocationId();
    this.shareFormService.locations = this.localStorageService.getLocations();
    setTimeout(() => {
      this.getOrderDetailsFromState();
    }, 0);
  }

  initStepperPosition() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.currentStepId = params?.stepperId ?? 0;
    });
  }

  private getOrderDetailsFromState() {
    this.store.pipe(select((state: IAppState): OrderDetails => state.order.orderDetails)).subscribe((stateOrderDetails: OrderDetails) => {
      this.stateOrderDetails = stateOrderDetails;
      if (this.stateOrderDetails) {
        this.getPersonalDataFromState(this.stateOrderDetails);
      }
    });
  }

  private getPersonalDataFromState(orderDetails: OrderDetails): void {
    this.store.pipe(select((state: IAppState): PersonalData => state.order.personalData)).subscribe((statePersonalData: PersonalData) => {
      this.statePersonalData = statePersonalData;
      if (orderDetails && this.statePersonalData) {
        this.stepper.linear = false;
        this.completed = true;
        this.stepper.selectedIndex = 2;
        setTimeout(() => {
          this.stepper.linear = true;
        });
      }
    });
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

  onSelectionChange($event: any) {
    console.log($event.selectedIndex);

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { stepperId: $event.selectedIndex },
      queryParamsHandling: 'merge'
    });
  }

  saveDataOnLocalStorage(): void {
    this.shareFormService.isDataSaved = false;
    this.shareFormService.saveDataOnLocalStorage();
  }

  ngOnDestroy() {
    this.saveDataOnLocalStorage();
  }
}
