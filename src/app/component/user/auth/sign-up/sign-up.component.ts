import {Component, OnInit} from '@angular/core';
import {UserOwnRegister} from "../../../../model/user-own-register";
import {UserOwnRegisterService} from "../../../../service/user-own-register-service.service";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  private userOwnRegister: UserOwnRegister;

  constructor(private userOwnSecurityService: UserOwnRegisterService) {
  }

  ngOnInit() {
    this.userOwnRegister = new UserOwnRegister();
  }

  private register(userOwnRegister: UserOwnRegister) {
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
    this.userOwnSecurityService.register(userOwnRegister).subscribe();
  }


}
