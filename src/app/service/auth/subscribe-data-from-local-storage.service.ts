import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {UserSuccessSignIn} from '../../model/user-success-sign-in';

@Injectable({
  providedIn: 'root'
})
export class SubscribeDataFromLocalStorageService {
public credentialData = new Subject<UserSuccessSignIn>();
private newObj: UserSuccessSignIn;

  constructor() { }

 public (): void {
    Object.keys(localStorage).forEach(
      (key) => {
     this.newObj[key] = localStorage.getItem(key);
    });
    this.credentialData.next(this.newObj);
 }
}
