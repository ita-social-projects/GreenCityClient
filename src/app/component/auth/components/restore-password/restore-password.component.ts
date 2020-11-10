import { Component, EventEmitter, OnInit, OnDestroy, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { AbstractControl, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, GoogleLoginProvider } from 'angularx-social-login';
import { take } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';
import { SignInIcons } from 'src/app/image-pathes/sign-in-icons';
import { UserSuccessSignIn } from '@global-models/user-success-sign-in';
import { HttpErrorResponse } from '@angular/common/http';
import { GoogleSignInService } from '@auth-service/google-sign-in.service';
import { UserOwnSignInService } from '@auth-service/user-own-sign-in.service';
import { RestorePasswordService } from '@auth-service/restore-password.service';
import { UserOwnSignIn } from '@global-models/user-own-sign-in';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { SignInComponent } from '../sign-in/sign-in.component';

@Component({
  selector: 'app-restore-password',
  templateUrl: './restore-password.component.html',
  styleUrls: ['./restore-password.component.scss']
})
export class RestorePasswordComponent implements OnInit, OnDestroy {
  public restorePasswordForm: FormGroup;
  public emailField: AbstractControl;
  public email: FormControl;
  public closeBtn = SignInIcons;
  public mainSignInImage = SignInIcons;
  public googleImage = SignInIcons;
  public emailErrorMessageBackEnd: string;
  public passwordErrorMessageBackEnd: string;
  public backEndError: string;
  public userOwnSignIn: UserOwnSignIn;
  public loadingAnim: boolean;
  public userIdSubscription: Subscription;
  @Output() public pageName = new EventEmitter();

  constructor(
    private matDialogRef: MatDialogRef<RestorePasswordComponent>,
    public dialog: MatDialog,
    private authService: AuthService,
    private googleService: GoogleSignInService,
    private userOwnSignInService: UserOwnSignInService,
    private router: Router,
    private restorePasswordService: RestorePasswordService,
    private localStorageService: LocalStorageService,
  ) {}

  ngOnInit() {
    this.userOwnSignIn = new UserOwnSignIn();
    this.initFormReactive();
    this.configDefaultErrorMessage();
    this.checkIfUserId();
    this.emailField = this.restorePasswordForm.get('email');
  }

  public initFormReactive(): void {
    this.restorePasswordForm = new FormGroup({
      email: new FormControl(null, [ Validators.required, Validators.email ])
    });
  }

  public configDefaultErrorMessage(): void {
    this.emailErrorMessageBackEnd = null;
    this.passwordErrorMessageBackEnd = null;
    this.backEndError = null;
  }

  private checkIfUserId(): void {
    this.userIdSubscription = this.localStorageService.userIdBehaviourSubject
      .subscribe(userId => {
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

  sentEmail(userOwnSignIn: UserOwnSignIn): void {
    this.loadingAnim = true;
    userOwnSignIn.email = this.restorePasswordForm.value.email;

    this.restorePasswordService.sendEmailForRestore(userOwnSignIn.email)
      .pipe(
       take(1))
      .subscribe({
        next: () => {
          this.onCloseRestoreWindow();
      },
        error: (error: HttpErrorResponse) => {
          this.onSentEmailBadMessage(error);
          this.loadingAnim = false;
      }
    });
  }

  private onSentEmailBadMessage(error: HttpErrorResponse): void {
    this.emailErrorMessageBackEnd = error.error.message;
  }

  private onSignInFailure(errors: HttpErrorResponse): Observable<any> {
    if (!Array.isArray(errors.error)) {
      this.backEndError = errors.message;
      return;
    }

    errors.error.map((error) => {
      this.emailErrorMessageBackEnd = error.name === 'email' ? error.message : this.emailErrorMessageBackEnd;
      this.passwordErrorMessageBackEnd = error.name === 'password' ? error.message : this.passwordErrorMessageBackEnd;
    });
  }

  public signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(data => {
      this.googleService.signIn(data.idToken).subscribe(
        (signInData: UserSuccessSignIn) => {
          this.onSignInWithGoogleSuccess(signInData);
        },
        (errors: HttpErrorResponse) => {
          this.onSignInFailure(errors);
        });
    });
  }

  private onSignInWithGoogleSuccess(data: UserSuccessSignIn): void {
    this.userOwnSignInService.saveUserToLocalStorage(data);
    this.router.navigate(['/welcome']);
  }

  ngOnDestroy() {
    this.userIdSubscription.unsubscribe();
  }
}
