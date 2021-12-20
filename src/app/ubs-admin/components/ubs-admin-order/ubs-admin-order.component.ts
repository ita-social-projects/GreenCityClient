import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UbsAdminCancelModalComponent } from '../ubs-admin-cancel-modal/ubs-admin-cancel-modal.component';
import { UbsAdminGoBackModalComponent } from '../ubs-admin-go-back-modal/ubs-admin-go-back-modal.component';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
import { formatDate } from '@angular/common';

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
  totalPaid: number;
  exportInfo: IExportDetails;
  responsiblePersonInfo: IResponsiblePersons;
  orderDetails: IOrderDetails;
  orderStatusInfo: IOrderStatusInfo;
  currentOrderPrice: number;
  currentOrderStatus: string;
  overpayment = 0;
  isMinOrder = true;
  timeFrom: string;
  timeTo: string;

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
        this.totalPaid = this.orderInfo.orderCertificateTotalDiscount + this.orderInfo.orderBonusDiscount;
        this.totalPaid += data.paymentTableInfoDto.paidAmount;
        this.currentOrderPrice = data.orderFullPrice;
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
      paidAmount: this.orderInfo.paymentTableInfoDto.paidAmount,
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
    const currentEmployees = this.responsiblePersonInfo.currentPositionEmployees;
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
        dateExport: this.exportInfo.dateExport ? formatDate(this.exportInfo.dateExport, 'yyyy-MM-dd', this.currentLanguage) : '',
        timeDeliveryFrom: this.parseTimeToStr(this.exportInfo.timeDeliveryFrom),
        timeDeliveryTo: this.parseTimeToStr(this.exportInfo.timeDeliveryTo),
        receivingStation: this.exportInfo.receivingStation
      }),
      responsiblePersonsForm: this.fb.group({
        callManager: this.getEmployeeById(currentEmployees, 2),
        logistician: this.getEmployeeById(currentEmployees, 3),
        navigator: this.getEmployeeById(currentEmployees, 4),
        driver: this.getEmployeeById(currentEmployees, 5)
      }),
      orderDetailsForm: this.fb.group({
        storeOrderNumbers: this.fb.array([]),
        certificates: (this.orderInfo.certificates || []).join(', '),
        customerComment: this.orderInfo.comment,
        orderFullPrice: this.orderInfo.orderFullPrice
      })
    });
    const storeOrderNumbersArr = this.getFormGroup('orderDetailsForm').controls.storeOrderNumbers as FormArray;
    this.orderInfo.numbersFromShop.forEach((elem) => {
      storeOrderNumbersArr.push(new FormControl(elem, [Validators.required, Validators.pattern('^\\d{10}$')]));
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

  getEmployeeById(allCurrentEmployees: Map<string, string>, id: number) {
    if (!allCurrentEmployees) {
      return '';
    }
    const key = Object.keys(allCurrentEmployees).find((el) => el.includes(`id=${id},`));
    return key ? allCurrentEmployees[key] : '';
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

  public onChangeCurrentPrice(sum: number) {
    this.currentOrderPrice = sum;
  }

  public setMinOrder(flag) {
    this.isMinOrder = flag;
  }

  parseTimeToStr(dateStr: string) {
    return dateStr ? formatDate(dateStr, 'HH:mm', this.currentLanguage) : '';
  }

  parseStrToTime(dateStr: string, date: Date) {
    const hours = dateStr.split(':')[0];
    const minutes = dateStr.split(':')[1];
    date.setHours(+hours + 2);
    date.setMinutes(+minutes);
    return date ? date.toISOString() : '';
  }

  resetForm() {
    this.orderForm.reset();
    this.initForm();
    this.currentOrderStatus = this.generalOrderInfo.orderStatus;
    this.orderStatusInfo = this.getOrderStatusInfo(this.currentOrderStatus);
  }

  onSubmit() {
    const date = new Date(this.orderForm.get(['exportDetailsForm', 'dateExport']).value);
    const timeTo = this.orderForm.get(['exportDetailsForm', 'timeDeliveryFrom']).value;
    const timeFrom = this.orderForm.get(['exportDetailsForm', 'timeDeliveryTo']).value;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
