import { Component, OnInit } from '@angular/core';
import { UserOwnSignInService } from '../../../../../service/auth/user-own-sign-in.service';
import { UserOwnSignIn } from '../../../../../model/user-own-sign-in';
import { HttpErrorResponse } from '@angular/common/http';
import { UserSuccessSignIn } from '../../../../../model/user-success-sign-in';

import { Router } from '@angular/router';
import { AuthService, GoogleLoginProvider } from 'angularx-social-login';
import { GoogleSignInService } from '../../../../../service/auth/google-sign-in.service';
import { MatDialog } from '@angular/material';
import { RestoreComponent } from '../../restore/restore.component';
import { LocalStorageService } from '../../../../../service/localstorage/local-storage.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css', './sign-in-fields.component.css']
})
export class SignInComponent implements OnInit {
  userOwnSignIn: UserOwnSignIn;
  loadingAnim: boolean;

  emailErrorMessageBackEnd: string;
  passwordErrorMessageBackEnd: string;

  backEndError: string;

  constructor(
    private userOwnSignInService: UserOwnSignInService,
    private router: Router,
    private authService: AuthService,
    private googleService: GoogleSignInService,
    public dialog: MatDialog,
    private localStorageService: LocalStorageService
  ) {}

    readonly formPic = 'assets/img/formpic.jpg';
    readonly picGoogle = 'assets/img/icon/google.svg';
    readonly picArrow = 'assets/img/icon/arrows/google-arrow.svg';

  ngOnInit() {
    this.userOwnSignIn = new UserOwnSignIn();
    this.loadingAnim = false;
    this.emailErrorMessageBackEnd = null;
    this.passwordErrorMessageBackEnd = null;
    this.backEndError = null;
  }

  private signIn(userOwnSignIn: UserOwnSignIn) {
    this.loadingAnim = true;
    this.userOwnSignInService.signIn(userOwnSignIn).subscribe(
      (data: UserSuccessSignIn) => {
        this.loadingAnim = false;
        this.userOwnSignInService.saveUserToLocalStorage(data);
        this.localStorageService.setFirstName(data.name);
        this.localStorageService.setFirstSignIn();
        this.router.navigate(['/'])
          .then(success => console.log('redirect has succeeded ' + success))
          .catch(fail => console.log('redirect has failed ' + fail));
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

  signInWithGoogle() {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(data => {
      this.googleService.signIn(data.idToken).subscribe(
        (data1: UserSuccessSignIn) => {
          this.userOwnSignInService.saveUserToLocalStorage(data1);
          this.router.navigate(['/']);
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

  clickImgSignIn() {
    const showEye = 'url(\'assets/img/icon/eye.png\')';
    const hideEye = 'url(\'assets/img/icon/eye-show.png\')';
    const passwordField = document.getElementById('password');
    const imgEye = document.getElementById('img');
    if (passwordField['type'] === 'password') {
      imgEye.style.backgroundImage = hideEye;
      passwordField.setAttribute('type', 'text');
    } else {
      imgEye.style.backgroundImage = showEye;
      passwordField.setAttribute('type', 'password');
    }
  }
}
