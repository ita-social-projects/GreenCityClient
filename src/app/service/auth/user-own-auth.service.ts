import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserOwnAuthService {
  public credentialDataSubject = new Subject<any>();

  constructor() { }

  public getDataFromLocalStorage(): void {
    const keys = {...localStorage};
    this.credentialDataSubject.next(keys);
 }
}
