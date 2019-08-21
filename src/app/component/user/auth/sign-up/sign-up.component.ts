import {Component, OnInit} from '@angular/core';
import {UserOwnRegister} from "../../../../model/user-own-register";
import {UserOwnRegisterService} from "../../../../service/user-own-register-service.service";
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  private userOwnRegister: UserOwnRegister;
  private firstNameErrorMessageBackEnd: string;
  private lastNameErrorMessageBackEnd: string;
  private emailErrorMessageBackEnd: string;
  private passwordErrorMessageBackEnd: string;

  private loadingAnim: boolean = false;


  constructor(private userOwnSecurityService: UserOwnRegisterService, private rout: Router) {
  }

  ngOnInit() {
    this.userOwnRegister = new UserOwnRegister();
    this.setNullAllMessage();
  }

  private register(userOwnRegister: UserOwnRegister) {
    this.setNullAllMessage();
    this.loadingAnim = true;
    this.userOwnSecurityService.register(userOwnRegister).subscribe(
      () => {
        this.loadingAnim = false;
        this.rout.navigate(["auth/submit-email"])
      },
      (errors: HttpErrorResponse) => {
        errors.error.forEach(error => {
          if (error.name == 'firstName') {
            this.firstNameErrorMessageBackEnd = error.message;
          } else if (error.name == 'lastName') {
            this.lastNameErrorMessageBackEnd = error.message;
          } else if (error.name == 'email') {
            this.emailErrorMessageBackEnd = error.message;
          } else if (error.name == 'password') {
            this.passwordErrorMessageBackEnd = error.message;
          }
        });
        this.loadingAnim = false;
      }
    );
  }

  private setNullAllMessage() {
    this.firstNameErrorMessageBackEnd = null;
    this.lastNameErrorMessageBackEnd = null;
    this.emailErrorMessageBackEnd = null;
    this.passwordErrorMessageBackEnd = null;
  }
}
