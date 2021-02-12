import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IOrder } from '../components/order-details-form/order.interface';
import { IUserOrder } from '../components/order-details-form/shared/userOrder.interface';

@Injectable({
  providedIn: 'root'
})
export class ShareFormService {

  public objectSource = new Subject<IUserOrder>();
  // currentObject = this.objectSource.asObservable();

  constructor() { }

  changeObject(order: IUserOrder) {
    this.objectSource.next(order);
  }
}
