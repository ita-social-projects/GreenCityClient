import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserViolations, IOrderHistory } from '../models/ubs-admin.interface';
import { environment } from '@environment/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private backend: string = environment.ubsAdmin.backendUbsAdminLink;
  private backendLink: string = environment.backendUbsLink;

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

  filterStatuses(allStatuses: Array<any>, availableStatusesNames: string[]) {
    return availableStatusesNames.map((status) => {
      return allStatuses.find((el) => el.key === status);
    });
  }

  getAvailableOrderStatuses(currentOrderStatus: string, statuses: Array<any>) {
    switch (currentOrderStatus) {
      case 'FORMED':
        return this.filterStatuses(statuses, ['FORMED', 'ADJUSTMENT', 'BROUGHT_IT_HIMSELF', 'CANCELED']);

      case 'ADJUSTMENT':
        return this.filterStatuses(statuses, ['FORMED', 'ADJUSTMENT', 'CONFIRMED', 'BROUGHT_IT_HIMSELF', 'CANCELED']);

      case 'CONFIRMED':
        return this.filterStatuses(statuses, ['FORMED', 'CONFIRMED', 'ON_THE_ROUTE', 'CANCELED']);

      case 'BROUGHT_IT_HIMSELF':
        return this.filterStatuses(statuses, ['BROUGHT_IT_HIMSELF', 'DONE', 'CANCELED']);

      case 'ON_THE_ROUTE':
        return this.filterStatuses(statuses, ['ON_THE_ROUTE', 'DONE', 'NOT_TAKEN_OUT', 'CANCELED']);

      case 'NOT_TAKEN_OUT':
        return this.filterStatuses(statuses, ['NOT_TAKEN_OUT', 'ADJUSTMENT', 'CANCELED']);

      case 'DONE':
        return this.filterStatuses(statuses, ['DONE']);

      case 'CANCELED':
        return this.filterStatuses(statuses, ['CANCELED']);
    }
  }

  public getOrderInfo(orderId, lang) {
    return this.http.get(`${this.backend}/management/get-data-for-order/${orderId}/${lang}`);
  }

  public getOrderDetails(orderId: number, lang: string): Observable<any> {
    return this.http.get<any>(`${this.backend}/management/read-order-info/${orderId}?language=${lang}`);
  }
  public getOrderSumDetails(orderId: number): Observable<any> {
    return this.http.get<any>(`${this.backend}/management/get-order-sum-detail/871`);
  }

  public getUserInfo(orderId: number, lang: string): Observable<any> {
    return this.http.get<any>(`${this.backend}/user-info/${orderId}?lang=${lang}`);
  }

  public getUserViolations(userEmail: string): Observable<UserViolations> {
    return this.http.get<UserViolations>(`${this.backend}/management/getUsersViolations?email=${userEmail}`);
  }

  public getPaymentInfo(orderId: number): Observable<any> {
    return this.http.get<any>(`${this.backend}/management/getPaymentInfo?orderId=${orderId}`);
  }

  public readAddressOrder(orderId: number) {
    return this.http.get<any>(`${this.backend}/management/read-address-order/${orderId}`);
  }

  public getOrderExportDetails(orderId: number): Observable<any> {
    return this.http.get<any>(`${this.backend}/management/get-order-export-details/${orderId}`);
  }

  public getAllReceivingStations(): Observable<any> {
    return this.http.get<any>(`${this.backendLink}/admin/ubs-employee/get-all-receiving-station`);
  }

  public getAllResponsiblePersons(positionId: number): Observable<any> {
    return this.http.get<any>(`${this.backend}/management/get-all-employee-by-position/${positionId}`);
  }

  public getOrderDetailStatus(orderId: number): Observable<any> {
    return this.http.get<any>(`${this.backend}/management/read-order-detail-status/${orderId}`);
  }

  public getOrderHistory(orderId: number): Observable<IOrderHistory[]> {
    return this.http.get<IOrderHistory[]>(`${this.backend}/order_history/${orderId}`);
  }

  public updateRecipientsData(postData: any) {
    return this.http.put<any>(`${this.backend}`, postData);
  }

  public getColumnToDisplay() {
    return this.http.get(`${this.backend}/management/getOrdersViewParameters`);
  }

  public setColumnToDisplay(columns: string) {
    return this.http.put<any>(`${this.backend}/management/changeOrdersTableView?titles=${columns}`, '');
  }

  public getOverpaymentMsg(overpayment) {
    let message: string;
    const OVERPAYMENT_MESSAGE = 'order-payment.overpayment';
    const UNDERPAYMENT_MESSAGE = 'order-payment.underpayment';
    if (overpayment > 0) {
      message = OVERPAYMENT_MESSAGE;
    } else if (overpayment < 0) {
      message = UNDERPAYMENT_MESSAGE;
    }
    return message;
  }
}
