import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { FormBaseComponent } from '@shared/components/form-base/form-base.component';
import { Bag, OrderBag, OrderDetails, OrderDetailsNotification, PersonalData } from '../../models/ubs.interface';
import { UBSOrderFormService } from '../../services/ubs-order-form.service';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/ubs.model';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';

@Component({
  selector: 'app-ubs-submit-order',
  templateUrl: './ubs-submit-order.component.html',
  styleUrls: ['./ubs-submit-order.component.scss']
})
export class UBSSubmitOrderComponent extends FormBaseComponent implements OnInit, OnDestroy {
  paymentForm: FormGroup = this.fb.group({});
  liqPayButtonForm: SafeHtml;
  liqPayButton: NodeListOf<HTMLElement>;
  isLiqPay = false;
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
    panelClass: 'popup-dialog-container',
    data: {
      popupTitle: 'confirmation.title',
      popupSubtitle: 'confirmation.subTitle',
      popupConfirm: 'confirmation.cancel',
      popupCancel: 'confirmation.dismiss'
    }
  };
  orderBags: OrderBag[] = [];
  isValidOrder = true;
  @Input() public isNotification: boolean;
  @Input() public orderIdFromNotification: number;
  isFinalSumZero = true;
  isTotalAmountZero = true;

  constructor(
    public orderService: OrderService,
    public ubsOrderFormService: UBSOrderFormService,
    private shareFormService: UBSOrderFormService,
    private localStorageService: LocalStorageService,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    router: Router,
    dialog: MatDialog
  ) {
    super(router, dialog, orderService);
  }

  ngOnInit(): void {
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
      district: data.addressDistrict,
      street: data.addressStreet
    };
  }

  setOrderNotification() {
    this.order = new Order(
      this.additionalOrders,
      2282,
      this.orderBags,
      this.orderDetails.certificates,
      this.orderDetails.orderComment,
      this.personalData,
      this.orderDetails.pointsToUse,
      this.shouldBePaid
    );
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }

  getFormValues(): boolean {
    return true;
  }

  takeOrderDetails() {
    this.shareFormService.changedOrder.pipe(takeUntil(this.destroy)).subscribe((orderDetails: OrderDetails) => {
      this.orderDetails = orderDetails;
      this.bags = orderDetails.bags.filter((bagItem) => bagItem.quantity !== null);
      this.additionalOrders = orderDetails.additionalOrders;
      this.isFinalSumZero = orderDetails.finalSum <= 0;
      this.isTotalAmountZero = orderDetails.total === 0;
    });
    this.shareFormService.changedPersonalData.pipe(takeUntil(this.destroy)).subscribe((personalData: PersonalData) => {
      this.personalData = personalData;
    });
  }

  redirectToOrder() {
    this.loadingAnim = true;

    if (this.isFinalSumZero) {
      this.isLiqPay = false;
    }

    if (!this.isLiqPay) {
      this.localStorageService.removeUbsOrderId();
      this.orderService
        .getOrderUrl()
        .pipe(takeUntil(this.destroy))
        .pipe(
          finalize(() => {
            this.loadingAnim = false;
            this.shareFormService.isDataSaved = false;
            if (!this.shareFormService.orderUrl) {
              this.router.navigate(['ubs', 'confirm']);
            }
          })
        )
        .subscribe(
          (response) => {
            this.shareFormService.orderUrl = '';
            this.localStorageService.removeUbsOrderId();
            if (this.isFinalSumZero && !this.isTotalAmountZero) {
              this.ubsOrderFormService.transferOrderId(response);
              this.ubsOrderFormService.setOrderResponseErrorStatus(false);
              this.ubsOrderFormService.setOrderStatus(true);
            } else {
              this.shareFormService.orderUrl = response.toString();
              document.location.href = this.shareFormService.orderUrl;
            }
          },
          (error) => {
            this.loadingAnim = false;
          }
        );
    } else {
      this.onNotSaveData();
    }
  }

  getLiqPayButton() {
    this.loadingAnim = true;
    this.orderService
      .getLiqPayForm()
      .pipe(takeUntil(this.destroy))
      .subscribe((res) => {
        const { orderId, liqPayButton } = JSON.parse(res);
        this.localStorageService.setUbsOrderId(orderId);
        this.liqPayButtonForm = this.sanitizer.bypassSecurityTrustHtml(liqPayButton);
        setTimeout(() => {
          this.liqPayButton = document.getElementsByName('btn_text');
          this.loadingAnim = false;
        }, 0);
      });
  }

  orderButton(event: any) {
    this.selectedPayment = event.target.value;
    if (this.selectedPayment === 'LiqPay') {
      this.isLiqPay = true;
      this.getLiqPayButton();
    } else {
      this.loadingAnim = false;
      this.isLiqPay = false;
    }
  }

  onNotSaveData() {
    this.shareFormService.isDataSaved = true;
    this.liqPayButton[0].click();
  }
}
