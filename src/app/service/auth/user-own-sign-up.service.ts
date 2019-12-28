import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserOwnSignUp} from '../../model/user-own-sign-up';
import {userOwnSignUpLink} from '../../links';

@Injectable({
  providedIn: 'root'
})
export class UserOwnSignUpService {
  saveUserToLocalStorage(data1: import("../../model/user-success-sign-in").UserSuccessSignIn) {
    throw new Error("Method not implemented.");
  }

  constructor(private http: HttpClient) {
  }

  public signUp(userOwnRegister: UserOwnSignUp) {
    if (userOwnRegister.firstName === undefined) {
      console.log('First name is empty');
      return;
    }
    if (userOwnRegister.lastName === undefined) {
      console.log('First name is empty');
      return;
    }
    if (userOwnRegister.email === undefined) {
      console.log('First name is empty');
      return;
    }
    if (userOwnRegister.password === undefined) {
      console.log('First name is empty');
      return;
    }

    const body = {
      firstName: userOwnRegister.firstName,
      lastName: userOwnRegister.lastName,
      email: userOwnRegister.email,
      password: userOwnRegister.password

    };
    return this.http.post(userOwnSignUpLink, body);
  }
}
