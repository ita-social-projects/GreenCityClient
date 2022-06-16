import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UbsUserOrderPaymentPopUpComponent } from './ubs-user-order-payment-pop-up/ubs-user-order-payment-pop-up.component';
import { UbsUserOrderCancelPopUpComponent } from './ubs-user-order-cancel-pop-up/ubs-user-order-cancel-pop-up.component';
import { IUserOrderInfo, CheckPaymentStatus, CheckOrderStatus } from './models/UserOrder.interface';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Bag, OrderDetails, PersonalData } from '../../ubs/models/ubs.interface';
import { Router } from '@angular/router';

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

  constructor(public dialog: MatDialog, private localStorageService: LocalStorageService, private router: Router) {}

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

  public isOrderPriceGreaterThenZero(order: IUserOrderInfo): boolean {
    return order.orderFullPrice > 0;
  }

  public isOrderPaymentAccess(order: IUserOrderInfo): boolean {
    return this.isOrderPriceGreaterThenZero(order) && (this.isOrderUnpaid(order) || this.isOrderHalfPaid(order));
  }

  public changeCard(id: number): void {
    this.orders.forEach((order) => (order.extend = order.id === id ? !order.extend : false));
  }

  public openOrderPaymentDialog(order: IUserOrderInfo): void {
    console.log('ORDER ', order);
    const userId = window.localStorage.getItem('userId');
    if (order.paymentStatusEng === 'Unpaid') {
      this.setDataForLocalStorage(order);
      const personalData = JSON.stringify(this.personalDetails);
      const orderData = JSON.stringify(this.orderDetails);
      this.localStorageService.setUbsOrderData(personalData, orderData);
      this.router.navigate(['ubs/order']);
    } else {
      this.dialog.open(UbsUserOrderPaymentPopUpComponent, {
        data: {
          orderId: order.id,
          price: order.orderFullPrice,
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

  public setDataForLocalStorage(order: IUserOrderInfo): void {
    const userId = window.localStorage.getItem('userId');
    //   export interface IUserOrderInfo {
    //     additionalOrders: any;
    //     address: IAddressExportDetails;
    //     amountBeforePayment: number;
    //     bags: IBags[];
    //     bonuses: number;
    //     certificate: ICertificate[];
    //     dateForm: string;
    //     datePaid: string;
    //     extend?: boolean;
    //     id: number;
    //     orderComment: string;
    //     orderFullPrice: number;
    //     orderStatus: string;
    //     orderStatusEng: string;
    //     paidAmount: number;
    //     paymentStatus: string;
    //     paymentStatusEng: string;
    //     sender: IUserInfo;
    //   }
    //   export interface IBags {
    //     capacity: number;
    //     count: number;
    //     price: number;
    //     service: string;
    //     totalPrice: number;
    //   }
    //
    // export interface ICertificate {
    //   certificateStatus: string;
    //   code: string;
    //   creationDate: string;
    //   points: number;
    // }

    this.bags = [
      {
        id: 1,
        capacity: 120,
        name: 'Безпечні відходи',
        price: 250,
        quantity: this.getBagsQuantity('Безпечні відходи', 120, order)
      },
      {
        id: 2,
        capacity: 120,
        name: 'Текстильні відходи',
        price: 300,
        quantity: this.getBagsQuantity('Текстильні відходи', 120, order)
      },
      {
        id: 3,
        capacity: 20,
        name: 'Текстильні відходи',
        price: 50,
        quantity: this.getBagsQuantity('Текстильні відходи', 20, order)
      }
    ];

    this.orderDetails = {
      additionalOrders: order.additionalOrders,
      bags: this.bags,
      certificates: [],
      certificatesSum: 0,
      finalSum: order.orderFullPrice,
      orderComment: order.orderComment,
      points: this.bonuses, // bonuses avalible
      pointsSum: 0,
      pointsToUse: 0,
      total: order.orderFullPrice
    };

    // address:
    // addressCity: "Київ"
    // addressCityEng: "Kyiv"
    // addressComment: "коментар до адреси"
    // addressDistinct: "Печерський район"
    // addressDistinctEng: "Pechers'kyi district"
    // addressRegion: "Київська область"
    // addressRegionEng: "Kyivs'ka oblast'"
    // addressStreet: "вулиця Хрещатик"
    // addressStreetEng: "Khreschatyk Street"
    // entranceNumber: "1"
    // houseCorpus: "1"
    // houseNumber: "1"

    this.personalDetails = {
      addressComment: order.address.addressComment,
      city: order.address.addressCity,
      cityEn: order.address.addressCityEng,
      district: order.address.addressDistinct,
      districtEn: order.address.addressDistinctEng,
      email: order.sender.senderEmail,
      entranceNumber: order.address.entranceNumber,
      firstName: order.sender.senderName,
      houseCorpus: order.address.houseCorpus,
      houseNumber: order.address.houseNumber,
      id: 14,
      lastName: order.sender.senderSurname,
      latitude: 0,
      longitude: 0,
      phoneNumber: order.sender.senderPhone,
      region: order.address.addressRegion,
      regionEn: order.address.addressRegionEng,
      senderEmail: order.sender.senderEmail,
      senderFirstName: order.sender.senderName,
      senderLastName: order.sender.senderSurname,
      senderPhoneNumber: order.sender.senderPhone,
      street: order.address.addressStreet,
      streetEn: order.address.addressStreetEng,
      ubsUserId: parseInt(userId)
    };
    //       id?: number;
    //       ubsUserId?: number;
    //       firstName: string;
    //       lastName: string;
    //       email: string;
    //       phoneNumber: string;
    //       addressComment: string;
    //       city: string;
    //       cityEn: string;
    //       district: string;
    //       districtEn: string;
    //       street?: string;
    //       streetEn?: string;
    //       region?: string;
    //       regionEn?: string;
    //       houseCorpus?: string;
    //       entranceNumber?: string;
    //       houseNumber?: string;
    //       longitude?: number;
    //       latitude?: number;
    //       senderEmail: string;
    //       senderFirstName: string;
    //       senderLastName: string;
    //       senderPhoneNumber: string;
    //     }
  }

  // {bags: [,…], points: 550, pointsToUse: 0, certificates: [], additionalOrders: [""], orderComment: "",…}
  // additionalOrders: [""]
  // 0: ""
  // bags: [,…]
  // 0: {id: 2, name: "Текстильні відходи", capacity: 120, price: 300, nameEng: "Textile waste", locationId: 1,…}
  // 1: {id: 1, name: "Безпечні відходи", capacity: 120, price: 250, nameEng: "Safe waste", locationId: 1,…}
  // 2: {id: 3, name: "Текстильні відходи", capacity: 20, price: 50, nameEng: "Textile waste", locationId: 1,…}
  // certificates: []
  // certificatesSum: 0
  // finalSum: 1800
  // orderComment: ""
  // points: 550
  // pointsSum: 0
  // pointsToUse: 0
  // total: 1800

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
}
