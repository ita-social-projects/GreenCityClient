import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { iif, Subject } from 'rxjs';
import { filter, finalize, take, takeUntil } from 'rxjs/operators';
import { FormBaseComponent } from 'src/app/shared/components/form-base/form-base.component';
import { Bag, IProcessOrderResponse, Order, OrderDetails, PersonalData, PaymentSystem } from '../../models/ubs.interface';
import { UBSOrderFormService } from '../../services/ubs-order-form.service';
import { OrderService } from '../../services/order.service';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { select, Store } from '@ngrx/store';
import { orderDetailsSelector, orderSelectors, personalDataSelector } from 'src/app/store/selectors/order.selectors';
import { WarningPopUpComponent } from 'src/app/greencity/shared/components';
import { PhoneNumberTreatPipe } from '@ubs/shared/pipes/phone-number-treat/phone-number-treat.pipe';

@Component({
  selector: 'app-ubs-submit-order',
  templateUrl: './ubs-submit-order.component.html',
  styleUrls: ['./ubs-submit-order.component.scss']
})
export class UBSSubmitOrderComponent implements OnInit, OnDestroy {
  @Input() public isNotification: boolean;
  @Input() public orderIdFromNotification: number;

  bags: Bag[] = [];
  personalData: PersonalData;
  orderDetails: OrderDetails;
  additionalOrders: string[];
  certificates: string[];
  certificateUsed: number;
  pointsUsed: number;
  orderSum: number;
  finalSum: number;
  tariffId: number;
  addressId: number;
  isLoadingAnim: boolean;
  existingOrderId: number;
  isShouldBePaid: boolean;
  isFirstFormValid: boolean;
  private $destroy: Subject<void> = new Subject<void>();

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

  constructor(
    private readonly ubsOrderFormService: UBSOrderFormService,
    private readonly route: ActivatedRoute,
    private readonly localStorageService: LocalStorageService,
    private readonly store: Store,
    private readonly cdr: ChangeDetectorRef,
    private readonly phoneNumberTreat: PhoneNumberTreatPipe,
    protected readonly orderService: OrderService,
    protected readonly router: Router,
    protected readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.queryParams.pipe(take(1)).subscribe((params) => (this.existingOrderId = params.existingOrderId));

    this.initListeners();
  }

  initListeners(): void {
    this.store.pipe(select(orderSelectors), takeUntil(this.$destroy)).subscribe((order) => {
      this.certificateUsed = order.certificateUsed;
      this.pointsUsed = order.pointsUsed;
      this.orderSum = order.orderSum;
      this.addressId = order.addressId;
      this.tariffId = order.tariff?.id;
      this.isFirstFormValid = order.firstFormValid;

      this.finalSum = this.orderSum - this.certificateUsed - this.pointsUsed;
      this.isShouldBePaid = this.finalSum > 0;
    });

    this.store.pipe(select(orderDetailsSelector), filter(Boolean), takeUntil(this.$destroy)).subscribe((orderDetails: OrderDetails) => {
      this.orderDetails = orderDetails;
      this.bags = orderDetails.bags.filter((bagItem) => bagItem.quantity);
      this.additionalOrders = orderDetails.additionalOrders || [];
    });

    this.store.pipe(select(personalDataSelector), filter(Boolean), takeUntil(this.$destroy)).subscribe((personalData: PersonalData) => {
      this.personalData = personalData;
      this.cdr.detectChanges();
    });
  }

  get formattedPhoneNumber(): string {
    return this.personalData?.phoneNumber ? this.formatPhoneNumber(this.personalData.phoneNumber) : '';
  }

  get formattedSenderPhoneNumber(): string {
    return this.personalData?.senderPhoneNumber ? this.formatPhoneNumber(this.personalData.senderPhoneNumber) : '';
  }

  private formatPhoneNumber(phone: string, sliceLength: number = -9, countryCode: string = '380'): string {
    const lastDigits = phone.slice(sliceLength);
    return this.phoneNumberTreat.transform(lastDigits, countryCode) as string;
  }

  processOrder(shouldBePaid: boolean = true): void {
    this.isLoadingAnim = true;
    iif(
      () => Boolean(this.existingOrderId),
      this.orderService.processExistingOrder(this.getOrder(shouldBePaid), this.existingOrderId),
      this.orderService.processNewOrder(this.getOrder(shouldBePaid))
    )
      .pipe(finalize(() => this.redirectToConfirmPage()))
      .subscribe({
        next: (response: IProcessOrderResponse) => {
          this.processPayment(response);
        },
        error: () => {
          this.isLoadingAnim = false;
          this.redirectToConfirmPage();
        }
      });
  }

  onCancel(): void {
    const matDialogRef = this.dialog.open(WarningPopUpComponent, this.popupConfig);

    matDialogRef.afterClosed().subscribe((isSave) => {
      if (isSave === null) {
        return;
      }
      return isSave ? this.processOrder(false) : this.redirectToMainPage();
    });
  }

  getFormValues(): boolean {
    return true;
  }

  private processPayment(response: IProcessOrderResponse): void {
    if (response.orderId) {
      this.localStorageService.setUbsPaymentOrderId(response.orderId);
      if (!this.finalSum && this.pointsUsed) {
        this.processPointsPayment(response.orderId);
      }
      if (response.link && this.isShouldBePaid) {
        this.redirectToExternalUrl(response.link);
      }
    }
  }

  private processPointsPayment(orderId: number) {
    this.localStorageService.setUserPagePayment(true);
    this.localStorageService.setUbsPaymentOrderId(orderId);

    this.ubsOrderFormService.transferOrderId(orderId);
    this.ubsOrderFormService.setOrderResponseErrorStatus(false);
    this.ubsOrderFormService.setOrderStatus(true);
  }

  private getOrder(shouldBePaid: boolean): Order {
    return {
      personalData: this.personalData,
      additionalOrders: this.additionalOrders,
      certificates: this.orderDetails.certificates,
      orderComment: this.orderDetails.orderComment,
      pointsToUse: this.pointsUsed,
      tariffId: this.tariffId,
      addressId: this.addressId,
      shouldBePaid,
      paymentSystem: PaymentSystem.WAY_FOR_PAY,
      bags: this.bags.map((bag) => ({ id: bag.id, amount: bag.quantity }))
    };
  }

  private redirectToConfirmPage(): void {
    this.router.navigate(['ubs', 'confirm']);
  }

  private redirectToMainPage(): void {
    this.router.navigate(['ubs']);
  }

  private redirectToExternalUrl(url: string): void {
    document.location.href = url;
  }

  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }
}
