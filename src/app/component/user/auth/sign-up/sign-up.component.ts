import {Component, OnInit} from '@angular/core';
import {UserOwnSignUp} from "../../../../model/user-own-sign-up";
import {UserOwnSignUpService} from "../../../../service/user-own-sign-up.service";
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  private userOwnSignUp: UserOwnSignUp;
  private firstNameErrorMessageBackEnd: string;
  private lastNameErrorMessageBackEnd: string;
  private emailErrorMessageBackEnd: string;
  private passwordErrorMessageBackEnd: string;

  private loadingAnim: boolean = false;


  constructor(private userOwnSecurityService: UserOwnSignUpService, private rout: Router) {
  }

  ngOnInit() {
    this.userOwnSignUp = new UserOwnSignUp();
    this.setNullAllMessage();
  }

  private register(userOwnRegister: UserOwnSignUp) {
    this.setNullAllMessage();
    this.loadingAnim = true;
    this.userOwnSecurityService.signUp(userOwnRegister).subscribe(
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
