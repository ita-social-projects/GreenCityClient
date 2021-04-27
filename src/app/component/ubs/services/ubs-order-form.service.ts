import { EventEmitter, Injectable } from '@angular/core';
import { OrderDetails, PersonalData } from '../models/ubs.interface';

@Injectable({
  providedIn: 'root'
})
export class UBSOrderFormService {

  orderDetails: OrderDetails;
  personalData: PersonalData;
  changedOrder: any = new EventEmitter();
  changedPersonalData: any = new EventEmitter();

  constructor() { }

  changeOrderDetails() {
    this.changedOrder.emit(this.orderDetails);
  }

  changePersonalData() {
    this.changedPersonalData.emit(this.personalData);
  }
}
