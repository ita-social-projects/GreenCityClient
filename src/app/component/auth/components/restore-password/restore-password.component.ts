import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, GoogleLoginProvider } from 'angularx-social-login';
import { catchError, take } from 'rxjs/operators';
import { Subscription, throwError, Observable } from 'rxjs';
import { SignInIcons } from 'src/app/image-pathes/sign-in-icons';
import { UserSuccessSignIn } from '@global-models/user-success-sign-in';
import { HttpErrorResponse } from '@angular/common/http';
import { GoogleSignInService } from '@auth-service/google-sign-in.service';
import { UserOwnSignInService } from '@auth-service/user-own-sign-in.service';
import { RestorePasswordService } from '@auth-service/restore-password.service';
import { UserOwnSignIn } from '@global-models/user-own-sign-in';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { SignInComponent } from '../sign-in/sign-in.component';
import { AuthModalServiceService } from '../../services/auth-service.service';

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


  constructor(
    private matDialogRef: MatDialogRef<SignInComponent>,
    public dialog: MatDialog,
    private authService: AuthService,
    private googleService: GoogleSignInService,
    private userOwnSignInService: UserOwnSignInService,
    private router: Router,
    private restorePasswordService: RestorePasswordService,
    private localStorageService: LocalStorageService,
    private authModalService: AuthModalServiceService,
  ) {}

  ngOnInit() {
    this.userOwnSignIn = new UserOwnSignIn();
    this.initFormReactive();
    this.configDefaultErrorMessage();
    this.checkIfUserId();
    this.emailField = this.restorePasswordForm.get('email');
  }

  public onCloseRestoreWindow(): void {
    this.dialog.closeAll();
  }

  public onBackToSignIn(): void {
    this.authModalService.setAuthPopUp('sign-in');
  }

  public initFormReactive(): void {
    this.restorePasswordForm = new FormGroup({
      email: new FormControl(null, [ Validators.required, Validators.email ])
    });
  }

  sentEmail(userOwnSignIn: UserOwnSignIn): void {
    this.loadingAnim = true;
    this.userOwnSignIn.email = this.restorePasswordForm.value.email;

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

  public configDefaultErrorMessage(): void {
    this.emailErrorMessageBackEnd = null;
    this.passwordErrorMessageBackEnd = null;
    this.backEndError = null;
  }

  // public signInWithGoogle(): void {
  //   this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(data => {
  //     this.googleService.signIn(data.idToken)
  //     .pipe(catchError(this.onSignInFailure))
  //     .subscribe(
  //       (signInData: UserSuccessSignIn) => {
  //         this.onSignInWithGoogleSuccess(signInData);
  //       });
  //   });
  // }

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

  private checkIfUserId(): void {
    this.userIdSubscription = this.localStorageService.userIdBehaviourSubject
      .subscribe(userId => {
        if (userId) {
          this.matDialogRef.close();
        }
      });
  }

  ngOnDestroy() {
    this.userIdSubscription.unsubscribe();
  }
}
