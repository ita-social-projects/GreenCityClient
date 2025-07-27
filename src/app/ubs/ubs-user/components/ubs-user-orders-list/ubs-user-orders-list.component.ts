import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { forkJoin, Observable, Subject } from 'rxjs';
import { take, takeUntil, tap } from 'rxjs/operators';
import { Bag, OrderDetails, PersonalData } from '../../../ubs/models/ubs.interface';
import { OrderService } from '../../../ubs/services/order.service';
import { UBSOrderFormService } from '../../../ubs/services/ubs-order-form.service';
import { IUserOrderInfo, OrderStatusEn, PaymentStatusEn } from './models/UserOrder.interface';
import { UbsUserOrderCancelPopUpComponent } from './ubs-user-order-cancel-pop-up/ubs-user-order-cancel-pop-up.component';
import { UbsUserOrderPaymentPopUpComponent } from './ubs-user-order-payment-pop-up/ubs-user-order-payment-pop-up.component';
import { ubsPdfIcon } from '@ubs/shared/image-paths/ubs-user-images';
import { DialogPopUpComponent } from 'src/app/shared/components/dialog-pop-up/dialog-pop-up.component';
import { PopUpsStyles } from '@ubs/ubs-admin/components/ubs-admin-employee/ubs-admin-employee-table/employee-models.enum';

@Component({
  selector: 'app-ubs-user-orders-list',
  templateUrl: './ubs-user-orders-list.component.html',
  styleUrls: ['./ubs-user-orders-list.component.scss']
})
export class UbsUserOrdersListComponent implements OnInit, OnDestroy {
  @Input() orders: IUserOrderInfo[];
  @Input() bonuses: number;

  pdfExportIcon = ubsPdfIcon;
  currentLanguage: string;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  orderDetails: OrderDetails;
  personalDetails: PersonalData;
  bags: Bag[];
  anotherClient = 'false';
  orderId: string;
  orderDetailsForSessionStorage;
  editOrPayDialogData = {
    popupTitle: 'ubs-client-profile.payment.edit-or-payment',
    popupConfirm: 'ubs-client-profile.payment.btn.pay',
    popupCancel: 'add-payment.edit',
    style: PopUpsStyles.lightGreen,
    isEditOrPayPopup: true
  };

  constructor(
    public dialog: MatDialog,
    private localStorageService: LocalStorageService,
    private router: Router,
    public ubsOrderService: UBSOrderFormService,
    public orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.currentLanguage = this.localStorageService.getCurrentLanguage();
    this.localStorageService.languageSubject.pipe(takeUntil(this.destroy$)).subscribe((lang: string) => {
      this.currentLanguage = lang;
    });
    this.sortingOrdersByData();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  isOrderUnpaid(order: IUserOrderInfo): boolean {
    return order.paymentStatusEn === PaymentStatusEn.UNPAID;
  }

  isOrderHalfPaid(order: IUserOrderInfo): boolean {
    return order.paymentStatusEn === PaymentStatusEn.HALFPAID;
  }

  isOrderCanceled(order: IUserOrderInfo): boolean {
    return order.orderStatusEn === OrderStatusEn.CANCELED;
  }

  isOrderDoneOrCancel(order: IUserOrderInfo): boolean {
    const isOrderDone = order.orderStatusEn === OrderStatusEn.DONE;
    const isOrderCancelled = order.orderStatusEn === OrderStatusEn.CANCELED;
    return isOrderDone || isOrderCancelled;
  }

  isOrderPriceGreaterThenZero(order: IUserOrderInfo): boolean {
    return order.orderFullPrice > 0;
  }

  isOrderPaymentAccess(order: IUserOrderInfo): boolean {
    return (
      this.isOrderPriceGreaterThenZero(order) && (this.isOrderUnpaid(order) || this.isOrderHalfPaid(order)) && !this.isOrderCanceled(order)
    );
  }

  canOrderBeCancel(order: IUserOrderInfo): boolean {
    return (
      order.paymentStatusEn !== PaymentStatusEn.HALFPAID &&
      order.orderStatusEn !== OrderStatusEn.ADJUSTMENT &&
      order.orderStatusEn !== OrderStatusEn.BROUGHT_IT_HIMSELF &&
      order.orderStatusEn !== OrderStatusEn.NOT_TAKEN_OUT &&
      order.orderStatusEn !== OrderStatusEn.CANCELED &&
      order.orderStatusEn !== OrderStatusEn.DONE
    );
  }

  changeCard(id: number): void {
    this.orders.forEach((order) => (order.extend = order.id === id ? !order.extend : false));
  }

  private openOrderPaymentPopUp(order: IUserOrderInfo): void {
    this.dialog.open(UbsUserOrderPaymentPopUpComponent, {
      maxWidth: '500px',
      panelClass: 'ubs-user-order-payment-pop-up-vertical-scroll',
      data: {
        orderId: order.id,
        price: order.amountBeforePayment,
        bonuses: this.bonuses
      }
    });
  }

  openOrderPaymentDialog(order: IUserOrderInfo): void {
    const isOrderFormed = order.orderStatusEn === OrderStatusEn.FORMED;
    this.isOrderUnpaid(order) && isOrderFormed ? this.editOrPayPopup(order) : this.openOrderPaymentPopUp(order);
    this.orderService.cleanOrderState();
  }

  editOrPayPopup(order: IUserOrderInfo) {
    this.dialog
      .open(DialogPopUpComponent, { data: this.editOrPayDialogData })
      .afterClosed()
      .pipe(take(1))
      .subscribe((res) => {
        if (res) {
          this.openOrderPaymentPopUp(order);
        }
        if (res === false) {
          this.getDataForLocalStorage(order);
        }
      });
  }

  exportAsPDF(order: IUserOrderInfo): void {
    const orderId = order.id;
    const lang = this.currentLanguage;

    this.orderService.getOrderPdf(orderId, lang).subscribe((pdfBlob) => {
      const blob = new Blob([pdfBlob], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `order-${orderId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  getBagsQuantity(bagTypeName: string, capacity: number, order: IUserOrderInfo): number | null {
    const bags = order.bags;
    const bag = bags.find((item) => item.capacity === capacity && item.serviceUk === bagTypeName);
    return bag ? bag.count : null;
  }

  getDataForLocalStorage(order: IUserOrderInfo): void {
    this.localStorageService.removeUbsOrderAndPersonalData();

    let orderDataResponse: OrderDetails;
    let personalDataResponse: PersonalData;

    const orderDataRequest: Observable<OrderDetails> = this.orderService
      .getExistingOrderDetails(order.id)
      .pipe(takeUntil(this.destroy$))
      .pipe(
        tap((orderData) => {
          orderDataResponse = orderData;
        })
      );
    const personalDataRequest: Observable<PersonalData> = this.orderService
      .getPersonalData()
      .pipe(takeUntil(this.destroy$))
      .pipe(
        tap((personalData) => {
          personalDataResponse = personalData;
        })
      );

    forkJoin([orderDataRequest, personalDataRequest]).subscribe(() => {
      this.bags = orderDataResponse.bags || [];
      this.bags.forEach((item) => {
        const bagsQuantity = this.getBagsQuantity(item.nameUk, item.capacity, order);
        item.quantity = bagsQuantity;
      });

      this.orderDetails = {
        additionalOrders: order.additionalOrders,
        bags: this.bags,
        certificates: [],
        certificatesSum: 0,
        finalSum: order.orderFullPrice,
        orderComment: order.orderComment,
        points: this.bonuses,
        pointsSum: 0,
        pointsToUse: 0,
        total: order.orderFullPrice
      };

      this.personalDetails = personalDataResponse;
      this.personalDetails.senderEmail = order.sender?.senderEmail !== this.personalDetails.email ? order.sender?.senderEmail : null;
      this.personalDetails.senderFirstName = order.sender?.senderName !== this.personalDetails.firstName ? order.sender?.senderName : null;
      this.personalDetails.senderLastName =
        order.sender?.senderSurname !== this.personalDetails.lastName ? order.sender?.senderSurname : null;
      this.personalDetails.senderPhoneNumber =
        order.sender?.senderPhone !== this.personalDetails.phoneNumber ? order.sender?.senderPhone : null;
      this.anotherClient = order.sender?.senderName !== this.personalDetails.firstName ? 'true' : 'false';
      this.orderId = order.id.toString();
      this.setDataToLocalStorage();
    });
  }

  private filterUtil(id: number) {
    return this.bags.filter((item) => item.id === id)[0].quantity;
  }

  setDataToLocalStorage(): void {
    const personalData = JSON.stringify(this.personalDetails);
    const orderData = JSON.stringify(this.orderDetails);
    this.localStorageService.setUbsOrderDataBeforeRedirect(personalData, orderData, this.anotherClient, this.orderId);
    this.redirectToStepOne();
  }

  redirectToStepOne(): void {
    this.router.navigate(['ubs/order'], { queryParams: { existingOrderId: this.orderId } });
  }

  openOrderCancelDialog(order: IUserOrderInfo): void {
    this.dialog.open(UbsUserOrderCancelPopUpComponent, {
      data: {
        orderId: order.id,
        orders: this.orders
      }
    });
  }

  sortingOrdersByData(): void {
    this.orders.sort((a: IUserOrderInfo, b: IUserOrderInfo): number => (a.dateForm < b.dateForm ? 1 : -1));
  }
}
