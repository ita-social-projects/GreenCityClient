import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subject, iif } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { FormBaseComponent } from '@shared/components/form-base/form-base.component';
import { Bag, IProcessOrderResponse, Order, OrderDetails, PersonalData } from '../../models/ubs.interface';
import { UBSOrderFormService } from '../../services/ubs-order-form.service';
import { OrderService } from '../../services/order.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { Store, select } from '@ngrx/store';
import { orderDetailsSelector, orderSelectors, personalDataSelector } from 'src/app/store/selectors/order.selectors';
import { WarningPopUpComponent } from '@shared/components';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-ubs-submit-order',
  templateUrl: './ubs-submit-order.component.html',
  styleUrls: ['./ubs-submit-order.component.scss']
})
export class UBSSubmitOrderComponent extends FormBaseComponent implements OnInit, OnDestroy {
  @Input() public isNotification: boolean;
  @Input() public orderIdFromNotification: number;

  @ViewChild('liqpayFormContainer', { static: false }) liqpayFormContainer: ElementRef;

  paymentForm: FormGroup = this.fb.group({});

  bags: Bag[] = [];
  personalData: PersonalData;
  orderDetails: OrderDetails;
  additionalOrders: string[];
  certificates: string[];
  certificateUsed: number;
  pointsUsed: number;
  orderSum: number;
  finalSum: number;
  locationId: number;
  addressId: number;
  isLoadingAnim: boolean;
  existingOrderId: number;
  isShouldBePaid: boolean;
  isFirstFormValid: boolean;
  sanitizedLiqpayForm: any;
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
    public orderService: OrderService,
    public ubsOrderFormService: UBSOrderFormService,
    private route: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private langService: LanguageService,
    private fb: FormBuilder,
    private store: Store,
    private sanitizer: DomSanitizer,
    router: Router,
    dialog: MatDialog
  ) {
    super(router, dialog, orderService, localStorageService);
  }

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
      this.locationId = order.locationId;
      this.isFirstFormValid = order.firstFormValid;

      this.finalSum = this.orderSum - this.certificateUsed - this.pointsUsed;
      this.isShouldBePaid = this.finalSum > 0;
    });

    this.store.pipe(select(orderDetailsSelector), filter(Boolean), takeUntil(this.$destroy)).subscribe((orderDetails: OrderDetails) => {
      this.orderDetails = orderDetails;
      this.bags = orderDetails.bags.filter((bagItem) => bagItem.quantity);
      this.additionalOrders = orderDetails.additionalOrders || [];
    });

    this.store
      .pipe(select(personalDataSelector), filter(Boolean), takeUntil(this.$destroy))
      .subscribe((personalData: PersonalData) => (this.personalData = personalData));
  }

  processOrder(shouldBePaid: boolean = true): void {
    this.isLoadingAnim = true;
    iif(
      () => this.existingOrderId >= 0,
      this.orderService.processExistingOrder(this.getOrder(shouldBePaid), this.existingOrderId),
      this.orderService.processNewOrder(this.getOrder(shouldBePaid))
    )
      .pipe(takeUntil(this.$destroy))
      .subscribe(
        (response: IProcessOrderResponse) => {
          this.processLiqpay(response);
        },
        () => {
          this.isLoadingAnim = false;
          this.redirectToConfirmPage();
        }
      );
  }

  onCancel(): void {
    const matDialogRef = this.dialog.open(WarningPopUpComponent, this.popupConfig);

    matDialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((isSave) => (isSave ? this.processOrder(false) : this.redirectToMainPage()));
  }

  private processFondy(response: IProcessOrderResponse): void {
    this.localStorageService.setUbsPaymentOrderId(response.orderId);
    if (response.link && this.isShouldBePaid) {
      this.redirectToExternalUrl(response.link);
    }
  }

  private processLiqpay(response: IProcessOrderResponse): void {
    this.localStorageService.setUbsPaymentOrderId(response.orderId);

    if (response.link && this.isShouldBePaid) {
      this.sanitizedLiqpayForm = this.sanitizer.bypassSecurityTrustHtml(response.link);
      setTimeout(() => {
        const form: HTMLFormElement = this.liqpayFormContainer.nativeElement.querySelector('form');
        if (form) {
          form.submit();
        }
      });
    }
  }

  private getOrder(shouldBePaid: boolean): Order {
    const order: Order = {
      personalData: this.personalData,
      additionalOrders: this.additionalOrders,
      certificates: this.orderDetails.certificates,
      orderComment: this.orderDetails.orderComment,
      pointsToUse: this.pointsUsed,
      locationId: this.locationId,
      addressId: this.addressId,
      shouldBePaid,
      bags: this.bags.map((bag) => ({ id: bag.id, amount: bag.quantity }))
    };

    return order;
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

  getLangValue(uaValue: string, enValue: string): string {
    return this.langService.getLangValue(uaValue, enValue) as string;
  }

  getFormValues(): boolean {
    return true;
  }

  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }
}
