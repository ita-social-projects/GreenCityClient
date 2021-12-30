import { Injectable, Injector, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
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

@Injectable({
  providedIn: 'root'
})
export class PopUpViewService implements OnDestroy {
  private userOwnSignInService: UserOwnSignInService;
  private jwtService: JwtService;
  private router: Router;
  private authService: AuthService;
  private googleService: GoogleSignInService;
  private localeStorageService: LocalStorageService;
  private userOwnAuthService: UserOwnAuthService;
  private userOwnSignUpService: UserOwnSignUpService;
  private profileService: ProfileService;
  private destroy: Subject<boolean> = new Subject<boolean>();
  private loadButtonAnimation = false;
  private snackBar: MatSnackBarComponent;
  /*private errorsType = {
    name: (error: string) => (),
    email: (error: string) => (this.signUpEmailErrorMessageBackEnd = error = error),
    password: (error: string) => (this.passwordErrorMessageBackEnd = error),
    passwordConfirm: (error: string) => (this.passwordConfirmErrorMessageBackEnd = error)
  };*/
  loadButtonAnimationBehaviourSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.getLoadButtonAnimation());
  regPopUpViewBehaviourSubject: BehaviorSubject<PopupTitleData> = new BehaviorSubject<PopupTitleData>(this.getPopupViewValue());
  popUpValue: PopupTitleData;
  isUbs: boolean;
  userOwnSignUp: UserOwnSignUp;
  currentLanguage: string;
  userOwnSignIn: UserOwnSignIn;
  navigateToLink: string[];
  signInEmailErrorMessageBackEnd: string;
  signInPasswordErrorMessageBackEnd: string;
  signUpEmailErrorMessageBackEnd: string;
  signUpPasswordErrorMessageBackEnd: string;
  signUpFirstNameErrorMessageBackEnd: string;
  signUpPasswordConfirmErrorMessageBackEnd: string;
  backEndError: string;

  private readonly signInTittle = {
    title: 'user.auth.sign-in.title',
    information: 'user.auth.sign-in.fill-form'
  };

  private readonly signUpValue = {
    title: 'user.auth.sign-up.title-up',
    information: 'user.auth.sign-up.fill-form-up'
  };

  private readonly restorePassword = {
    title: 'user.auth.forgot-password.title',
    information: 'user.auth.forgot-password.fill-form'
  };

  constructor(private injector: Injector) {
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

  setPopupViewValue(page: string): void {
    this.localeStorageService.ubsRegBehaviourSubject.pipe(takeUntil(this.destroy)).subscribe((value) => (this.isUbs = value));
    this.popUpValue = page === 'sign-in' ? this.signInTittle : page === 'restore-password' ? this.restorePassword : this.signUpValue;
    this.regPopUpViewBehaviourSubject.next(this.popUpValue);
  }

  getLoadButtonAnimation() {
    return this.loadButtonAnimation;
  }

  getPopupViewValue(): PopupTitleData {
    return this.popUpValue;
  }

  public signUp(email: string, firstName: string, password: string): void {
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
        },
        (error: HttpErrorResponse) => {
          this.onSubmitError(error);
          this.loadButtonAnimation = false;
          this.loadButtonAnimationBehaviourSubject.next(this.loadButtonAnimation);
        }
      );
  }

  private onSubmitError(errors: HttpErrorResponse): void {
    /*errors.error.map((error) => {
      this.errorsType[error.name](error.message);
    });*/
    this.loadButtonAnimation = false;
    this.loadButtonAnimationBehaviourSubject.next(this.loadButtonAnimation);
  }

  private onSubmitSuccess(data: SuccessSignUpDto): void {
    this.loadButtonAnimation = false;
    this.loadButtonAnimationBehaviourSubject.next(this.loadButtonAnimation);
    this.snackBar.openSnackBar('signUp');
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
        },
        (errors: HttpErrorResponse) => {
          this.onSignInFailure(errors);
          this.loadButtonAnimation = false;
          this.loadButtonAnimationBehaviourSubject.next(this.loadButtonAnimation);
        }
      );
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
    this.loadButtonAnimation = false;
    this.loadButtonAnimationBehaviourSubject.next(this.loadButtonAnimation);
    this.userOwnSignInService.saveUserToLocalStorage(data);
    this.localeStorageService.setFirstName(data.name);
    this.localeStorageService.setFirstSignIn();
    this.userOwnAuthService.getDataFromLocalStorage();
    this.jwtService.userRole$.next(this.jwtService.getUserRole());
    this.navigateToLink = this.isUbs ? ['ubs', 'order'] : ['profile', data.userId];
    this.router.navigate(this.navigateToLink);
  }

  private onSignInFailure(errors: HttpErrorResponse): void {
    if (typeof errors === 'string') {
      return;
    } else if (!Array.isArray(errors.error)) {
      this.backEndError = errors.error.message;
      return;
    }

    errors.error.forEach((error) => {
      this.signInEmailErrorMessageBackEnd = error.name === 'email' ? error.message : this.signInEmailErrorMessageBackEnd;
      this.signInPasswordErrorMessageBackEnd = error.name === 'password' ? error.message : this.signInPasswordErrorMessageBackEnd;
    });
  }

  ngOnDestroy() {
    this.destroy.next(true);
    this.destroy.complete();
  }
}
