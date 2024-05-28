import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserOwnAuthService {
  public credentialDataSubject = new Subject<any>();
  public isLoginUserSubject = new BehaviorSubject<boolean>(!!this.localStorageService.getUserId());

  constructor(private localStorageService: LocalStorageService) {}

  public getDataFromLocalStorage(): void {
    const keys = { ...localStorage };
    this.credentialDataSubject.next(keys);
  }
}
