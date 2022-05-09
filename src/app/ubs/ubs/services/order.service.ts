import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Address, AddressData, CourierLocations } from '../models/ubs.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ICertificate, OrderDetails } from '../models/ubs.interface';
import { environment } from '@environment/environment.js';
import { Order } from '../models/ubs.model';
import { UBSOrderFormService } from './ubs-order-form.service';
import { OrderClientDto } from 'src/app/ubs/ubs-user/ubs-user-orders-list/models/OrderClientDto';
import { ResponceOrderFondyModel } from '../../ubs-user/ubs-user-orders-list/models/ResponceOrderFondyModel';
import { ResponceOrderLiqPayModel } from '../../ubs-user/ubs-user-orders-list/models/ResponceOrderLiqPayModel';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly orderSubject = new BehaviorSubject<Order>({} as Order);
  private url = environment.ubsAdmin.backendUbsAdminLink;
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

  addAdress(adress: AddressData): Observable<any> {
    return this.http.post<{ addressList: Address[] }>(`${this.url}/save-order-address`, adress);
  }

  updateAdress(adress: Address): Observable<any> {
    return this.http.put<{ addressList: Address[] }>(`${this.url}/update-order-address`, adress);
  }

  deleteAddress(address: Address): Observable<any> {
    return this.http.delete<{ addressList: Address[] }>(`${this.url}/order-addresses/${address.id}`);
  }

  findAllAddresses(): Observable<any> {
    return this.http.get<{ addressList: Address[] }>(`${this.url}/findAll-order-address`);
  }

  setOrder(order: Order) {
    this.orderSubject.next(order);
  }

  changeShouldBePaid(shouldBePaid: boolean) {
    const order = this.orderSubject.getValue();
    order.shouldBePaid = shouldBePaid;
    this.setOrder(order);
  }

  getOrderUrl(): Observable<any> {
    return this.processOrder(this.orderSubject.getValue());
  }

  getUbsOrderStatus(): Observable<any> {
    const liqPayOrderId = this.localStorageService.getUbsOrderId();
    const fondyOrderId = this.localStorageService.getUbsFondyOrderId();
    if (liqPayOrderId) {
      return this.getLiqPayStatus(liqPayOrderId);
    }
    if (fondyOrderId) {
      return this.getFondyStatus(fondyOrderId);
    }
    return throwError(new Error('There is no OrderId!'));
  }

  getLiqPayStatus(orderId: string): Observable<any> {
    return this.http.get(`${this.url}/getLiqPayStatus/${orderId}`);
  }

  getFondyStatus(orderId: string): Observable<any> {
    return this.http.get(`${this.url}/getFondyStatus/${orderId}`);
  }

  getLocations(courierId?: number): Observable<CourierLocations[]> {
    return this.http.get<CourierLocations[]>(`${this.url}/courier/${courierId}`);
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
    return this.http.get(`${this.url}/client/get-data-for-order-surcharge/${orderId}`);
  }

  processOrderFondyFromUserOrderList(order: OrderClientDto): Observable<ResponceOrderFondyModel> {
    return this.http.post<ResponceOrderFondyModel>(`${this.url}/client/processOrderFondy`, order);
  }

  processOrderLiqPayFromUserOrderList(order: OrderClientDto): Observable<ResponceOrderLiqPayModel> {
    return this.http.post<ResponceOrderLiqPayModel>(`${this.url}/client/processOrderLiqpay`, order);
  }

  cancelUBSwithoutSaving(): void {
    this.shareFormService.isDataSaved = true;
    this.shareFormService.orderDetails = null;
    this.shareFormService.personalData = null;
    this.localStorageService.removeUbsOrderId();
    this.localStorageService.removeUbsFondyOrderId();
    this.shareFormService.saveDataOnLocalStorage();
  }
}
