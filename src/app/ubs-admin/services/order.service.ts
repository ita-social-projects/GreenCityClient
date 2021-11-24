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

  statusDone = { name: 'DONE', translation: 'order-edit.order-status.done' };
  statusAdjustment = { name: 'ADJUSTMENT', translation: 'order-edit.order-status.adjustment' };
  statusOnTheRoute = { name: 'ON_THE_ROUTE', translation: 'order-edit.order-status.on-the-route' };
  statusNotTakenOut = { name: 'NOT_TAKEN_OUT', translation: 'order-edit.order-status.not-taken-out' };
  statusConfirmed = { name: 'CONFIRMED', translation: 'order-edit.order-status.confirmed' };
  statusFormed = { name: 'FORMED', translation: 'order-edit.order-status.formed' };
  statusBroughtItHimself = { name: 'BROUGHT_IT_HIMSELF', translation: 'order-edit.order-status.brought-it-himself' };
  statusCanceled = { name: 'CANCELED', translation: 'order-edit.order-status.cancelled' };

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

  getAvailableOrderStatuses(currentOrderStatus, statuses) {
    const statusDone = statuses.find((el) => el.name === 'DONE');
    const statusAdjustment = statuses.find((el) => el.name === 'ADJUSTMENT');
    const statusOnTheRoute = statuses.find((el) => el.name === 'ON_THE_ROUTE');
    const statusNotTakenOut = statuses.find((el) => el.name === 'NOT_TAKEN_OUT');
    const statusConfirmed = statuses.find((el) => el.name === 'CONFIRMED');
    const statusFormed = statuses.find((el) => el.name === 'FORMED');
    const statusBroughtItHimself = statuses.find((el) => el.name === 'BROUGHT_IT_HIMSELF');
    const statusCanceled = statuses.find((el) => el.name === 'CANCELED');

    switch (currentOrderStatus) {
      case 'FORMED':
        return [statusFormed, statusAdjustment, statusBroughtItHimself, statusCanceled];

      case 'ADJUSTMENT':
        return [statusFormed, statusAdjustment, statusConfirmed, statusBroughtItHimself, statusCanceled];

      case 'CONFIRMED':
        return [statusFormed, statusConfirmed, statusOnTheRoute, statusCanceled];

      case 'BROUGHT_IT_HIMSELF':
        return [statusBroughtItHimself, statusDone, statusCanceled];

      case 'ON_THE_ROUTE':
        return [statusOnTheRoute, statusDone, statusNotTakenOut, statusCanceled];

      case 'NOT_TAKEN_OUT':
        return [statusNotTakenOut, statusAdjustment, statusCanceled];

      case 'DONE':
        return [statusDone];

      case 'CANCELED':
        return [statusCanceled];
    }
  }

  getOrderStatuses(currentOrderStatus) {
    switch (currentOrderStatus) {
      case 'FORMED':
        return [this.statusFormed, this.statusAdjustment, this.statusBroughtItHimself, this.statusCanceled];

      case 'ADJUSTMENT':
        return [this.statusFormed, this.statusAdjustment, this.statusConfirmed, this.statusBroughtItHimself, this.statusCanceled];

      case 'CONFIRMED':
        return [this.statusFormed, this.statusConfirmed, this.statusOnTheRoute, this.statusCanceled];

      case 'BROUGHT_IT_HIMSELF':
        return [this.statusBroughtItHimself, this.statusDone, this.statusCanceled];

      case 'ON_THE_ROUTE':
        return [this.statusOnTheRoute, this.statusDone, this.statusNotTakenOut, this.statusCanceled];

      case 'NOT_TAKEN_OUT':
        return [this.statusNotTakenOut, this.statusAdjustment, this.statusCanceled];

      case 'DONE':
        return [this.statusDone];

      case 'CANCELED':
        return [this.statusCanceled];
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

  addViolationToCurrentOrder(violation) {
    return this.http.post(`${this.backend}/management/addViolationToUser`, violation);
  }

  getViolationOfCurrentOrder(orderId) {
    return this.http.get(`${this.backend}/management/violation-details/${orderId}`);
  }

  detail() {
    return this.http.get(`${this.backend}/management/violation-details/3026`);
  }
}
