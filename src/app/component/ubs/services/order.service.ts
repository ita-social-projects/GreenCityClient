import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


import { ICertificate, OrderDetails, PersonalData } from '../models/ubs.interface';
import { Order } from '../models/ubs.model';
import { UBSOrderFormService } from './ubs-order-form.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private url = 'https://greencity-ubs.azurewebsites.net/ubs';

  // orderDetails: OrderDetails;
  // personalData: PersonalData;
  // changeOrder: any = new EventEmitter();

  constructor(
    private http: HttpClient,
    private shareFormService: UBSOrderFormService
  ) { }

  getOrders(): Observable<OrderDetails> {
    return this.http.get<OrderDetails>(`${this.url}/order-details`)
      .pipe(tap(orderDetails => this.shareFormService.orderDetails = orderDetails));
  }

  getPersonalData(): Observable<any> {
    return this.http.get(`${this.url}/personal-data`)
      .pipe(tap(personalData => this.shareFormService.personalData = personalData[0]));
  }

  processOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.url}/processOrder`, order);
  }

  processCertificate(certificate): Observable<ICertificate[]> {
    return this.http.get<ICertificate[]>(`${this.url}/certificate/${certificate}`);
  }

  // onChanged() {
  //   this.changeOrder.emit(this.orderDetails)
  // }
}
