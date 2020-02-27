import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

//import { Component, OnInit } from '@angular/core';
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
import { WindowsigninComponent } from 'src/app/component/user/modal-auth/windowsignin/windowsignin.component';

@Component({
  selector: 'app-windowsignup',
  templateUrl: './windowsignup.component.html',
  styleUrls: ['./windowsignup.component.css']
})
export class WindowsignupComponent implements OnInit {

  constructor(
  	private matDialogRef: MatDialogRef<WindowsignupComponent>,

  	private userOwnSignInService: UserOwnSignInService,
    private userOwnSecurityService: UserOwnSignUpService,
    private router: Router,
    private authService: AuthService,
    private googleService: GoogleSignInService,
    public dialog: MatDialog,
  	@Inject(MAT_DIALOG_DATA) public data: any
  	) { }

    userOwnSignUp: UserOwnSignUp;
  firstNameErrorMessageBackEnd: string;
  lastNameErrorMessageBackEnd: string;
  emailErrorMessageBackEnd: string;
  passwordErrorMessageBackEnd: string;
  passwordConfirmErrorMessageBackEnd: string;
  loadingAnim = false;
  tmp: string;

  backEndError: string;

  readonly formPic = 'assets/img/formpic.jpg';
  readonly picGoogle = 'assets/img/icon/google.svg';
  readonly picArrow = 'assets/img/icon/arrows/google-arrow.svg';

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
            switch (error.name) {
              case 'firstName' :
                this.firstNameErrorMessageBackEnd = error.message;
                break;
              case 'lastName' :
                this.lastNameErrorMessageBackEnd = error.message;
                break;
              case 'email' :
                this.emailErrorMessageBackEnd = error.message;
                break;
              case 'password' :
                this.passwordErrorMessageBackEnd = error.message;
                break;
              case 'passwordConfirm' :
                this.passwordConfirmErrorMessageBackEnd = error.message;
                break;
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
    this.passwordConfirmErrorMessageBackEnd = null;
  }

  clickImg() {
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

  clickImgConfirm() {
    const showEyeConfirm = 'url(\'assets/img/icon/eye.png\')';
    const hideEyeConfirm = 'url(\'assets/img/icon/eye-show.png\')';
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

   redirectSignIn() {
       this.matDialogRef.close();
       this.dialog.open(WindowsigninComponent);
  }

  public close() {
  	this.matDialogRef.close();
  }

}
