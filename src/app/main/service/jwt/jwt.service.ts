import { Injectable } from '@angular/core';
import { LocalStorageService } from '../localstorage/local-storage.service';
import { BehaviorSubject } from 'rxjs';
import { TUserRole } from '@global-models/auth/user-role.type';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  userRole$: BehaviorSubject<string> = new BehaviorSubject<string>(this.getUserRole());

  constructor(private localStorageService: LocalStorageService) {}

  isExpired(token: string): boolean {
    if (token != null) {
      const jwtData = token.split('.')[1];
      const decodedJwtJsonData = window.atob(jwtData);
      const decodedJwtData = JSON.parse(decodedJwtJsonData);
      const dateInSecond = new Date().getTime() / 1000;
      return dateInSecond > decodedJwtData.exp;
    } else {
      return false;
    }
  }

  getEmailFromAccessToken(): string {
    const accessToken = this.localStorageService.getAccessToken();
    if (accessToken == null) {
      return null;
    }
    const payload = accessToken.split('.')[1];
    const decodedPayload = window.atob(payload);
    return JSON.parse(decodedPayload).sub;
  }

  getUserRole(token?: string): TUserRole | null {
    const accessToken = token ?? this.localStorageService.getAccessToken();
    if (accessToken != null) {
      const payload = accessToken.split('.')[1];
      const decodedPayload = window.atob(payload);
      return JSON.parse(decodedPayload).role[0];
    } else {
      return null;
    }
  }
}
