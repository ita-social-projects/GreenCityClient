import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {UserSuccessSignIn} from '../../model/user-success-sign-in';

@Injectable({
  providedIn: 'root'
})
export class UserOwnAuthService {
  public credentialDataSubject = new Subject<any>();

  public getDataFromLocalStorage(): void {
    const keys = {...localStorage};
    this.credentialDataSubject.next(keys);
 }
}
