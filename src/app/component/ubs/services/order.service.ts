import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IOrder } from '../components/order-details-form/order.interface';
import { FinalOrder } from '../models/finalOrder.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private _url: string = 'https://greencity-ubs.azurewebsites.net/ubs';

  constructor(private http: HttpClient) { }

  getOrders(): Observable<IOrder> {
    return this.http.get<IOrder>(`${this._url}/order-details`);
  }

  getPersonalData(): Observable<any> {
    return this.http.get(`${this._url}/personal-data`);
  }

  processOrder(order: FinalOrder): Observable<FinalOrder> {
    return this.http.post<FinalOrder>(`${this._url}/processOrder`, order);
  }

  processCertificate(certificate) {
    return this.http.get(`${this._url}/processCertificate/${certificate}`);
  }

}
