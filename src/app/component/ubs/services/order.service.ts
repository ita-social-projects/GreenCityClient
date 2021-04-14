import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Bag, FinalOrder, ICertificate, OrderDetails, PersonalData, WorkingData } from '../models/ubs.interface';
import { Order } from '../models/ubs.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private url = 'https://greencity-ubs.azurewebsites.net/ubs';

  orderDetails: OrderDetails;
  personalData: PersonalData;

  constructor(private http: HttpClient) { }

  getOrders(): Observable<OrderDetails> {
    return this.http.get<OrderDetails>(`${this.url}/order-details`)
      .pipe(tap(orderDetails => this.orderDetails = orderDetails));
  }

  getPersonalData(): Observable<any> {
    return this.http.get(`${this.url}/personal-data`)
      .pipe(tap(personalData => this.personalData=personalData[0]));
  }

  processOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.url}/processOrder`, order);
  }

  processCertificate(certificate): Observable<ICertificate[]> {
    return this.http.get<ICertificate[]>(`${this.url}/certificate/${certificate}`);
  }
}
