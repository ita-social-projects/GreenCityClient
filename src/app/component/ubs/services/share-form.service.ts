import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IOrder } from '../components/order-details-form/order.interface';
import { IUserOrder } from '../components/order-details-form/shared/userOrder.interface';
import { FinalOrder } from '../models/finalOrder.interface';

@Injectable({
  providedIn: 'root'
})
export class ShareFormService {

  public objectSource = new Subject<IUserOrder>();
  public finalObject = new Subject<FinalOrder>();

  constructor() { }

  changeObject(order: IUserOrder) {
    this.objectSource.next(order);
  }

  thirdStepObject(order: FinalOrder) {
    this.finalObject.next(order);
  }

}
