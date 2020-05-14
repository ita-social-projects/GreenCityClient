import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserOwnAuthService {
  public credentialDataSubject = new Subject<any>();

  public getDataFromLocalStorage(): void {
    const keys = {...localStorage};
    this.credentialDataSubject.next(keys);
 }


  public test(): void {
    const keys = {...localStorage};
    this.credentialDataSubject.next(keys);
  }
}
