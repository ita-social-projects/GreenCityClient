import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserOwnSignUp } from '../../model/user-own-sign-up';
import { userOwnSignUpLink } from '../../links';
import { Observable, of } from 'rxjs';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserOwnSignUpService {
  constructor(private http: HttpClient, private localStorageService: LocalStorageService) {}

  public signUp(userOwnRegister: UserOwnSignUp, lang = 'en'): Observable<any> {
    if (userOwnRegister.firstName === undefined) {
      return of<any>();
    }
    if (userOwnRegister.email === undefined) {
      return of<any>();
    }
    if (userOwnRegister.password === undefined) {
      return of<any>();
    }

    userOwnRegister.isUbs = this.localStorageService.getUbsRegistration();
    const body = {
      email: userOwnRegister.email,
      name: userOwnRegister.firstName,
      password: userOwnRegister.password,
      isUbs: userOwnRegister.isUbs
    };
    return this.http.post(`${userOwnSignUpLink}?lang=${lang}`, body);
  }
}
