import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Bags,
  IOrderDetails,
  IOrderSumDetails,
  IUserInfo,
  PaymentInfo,
  UserViolations,
  IExportDetails,
  IDetailStatus
} from '../models/ubs-admin.interface';
import { environment } from '@environment/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private backend: string = environment.ubsAdmin.backendUbsAdminLink;
  private backendLink: string = environment.backendUbsLink;
  private selectedOrder: {};

  readonly orderStatuses = [
    { name: 'FORMED', translation: 'order-edit.order-status.formed' },
    { name: 'ADJUSTMENT', translation: 'order-edit.order-status.adjustment' },
    { name: 'BROUGHT_IT_HIMSELF', translation: 'order-edit.order-status.brought-it-himself' },
    { name: 'CONFIRMED', translation: 'order-edit.order-status.confirmed' },
    { name: 'ON_THE_ROUTE', translation: 'order-edit.order-status.on-the-route' },
    { name: 'DONE', translation: 'order-edit.order-status.done' },
    { name: 'NOT_TAKEN_OUT', translation: 'order-edit.order-status.not-taken-out' },
    { name: 'CANCELLED', translation: 'order-edit.order-status.cancelled' }
  ];

  readonly paymentStatuses = [
    { name: 'UNPAID', translation: 'order-edit.payment-status.not-paid' },
    { name: 'PAID', translation: 'order-edit.payment-status.paid' },
    { name: 'HALF_PAID', translation: 'order-edit.payment-status.half-paid' },
    { name: 'PAYMENT_REFUNDED', translation: 'order-edit.payment-status.payment-refunded' }
  ];

  readonly districts = [
    'Голосіївський',
    'Дарницький',
    'Деснянський',
    'Дніпровський',
    'Оболонський',
    'Печерський',
    'Подільський',
    'Святошинський',
    'Солом`янський',
    'Шевченківський',
    'Києво-Святошинський'
  ];

  constructor(private http: HttpClient) {}

  getSelectedOrder() {
    return this.selectedOrder;
  }

  setSelectedOrder(order) {
    this.selectedOrder = order;
  }

  public getBags(lang): Observable<Bags> {
    return this.http.get<Bags>(`${this.backend}/order-details?lang=${lang}`);
  }

  public getOrderDetails(orderId: number, lang: string): Observable<IOrderDetails> {
    return this.http.get<IOrderDetails>(`${this.backend}/management/read-order-info/${orderId}?language=${lang}`);
  }
  public getOrderSumDetails(orderId: number): Observable<IOrderSumDetails> {
    return this.http.get<IOrderSumDetails>(`${this.backend}/management/get-order-sum-detail/871`);
  }

  public getUserInfo(orderId: number, lang: string): Observable<IUserInfo> {
    return this.http.get<IUserInfo>(`${this.backend}/user-info/${orderId}?lang=${lang}`);
  }

  public getUserViolations(userEmail: string): Observable<UserViolations> {
    return this.http.get<UserViolations>(`${this.backend}/management/getUsersViolations?email=${userEmail}`);
  }

  public getPaymentInfo(orderId: number): Observable<PaymentInfo> {
    return this.http.get<PaymentInfo>(`${this.backend}/management/getPaymentInfo?orderId=${orderId}`);
  }

  public readAddressOrder(orderId: number) {
    return this.http.get<any>(`${this.backend}/management/read-address-order/${orderId}`);
  }

  public getOrderExportDetails(orderId: number): Observable<IExportDetails> {
    return this.http.get<IExportDetails>(`${this.backend}/management/get-order-export-details/${orderId}`);
  }

  public getAllReceivingStations(): Observable<any> {
    return this.http.get<any>(`${this.backendLink}/admin/ubs-employee/get-all-receiving-station`);
  }

  public getAllResponsiblePersons(positionId: number): Observable<any> {
    return this.http.get<any>(`${this.backend}/management/get-all-employee-by-position/${positionId}`);
  }

  public getOrderDetailStatus(orderId: number): Observable<IDetailStatus> {
    return this.http.get<IDetailStatus>(`${this.backend}/management/read-order-detail-status/${orderId}`);
  }

  public updateRecipientsData(postData: any) {
    return this.http.put<any>(`${this.backend}`, postData);
  }
}
