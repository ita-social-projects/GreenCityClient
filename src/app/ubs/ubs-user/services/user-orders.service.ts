import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environment/environment.js';

@Injectable({
  providedIn: 'root'
})
export class UserOrdersService {
  private url = environment.ubsAdmin.backendUbsAdminLink + '/client';

  constructor(private http: HttpClient) {}

  getAllUserOrders(page: number, itemsPerPage: number): Observable<any> {
    return this.http.get<any[]>(`${this.url}/user-orders?page=${page}&size=${itemsPerPage}`);
  }

  public deleteOrder(orderId: number): Observable<object> {
    return this.http.delete<object>(`${this.url}/delete-order/${orderId}`);
  }
}
