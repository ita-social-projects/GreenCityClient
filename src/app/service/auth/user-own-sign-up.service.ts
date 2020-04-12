import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserOwnSignUp} from '../../model/user-own-sign-up';
import {userOwnSignUpLink} from '../../links';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserOwnSignUpService {

  constructor(private http: HttpClient) {
  }

  public signUp(userOwnRegister: UserOwnSignUp): Observable<any> {
  console.log(userOwnRegister);
    if (userOwnRegister.firstName === undefined) {
      console.log('Email name is empty');
      return of<any>();
    }
    if (userOwnRegister.email === undefined) {
      console.log('First name is empty');
      return of<any>();
    }
    if (userOwnRegister.password === undefined) {
      console.log('Pass name is empty');
      return of<any>();
    }
    const body = {
      firstName: userOwnRegister.firstName,
      email: userOwnRegister.email,
      password: userOwnRegister.password
    };
    return this.http.post(userOwnSignUpLink, body);
  }
}
