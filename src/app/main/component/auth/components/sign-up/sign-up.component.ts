import { UserSuccessSignIn, SuccessSignUpDto } from '@global-models/user-success-sign-in';
import { UserOwnSignUp } from '@global-models/user-own-sign-up';
import { authImages } from '../../../../image-pathes/auth-images';
import { Component, EventEmitter, OnInit, OnDestroy, Output, Injector } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService, GoogleLoginProvider } from 'angularx-social-login';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfirmPasswordValidator, ValidatorRegExp } from './sign-up.validator';
import { GoogleSignInService } from '@auth-service/google-sign-in.service';
import { UserOwnSignInService } from '@auth-service/user-own-sign-in.service';
import { UserOwnSignUpService } from '@auth-service/user-own-sign-up.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit, OnDestroy {
  public signUpForm: FormGroup;
  public emailControl: AbstractControl;
  public firstNameControl: AbstractControl;
  public passwordControl: AbstractControl;
  public passwordControlConfirm: AbstractControl;
  public signUpImages = authImages;
  public userOwnSignUp: UserOwnSignUp;
  public loadingAnim: boolean;
  public emailErrorMessageBackEnd: string;
  public passwordErrorMessageBackEnd: string;
  public firstNameErrorMessageBackEnd: string;
  public passwordConfirmErrorMessageBackEnd: string;
  public backEndError: string;
  public emailFieldValue: string;
  public nameFieldValue: string;
  public passwordFieldValue: string;
  public passwordConfirmFieldValue: string;
  public currentLanguage: string;
  private destroy: Subject<boolean> = new Subject<boolean>();
  private errorsType = {
    name: (error: string) => (this.firstNameErrorMessageBackEnd = error),
    email: (error: string) => (this.emailErrorMessageBackEnd = error),
    password: (error: string) => (this.passwordErrorMessageBackEnd = error),
    passwordConfirm: (error: string) => (this.passwordConfirmErrorMessageBackEnd = error)
  };
  public isUbs: boolean;
  public navigateToLink;
  @Output() private pageName = new EventEmitter();
  private dialog: MatDialog;
  private formBuilder: FormBuilder;
  private userOwnSignInService: UserOwnSignInService;
  private userOwnSignUpService: UserOwnSignUpService;
  private router: Router;
  private authService: AuthService;
  private googleService: GoogleSignInService;
  private localeStorageService: LocalStorageService;
  private snackBar: MatSnackBarComponent;

  constructor(private matDialogRef: MatDialogRef<SignUpComponent>, private injector: Injector) {
    this.dialog = injector.get(MatDialog);
    this.formBuilder = injector.get(FormBuilder);
    this.userOwnSignInService = injector.get(UserOwnSignInService);
    this.userOwnSignUpService = injector.get(UserOwnSignUpService);
    this.router = injector.get(Router);
    this.authService = injector.get(AuthService);
    this.googleService = injector.get(GoogleSignInService);
    this.localeStorageService = injector.get(LocalStorageService);
    this.snackBar = injector.get(MatSnackBarComponent);
  }

  ngOnInit() {
    this.localeStorageService.ubsRegBehaviourSubject.pipe(takeUntil(this.destroy)).subscribe((value) => (this.isUbs = value));
    this.currentLanguage = this.localeStorageService.getCurrentLanguage();
    this.onFormInit();
    this.getFormFields();
    this.setNullAllMessage();
    this.userOwnSignUp = new UserOwnSignUp();
  }

  public onSubmit(userOwnRegister: UserOwnSignUp): void {
    const { email, firstName, password } = this.signUpForm.value;

    userOwnRegister.email = email;
    userOwnRegister.firstName = firstName;
    userOwnRegister.password = password;

    this.setNullAllMessage();
    this.loadingAnim = true;
    this.currentLanguage = this.localeStorageService.getCurrentLanguage();
    this.userOwnSignUpService
      .signUp(userOwnRegister, this.currentLanguage)
      .pipe(takeUntil(this.destroy))
      .subscribe(
        (data: SuccessSignUpDto) => {
          this.onSubmitSuccess(data);
        },
        (error: HttpErrorResponse) => {
          this.onSubmitError(error);
        }
      );
  }

  public signUpWithGoogle(): void {
    this.authService
      .signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((data) => {
        this.googleService
          .signIn(data.idToken, this.currentLanguage)
          .pipe(takeUntil(this.destroy))
          .subscribe((successData) => this.signUpWithGoogleSuccess(successData));
      })
      .catch((errorData) => this.signUpWithGoogleError(errorData));
  }

  public setEmailBackendErr(): void {
    this.emailErrorMessageBackEnd = null;
    if (this.signUpForm) {
      this.emailFieldValue = this.emailControl.value;
      this.nameFieldValue = this.firstNameControl.value;
      this.passwordFieldValue = this.passwordControl.value;
      this.passwordConfirmFieldValue = this.passwordControlConfirm.value;
    }
  }

  public setPasswordVisibility(htmlInput: HTMLInputElement, htmlImage: HTMLImageElement): void {
    htmlInput.type = htmlInput.type === 'password' ? 'text' : 'password';
    htmlImage.src = htmlInput.type === 'password' ? this.signUpImages.hiddenEye : this.signUpImages.openEye;
  }

  public openSignInWindow(): void {
    this.pageName.emit('sign-in');
  }

  public getEmailError(): string {
    return /already registered/.test(this.emailErrorMessageBackEnd)
      ? 'user.auth.sign-up.the-user-already-exists-by-this-email'
      : 'user.auth.sign-up.this-is-not-email';
  }

  private onFormInit(): void {
    this.signUpForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        firstName: ['', []],
        password: ['', []],
        repeatPassword: ['', []]
      },
      {
        validator: [ConfirmPasswordValidator('password', 'repeatPassword'), ValidatorRegExp('firstName'), ValidatorRegExp('password')]
      }
    );
  }

  private getFormFields(): void {
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

  private onSubmitSuccess(data: SuccessSignUpDto): void {
    this.loadingAnim = false;
    this.closeSignUpWindow();
    this.snackBar.openSnackBar('signUp');
  }

  private closeSignUpWindow(): void {
    this.matDialogRef.close();
  }

  private onSubmitError(errors: HttpErrorResponse): void {
    errors.error.map((error) => {
      this.errorsType[error.name](error.message);
    });
    this.loadingAnim = false;
  }

  private signUpWithGoogleSuccess(data: UserSuccessSignIn): void {
    this.navigateToLink = this.isUbs ? ['ubs', 'order'] : ['profile', data.userId];
    this.userOwnSignInService.saveUserToLocalStorage(data);
    this.closeSignUpWindow();
    this.router.navigate(this.navigateToLink);
  }

  private signUpWithGoogleError(errors: HttpErrorResponse): void {
    if (typeof errors === 'string') {
      return;
    } else if (!Array.isArray(errors.error)) {
      this.backEndError = errors.error.message;
      return;
    }

    errors.error.forEach((error) => {
      this.emailErrorMessageBackEnd = error.name === 'email' ? error.message : this.emailErrorMessageBackEnd;
      this.passwordConfirmErrorMessageBackEnd = error.name === 'password' ? error.message : this.passwordConfirmErrorMessageBackEnd;
    });
  }

  ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.complete();
  }
}
