import { UserSuccessSignIn } from './../../../../model/user-success-sign-in';
import { SignInIcons } from './../../../../image-pathes/sign-in-icons';
import { UserOwnSignIn } from './../../../../model/user-own-sign-in';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Component, EventEmitter, OnInit, OnDestroy, Output, OnChanges, NgZone, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { GoogleSignInService } from '@auth-service/google-sign-in.service';
import { JwtService } from '@global-service/jwt/jwt.service';
import { UserOwnSignInService } from '@auth-service/user-own-sign-in.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { UserOwnAuthService } from '@auth-service/user-own-auth.service';
import { takeUntil, take } from 'rxjs/operators';
import { ProfileService } from '../../../user/components/profile/profile-service/profile.service';
import { environment } from '@environment/environment';
import { accounts } from 'google-one-tap';
import { Patterns } from 'src/assets/patterns/patterns';
import { UbsAdminEmployeeService } from 'src/app/ubs/ubs-admin/services/ubs-admin-employee.service';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/state/app.state';

import { HttpClient } from '@angular/common/http';
import { googleProvider } from './GoogleOAuthProvider/GoogleOAuthProvider';

declare let google: any;
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit, OnDestroy, OnChanges {
  closeBtn = SignInIcons;
  mainSignInImage = SignInIcons;
  googleImage = SignInIcons;
  hideShowPasswordImage = SignInIcons;
  userOwnSignIn: UserOwnSignIn;
  loadingAnim: boolean;
  signInForm: FormGroup;
  signInFormValid: boolean;
  emailField: AbstractControl;
  passwordField: AbstractControl;
  emailFieldValue: string;
  passwordFieldValue: string;
  private destroy: Subject<boolean> = new Subject<boolean>();
  isSignInPage: boolean;
  private errorUnverifiedEmail = 'You should verify the email first, check your email box!';
  private errorUnauthorized = 'Unauthorized';
  generalError: string;

  @Output() private pageName = new EventEmitter();
  @Input() isUbs: boolean;

  constructor(
    public dialog: MatDialog,
    private matDialogRef: MatDialogRef<SignInComponent>,
    private userOwnSignInService: UserOwnSignInService,
    private jwtService: JwtService,
    private router: Router,
    private route: ActivatedRoute,
    private googleService: GoogleSignInService,
    private localStorageService: LocalStorageService,
    private userOwnAuthService: UserOwnAuthService,
    private profileService: ProfileService,
    private ubsAdminEmployeeService: UbsAdminEmployeeService,
    private zone: NgZone,
    private store: Store<IAppState>,
    private http: HttpClient
  ) {}

  ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.complete();
  }

  ngOnInit() {
    this.userOwnSignIn = new UserOwnSignIn();
    this.configDefaultErrorMessage();
    this.checkIfUserId();

    // Initialization of reactive form
    this.signInForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.pattern(Patterns.ubsMailPattern)]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(20)])
    });

    // Get form fields to use it in the template
    this.emailField = this.signInForm.get('email');
    this.passwordField = this.signInForm.get('password');

    this.signInWithGooglePopup();
  }

  ngOnChanges(): void {
    this.emailClassCheck();
    this.passwordClassCheck();
  }

  configDefaultErrorMessage(): void {
    this.generalError = null;
    if (this.signInForm) {
      this.emailFieldValue = this.emailField.value;
      this.passwordFieldValue = this.passwordField.value;
      this.isSignInPage = true;
    }
  }

  allFieldsEmptyCheck() {
    const emailAndPasswordEmpty =
      this.passwordField.touched && !this.passwordField.value && this.emailField.touched && !this.emailField.value;
    this.generalError = emailAndPasswordEmpty ? 'user.auth.sign-in.fill-all-red-fields' : null;
  }

  signIn(): void {
    if (this.signInForm.invalid) {
      return;
    }
    this.loadingAnim = true;
    const { email, password } = this.signInForm.value;
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
          this.loadingAnim = false;
        }
      );
  }

  signInWithGooglePopup(): void {
    const gAccounts: accounts = google.accounts;
    gAccounts.id.initialize({
      client_id: environment.googleClientId,
      ux_mode: 'popup',
      cancel_on_tap_outside: true,
      callback: (resp) => this.handleGoogleAuth(resp.credential)
    });
    gAccounts.id.prompt();
  }

  signInWithGoogle(): void {
    const login = googleProvider.useGoogleLogin({
      flow: 'implicit',
      onSuccess: (res) => {
        this.handleGoogleAuth(res.access_token);
      },
      onError: (err) => console.error('Failed to login with google redirect', err)
    });
    login();
  }

  handleGoogleAuth(resp): void {
    this.googleService
      .signIn(resp)
      .pipe(takeUntil(this.destroy))
      .subscribe((signInData: UserSuccessSignIn) => {
        this.onSignInWithGoogleSuccess(signInData);
      });
  }

  onOpenModalWindow(windowPath: string): void {
    this.pageName.emit(windowPath);
  }

  onSignInWithGoogleSuccess(data: UserSuccessSignIn): void {
    this.userOwnSignInService.saveUserToLocalStorage(data);
    this.userOwnAuthService.getDataFromLocalStorage();
    this.jwtService.userRole$.next(this.jwtService.getUserRole());
    this.zone.run(() => {
      this.router
        .navigate(this.navigateToPage(data))
        .then(() => {
          this.localStorageService.setFirstSignIn();
          this.profileService
            .getUserInfo()
            .pipe(take(1))
            .subscribe((item) => {
              this.localStorageService.setFirstName(item.name);
            });
        })
        .catch((fail) => console.log('redirect has failed ' + fail));
    });
  }

  togglePassword(input: HTMLInputElement, src: HTMLImageElement): void {
    input.type = input.type === 'password' ? 'text' : 'password';
    src.src = input.type === 'password' ? this.hideShowPasswordImage.hidePassword : this.hideShowPasswordImage.showPassword;
    src.alt = input.type === 'password' ? 'show password' : 'hide password';
  }

  private checkIfUserId(): void {
    this.localStorageService.userIdBehaviourSubject.pipe(takeUntil(this.destroy)).subscribe((userId) => {
      if (userId) {
        this.matDialogRef.close(userId);
      }
    });
  }

  onSignInSuccess(data: UserSuccessSignIn): void {
    this.loadingAnim = false;
    this.userOwnSignInService.saveUserToLocalStorage(data);
    this.localStorageService.setFirstName(data.name);
    this.localStorageService.setFirstSignIn();
    this.userOwnAuthService.getDataFromLocalStorage();
    this.router.navigate(this.navigateToPage(data));
  }

  navigateToPage(data): any {
    const getUbsRoleSignIn = this.jwtService.getUserRole();
    this.jwtService.userRole$.next(getUbsRoleSignIn);
    if (getUbsRoleSignIn === 'ROLE_UBS_EMPLOYEE') {
      return ['ubs-admin', 'orders'];
    }
    if (this.isUbs) {
      return ['ubs'];
    }
    if (getUbsRoleSignIn === 'ROLE_USER') {
      return ['profile', data.userId];
    }
  }

  private onSignInFailure(errors: HttpErrorResponse): void {
    if (typeof errors === 'string') {
      return;
    }

    if (!Array.isArray(errors.error)) {
      this.generalError = this.setErrorMessage(errors.error);
    }
  }

  private setErrorMessage(errors: any): string {
    if (errors.error === this.errorUnauthorized) {
      return 'user.auth.sign-in.account-has-been-deleted';
    } else if (errors.message === this.errorUnverifiedEmail) {
      return 'user.auth.sign-in.not-verified-email';
    } else {
      return 'user.auth.sign-in.bad-email-or-password';
    }
  }

  emailClassCheck(): string {
    return (this.emailField?.invalid && this.emailField.touched) || this.generalError
      ? 'alert-email-validation'
      : 'successful-email-validation';
  }

  passwordClassCheck(): string {
    return (this.passwordField?.invalid && this.passwordField.touched) || this.generalError
      ? 'alert-password-validation'
      : 'successful-password-validation';
  }
}
