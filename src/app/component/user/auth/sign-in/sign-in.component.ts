import {Component, OnInit} from "@angular/core";
import {UserOwnSignInService} from "../../../../service/user-own-sign-in.service";
import {UserOwnSignIn} from "../../../../model/user-own-sign-in";
import {HttpErrorResponse} from "@angular/common/http";
import {UserSuccessSignIn} from "../../../../model/user-success-sign-in";
import {Router} from "@angular/router";


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  private userOwnSignIn: UserOwnSignIn;
  private loadingAnim: boolean;

  constructor(private service: UserOwnSignInService, private rout: Router) {
  }

  ngOnInit() {
    this.userOwnSignIn = new UserOwnSignIn();
    this.loadingAnim = false;
  }

  private signIn(userOwnSignIn: UserOwnSignIn) {
    this.loadingAnim = true;
    this.service.signIn(userOwnSignIn).subscribe(
      (data: UserSuccessSignIn) => {
        this.loadingAnim = false;
        window.localStorage.setItem("email", data.email);
        window.localStorage.setItem("accessToken", data.accessToken);
        window.localStorage.setItem("refreshToken", data.refreshToken);
        console.log(data);
        this.rout.navigate(["/"]);


      },
      (error: HttpErrorResponse) => {
        console.log(error.message)
        this.loadingAnim = false;
      }
    );
  }

}
