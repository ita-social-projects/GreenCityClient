import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Address, Locations } from './../models/ubs.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
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
  locationSubject = new Subject();
  locationSub = new Subject();
  currentAddress = new Subject();

  constructor(private http: HttpClient, private shareFormService: UBSOrderFormService, private localStorageService: LocalStorageService) {}

  getOrders(): Observable<any> {
    const ubsOrderData = this.localStorageService.getUbsOrderData();
    if (ubsOrderData) {
      const observable = new Observable((observer) => observer.next(ubsOrderData));
      return observable.pipe(tap((orderDetails) => (this.shareFormService.orderDetails = orderDetails)));
    } else {
      return this.http
        .get<OrderDetails>(`${this.url}/order-details`)
        .pipe(tap((orderDetails) => (this.shareFormService.orderDetails = orderDetails)));
    }
  }

  setLocationData(obj) {
    this.locationSub.next(obj);
  }

  setCurrentAddress(obj) {
    this.currentAddress.next(obj);
  }

  getPersonalData(): Observable<any> {
    const ubsPersonalData = this.localStorageService.getUbsPersonalData();
    if (ubsPersonalData) {
      const observable = new Observable((observer) => observer.next(ubsPersonalData));
      return observable.pipe(tap((personalData) => (this.shareFormService.personalData = personalData)));
    } else {
      return this.http.get(`${this.url}/personal-data`).pipe(tap((personalData) => (this.shareFormService.personalData = personalData)));
    }
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

  changeShouldBePaid() {
    const order = this.orderSubject.getValue();
    order.shouldBePaid = false;
    this.setOrder(order);
  }

  getOrderUrl(): Observable<Order> {
    return this.processOrder(this.orderSubject.getValue());
  }

  getUbsOrderStatus(): Observable<any> {
    const liqPayOrderId = this.localStorageService.getUbsOrderId();
    return liqPayOrderId ? this.getLiqPayStatus(liqPayOrderId) : throwError(new Error('There is no OrderId!'));
  }

  getLiqPayStatus(orderId: string): Observable<any> {
    return this.http.get(`${this.url}/getLiqPayStatus/${orderId}`);
  }

  getLocations(): Observable<Locations[]> {
    return this.http.get<Locations[]>(`${this.url}/order/get-locations`);
  }

  addLocation(location): Observable<any> {
    return this.http.post(`${this.url}/order/get-locations`, location);
  }

  completedLocation(completed: boolean) {
    this.locationSubject.next(completed);
  }

  processLiqPayOrder(order: Order): Observable<string> {
    return this.http.post<string>(`${this.url}/processLiqPayOrder`, order, { responseType: 'text' as 'json' });
  }

  getLiqPayForm(): Observable<string> {
    return this.processLiqPayOrder(this.orderSubject.getValue());
  }

  getOrderFromNotification(orderId: number) {
    const lang = localStorage.getItem('language') === 'ua' ? 1 : 2;
    return this.http.get(`${this.url}/client/get-data-for-order-surcharge/${orderId}/${lang}`);
  }

  cancelUBSwithoutSaving(): void {
    this.shareFormService.isDataSaved = true;
    this.localStorageService.removeUbsOrderId();
    this.shareFormService.saveDataOnLocalStorage();
  }
}
