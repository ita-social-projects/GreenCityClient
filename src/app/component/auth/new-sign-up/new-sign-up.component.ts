import { Component, OnInit } from '@angular/core';
import { authImages } from '../../../../assets/img/auth/auth-images';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SignInNewComponent } from '../sign-in-new/sign-in-new.component';
import {UserOwnSignInService} from '../../../service/auth/user-own-sign-in.service';
import {UserOwnSignUpService} from '../../../service/auth/user-own-sign-up.service';
import {Router} from '@angular/router';
import {AuthService, GoogleLoginProvider} from 'angularx-social-login';
import {GoogleSignInService} from '../../../service/auth/google-sign-in.service';
import {UserOwnSignUp} from '../../../model/user-own-sign-up';
import {HttpErrorResponse} from '@angular/common/http';
import {UserSuccessSignIn} from '../../../model/user-success-sign-in';

@Component({
  selector: 'app-new-sign-up',
  templateUrl: './new-sign-up.component.html',
  styleUrls: ['./new-sign-up.component.scss']
})
export class NewSignUpComponent implements OnInit {
  private signUpImgs = authImages;
  private userOwnSignUp: UserOwnSignUp;
  private firstNameErrorMessageBackEnd: string;
  private lastNameErrorMessageBackEnd: string;
  private emailErrorMessageBackEnd: string;
  private passwordErrorMessageBackEnd: string;
  private passwordConfirmErrorMessageBackEnd: string;
  private loadingAnim = false;
  private tmp: string;
  private backEndError: string;

  constructor(private matDialogRef: MatDialogRef<NewSignUpComponent>,
              private dialog: MatDialog,
              private userOwnSignInService: UserOwnSignInService,
              private userOwnSecurityService: UserOwnSignUpService,
              private router: Router,
              private authService: AuthService,
              private googleService: GoogleSignInService) { }

  ngOnInit() {
    this.userOwnSignUp = new UserOwnSignUp();
    this.setNullAllMessage();
  }

  private setNullAllMessage(): void {
    this.firstNameErrorMessageBackEnd = null;
    this.lastNameErrorMessageBackEnd = null;
    this.emailErrorMessageBackEnd = null;
    this.passwordErrorMessageBackEnd = null;
    this.passwordConfirmErrorMessageBackEnd = null;
  }

  private onSubmit(userOwnRegister: UserOwnSignUp): void {
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

  private signInWithGoogle(): void {
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

  private closeSignUpWindow(): void {
    this.matDialogRef.close();
  }

  private matchPassword(passInput: HTMLInputElement,
                        passRepeat: HTMLInputElement,
                        inputBlock: HTMLElement): void {
    if (passInput.value !== passRepeat.value) {
      inputBlock.className = 'main-data-input-password wrong-input';
    } else {
      inputBlock.className = 'main-data-input-password';
    }
  }

  private hideShowPassword(htmlInput: HTMLInputElement,
                           htmlImage: HTMLImageElement): void {
    if (htmlInput.type === 'password') {
      htmlInput.type = 'text';
      htmlImage.src = this.signUpImgs.openEye;
    } else {
      htmlInput.type = 'password';
      htmlImage.src = this.signUpImgs.hiddenEye;
    }
  }

  private openSignInWindow(): void {
    this.closeSignUpWindow();
    this.dialog.open(SignInNewComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      panelClass: 'custom-dialog-container',
    });
  }
}
