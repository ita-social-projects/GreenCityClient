import {Component, OnInit} from '@angular/core';
import {UserOwnSignInService} from '../../../../service/user-own-sign-in.service';
import {UserOwnSignIn} from '../../../../model/user-own-sign-in';
import {HttpErrorResponse} from '@angular/common/http';
import {UserSuccessSignIn} from '../../../../model/user-success-sign-in';

import {Router} from '@angular/router';
import {AuthService, GoogleLoginProvider} from 'angularx-social-login';
import {GoogleSignInService} from '../../../../service/google-sign-in.service';
import {MatDialog, MatDialogRef} from "@angular/material";
import {RestoreComponent} from "../../restore/restore.component";
import {EditFavoriteNameComponent} from "../../favorite-place/favorite-place.component";


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

  constructor(private service: UserOwnSignInService,
              private rout: Router,
              private authService: AuthService,
              private googleService: GoogleSignInService,
              public dialog: MatDialog,
  ) {
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
        this.service.saveUserToLocalStorage(data);
        window.location.href = '/';

      },
      (errors: HttpErrorResponse) => {
        try {
          errors.error.forEach(error => {
            if (error.name === 'email') {
              this.emailErrorMessageBackEnd = error.message;
            } else if (error.name === 'password') {
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

  private signInWithGoogle() {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((data) => {
      this.googleService.signIn(data.idToken).subscribe((data1: UserSuccessSignIn) => {
          this.service.saveUserToLocalStorage(data1);
          window.location.href = '/';
        },
        (errors: HttpErrorResponse) => {
          try {
            errors.error.forEach(error => {
              if (error.name === 'email') {
                this.emailErrorMessageBackEnd = error.message;
              } else if (error.name === 'password') {
                this.passwordErrorMessageBackEnd = error.message;
              }
            });
          } catch (e) {
            this.backEndError = errors.error.message;
          }
        }
      );
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(RestoreComponent, {
        width: '550px',
        height: '350px',
      });
  }

}
