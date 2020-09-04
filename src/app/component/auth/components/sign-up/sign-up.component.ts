import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService, GoogleLoginProvider } from 'angularx-social-login';
import { authImages } from 'src/app/image-pathes/auth-images';
import { UserOwnSignInService } from '@global-service/auth/user-own-sign-in.service';
import { UserOwnSignUpService } from '@global-service/auth/user-own-sign-up.service';
import { GoogleSignInService } from '@global-service/auth/google-sign-in.service';
import { UserOwnSignUp } from '@global-models/user-own-sign-up';
import { UserSuccessSignIn } from '@global-models/user-success-sign-in';
import { SubmitEmailComponent } from '../submit-email/submit-email.component';
import { SignInComponent } from '../sign-in/sign-in.component';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  public signUpImages = authImages;
  public userOwnSignUp: UserOwnSignUp;
  public tmp: string;
  public loadingAnim = false;
  public emailErrorMessageBackEnd: string;
  public passwordErrorMessageBackEnd: string;
  private firstNameErrorMessageBackEnd: string;
  private lastNameErrorMessageBackEnd: string;
  private passwordConfirmErrorMessageBackEnd: string;
  private backEndError: string;

  constructor(private matDialogRef: MatDialogRef<SignUpComponent>,
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

  public onSubmit(userOwnRegister: UserOwnSignUp): void {
    this.setNullAllMessage();
    this.loadingAnim = true;
    this.userOwnSecurityService.signUp(userOwnRegister)
      .subscribe((data) => this.onSubmitSuccess(data), (error) => this.onSubmitError(error));
  }

  private onSubmitSuccess(data): void {
    this.loadingAnim = false;
    this.openSignUpPopup();
    this.closeSignUpWindow();
    this.receiveUserId(data.userId);
  }

  private receiveUserId(id): void {
    setTimeout(() => {
      this.router.navigate(['profile', id]);
      this.dialog.closeAll();
    }, 5000);
  }

  private openSignUpPopup(): void {
    this.dialog.open(SubmitEmailComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: false,
      panelClass: 'custom-dialog-container',
    });
  }

  private onSubmitError(errors: HttpErrorResponse): void {
    errors.error.map(error => {
      switch (error.name) {
        case 'name':
          this.firstNameErrorMessageBackEnd = error.message;
          break;
        case 'email':
          this.emailErrorMessageBackEnd = error.message;
          break;
        case 'password':
          this.passwordErrorMessageBackEnd = error.message;
          break;
        case 'passwordConfirm':
          this.passwordConfirmErrorMessageBackEnd = error.message;
          break;
      }
    });

    this.loadingAnim = false;
  }

  public signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((data) => {
        this.googleService.signIn(data.idToken)
          .subscribe((successData) => this.signInWithGoogleSuccess(successData));
      })
      .catch((errorData) => this.signInWithGoogleError(errorData));
  }

  private signInWithGoogleSuccess(data: UserSuccessSignIn): void {
    this.userOwnSignInService.saveUserToLocalStorage(data);
    this.closeSignUpWindow();
    this.router.navigate(['/']);
  }

  private signInWithGoogleError(errors: HttpErrorResponse): void {
    if (!Array.isArray(errors.error)) {
      this.backEndError = errors.error.message;
      return;
    }

    errors.error.map((error) => {
      this.emailErrorMessageBackEnd = error.name === 'email' ? error.message : this.emailErrorMessageBackEnd;
      this.passwordConfirmErrorMessageBackEnd = error.name === 'password' ? error.message : this.passwordConfirmErrorMessageBackEnd;
    });
  }

  public closeSignUpWindow(): void {
    this.matDialogRef.close();
  }

  public matchPassword(passInput: HTMLInputElement,
                       passRepeat: HTMLInputElement,
                       inputBlock: HTMLElement): void {
    this.passwordErrorMessageBackEnd = null;
    inputBlock.className = passInput.value !== passRepeat.value ?
                          'main-data-input-password wrong-input' :
                          'main-data-input-password';
  }

  public setEmailBackendErr(): void {
    this.emailErrorMessageBackEnd = null;
  }

  public setPasswordVisibility(htmlInput: HTMLInputElement, htmlImage: HTMLImageElement): void {
    htmlInput.type = htmlInput.type === 'password' ? 'text' : 'password';
    htmlImage.src = htmlInput.type === 'password' ? this.signUpImages.hiddenEye : this.signUpImages.openEye;
  }

  public checkSpaces(input: string): boolean {
    return input.indexOf(' ') >= 0;
  }

  public checkSymbols(input: string): boolean {
    const regexp = /^(?=.*[a-z]+)(?=.*[A-Z]+)(?=.*\d+)(?=.*[~`!@#$%^&*()+=_\-{}|:;”’?/<>,.\]\[]+).{8,}$/;
    return (regexp.test(input) || input === '');
  }

  public checkUserName(input: string): boolean {
    const regexp = /^[^\.][a-z0-9\. ]{5,29}$/gi;
    return (regexp.test(input) || input === '');
  }

  public openSignInWindow(): void {
    this.closeSignUpWindow();
    this.dialog.open(SignInComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: true,
      panelClass: 'custom-dialog-container',
    });
  }
}
