import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
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
import { ConfirmPasswordValidator, ValidatorRegExp } from './sign-up.validator';
import { AuthModalServiceService } from '../../services/auth-service.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  public signUpForm: FormGroup;
  public emailControl: AbstractControl;
  public firstNameControl: AbstractControl;
  public passwordControl: AbstractControl;
  public passwordControlConfirm: AbstractControl;
  public signUpImages = authImages;
  public userOwnSignUp: UserOwnSignUp;
  public loadingAnim = false;
  public emailErrorMessageBackEnd: string;
  public isEmailInvalid = false;
  public passwordErrorMessageBackEnd: string;
  private firstNameErrorMessageBackEnd: string;
  private passwordConfirmErrorMessageBackEnd: string;
  private backEndError: string;

  constructor(private matDialogRef: MatDialogRef<SignUpComponent>,
              private dialog: MatDialog,
              private formBuilder: FormBuilder,
              private userOwnSignInService: UserOwnSignInService,
              private userOwnSecurityService: UserOwnSignUpService,
              private router: Router,
              private authService: AuthService,
              private googleService: GoogleSignInService,
              private authModalService: AuthModalServiceService,) { }

  ngOnInit() {
    this.InitFormReactive();
    this.getFormFields();
    this.userOwnSignUp = new UserOwnSignUp();
    this.setNullAllMessage();
  }

  public InitFormReactive() : void {
    this.signUpForm = this.formBuilder.group({
        email: ['', [ Validators.required, Validators.email ]],
        firstName: ['', [ Validators.required ]],
        password: ['', [ Validators.required]],
        repeatPassword: ['', [ Validators.required ]]
      },
      {
        validator: [ 
          ConfirmPasswordValidator('password', 'repeatPassword'),
          ValidatorRegExp('firstName'),
          ValidatorRegExp('password'),
        ]
      }
    );
  }

  public getFormFields(): void {
    this.emailControl = this.signUpForm.get('email');
    this.firstNameControl = this.signUpForm.get('firstName');
    this.passwordControl = this.signUpForm.get('password');
    this.passwordControlConfirm = this.signUpForm.get('repeatPassword');
  }

  private setNullAllMessage(): void {
    this.firstNameErrorMessageBackEnd = null;
    this.emailErrorMessageBackEnd = null;
    this.passwordErrorMessageBackEnd = null;
    this.passwordConfirmErrorMessageBackEnd = null;
  }

  public onSubmit(userOwnRegister: UserOwnSignUp): void {
    const { email, firstName, password } = this.signUpForm.value;

    userOwnRegister.email = email;
    userOwnRegister.firstName = firstName;
    userOwnRegister.password = password;

    this.setNullAllMessage();
    this.loadingAnim = true;
    this.userOwnSecurityService.signUp(userOwnRegister)
      .subscribe(
      (data) => {
        this.onSubmitSuccess(data)
      }, (error) => {
        this.onSubmitError(error)});
  }

  private onSubmitSuccess(data): void {
    this.loadingAnim = false;
    this.openSignUpPopup();
    this.closeSignUpWindow();
    this.receiveUserId(data.userId);
  }

  private receiveUserId(id: number): void {
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
          this.isEmailInvalid = this.emailErrorMessageBackEnd === 'The email is invalid';
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

  public signUpWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((data) => {
        this.googleService.signIn(data.idToken)
          .subscribe((successData) => this.signUpWithGoogleSuccess(successData));
      })
      .catch((errorData) => this.signUpWithGoogleError(errorData));
  }

  private signUpWithGoogleSuccess(data: UserSuccessSignIn): void {
    this.userOwnSignInService.saveUserToLocalStorage(data);
    this.closeSignUpWindow();
    this.router.navigate(['/']);
  }

  private signUpWithGoogleError(errors: HttpErrorResponse): void {
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

  public setEmailBackendErr(): void {
    this.emailErrorMessageBackEnd = null;
  }

  public setPasswordVisibility(htmlInput: HTMLInputElement, htmlImage: HTMLImageElement): void {
    htmlInput.type = htmlInput.type === 'password' ? 'text' : 'password';
    htmlImage.src = htmlInput.type === 'password' ? this.signUpImages.hiddenEye : this.signUpImages.openEye;
  }

  public openSignInWindow(): void {
    this.authModalService.setAuthPopUp('sign-in');
  }
}
