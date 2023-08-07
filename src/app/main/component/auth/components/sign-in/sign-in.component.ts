import { UserSuccessSignIn } from './../../../../model/user-success-sign-in';
import { SignInIcons } from './../../../../image-pathes/sign-in-icons';
import { UserOwnSignIn } from './../../../../model/user-own-sign-in';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Component, EventEmitter, OnInit, OnDestroy, Output, OnChanges, NgZone } from '@angular/core';
import { Router } from '@angular/router';
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
import { accounts } from '@types/google-one-tap';
import { Patterns } from 'src/assets/patterns/patterns';
import { UbsAdminEmployeeService } from 'src/app/ubs/ubs-admin/services/ubs-admin-employee.service';

declare var google: any;
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit, OnDestroy, OnChanges {
  public closeBtn = SignInIcons;
  public mainSignInImage = SignInIcons;
  public googleImage = SignInIcons;
  public hideShowPasswordImage = SignInIcons;
  public userOwnSignIn: UserOwnSignIn;
  public loadingAnim: boolean;
  public signInForm: FormGroup;
  public signInFormValid: boolean;
  public emailField: AbstractControl;
  public passwordField: AbstractControl;
  public emailFieldValue: string;
  public passwordFieldValue: string;
  public isUbs: boolean;
  private destroy: Subject<boolean> = new Subject<boolean>();
  public isSignInPage: boolean;

  // generalError can contain:
  // 'user.auth.sign-in.fill-all-red-fields', or
  // 'user.auth.sign-in.account-has-been-deleted', or
  // 'user.auth.sign-in.bad-email-or-password' error
  public generalError: string;
  @Output() private pageName = new EventEmitter();

  constructor(
    public dialog: MatDialog,
    private matDialogRef: MatDialogRef<SignInComponent>,
    private userOwnSignInService: UserOwnSignInService,
    private jwtService: JwtService,
    private router: Router,
    private googleService: GoogleSignInService,
    private localStorageService: LocalStorageService,
    private userOwnAuthService: UserOwnAuthService,
    private profileService: ProfileService,
    private ubsAdminEmployeeService: UbsAdminEmployeeService,
    private zone: NgZone
  ) {}

  ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.complete();
  }

  ngOnInit() {
    this.isUbs = this.router.url.includes('ubs');
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
  }

  ngOnChanges(): void {
    this.emailClassCheck();
    this.passwordClassCheck();
  }

  public configDefaultErrorMessage(): void {
    this.generalError = null;
    if (this.signInForm) {
      this.emailFieldValue = this.emailField.value;
      this.passwordFieldValue = this.passwordField.value;
      this.isSignInPage = true;
    }
  }

  public allFieldsEmptyCheck() {
    const emailAndPasswordEmpty =
      this.passwordField.touched && !this.passwordField.value && this.emailField.touched && !this.emailField.value;
    this.generalError = emailAndPasswordEmpty ? 'user.auth.sign-in.fill-all-red-fields' : null;
  }

  public signIn(): void {
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

  public signInWithGoogle(): void {
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
    this.googleService
      .signIn(resp.credential)
      .pipe(takeUntil(this.destroy))
      .subscribe((signInData: UserSuccessSignIn) => {
        this.onSignInWithGoogleSuccess(signInData);
      });
  }

  public onOpenModalWindow(windowPath: string): void {
    this.pageName.emit(windowPath);
  }

  public onSignInWithGoogleSuccess(data: UserSuccessSignIn): void {
    this.userOwnSignInService.saveUserToLocalStorage(data);
    this.userOwnAuthService.getDataFromLocalStorage();
    this.jwtService.userRole$.next(this.jwtService.getUserRole());
    this.zone.run(() => {
      this.router
        .navigate(this.isUbs ? ['ubs'] : ['profile', data.userId])
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

  public togglePassword(input: HTMLInputElement, src: HTMLImageElement): void {
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

  private onSignInSuccess(data: UserSuccessSignIn): void {
    this.loadingAnim = false;
    this.userOwnSignInService.saveUserToLocalStorage(data);
    this.localStorageService.setFirstName(data.name);
    this.localStorageService.setFirstSignIn();
    this.userOwnAuthService.getDataFromLocalStorage();
    const getUbsRoleSignIn = this.jwtService.getUserRole();
    const isUbsRoleAdmin = getUbsRoleSignIn === 'ROLE_UBS_EMPLOYEE' ? ['ubs-admin', 'orders'] : ['ubs'];
    this.jwtService.userRole$.next(getUbsRoleSignIn);
    if (getUbsRoleSignIn !== 'ROLE_USER') {
      this.definitionOfAuthoritiesAndPositions();
    }
    this.router.navigate(this.isUbs ? isUbsRoleAdmin : ['profile', data.userId]);
  }

  private definitionOfAuthoritiesAndPositions() {
    const userEmail = this.jwtService.getEmailFromAccessToken();
    this.ubsAdminEmployeeService.getEmployeeLoginPositions(userEmail).subscribe((positions) => {
      this.ubsAdminEmployeeService.employeePositions$.next(positions);
    });
    this.ubsAdminEmployeeService.getEmployeePositionsAuthorities(userEmail).subscribe((positionsAuthorities) => {
      this.ubsAdminEmployeeService.employeePositionsAuthorities$.next(positionsAuthorities);
    });
  }

  private onSignInFailure(errors: HttpErrorResponse): void {
    if (typeof errors === 'string') {
      return;
    } else if (!Array.isArray(errors.error)) {
      this.generalError =
        errors.error.error === 'Unauthorized' ? 'user.auth.sign-in.account-has-been-deleted' : 'user.auth.sign-in.bad-email-or-password';
      return;
    }
  }

  public emailClassCheck(): string {
    return (this.emailField.invalid && this.emailField.touched) || this.generalError
      ? 'alert-email-validation'
      : 'successful-email-validation';
  }

  public passwordClassCheck(): string {
    return (this.passwordField.invalid && this.passwordField.touched) || this.generalError
      ? 'alert-password-validation'
      : 'successful-password-validation';
  }
}
