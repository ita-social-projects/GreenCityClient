import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { SignInIcons } from 'src/assets/img/icon/sign-in/sign-in-icons';
import {catchError, take} from 'rxjs/operators';
import {AuthService, GoogleLoginProvider} from 'angularx-social-login';
import {UserSuccessSignIn} from '../../../../model/user-success-sign-in';
import {HttpErrorResponse} from '@angular/common/http';
import {GoogleSignInService} from '../../../../service/auth/google-sign-in.service';
import {UserOwnSignInService} from '../../../../service/auth/user-own-sign-in.service';
import {Router} from '@angular/router';
import {RestorePasswordService} from '../../../../service/auth/restore-password.service';
import {UserOwnSignIn} from '../../../../model/user-own-sign-in';
import {Subscription} from 'rxjs';
import {LocalStorageService} from '../../../../service/localstorage/local-storage.service';
import {SignInComponent} from '../sign-in/sign-in.component';

@Component({
  selector: 'app-restore-password',
  templateUrl: './restore-password.component.html',
  styleUrls: ['./restore-password.component.scss']
})
export class RestorePasswordComponent implements OnInit, OnDestroy {
  private closeBtn = SignInIcons;
  private mainSignInImage = SignInIcons;
  private googleImage = SignInIcons;
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
    this.userOwnSignIn = new UserOwnSignIn();
    this.configDefaultErrorMessage();
    this.checkIfUserId();
  }

  private onCloseRestoreWindow(): void {
    this.dialog.closeAll();
  }

  private onBackToSignIn(): void {
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

  private signInWithGoogle(): void {
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
