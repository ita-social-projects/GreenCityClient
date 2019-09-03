import {Component, OnInit} from "@angular/core";
import {UserOwnSignInService} from "../../../../service/user-own-sign-in.service";
import {UserOwnSignIn} from "../../../../model/user-own-sign-in";
import {HttpErrorResponse} from "@angular/common/http";
import {UserSuccessSignIn} from "../../../../model/user-success-sign-in";


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  private userOwnSignIn: UserOwnSignIn;
  private loadingAnim: boolean;

  private emailErrorMessageBackEnd: string;
  private passwordErrorMessageBackEnd: string;

  private backEndError: string;

  constructor(private service: UserOwnSignInService) {
  }

  ngOnInit() {
    this.userOwnSignIn = new UserOwnSignIn();
    this.loadingAnim = false;
    this.emailErrorMessageBackEnd = null;
    this.passwordErrorMessageBackEnd = null;
    this.backEndError = null;
  }

  private signIn(userOwnSignIn: UserOwnSignIn) {
    this.loadingAnim = true;
    this.service.signIn(userOwnSignIn).subscribe(
      (data: UserSuccessSignIn) => {
        this.loadingAnim = false;
        window.localStorage.setItem("firstName", data.firstName);
        window.localStorage.setItem("accessToken", data.accessToken);
        window.localStorage.setItem("refreshToken", data.refreshToken);
        window.location.href = "/";

      },
      (errors: HttpErrorResponse) => {

        console.log(errors);
        try {
          errors.error.forEach(error => {
            if (error.name == 'email') {
              this.emailErrorMessageBackEnd = error.message;
            } else if (error.name == 'password') {
              this.passwordErrorMessageBackEnd = error.message;
            }
          });
        } catch (e) {
          this.backEndError = errors.error.message;
        }
        this.loadingAnim = false;
      }
    );
  }

}
