import { Address } from './../models/ubs.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ICertificate, OrderDetails } from '../models/ubs.interface';
import { Order } from '../models/ubs.model';
import { UBSOrderFormService } from './ubs-order-form.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly orderSubject = new BehaviorSubject<Order>({} as Order);

  private url = 'https://greencity-ubs.azurewebsites.net/ubs';

  constructor(private http: HttpClient, private shareFormService: UBSOrderFormService) {}

  getOrders(lang): Observable<OrderDetails> {
    return this.http
      .get<OrderDetails>(`${this.url}/order-details`)
      .pipe(tap((orderDetails) => (this.shareFormService.orderDetails = orderDetails)));
  }

  getPersonalData(): Observable<any> {
    return this.http.get(`${this.url}/personal-data`).pipe(tap((personalData) => (this.shareFormService.personalData = personalData[0])));
  }

  processOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.url}/processOrder`, order, { responseType: 'text' as 'json' });
  }

  processCertificate(certificate): Observable<ICertificate> {
    return this.http.get<ICertificate>(`${this.url}/certificate/${certificate}`);
  }

  addAdress(adress: Address): Observable<any> {
    return this.http.post<Address>(`${this.url}/save-order-address`, adress);
  }

  deleteAddress(address: Address): Observable<any> {
    const body = address.id;
    return this.http.post<any>(`${this.url}/${address.id}/delete-order-address`, body);
  }

  findAllAddresses(): Observable<any> {
    return this.http.get<Address[]>(`${this.url}/findAll-order-address`);
  }

  setOrder(order: Order) {
    this.orderSubject.next(order);
  }

  getOrderUrl(): Observable<Order> {
    return this.processOrder(this.orderSubject.getValue());
  }
}
