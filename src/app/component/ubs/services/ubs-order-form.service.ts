import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { FinalOrder, IUserOrder } from '../models/ubs.interface';

@Injectable({
  providedIn: 'root'
})
export class UBSOrderFormService {

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
