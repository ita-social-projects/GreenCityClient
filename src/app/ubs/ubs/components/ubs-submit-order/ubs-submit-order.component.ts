import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { finalize, map, mergeMap, takeUntil } from 'rxjs/operators';
import { FormBaseComponent } from '@shared/components/form-base/form-base.component';
import { Bag, OrderBag, OrderDetails, OrderDetailsNotification, PersonalData } from '../../models/ubs.interface';
import { UBSOrderFormService } from '../../services/ubs-order-form.service';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/ubs.model';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { Store } from '@ngrx/store';
import { UpdatePersonalData } from 'src/app/store/actions/order.actions';
import { IAppState } from 'src/app/store/state/app.state';

@Component({
  selector: 'app-ubs-submit-order',
  templateUrl: './ubs-submit-order.component.html',
  styleUrls: ['./ubs-submit-order.component.scss']
})
export class UBSSubmitOrderComponent extends FormBaseComponent implements OnInit, OnDestroy {
  paymentForm: UntypedFormGroup = this.fb.group({});
  isPaymentWithMoney = false;
  shouldBePaid: boolean;
  order: Order;
  addressId: number;
  bags: Bag[] = [];
  loadingAnim: boolean;
  selectedPayment: string;
  additionalOrders: any;
  personalData: PersonalData;
  orderDetails: OrderDetails | null;
  defaultId: 2282;
  isDownloadDataNotification: boolean;
  private destroy: Subject<boolean> = new Subject<boolean>();
  popupConfig = {
    hasBackdrop: true,
    closeOnNavigation: true,
    disableClose: true,
    panelClass: 'custom-ubs-style',
    data: {
      popupTitle: 'confirmation.submit-title',
      popupSubtitle: '',
      popupConfirm: 'confirmation.ok',
      popupCancel: 'confirmation.delete',
      isUBS: true,
      isUbsOrderSubmit: true
    }
  };
  orderBags: OrderBag[] = [];
  isValidOrder = true;
  @Input() public isNotification: boolean;
  @Input() public orderIdFromNotification: number;
  isFinalSumZero = true;
  isTotalAmountZero = true;
  public currentLanguage: string;

  constructor(
    public orderService: OrderService,
    public ubsOrderFormService: UBSOrderFormService,
    private shareFormService: UBSOrderFormService,
    private localStorageService: LocalStorageService,
    private langService: LanguageService,
    private sanitizer: DomSanitizer,
    private fb: UntypedFormBuilder,
    private store: Store,
    router: Router,
    dialog: MatDialog
  ) {
    super(router, dialog, orderService, localStorageService);
  }

  ngOnInit(): void {
    this.currentLanguage = this.localStorageService.getCurrentLanguage();
    this.localStorageService.languageSubject.pipe(takeUntil(this.destroy)).subscribe((lang: string) => {
      this.currentLanguage = lang;
    });
    if (this.isNotification) {
      this.isDownloadDataNotification = false;
      this.getOrderFormNotifications();
    } else {
      this.takeOrderDetails();
    }
  }

  getOrderFormNotifications() {
    this.orderBags = this.orderBags.filter((bag) => bag.amount !== 0);
    this.orderService
      .getOrderFromNotification(this.orderIdFromNotification)
      .pipe(takeUntil(this.destroy))
      .subscribe((response: OrderDetailsNotification) => {
        this.bags = response.bags;
        this.setDataFromNotification(response);
        this.bags.forEach((item) => {
          item.name = 'Clothes';
          item.quantity = response.amountOfBagsOrdered[item.id];
          const bag: OrderBag = { amount: item.quantity, id: item.id };
          this.orderBags.push(bag);
        });
        this.setOrderNotification();
        this.orderService.setOrder(this.order);

        this.isValidOrder = response.orderDiscountedPrice <= 0;
        this.isDownloadDataNotification = true;
      });
  }

  setDataFromNotification(data: OrderDetailsNotification) {
    this.additionalOrders = [];
    this.orderDetails = {
      points: data.orderBonusDiscount,
      total: data.orderFullPrice,
      finalSum: data.orderDiscountedPrice,
      certificatesSum: data.orderCertificateTotalDiscount,
      pointsToUse: data.orderBonusDiscount
    };
    this.personalData = {
      firstName: data.recipientName,
      lastName: data.recipientSurname,
      email: data.recipientEmail,
      phoneNumber: data.recipientPhone,
      addressComment: data.addressComment,
      city: data.addressCity,
      cityEn: data.addressCityEn,
      district: data.addressDistrict,
      districtEn: data.addressDistrictEn,
      street: data.addressStreet,
      streetEn: data.addressStreetEn,
      region: data.addressRegion,
      regionEn: data.addressRegionEn,
      senderFirstName: data.recipientName,
      senderLastName: data.recipientSurname,
      senderEmail: data.recipientEmail,
      senderPhoneNumber: data.recipientPhone
    };
  }

  setOrderNotification() {
    this.order = new Order(
      this.additionalOrders,
      2282,
      this.orderBags,
      this.orderDetails.certificates,
      1,
      this.orderDetails.orderComment,
      this.personalData,
      this.orderDetails.pointsToUse,
      this.shouldBePaid
    );
  }

  ngOnDestroy() {
    this.destroy.next(true);
    this.destroy.unsubscribe();
  }

  getFormValues(): boolean {
    return true;
  }

  takeOrderDetails() {
    this.shareFormService.changedOrder.pipe(takeUntil(this.destroy)).subscribe((orderDetails: OrderDetails) => {
      this.localStorageService.setFinalSumOfOrder(orderDetails.finalSum);
      this.orderDetails = orderDetails;
      this.bags = orderDetails.bags.filter((bagItem) => bagItem.quantity !== null);
      this.additionalOrders = orderDetails.additionalOrders;
      this.isFinalSumZero = orderDetails.finalSum <= 0;
      this.isTotalAmountZero = orderDetails.total === 0;
    });

    this.store
      .select((state: IAppState): PersonalData => state.order.personalData)
      .pipe(
        takeUntil(this.destroy),
        mergeMap((statePersonalData: PersonalData) => {
          return this.shareFormService.changedPersonalData.pipe(
            map((personalData: PersonalData) => {
              this.personalData = statePersonalData || personalData;
            })
          );
        })
      )
      .subscribe();
  }

  finalizeGetOrderUrl(): void {
    this.shareFormService.isDataSaved = false;
    if (!this.shareFormService.orderUrl) {
      this.router.navigate(['ubs', 'confirm']);
    }
  }

  redirectToOrder() {
    this.loadingAnim = true;
    this.localStorageService.setUserPagePayment(false);
    if (this.isFinalSumZero) {
      this.isPaymentWithMoney = false;
    }
    if (!this.isPaymentWithMoney) {
      this.localStorageService.getExistingOrderId() ? this.getExistingOrderUrl() : this.getNewOrderUrl();
    }
    this.cleanPersonalDataState();
    this.localStorageService.removeUbsFondyOrderId();
  }

  public getExistingOrderUrl(): void {
    const existingOrderId = parseInt(this.localStorageService.getExistingOrderId(), 10);
    this.orderService
      .getExistingOrderUrl(existingOrderId)
      .pipe(takeUntil(this.destroy))
      .pipe(
        finalize(() => {
          this.finalizeGetOrderUrl();
        })
      )
      .subscribe(
        (response) => {
          const { orderId, link } = JSON.parse(response);
          this.shareFormService.orderUrl = '';
          this.localStorageService.removeUBSExistingOrderId();
          this.shareFormService.orderUrl = link.toString();
          this.localStorageService.setUbsFondyOrderId(orderId);
          this.redirectToExternalUrl(this.shareFormService.orderUrl);
        },
        () => {
          this.loadingAnim = false;
        }
      );
  }

  public getNewOrderUrl(): void {
    this.orderService
      .getOrderUrl()
      .pipe(takeUntil(this.destroy))
      .pipe(
        finalize(() => {
          this.finalizeGetOrderUrl();
        })
      )
      .subscribe(
        (response) => {
          const { orderId, link } = JSON.parse(response);
          this.shareFormService.orderUrl = '';
          if (this.isFinalSumZero && !this.isTotalAmountZero) {
            this.ubsOrderFormService.transferOrderId(orderId);
            this.ubsOrderFormService.setOrderResponseErrorStatus(false);
            this.ubsOrderFormService.setOrderStatus(true);
            this.localStorageService.setUbsBonusesOrderId(orderId);
          } else {
            this.shareFormService.orderUrl = link.toString();
            this.localStorageService.setUbsFondyOrderId(orderId);
            this.redirectToExternalUrl(this.shareFormService.orderUrl);
          }
        },
        () => {
          this.loadingAnim = false;
        }
      );
  }

  private redirectToExternalUrl(url: string): void {
    document.location.href = url;
  }

  onNotSaveData() {
    this.shareFormService.isDataSaved = true;
    this.localStorageService.removeUbsFondyOrderId();
    this.localStorageService.removeUBSExistingOrderId();
  }

  public getLangValue(uaValue: string, enValue: string): string {
    return this.langService.getLangValue(uaValue, enValue) as string;
  }

  public cleanPersonalDataState(): void {
    this.store.dispatch(UpdatePersonalData({ personalData: null }));
  }
}
