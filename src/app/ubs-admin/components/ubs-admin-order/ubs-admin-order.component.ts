import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UbsAdminCancelModalComponent } from '../ubs-admin-cancel-modal/ubs-admin-cancel-modal.component';
import { UbsAdminGoBackModalComponent } from '../ubs-admin-go-back-modal/ubs-admin-go-back-modal.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { take, takeUntil } from 'rxjs/operators';
import { OrderService } from '../../services/order.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Subject } from 'rxjs';
import {
  IAddressExportDetails,
  IExportDetails,
  IGeneralOrderInfo,
  IOrderDetails,
  IOrderInfo,
  IOrderStatusInfo,
  IPaymentInfo,
  IResponsiblePersons,
  IUserInfo
} from '../../models/ubs-admin.interface';

@Component({
  selector: 'app-ubs-admin-order',
  templateUrl: './ubs-admin-order.component.html',
  styleUrls: ['./ubs-admin-order.component.scss']
})
export class UbsAdminOrderComponent implements OnInit, OnDestroy {
  currentLanguage: string;

  private destroy$: Subject<boolean> = new Subject<boolean>();
  orderForm: FormGroup;
  isDataLoaded = false;
  orderId: number;
  orderInfo: IOrderInfo;
  generalOrderInfo: IGeneralOrderInfo;
  clientInfo: IUserInfo;
  addressInfo: IAddressExportDetails;
  paymentInfo: IPaymentInfo;
  exportInfo: IExportDetails;
  responsiblePersonInfo: IResponsiblePersons;
  orderDetails: IOrderDetails;
  orderStatusInfo: IOrderStatusInfo;
  currentOrderStatus: string;
  overpayment = 0;
  isMinOrder = true;

  constructor(
    private translate: TranslateService,
    private orderService: OrderService,
    private localStorageService: LocalStorageService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.localStorageService.languageBehaviourSubject.pipe(takeUntil(this.destroy$)).subscribe((lang) => {
      this.currentLanguage = lang;
      this.translate.setDefaultLang(lang);
    });
    this.route.params.subscribe((params: Params) => {
      this.orderId = +params.id;
    });
    this.getOrderInfo(this.orderId, this.currentLanguage);
  }

  public getOrderInfo(orderId, lang): void {
    this.orderService
      .getOrderInfo(orderId, lang)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.orderInfo = data;
        this.generalOrderInfo = data.generalOrderInfo;
        this.currentOrderStatus = this.generalOrderInfo.orderStatus;
        this.clientInfo = data.userInfoDto;
        this.addressInfo = data.addressExportDetailsDto;
        this.paymentInfo = data.paymentTableInfoDto;
        this.exportInfo = data.exportDetailsDto;
        this.responsiblePersonInfo = data.employeePositionDtoRequest;
        this.setOrderDetails();
        this.initForm();
      });
  }

  private setOrderDetails() {
    this.setPreviousBagsIfEmpty(this.currentOrderStatus);
    const bagsObj = this.orderInfo.bags.map((bag) => {
      bag.planned = this.orderInfo.amountOfBagsOrdered[bag.id] || 0;
      bag.confirmed = this.orderInfo.amountOfBagsConfirmed[bag.id] || 0;
      bag.actual = this.orderInfo.amountOfBagsExported[bag.id] || 0;
      return bag;
    });
    this.orderDetails = {
      bags: bagsObj,
      courierInfo: Object.assign({}, this.orderInfo.courierInfo),
      bonuses: this.orderInfo.orderBonusDiscount,
      certificateDiscount: this.orderInfo.orderCertificateTotalDiscount,
      orderFullPrice: this.orderInfo.orderFullPrice,
      courierPricePerPackage: this.orderInfo.courierPricePerPackage
    };
    this.orderStatusInfo = this.getOrderStatusInfo(this.currentOrderStatus);
  }

  private setPreviousBagsIfEmpty(status) {
    const actualStage = this.getOrderStatusInfo(status).ableActualChange;
    if (actualStage) {
      if (!Object.keys(this.orderInfo.amountOfBagsExported).length) {
        this.orderInfo.amountOfBagsExported = Object.assign({}, this.orderInfo.amountOfBagsConfirmed);
      }
    } else {
      if (!Object.keys(this.orderInfo.amountOfBagsConfirmed).length) {
        this.orderInfo.amountOfBagsConfirmed = Object.assign({}, this.orderInfo.amountOfBagsOrdered);
      }
    }
  }

  private getOrderStatusInfo(statusName: string) {
    return this.generalOrderInfo.orderStatusesDtos.find((status) => status.key === statusName);
  }

  initForm() {
    this.overpayment = 0;
    this.orderForm = this.fb.group({
      orderStatusForm: this.fb.group({
        orderStatus: this.generalOrderInfo.orderStatus,
        adminComment: this.generalOrderInfo.adminComment,
        cancellationComment: '',
        cancellationReason: ''
      }),
      clientInfoForm: this.fb.group({
        senderName: [this.clientInfo.recipientName, [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
        senderSurname: [this.clientInfo.recipientSurName, [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
        senderPhone: [this.clientInfo.recipientPhoneNumber, [Validators.required, Validators.pattern('^\\+?3?8?(0\\d{9})$')]],
        senderEmail: [this.clientInfo.recipientEmail, [Validators.required, Validators.email]]
      }),
      addressDetailsForm: this.fb.group({
        region: this.addressInfo.addressRegion,
        settlement: this.addressInfo.addressCity,
        street: this.addressInfo.addressStreet,
        building: this.addressInfo.addressHouseNumber,
        corpus: this.addressInfo.addressHouseCorpus,
        entrance: this.addressInfo.addressEntranceNumber,
        district: this.addressInfo.addressDistrict
      }),
      exportDetailsForm: this.fb.group({
        exportedDate: this.exportInfo.exportedDate,
        exportedTime: this.exportInfo.exportedTime,
        receivingStation: this.exportInfo.receivingStation
      }),
      responsiblePersonsForm: this.fb.group({
        callManager: this.getPositionEmployee(this.responsiblePersonInfo.currentPositionEmployees, 'callManager'),
        logistician: this.getPositionEmployee(this.responsiblePersonInfo.currentPositionEmployees, 'logistician'),
        navigator: this.getPositionEmployee(this.responsiblePersonInfo.currentPositionEmployees, 'navigator'),
        driver: this.getPositionEmployee(this.responsiblePersonInfo.currentPositionEmployees, 'driver')
      }),
      orderDetailsForm: this.fb.group({
        storeOrderNumber: this.orderInfo.numbersFromShop.join(', '),
        certificate: 'TODO-TODO',
        customerComment: this.orderInfo.comment,
        orderFullPrice: this.orderInfo.orderFullPrice
      })
    });
    this.orderDetails.bags.forEach((bag) => {
      this.getFormGroup('orderDetailsForm').addControl(
        'plannedQuantity' + String(bag.id),
        new FormControl(bag.planned, [Validators.min(0), Validators.max(999)])
      );
      this.getFormGroup('orderDetailsForm').addControl(
        'confirmedQuantity' + String(bag.id),
        new FormControl(bag.confirmed, [Validators.min(0), Validators.max(999)])
      );
      this.getFormGroup('orderDetailsForm').addControl(
        'actualQuantity' + String(bag.id),
        new FormControl(bag.actual, [Validators.min(0), Validators.max(999)])
      );
    });
  }

  getPositionEmployee(currentPositionEmployees: Map<string, string>, key: string) {
    if (!currentPositionEmployees) {
      return '';
    }
    return currentPositionEmployees.get(key);
  }

  getFormGroup(name: string): FormGroup {
    return this.orderForm.get(name) as FormGroup;
  }

  openCancelModal() {
    this.dialog
      .open(UbsAdminCancelModalComponent, {
        hasBackdrop: true
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((discarded) => {
        if (discarded) {
          this.resetForm();
        }
      });
  }

  openGoBackModal() {
    this.dialog.open(UbsAdminGoBackModalComponent, {
      hasBackdrop: true
    });
  }

  onChangedOrderStatus(status: string) {
    this.currentOrderStatus = status;
    this.orderStatusInfo = this.getOrderStatusInfo(this.currentOrderStatus);
  }

  public changeOverpayment(sum) {
    this.overpayment = sum;
  }

  public setMinOrder(flag) {
    this.isMinOrder = flag;
  }

  resetForm() {
    this.orderForm.reset();
    this.initForm();
    this.currentOrderStatus = this.generalOrderInfo.orderStatus;
    this.orderStatusInfo = this.getOrderStatusInfo(this.currentOrderStatus);
  }

  onSubmit() {
    console.log(this.orderForm);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
