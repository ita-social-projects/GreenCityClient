import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService, GoogleLoginProvider } from 'angularx-social-login';
import { GoogleSignInService } from '../../../service/auth/google-sign-in.service';
import { UserSuccessSignIn } from '../../../model/user-success-sign-in';
import { HttpErrorResponse } from '@angular/common/http';
import { UserOwnSignInService } from '../../../service/auth/user-own-sign-in.service';
import { Router } from '@angular/router';
import { SignInIcons } from 'src/assets/img/icon/sign-in/sign-in-icons';
import { MatDialog, MatDialogRef } from '@angular/material';
import { UserOwnSignIn } from '../../../model/user-own-sign-in';
import { LocalStorageService } from '../../../service/localstorage/local-storage.service';
import { NewSignUpComponent } from '../new-sign-up/new-sign-up.component';
import { Subscription } from 'rxjs';
import { RestorePasswordComponent } from '../restore-password/restore-password.component';

@Component({
  selector: 'app-sign-in-new',
  templateUrl: './sign-in-new.component.html',
  styleUrls: ['./sign-in-new.component.scss']
})
export class SignInNewComponent implements OnInit, OnDestroy {
  private closeBtn = SignInIcons;
  private mainSignInImage = SignInIcons;
  private googleImage = SignInIcons;
  private hideShowPasswordImage = SignInIcons;
  public userOwnSignIn: UserOwnSignIn;
  public userIdSubscription: Subscription;
  public loadingAnim: boolean;
  public emailErrorMessageBackEnd: string;
  public passwordErrorMessageBackEnd: string;
  public backEndError: string;

  constructor(
    public dialog: MatDialog,
    private matDialogRef: MatDialogRef<SignInNewComponent>,
    private userOwnSignInService: UserOwnSignInService,
    private router: Router,
    private authService: AuthService,
    private googleService: GoogleSignInService,
    private localStorageService: LocalStorageService,
  ) { }

  ngOnInit() {
    this.userOwnSignIn = new UserOwnSignIn();
    this.configDefaultErrorMessage();
    this.checkIfUserId();
  }

  private checkIfUserId(): void {
    this.userIdSubscription = this.localStorageService.userIdBehaviourSubject
      .subscribe(userId => {
      if (userId) {
        this.matDialogRef.close();
      }
    });
  }

  public configDefaultErrorMessage(): void {
    this.emailErrorMessageBackEnd = null;
    this.passwordErrorMessageBackEnd = null;
    this.backEndError = null;
  }

  private signIn(userOwnSignIn: UserOwnSignIn): void {
    this.loadingAnim = true;
    this.userOwnSignInService.signIn(userOwnSignIn).subscribe(
      (data: UserSuccessSignIn) => {
        this.onSignInSuccess(data);
      },
      (errors: HttpErrorResponse) => {
        this.onSignInFailure(errors);
        this.loadingAnim = false;
      });
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

  private onSignInSuccess(data: UserSuccessSignIn): void {
    this.loadingAnim = false;
    this.userOwnSignInService.saveUserToLocalStorage(data);
    this.localStorageService.setFirstName(data.firstName);
    this.localStorageService.setFirstSignIn();
    this.router.navigate(['/welcome'])
      .then(success => console.log('redirect has succeeded ' + success))
      .catch(fail => console.log('redirect has failed ' + fail));
  }

  private onOpenForgotWindow(): void {
    this.dialog.open(RestorePasswordComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      panelClass: 'custom-dialog-container',
    });
    this.matDialogRef.close();
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

  private onSignInWithGoogleSuccess(data: UserSuccessSignIn): void {
    this.userOwnSignInService.saveUserToLocalStorage(data);
    this.router.navigate(['/welcome'])
      .then(success => console.log('redirect has succeeded ' + success))
      .catch(fail => console.log('redirect has failed ' + fail));
  }

  private togglePassword(input: HTMLInputElement, src: HTMLImageElement): void {
    input.type = input.type === 'password' ? 'text' : 'password';
    src.src = input.type === 'password' ?
      this.hideShowPasswordImage.hidePassword : this.hideShowPasswordImage.showPassword;
  }

  private closeSignInWindow(): void {
    this.matDialogRef.close();
  }

  private signUpOpenWindow(): void {
    this.matDialogRef.close();
    this.dialog.open(NewSignUpComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      panelClass: 'custom-dialog-container',
    });
  }

  ngOnDestroy() {
    this.userIdSubscription.unsubscribe();
  }
}
