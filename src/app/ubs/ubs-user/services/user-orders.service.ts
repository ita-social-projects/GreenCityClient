import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environment/environment.js';
import { IUserOrdersInfo } from '../ubs-user-orders-list/models/UserOrder.interface';

@Injectable({
  providedIn: 'root'
})
export class UserOrdersService {
  private url = environment.ubsAdmin.backendUbsAdminLink + '/client';

  constructor(private http: HttpClient) {}

  getAllUserOrders(page: number, itemsPerPage: number, table: string): Observable<IUserOrdersInfo> {
    const ordersStatusesParams =
      table === 'current'
        ? 'ADJUSTMENT&status=BROUGHT_IT_HIMSELF&status=FORMED&status=CONFIRMED&status=ON_THE_ROUTE&status=NOT_TAKEN_OUT'
        : 'DONE&status=CANCELED';
    return this.http.get<IUserOrdersInfo>(`${this.url}/user-orders?page=${page}&size=${itemsPerPage}&status=${ordersStatusesParams}`);
  }

  getCurrentUserOrders(page: number, itemsPerPage: number): Observable<IUserOrdersInfo> {
    const ordersStatusesParams =
      'ADJUSTMENT&status=BROUGHT_IT_HIMSELF&status=FORMED&status=CONFIRMED&status=ON_THE_ROUTE&status=NOT_TAKEN_OUT';
    const url = `${this.url}/user-orders?page=${page}&size=${itemsPerPage}&status=${ordersStatusesParams}`;
    return this.http.get<IUserOrdersInfo>(url);
  }

  getClosedUserOrders(page: number, itemsPerPage: number): Observable<IUserOrdersInfo> {
    const ordersStatusesParams = 'DONE&status=CANCELED';
    const url = `${this.url}/user-orders?page=${page}&size=${itemsPerPage}&status=${ordersStatusesParams}`;
    return this.http.get<IUserOrdersInfo>(url);
  }

  public deleteOrder(orderId: number): Observable<object> {
    return this.http.delete<object>(`${this.url}/delete-order/${orderId}`);
  }
}
