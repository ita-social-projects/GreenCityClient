import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UbsUserOrderPaymentPopUpComponent } from './ubs-user-order-payment-pop-up/ubs-user-order-payment-pop-up.component';
import { UbsUserOrderCancelPopUpComponent } from './ubs-user-order-cancel-pop-up/ubs-user-order-cancel-pop-up.component';
import { IUserOrderInfo, CheckPaymentStatus, CheckOrderStatus } from './models/UserOrder.interface';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { forkJoin, Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { Bag, OrderDetails, PersonalData } from '../../ubs/models/ubs.interface';
import { Router } from '@angular/router';
import { UBSOrderFormService } from '../../ubs/services/ubs-order-form.service';
import { OrderService } from '../../ubs/services/order.service';
import { LanguageService } from 'src/app/main/i18n/language.service';

@Component({
  selector: 'app-ubs-user-orders-list',
  templateUrl: './ubs-user-orders-list.component.html',
  styleUrls: ['./ubs-user-orders-list.component.scss']
})
export class UbsUserOrdersListComponent implements OnInit, OnDestroy {
  @Input() orders: IUserOrderInfo[];
  @Input() bonuses: number;

  public currentLanguage: string;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  orderDetails: OrderDetails;
  personalDetails: PersonalData;
  bags: Bag[];
  anotherClient = 'false';
  orderId: string;

  constructor(
    public dialog: MatDialog,
    private localStorageService: LocalStorageService,
    private langService: LanguageService,
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

  public isOrderUnpaid(order: IUserOrderInfo): boolean {
    return order.paymentStatusEng === CheckPaymentStatus.UNPAID;
  }

  public isOrderHalfPaid(order: IUserOrderInfo): boolean {
    return order.paymentStatusEng === CheckPaymentStatus.HALFPAID;
  }

  public isOrderCanceled(order: IUserOrderInfo): boolean {
    return order.orderStatusEng === CheckOrderStatus.CANCELED;
  }

  public isOrderDoneOrCancel(order: IUserOrderInfo): boolean {
    const isOrderDone = order.orderStatusEng === CheckOrderStatus.DONE;
    const isOrderCancelled = order.orderStatusEng === CheckOrderStatus.CANCELED;
    return isOrderDone || isOrderCancelled;
  }

  public isOrderPriceGreaterThenZero(order: IUserOrderInfo): boolean {
    return order.orderFullPrice > 0;
  }

  public isOrderPaymentAccess(order: IUserOrderInfo): boolean {
    return (
      this.isOrderPriceGreaterThenZero(order) &&
      (this.isOrderUnpaid(order) || this.isOrderHalfPaid(order)) &&
      !this.isOrderDoneOrCancel(order)
    );
  }

  public canOrderBeCancel(order: IUserOrderInfo): boolean {
    return (
      order.paymentStatusEng !== CheckPaymentStatus.HALFPAID &&
      order.orderStatusEng !== CheckOrderStatus.ADJUSTMENT &&
      order.orderStatusEng !== CheckOrderStatus.BROUGHT_IT_HIMSELF &&
      order.orderStatusEng !== CheckOrderStatus.NOT_TAKEN_OUT &&
      order.orderStatusEng !== CheckOrderStatus.CANCELED
    );
  }

  public changeCard(id: number): void {
    this.orders.forEach((order) => (order.extend = order.id === id ? !order.extend : false));
  }

  public openOrderPaymentDialog(order: IUserOrderInfo): void {
    if (order.paymentStatusEng === 'Unpaid') {
      this.getDataForLocalStorage(order);
    } else {
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
  }

  public getBagsQuantity(bagTypeName: string, capacity: number, order: IUserOrderInfo): number | null {
    const bags = order.bags;
    const bag = bags.find((item) => {
      return item.capacity === capacity && item.service === bagTypeName;
    });
    return bag ? bag.count : null;
  }

  public getDataForLocalStorage(order: IUserOrderInfo): void {
    this.localStorageService.removeUbsOrderAndPersonalData();

    let orderDataResponse: OrderDetails;
    let personalDataResponse: PersonalData;

    const orderDataRequest: Observable<OrderDetails> = this.orderService
      .getExistingOrder(order.id)
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
      this.bags = orderDataResponse.bags;
      this.bags.forEach((item) => {
        const bagsQuantity = this.getBagsQuantity(item.name, item.capacity, order);
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
      this.personalDetails.senderEmail = order.sender.senderEmail !== this.personalDetails.email ? order.sender.senderEmail : null;
      this.personalDetails.senderFirstName = order.sender.senderName !== this.personalDetails.firstName ? order.sender.senderName : null;
      this.personalDetails.senderLastName =
        order.sender.senderSurname !== this.personalDetails.lastName ? order.sender.senderSurname : null;
      this.personalDetails.senderPhoneNumber =
        order.sender.senderPhone !== this.personalDetails.phoneNumber ? order.sender.senderPhone : null;
      this.anotherClient = order.sender.senderName !== this.personalDetails.firstName ? 'true' : 'false';
      this.orderId = order.id.toString();
      this.setDataToLocalStorage();
    });
  }

  public setDataToLocalStorage(): void {
    const personalData = JSON.stringify(this.personalDetails);
    const orderData = JSON.stringify(this.orderDetails);
    this.localStorageService.setUbsOrderDataBeforeRedirect(personalData, orderData, this.anotherClient, this.orderId);
    this.redirectToStepOne();
  }

  public redirectToStepOne(): void {
    this.router.navigate(['ubs/order'], { queryParams: { isThisExistingOrder: true } });
  }

  public openOrderCancelDialog(order: IUserOrderInfo): void {
    this.dialog.open(UbsUserOrderCancelPopUpComponent, {
      data: {
        orderId: order.id,
        orders: this.orders
      }
    });
  }

  public sortingOrdersByData(): void {
    this.orders.sort((a: IUserOrderInfo, b: IUserOrderInfo): number => {
      return a.dateForm < b.dateForm ? 1 : -1;
    });
  }

  public getLangValue(uaValue: string, enValue: string): string {
    return this.langService.getLangValue(uaValue, enValue) as string;
  }
}
