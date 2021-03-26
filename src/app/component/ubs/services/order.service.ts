import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { FinalOrder } from '../models/finalOrder.interface';
import { ICertificate, IOrder } from '../models/order.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private url = 'https://greencity-ubs.azurewebsites.net/ubs';

  constructor(private http: HttpClient) { }

  getOrders(): Observable<IOrder> {
    return this.http.get<IOrder>(`${this.url}/order-details`);
  }

  getPersonalData(): Observable<any> {
    return this.http.get(`${this.url}/personal-data`);
  }

  processOrder(order: FinalOrder): Observable<FinalOrder> {
    return this.http.post<FinalOrder>(`${this.url}/processOrder`, order);
  }

  processCertificate(certificate): Observable<ICertificate[]> {
    return this.http.get<ICertificate[]>(`${this.url}/certificate/${certificate}`);
  }
}
