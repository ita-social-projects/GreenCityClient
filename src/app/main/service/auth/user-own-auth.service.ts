import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserOwnAuthService {
  credentialDataSubject = new Subject<any>();
  isLoginUserSubject = new BehaviorSubject<boolean>(!!this.localStorageService.getUserId());

  constructor(private localStorageService: LocalStorageService) {}

  getDataFromLocalStorage(): void {
    const keys = { ...localStorage };
    this.credentialDataSubject.next(keys);
  }
}
