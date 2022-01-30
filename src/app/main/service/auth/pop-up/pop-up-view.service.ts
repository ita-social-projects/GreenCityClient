import { Injectable, Injector, OnDestroy } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { PopupTitleData } from '../../../component/auth/models/authPop-upContent';
import { take, takeUntil } from 'rxjs/operators';
import { SuccessSignUpDto, UserSuccessSignIn } from '@global-models/user-success-sign-in';
import { HttpErrorResponse } from '@angular/common/http';
import { UserOwnSignInService } from '@auth-service/user-own-sign-in.service';
import { JwtService } from '@global-service/jwt/jwt.service';
import { Router } from '@angular/router';
import { AuthService, GoogleLoginProvider } from 'angularx-social-login';
import { GoogleSignInService } from '@auth-service/google-sign-in.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { UserOwnAuthService } from '@auth-service/user-own-auth.service';
import { ProfileService } from '@global-user/components/profile/profile-service/profile.service';
import { UserOwnSignIn } from '@global-models/user-own-sign-in';
import { UserOwnSignUp } from '@global-models/user-own-sign-up';
import { UserOwnSignUpService } from '@auth-service/user-own-sign-up.service';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { ConfirmPasswordValidator } from '@global-auth/sign-up/sign-up.validator';
import { RestorePasswordService } from '@auth-service/restore-password.service';

@Injectable({
  providedIn: 'root'
})
export class PopUpViewService implements OnDestroy {
  private signInValue = 'sign-in';
  private signUpValue = 'sign-up';
  private restorePasswordValue = 'restore-password';
  private validityStatus = 'noValid';
  private emailValueIsValid: boolean;
  private userNameFieldIsValid: boolean;
  private passwordValueIsValid: boolean;
  private userOwnSignInService: UserOwnSignInService;
  private jwtService: JwtService;
  private router: Router;
  private authService: AuthService;
  private restorePasswordService: RestorePasswordService;
  private googleService: GoogleSignInService;
  private localeStorageService: LocalStorageService;
  private userOwnAuthService: UserOwnAuthService;
  private userOwnSignUpService: UserOwnSignUpService;
  private profileService: ProfileService;
  private destroy: Subject<boolean> = new Subject<boolean>();
  private loadButtonAnimation = false;
  private snackBar: MatSnackBarComponent;
  private popUpValue: PopupTitleData;
  private isUbs: boolean;
  private userOwnSignUp: UserOwnSignUp;
  private currentLanguage: string;
  private userOwnSignIn: UserOwnSignIn;
  private backEndError: string;
  private navigateToLink: string[];
  private signInEmailErrorMessageBackEnd: string;
  private signInPasswordErrorMessageBackEnd: string;
  private currentPage: string;
  private buttonActive = false;
  private signUpEmailErrorMessageBackEnd: string;
  private signUpPasswordErrorMessageBackEnd: string;
  private signUpFirstNameErrorMessageBackEnd: string;
  private restorePasswordEmailMessageBackEnd: string;
  private readonly signInTittle = {
    title: 'user.auth.sign-in.title',
    information: 'user.auth.sign-in.fill-form'
  };
  private readonly signUpTittle = {
    title: 'user.auth.sign-up.title-up',
    information: 'user.auth.sign-up.fill-form-up'
  };
  private readonly restorePassword = {
    title: 'user.auth.forgot-password.title',
    information: 'user.auth.forgot-password.fill-form'
  };
  private errorsType = {
    name: (error: string) => (this.signUpFirstNameErrorMessageBackEnd = error),
    email: (error: string) => (this.signUpEmailErrorMessageBackEnd = error),
    password: (error: string) => (this.signUpPasswordErrorMessageBackEnd = error)
  };
  public passwordValue: string;
  public repeatPasswordValue: string;
  loadButtonAnimationBehaviourSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.getLoadButtonAnimation());
  backendErrorSubject: Subject<string> = new Subject<string>();
  closePopUpSubject: Subject<string> = new Subject<string>();
  passwordMismatchSubject: ReplaySubject<string> = new ReplaySubject<string>();
  buttonActiveBehaviourSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.getButtonActive());
  regPopUpViewBehaviourSubject: BehaviorSubject<PopupTitleData> = new BehaviorSubject<PopupTitleData>(this.getPopupViewValue());
  emailBackendErrorSubject: Subject<string> = new Subject<string>();
  firstNameBackendErrorSubject: Subject<string> = new Subject<string>();
  passwordBackendErrorSubject: Subject<string> = new Subject<string>();

  constructor(private injector: Injector) {
    this.restorePasswordService = injector.get(RestorePasswordService);
    this.localeStorageService = injector.get(LocalStorageService);
    this.userOwnSignInService = injector.get(UserOwnSignInService);
    this.userOwnSignUpService = injector.get(UserOwnSignUpService);
    this.jwtService = injector.get(JwtService);
    this.router = injector.get(Router);
    this.authService = injector.get(AuthService);
    this.googleService = injector.get(GoogleSignInService);
    this.userOwnAuthService = injector.get(UserOwnAuthService);
    this.profileService = injector.get(ProfileService);
    this.snackBar = injector.get(MatSnackBarComponent);
  }

  signIn(email: string, password: string): void {
    this.loadButtonAnimation = true;
    this.loadButtonAnimationBehaviourSubject.next(this.loadButtonAnimation);
    this.userOwnSignIn = new UserOwnSignIn();
    this.userOwnSignIn.email = email;
    this.userOwnSignIn.password = password;
    this.userOwnSignInService
      .signIn(this.userOwnSignIn)
      .pipe(takeUntil(this.destroy))
      .subscribe(
        (data: UserSuccessSignIn) => {
          this.onSignInSuccess(data);
          this.loadButtonAnimation = false;
          this.loadButtonAnimationBehaviourSubject.next(this.loadButtonAnimation);
        },
        (errors: HttpErrorResponse) => {
          this.onSignInFailure(errors);
          this.loadButtonAnimation = false;
          this.loadButtonAnimationBehaviourSubject.next(this.loadButtonAnimation);
        }
      );
  }

  private getButtonActive() {
    return this.buttonActive;
  }

  public setEmailInputField(value: boolean) {
    this.emailValueIsValid = value;
    this.setButtonActive();
  }

  public setUserNameInputField(value: boolean) {
    this.userNameFieldIsValid = value;
    this.setButtonActive();
  }

  public setPasswordInputField(isValid: boolean, value?: string) {
    if (this.currentPage === this.signUpValue) {
      this.passwordValueIsValid = isValid;
      this.passwordValue = value;
    }
    if (this.currentPage === this.signInValue) {
      this.passwordValueIsValid = isValid;
    }
    this.setButtonActive();
  }

  public setRepeatPasswordValue(value: string) {
    this.repeatPasswordValue = value;
    this.setButtonActive();
  }

  private setButtonActive() {
    if (this.currentPage === this.signInValue) {
      this.buttonActive = this.emailValueIsValid && this.passwordValueIsValid && this.passwordValue !== '';
    }
    if (this.currentPage === this.signUpValue) {
      const boolValue = ConfirmPasswordValidator(this.passwordValue, this.repeatPasswordValue);
      this.buttonActive = this.emailValueIsValid && this.passwordValueIsValid && this.userNameFieldIsValid && boolValue;
      this.validityStatus = !boolValue ? 'noValid' : 'valid';
      if (this.passwordValueIsValid) {
        this.passwordMismatchSubject.next(this.validityStatus);
      }
    }
    if (this.currentPage === this.restorePasswordValue) {
      this.buttonActive = this.emailValueIsValid;
    }
    this.buttonActiveBehaviourSubject.next(this.buttonActive);
  }

  sendEmail(email: string): void {
    this.loadButtonAnimation = true;
    this.loadButtonAnimationBehaviourSubject.next(this.loadButtonAnimation);
    this.currentLanguage = this.localeStorageService.getCurrentLanguage();
    this.restorePasswordService
      .sendEmailForRestore(email, this.currentLanguage)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.closePopUpSubject.next('close');
          this.snackBar.openSnackBar('successRestorePassword');
          this.loadButtonAnimation = false;
          this.loadButtonAnimationBehaviourSubject.next(this.loadButtonAnimation);
        },
        error: (error: HttpErrorResponse) => {
          this.onSendEmailBadMessage(error);
          this.loadButtonAnimation = false;
          this.loadButtonAnimationBehaviourSubject.next(this.loadButtonAnimation);
        }
      });
  }

  setPopupViewValue(page: string): void {
    this.emailValueIsValid = false;
    this.passwordValueIsValid = false;
    this.buttonActive = false;
    this.buttonActiveBehaviourSubject.next(this.buttonActive);
    this.currentPage = page;
    this.localeStorageService.ubsRegBehaviourSubject.pipe(takeUntil(this.destroy)).subscribe((value) => (this.isUbs = value));
    this.popUpValue =
      page === this.signInValue ? this.signInTittle : page === this.restorePasswordValue ? this.restorePassword : this.signUpTittle;
    this.regPopUpViewBehaviourSubject.next(this.popUpValue);
  }

  getLoadButtonAnimation() {
    return this.loadButtonAnimation;
  }

  getPopupViewValue(): PopupTitleData {
    return this.popUpValue;
  }

  public signUp(email: string, firstName: string, password: string): void {
    this.loadButtonAnimation = true;
    this.loadButtonAnimationBehaviourSubject.next(this.loadButtonAnimation);
    this.userOwnSignUp = new UserOwnSignUp();
    this.userOwnSignUp.email = email;
    this.userOwnSignUp.firstName = firstName;
    this.userOwnSignUp.password = password;
    this.currentLanguage = this.localeStorageService.getCurrentLanguage();
    this.userOwnSignUpService
      .signUp(this.userOwnSignUp, this.currentLanguage)
      .pipe(takeUntil(this.destroy))
      .subscribe(
        (data: SuccessSignUpDto) => {
          this.onSubmitSuccess(data);
          this.loadButtonAnimation = false;
          this.loadButtonAnimationBehaviourSubject.next(this.loadButtonAnimation);
        },
        (error: HttpErrorResponse) => {
          this.onSubmitError(error);
          this.loadButtonAnimation = false;
          this.loadButtonAnimationBehaviourSubject.next(this.loadButtonAnimation);
        }
      );
  }

  private onSendEmailBadMessage(error: HttpErrorResponse): void {
    this.restorePasswordEmailMessageBackEnd = error.error.name === 'email' ? 'already-sent' : 'email-not-exist';
    this.emailBackendErrorSubject.next(this.restorePasswordEmailMessageBackEnd);
  }

  private onSubmitError(errors: HttpErrorResponse): void {
    errors.error.map((error) => {
      this.errorsType[error.name](error.message);
    });
    this.emailBackendErrorSubject.next(this.signUpEmailErrorMessageBackEnd);
    this.firstNameBackendErrorSubject.next(this.signUpFirstNameErrorMessageBackEnd);
    this.passwordBackendErrorSubject.next(this.signUpPasswordErrorMessageBackEnd);
  }

  private onSignInFailure(errors: HttpErrorResponse): void {
    if (typeof errors === 'string') {
      return;
    } else if (!Array.isArray(errors.error)) {
      this.backEndError = errors.error.message;
      this.backendErrorSubject.next(this.backEndError);
      return;
    }

    errors.error.forEach((error) => {
      this.signInEmailErrorMessageBackEnd = error.name === 'email' ? error.message : this.signInEmailErrorMessageBackEnd;
      this.signInPasswordErrorMessageBackEnd = error.name === 'password' ? error.message : this.signInPasswordErrorMessageBackEnd;
    });
  }

  private onSubmitSuccess(data: SuccessSignUpDto): void {
    this.closePopUpSubject.next('close');
    this.snackBar.openSnackBar('signUp');
  }

  signInWithGoogle(): void {
    this.authService
      .signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((data) => {
        this.googleService
          .signIn(data.idToken)
          .pipe(takeUntil(this.destroy))
          .subscribe((signInData: UserSuccessSignIn) => {
            this.onSignInWithGoogleSuccess(signInData);
          });
      })
      .catch((errors: HttpErrorResponse) => this.onSignInFailure(errors));
  }

  public onSignInWithGoogleSuccess(data: UserSuccessSignIn): void {
    this.navigateToLink = this.isUbs ? ['ubs', 'order'] : ['profile', data.userId];
    this.userOwnSignInService.saveUserToLocalStorage(data);
    this.userOwnAuthService.getDataFromLocalStorage();
    this.jwtService.userRole$.next(this.jwtService.getUserRole());
    this.router
      .navigate(this.navigateToLink)
      .then(() => {
        this.localeStorageService.setFirstSignIn();
        this.profileService
          .getUserInfo()
          .pipe(take(1))
          .subscribe((item) => {
            this.localeStorageService.setFirstName(item.name);
          });
      })
      .catch((fail) => console.log('redirect has failed ' + fail));
  }

  private onSignInSuccess(data: UserSuccessSignIn): void {
    this.userOwnSignInService.saveUserToLocalStorage(data);
    this.localeStorageService.setFirstName(data.name);
    this.localeStorageService.setFirstSignIn();
    this.userOwnAuthService.getDataFromLocalStorage();
    this.jwtService.userRole$.next(this.jwtService.getUserRole());
    this.navigateToLink = this.isUbs ? ['ubs', 'order'] : ['profile', data.userId];
    this.router.navigate(this.navigateToLink);
  }

  ngOnDestroy() {
    this.destroy.next(true);
    this.destroy.complete();
  }
}
