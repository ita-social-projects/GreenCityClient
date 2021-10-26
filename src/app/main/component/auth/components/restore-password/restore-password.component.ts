import { UserOwnSignIn } from '@global-models/user-own-sign-in';
import { UserSuccessSignIn } from '@global-models/user-success-sign-in';
import { SignInIcons } from '../../../../image-pathes/sign-in-icons';
import { Component, EventEmitter, OnInit, OnDestroy, Output, Injector } from '@angular/core';
import { AbstractControl, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, GoogleLoginProvider } from 'angularx-social-login';
import { take, takeUntil } from 'rxjs/operators';
import { Subscription, Observable, Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { GoogleSignInService } from '@auth-service/google-sign-in.service';
import { UserOwnSignInService } from '@auth-service/user-own-sign-in.service';
import { RestorePasswordService } from '@auth-service/restore-password.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-restore-password',
  templateUrl: './restore-password.component.html',
  styleUrls: ['./restore-password.component.scss']
})
export class RestorePasswordComponent implements OnInit, OnDestroy {
  public restorePasswordForm: FormGroup;
  public emailField: AbstractControl;
  public closeBtn = SignInIcons;
  public mainSignInImage = SignInIcons;
  public googleImage = SignInIcons;
  public emailErrorMessageBackEnd: string;
  public passwordErrorMessageBackEnd: string;
  public backEndError: string;
  public userOwnSignIn: UserOwnSignIn;
  public loadingAnim: boolean;
  public currentLanguage: string;
  public userIdSubscription: Subscription;
  public emailFieldValue: string;
  public isUbs: boolean;
  private destroy: Subject<boolean> = new Subject<boolean>();
  @Output() public pageName = new EventEmitter();
  public dialog: MatDialog;
  private authService: AuthService;
  private googleService: GoogleSignInService;
  private userOwnSignInService: UserOwnSignInService;
  private router: Router;
  private restorePasswordService: RestorePasswordService;
  private localStorageService: LocalStorageService;
  private snackBar: MatSnackBarComponent;

  constructor(private matDialogRef: MatDialogRef<RestorePasswordComponent>, private injector: Injector) {
    this.dialog = injector.get(MatDialog);
    this.authService = injector.get(AuthService);
    this.googleService = injector.get(GoogleSignInService);
    this.userOwnSignInService = injector.get(UserOwnSignInService);
    this.router = injector.get(Router);
    this.restorePasswordService = injector.get(RestorePasswordService);
    this.localStorageService = injector.get(LocalStorageService);
    this.snackBar = injector.get(MatSnackBarComponent);
  }

  ngOnInit() {
    this.localStorageService.ubsRegBehaviourSubject.pipe(takeUntil(this.destroy)).subscribe((value) => (this.isUbs = value));
    this.userOwnSignIn = new UserOwnSignIn();
    this.initFormReactive();
    this.configDefaultErrorMessage();
    this.checkIfUserId();
    this.emailField = this.restorePasswordForm.get('email');
  }

  public initFormReactive(): void {
    this.restorePasswordForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email])
    });
  }

  public configDefaultErrorMessage(): void {
    this.emailErrorMessageBackEnd = null;
    this.passwordErrorMessageBackEnd = null;
    this.backEndError = null;
    if (this.restorePasswordForm) {
      this.emailFieldValue = this.restorePasswordForm.get('email').value;
    }
  }

  private checkIfUserId(): void {
    this.userIdSubscription = this.localStorageService.userIdBehaviourSubject.pipe(takeUntil(this.destroy)).subscribe((userId) => {
      if (userId) {
        this.matDialogRef.close();
      }
    });
  }

  public onCloseRestoreWindow(): void {
    this.matDialogRef.close();
  }

  public onBackToSignIn(page): void {
    this.pageName.emit(page);
  }

  sentEmail(): void {
    const { email } = this.restorePasswordForm.value;
    this.loadingAnim = true;
    this.currentLanguage = this.localStorageService.getCurrentLanguage();
    this.restorePasswordService
      .sendEmailForRestore(email, this.currentLanguage)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.onCloseRestoreWindow();
          this.snackBar.openSnackBar('successRestorePassword');
        },
        error: (error: HttpErrorResponse) => {
          this.onSentEmailBadMessage(error);
          this.loadingAnim = false;
        }
      });
  }

  private onSentEmailBadMessage(error: HttpErrorResponse): void {
    this.emailErrorMessageBackEnd = error.error.name === 'email' ? 'already-sent' : 'email-not-exist';
  }

  private onSignInFailure(errors: HttpErrorResponse): Observable<any> {
    if (!Array.isArray(errors.error)) {
      this.backEndError = errors.message;
      return;
    }

    errors.error.forEach((error) => {
      this.emailErrorMessageBackEnd = error.name === 'email' ? error.message : this.emailErrorMessageBackEnd;
      this.passwordErrorMessageBackEnd = error.name === 'password' ? error.message : this.passwordErrorMessageBackEnd;
    });
  }

  public signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((data) => {
      this.googleService.signIn(data.idToken).subscribe(
        (signInData: UserSuccessSignIn) => {
          this.onSignInWithGoogleSuccess(signInData);
        },
        (errors: HttpErrorResponse) => {
          this.onSignInFailure(errors);
        }
      );
    });
  }

  private onSignInWithGoogleSuccess(data: UserSuccessSignIn): void {
    this.userOwnSignInService.saveUserToLocalStorage(data);
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    this.destroy.next(true);
    this.destroy.complete();
  }
}
