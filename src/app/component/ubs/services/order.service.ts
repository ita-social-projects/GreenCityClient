import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IOrder } from '../components/order-details-form/order.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private _url: string = 'https://greencity-ubs.azurewebsites.net/ubs/first';

  constructor(private http: HttpClient) { }

  getOrders(): Observable<IOrder> {
    return this.http.get<IOrder>(this._url);
  }
}
