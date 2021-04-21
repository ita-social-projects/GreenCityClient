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

  // public objectSource = new Subject<FinalOrder>();
  public finalObject = new Subject<FinalOrder>();

  public billObjectSource = new BehaviorSubject<{}>({
    amountUbs: 0,
    amountClothesXL: 0,
    amountClothesM: 0,
    sumUbs: 0,
    sumClothesXL: 0,
    sumClothesM: 0,
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

  // changeObject(order: FinalOrder) {
  //   this.objectSource.next(order);
  // }

  // thirdStepObject(order: FinalOrder) {
  //   this.finalObject.next(order);
  // }

  finalBillObject(order) {
    this.billObjectSource.next(order);
  }
}
