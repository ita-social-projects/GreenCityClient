import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import { FinalOrder } from '../models/finalOrder.interface';
import { IUserOrder } from '../models/order.interface';

@Injectable({
  providedIn: 'root'
})
export class ShareFormService {

  public objectSource = new Subject<IUserOrder>();
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

  changeObject(order: IUserOrder) {
    this.objectSource.next(order);
  }

  thirdStepObject(order: FinalOrder) {
    this.finalObject.next(order);
  }

  finalBillObject(order) {
    this.billObjectSource.next(order);
  }
}
