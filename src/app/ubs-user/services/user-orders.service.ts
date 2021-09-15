import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserOrdersService {
  private url = 'https://greencity-ubs.azurewebsites.net/ubs';
  backend = 'assets/mocks/orders/user-orders.json';
  backendDet = 'assets/mocks/orders/order-details.json';
  constructor(private http: HttpClient) {}

  // getOrders(): Observable<any> {
  //   return this.http.get<any>(`${this.url}/client/getAll-users-orders`);
  // }

  // getOrderDetails(id): Observable<any> {
  //   return this.http.get<any>(`${this.url}/order-details`);
  // }

  getAllUserOrders(id): Observable<any> {
    return this.http.get<any[]>(`${this.backend}`);
  }

  getOrderDetails(id): Observable<any> {
    return this.http.get<any[]>(`${this.backendDet}`);
  }
}
