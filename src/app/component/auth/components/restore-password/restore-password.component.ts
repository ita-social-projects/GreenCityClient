import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { AuthService, GoogleLoginProvider } from 'angularx-social-login';
import { catchError, take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
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
  ) {}

  ngOnInit() {
    console.log('init');
    this.userOwnSignIn = new UserOwnSignIn();
    this.configDefaultErrorMessage();
    this.checkIfUserId();
  }

  public onCloseRestoreWindow(): void {
    this.dialog.closeAll();
  }

  public onBackToSignIn(): void {
    this.dialog.open(SignInComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      panelClass: 'custom-dialog-container',
    });
    this.matDialogRef.close();
  }

  sentEmail(userOwnSignIn: UserOwnSignIn): void {
    this.loadingAnim = true;
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

  private onSignInFailure(errors: HttpErrorResponse): void {
    try {
      errors.error.forEach(error => {
        if (error.name === 'email') {
          this.emailErrorMessageBackEnd = error.message;
        } else if (error.name === 'password') {
          this.passwordErrorMessageBackEnd = error.message;
        }
      });
    } catch (e) {
      this.backEndError = errors.error.message;
    }
  }

  public configDefaultErrorMessage(): void {
    this.emailErrorMessageBackEnd = null;
    this.passwordErrorMessageBackEnd = null;
    this.backEndError = null;
  }

  public signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(data => {
      this.googleService.signIn(data.idToken).subscribe(
        (signInData: UserSuccessSignIn) => {
          console.log('success');
          this.onSignInWithGoogleSuccess(signInData);
        },
        (errors: HttpErrorResponse) => {
          console.log('errors');
          this.onSignInFailure(errors);
        });
    });
  }

  private onSignInWithGoogleSuccess(data: UserSuccessSignIn): void {
    console.log(data);
    this.userOwnSignInService.saveUserToLocalStorage(data);
    this.router.navigate(['/welcome'])
      .then(success => console.log('redirect has succeeded ' + success))
      .catch(fail => console.log('redirect has failed ' + fail));
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
