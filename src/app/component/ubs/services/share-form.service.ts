import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IOrder } from '../components/order-details-form/order.interface';

@Injectable({
  providedIn: 'root'
})
export class ShareFormService {

  public objectSource = new BehaviorSubject<object>({
    // "points": 8700,
    // "allBags": [
    //   {
    //     "id": 1,
    //     "name": "УБС Кур'єр",
    //     "capacity": 120,
    //     "price": 250
    //   },
    //   {
    //     "id": 2,
    //     "name": "Безнадійний одяг",
    //     "capacity": 120,
    //     "price": 300
    //   },
    //   {
    //     "id": 3,
    //     "name": "Безнадійний одяг",
    //     "capacity": 35,
    //     "price": 150
    //   }
    // ]
  });
  // currentObject = this.objectSource.asObservable();

  constructor() { }

  changeObject(order: IOrder) {
    this.objectSource.next(order);
  }
}
