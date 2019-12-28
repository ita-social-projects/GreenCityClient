import { Component, OnInit } from '@angular/core';
import { UserOwnSignUp } from '../../../../model/user-own-sign-up';
import { UserOwnSignUpService } from '../../../../service/auth/user-own-sign-up.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserSuccessSignIn } from '../../../../model/user-success-sign-in';
import { AuthService, GoogleLoginProvider } from 'angularx-social-login';
import { GoogleSignInService } from '../../../../service/auth/google-sign-in.service';
import { MatDialog } from '@angular/material';
import { LocalStorageService } from '../../../../service/localstorage/local-storage.service';
import { UserOwnSignInService } from 'src/app/service/auth/user-own-sign-in.service';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  userOwnSignUp: UserOwnSignUp;
  firstNameErrorMessageBackEnd: string;
  lastNameErrorMessageBackEnd: string;
  userNameErrorMessageBackEnd: string;
  emailErrorMessageBackEnd: string;
  passwordErrorMessageBackEnd: string;
  passwordConfirmErrorMessageBackEnd: string;
  loadingAnim = false;
  tmp = true;

  backEndError: string;

  constructor(
    private userOwnSignInService: UserOwnSignInService,
    private userOwnSecurityService: UserOwnSignUpService,
    private router: Router,
    private authService: AuthService,
    private googleService: GoogleSignInService,
    public dialog: MatDialog,
    private localStorageService: LocalStorageService
  ) {}

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
        this.router.navigateByUrl('/auth/submit-email').then(r => r);
      },
      (errors: HttpErrorResponse) => {
        errors.error.forEach(error => {
          if (error.name === 'firstName') {
            this.firstNameErrorMessageBackEnd = error.message;
          } else if (error.name === 'lastName') {
            this.lastNameErrorMessageBackEnd = error.message;
          } else if (error.name === 'userName') {
            this.userNameErrorMessageBackEnd = error.message;
          } else if (error.name === 'email') {
            this.emailErrorMessageBackEnd = error.message;
          } else if (error.name === 'password') {
            this.passwordErrorMessageBackEnd = error.message;
          } else if (error.name === 'passwordConfirm') {
            this.passwordConfirmErrorMessageBackEnd = error.message;
          }
        });
        this.loadingAnim = false;
      }
    );
  }

  private setNullAllMessage() {
    this.firstNameErrorMessageBackEnd = null;
    this.lastNameErrorMessageBackEnd = null;
    this.userNameErrorMessageBackEnd = null;
    this.emailErrorMessageBackEnd = null;
    this.passwordErrorMessageBackEnd = null;
    this.passwordConfirmErrorMessageBackEnd = null;
  }

  clickImg(elememtIdInput, image) {
    const showEye = 'url(\'/assets/img/icon/eye.png\')';
    const hideEye = 'url(\'/assets/img/icon/eye-show.png\')';
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

  clickImgConfirm() {
    const showEyeConfirm = 'url(\'/assets/img/icon/eye.png\')';
    const hideEyeConfirm = 'url(\'/assets/img/icon/eye-show.png\')';
    const confirmField = document.getElementById('password-confirm');
    const imgEyeConfirm = document.getElementById('img-confirm');
    if (confirmField['type'] === 'password') {
      imgEyeConfirm.style.backgroundImage = hideEyeConfirm;
      confirmField.setAttribute('type', 'text');
    } else {
      imgEyeConfirm.style.backgroundImage = showEyeConfirm;
      confirmField.setAttribute('type', 'password');
    }
  }

  matchPassword() {
    const password = document.getElementById('password')['value'];
    const confirmPassword = document.getElementById('password-confirm')['value'];
    if (password !== confirmPassword) {
      document.getElementById('seterror').style.display = 'block';
      document.getElementById('password-confirm').style.border = '1px solid #F03127';
    } else {
      document.getElementById('seterror').style.display = 'none';
      document.getElementById('password-confirm').style.border = '1px solid #839c94';
    }
  }

  inputTextGreen() {
    document.getElementById('first-name').style.color = '#13AA57';
  }

  inputTextBlack() {
    document.getElementById('first-name').style.color = '#000';
  }

  inputLastGreen() {
    document.getElementById('last-name').style.color = '#13AA57';
  }

  inputLastBlack() {
    document.getElementById('last-name').style.color = '#000';
  }

  inputNickGreen() {
    document.getElementById('user-name').style.color = '#13AA57';
  }

  inputNickBlack() {
    document.getElementById('user-name').style.color = '#000';
  }

  inputEmailGreen() {
    document.getElementById('email').style.color = '#13AA57';
  }

  inputEmailBlack() {
    document.getElementById('email').style.color = '#000';
  }

  inputPassGreen() {
    document.getElementById('password').style.color = '#13AA57';
  }

  inputPassBlack() {
    document.getElementById('password').style.color = '#000';
  }

  inputPassConfirmGreen() {
    document.getElementById('password-confirm').style.color = '#13AA57';
  }

  inputPassConfirmBlack() {
    document.getElementById('password-confirm').style.color = '#000';
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
}
