import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {userOwnSignInLink} from '../../links';
import {UserOwnSignIn} from '../../model/user-own-sign-in';
import {UserSuccessSignIn} from '../../model/user-success-sign-in';
import {LocalStorageService} from '../localstorage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserOwnSignInService {

  constructor(private http: HttpClient, private localStorageService: LocalStorageService) {
  }

  public signIn(model: UserOwnSignIn) {
    const body = {
      email: model.email,
      password: model.password
    };
    return this.http.post(userOwnSignInLink, body);
  }

  public saveUserToLocalStorage(data: UserSuccessSignIn) {
    this.localStorageService.setFirstName(data.name);
    this.localStorageService.setAccessToken(data.accessToken);
    this.localStorageService.setRefreshToken(data.refreshToken);
    this.localStorageService.setUserId(Number(data.userId));

  }
}

