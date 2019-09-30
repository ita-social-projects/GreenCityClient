import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {userOwnSignInLink} from '../links';
import {UserOwnSignIn} from '../model/user-own-sign-in';
import {UserSuccessSignIn} from '../model/user-success-sign-in';

@Injectable({
  providedIn: 'root'
})
export class UserOwnSignInService {

  constructor(private http: HttpClient) {
  }

  public signIn(model: UserOwnSignIn) {
    const body = {
      email: model.email,
      password: model.password
    };
    return this.http.post(userOwnSignInLink, body);
  }

  public saveUserToLocalStorage(data: UserSuccessSignIn) {
    window.localStorage.setItem('firstName', data.firstName);
    window.localStorage.setItem('accessToken', data.accessToken);
    window.localStorage.setItem('refreshToken', data.refreshToken);
  }
}

