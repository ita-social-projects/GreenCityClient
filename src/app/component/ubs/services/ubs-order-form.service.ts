import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { FinalOrder, OrderDetails, PersonalData } from '../models/ubs.interface';

@Injectable({
  providedIn: 'root'
})
export class UBSOrderFormService {

  orderDetails: OrderDetails;
  personalData: PersonalData;
  changedOrder: any = new EventEmitter();
  changedPersonalData: any = new EventEmitter();

  public billObjectSource = new BehaviorSubject<{}>({
    certificatesSum: '',
    pointsSum: '',
    total: 0,
    finalSum: 0,
  });

  constructor() { }

  changeOrderDetails() {
    this.changedOrder.emit(this.orderDetails);
  }

  changePersonalData() {
    this.changedPersonalData.emit(this.personalData);
  }

  finalBillObject(order) {
    this.billObjectSource.next(order);
  }
}
