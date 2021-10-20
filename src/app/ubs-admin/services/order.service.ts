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

  constructor(private http: HttpClient) {}

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

  public getOrderDetailStatus(orderId: number): Observable<IDetailStatus> {
    return this.http.get<IDetailStatus>(`${this.backend}/management/read-order-detail-status/${orderId}`);
  }

  public updateRecipientsData(postData: any) {
    return this.http.put<any>(`${this.backend}`, postData);
  }
}
