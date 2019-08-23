import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserOwnSignUp} from "../model/user-own-sign-up";
import {userOwnSignInLink, userOwnSignUpLink} from "../links";
import {UserOwnSignIn} from "../model/user-own-sign-in";

@Injectable({
  providedIn: 'root'
})
export class UserOwnSignInService {

  constructor(private http: HttpClient) {
  }

  public signIn(model: UserOwnSignIn) {
    const body = {
      "email": model.email,
      "password": model.password
    };
    return this.http.post(userOwnSignInLink, body)
  }
}

