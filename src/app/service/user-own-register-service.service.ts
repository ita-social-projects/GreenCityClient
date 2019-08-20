import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserOwnRegister} from "../model/user-own-register";
import {userOwnSecurityLink} from "../links";

@Injectable({
  providedIn: 'root'
})
export class UserOwnRegisterService {

  constructor(private http: HttpClient) {
  }

  public register(userOwnRegister: UserOwnRegister) {
    if (userOwnRegister.firstName == undefined) {
      console.log("First name is empty");
      return;
    }
    if (userOwnRegister.lastName == undefined) {
      console.log("First name is empty");
      return;
    }
    if (userOwnRegister.email == undefined) {
      console.log("First name is empty");
      return;
    }
    if (userOwnRegister.password == undefined) {
      console.log("First name is empty");
      return;
    }

    const body = {
      firstName: userOwnRegister.firstName,
      lastName: userOwnRegister.lastName,
      email: userOwnRegister.email,
      password: userOwnRegister.password

    };
    return this.http.post(userOwnSecurityLink, body);
  }
}
