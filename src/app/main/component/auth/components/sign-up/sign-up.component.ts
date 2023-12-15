import { Patterns } from './../../../../../../assets/patterns/patterns';
import { UserSuccessSignIn, SuccessSignUpDto } from './../../../../model/user-success-sign-in';
import { UserOwnSignUp } from './../../../../model/user-own-sign-up';
import { authImages } from './../../../../image-pathes/auth-images';
import { Component, EventEmitter, OnInit, OnDestroy, Output, OnChanges, NgZone, Input } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfirmPasswordValidator, ValidatorRegExp } from './sign-up.validator';
import { GoogleSignInService } from '@auth-service/google-sign-in.service';
import { UserOwnSignInService } from '@auth-service/user-own-sign-in.service';
import { UserOwnSignUpService } from '@auth-service/user-own-sign-up.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { environment } from '@environment/environment';
import { accounts } from 'google-one-tap';

declare var google: any;
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit, OnDestroy, OnChanges {
  @Input() isUbs: boolean;

  public signUpForm: UntypedFormGroup;
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
  public isSignInPage: boolean;
  public currentLanguage: string;
  private destroy: Subject<boolean> = new Subject<boolean>();
  private errorsType = {
    name: (error: string) => (this.firstNameErrorMessageBackEnd = error),
    email: (error: string) => (this.emailErrorMessageBackEnd = error),
    password: (error: string) => (this.passwordErrorMessageBackEnd = error),
    passwordConfirm: (error: string) => (this.passwordConfirmErrorMessageBackEnd = error)
  };
  @Output() private pageName = new EventEmitter();

  constructor(
    private matDialogRef: MatDialogRef<SignUpComponent>,
    private formBuilder: UntypedFormBuilder,
    private userOwnSignInService: UserOwnSignInService,
    private userOwnSignUpService: UserOwnSignUpService,
    private router: Router,
    private googleService: GoogleSignInService,
    private localStorageService: LocalStorageService,
    private snackBar: MatSnackBarComponent,
    private zone: NgZone
  ) {}

  ngOnInit() {
    this.onFormInit();
    this.getFormFields();
    this.setNullAllMessage();
    this.userOwnSignUp = new UserOwnSignUp();
  }

  ngOnChanges(): void {
    this.emailClassCheck();
    this.firstNameClassCheck();
    this.passwordClassCheck();
    this.passwordConfirmClassCheck();
  }

  public onSubmit(userOwnRegister: UserOwnSignUp): void {
    const { email, firstName, password } = this.signUpForm.value;

    userOwnRegister.email = email;
    userOwnRegister.firstName = firstName;
    userOwnRegister.password = password;

    this.setNullAllMessage();
    this.loadingAnim = true;
    this.currentLanguage = this.localStorageService.getCurrentLanguage();
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
    const gAccounts: accounts = google.accounts;
    gAccounts.id.initialize({
      client_id: environment.googleClientId,
      ux_mode: 'popup',
      cancel_on_tap_outside: true,
      callback: this.handleGgOneTap.bind(this)
    });
    gAccounts.id.prompt();
  }

  public handleGgOneTap(resp): void {
    try {
      this.googleService
        .signIn(resp.credential, this.currentLanguage)
        .pipe(takeUntil(this.destroy))
        .subscribe((successData) => this.signUpWithGoogleSuccess(successData));
    } catch (errorData) {
      this.signUpWithGoogleError(errorData);
    }
  }

  public setEmailBackendErr(): void {
    this.emailErrorMessageBackEnd = null;
    if (this.signUpForm) {
      this.emailFieldValue = this.emailControl.value;
      this.nameFieldValue = this.firstNameControl.value;
      this.passwordFieldValue = this.passwordControl.value;
      this.passwordConfirmFieldValue = this.passwordControlConfirm.value;
      this.isSignInPage = false;
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
        email: ['', [Validators.required, Validators.pattern(Patterns.ubsMailPattern)]],
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

  public trimValue(control: AbstractControl): void {
    control.setValue(control.value.trim());
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
    this.isUbs ? this.snackBar.openSnackBar('signUpUbs') : this.snackBar.openSnackBar('signUp');
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
    this.userOwnSignInService.saveUserToLocalStorage(data);
    this.closeSignUpWindow();
    this.zone.run(() => {
      this.router.navigate(this.isUbs ? ['ubs'] : ['profile', data.userId]);
    });
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

  public emailClassCheck(): string {
    return (this.emailControl?.invalid && this.emailControl.touched) || this.emailErrorMessageBackEnd || this.backEndError
      ? 'main-data-input wrong-input'
      : 'main-data-input';
  }

  public firstNameClassCheck(): string {
    return (this.firstNameControl?.invalid && this.firstNameControl.touched) || this.backEndError
      ? 'main-data-input wrong-input'
      : 'main-data-input';
  }

  public passwordClassCheck(): string {
    return (this.passwordControl?.invalid && this.passwordControl.touched) || this.backEndError
      ? 'main-data-input-password wrong-input'
      : 'main-data-input-password';
  }

  public passwordConfirmClassCheck(): string {
    return (this.passwordControlConfirm?.invalid && this.passwordControlConfirm.touched) ||
      this.backEndError ||
      (this.passwordControl?.value !== this.passwordControlConfirm?.value && this.passwordControlConfirm?.value !== '')
      ? 'main-data-input-password wrong-input'
      : 'main-data-input-password';
  }

  ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.complete();
  }
}
