import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material';
import { AuthService, GoogleLoginProvider } from 'angularx-social-login';
import { Subscription } from 'rxjs';
import { GoogleSignInService } from '@auth-service/google-sign-in.service';
import { UserSuccessSignIn } from '@global-models/user-success-sign-in';
import { UserOwnSignInService } from '@auth-service/user-own-sign-in.service';
import { SignInIcons } from 'src/app/image-pathes/sign-in-icons';
import { UserOwnSignIn } from '@global-models/user-own-sign-in';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { UserOwnAuthService } from '@global-service/auth/user-own-auth.service';
import { AuthModalServiceService } from '../../services/auth-service.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit, OnDestroy {
  public closeBtn = SignInIcons;
  public mainSignInImage = SignInIcons;
  public googleImage = SignInIcons;
  public hideShowPasswordImage = SignInIcons;
  public userOwnSignIn: UserOwnSignIn;
  public userIdSubscription: Subscription;
  public loadingAnim: boolean;
  public emailErrorMessageBackEnd: string;
  public passwordErrorMessageBackEnd: string;
  public backEndError: string;
  public signInForm: FormGroup;
  public emailField: AbstractControl;
  public passwordField: AbstractControl;

  constructor(
    public dialog: MatDialog,
    private matDialogRef: MatDialogRef<SignInComponent>,
    private userOwnSignInService: UserOwnSignInService,
    private router: Router,
    private authService: AuthService,
    private googleService: GoogleSignInService,
    private localStorageService: LocalStorageService,
    private userOwnAuthService: UserOwnAuthService,
    private authModalService: AuthModalServiceService,
  ) { }

  ngOnInit() {
    this.userOwnSignIn = new UserOwnSignIn();
    this.configDefaultErrorMessage();
    this.checkIfUserId();
    // Initialization of reactive form
    this.signInForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(8)])
    });
    // Get form fields to use it in the template
    this.emailField = this.signInForm.get('email');
    this.passwordField = this.signInForm.get('password');
  }

  private checkIfUserId(): void {
    this.userIdSubscription = this.localStorageService.userIdBehaviourSubject
      .subscribe(userId => {
        if (userId) {
          this.matDialogRef.close(userId);
        }
      });
  }

  public configDefaultErrorMessage(): void {
    this.emailErrorMessageBackEnd = null;
    this.passwordErrorMessageBackEnd = null;
    this.backEndError = null;
  }

  public signIn(): void {
    this.loadingAnim = true;

    const { email, password } = this.signInForm.value;

    this.userOwnSignIn.email = email;
    this.userOwnSignIn.password = password;

    this.userOwnSignInService.signIn(this.userOwnSignIn).subscribe(
      (data: UserSuccessSignIn) => {
        this.onSignInSuccess(data);
      },
      (errors: HttpErrorResponse) => {
        this.onSignInFailure(errors);
        this.loadingAnim = false;
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

  private onSignInSuccess(data: UserSuccessSignIn): void {
    this.loadingAnim = false;
    this.userOwnSignInService.saveUserToLocalStorage(data);
    this.localStorageService.setFirstName(data.name);
    this.localStorageService.setFirstSignIn();
    this.userOwnAuthService.getDataFromLocalStorage();
    this.router.navigate(['profile', data.userId])
      .then(success => console.log('redirect has succeeded ' + success))
      .catch(fail => console.log('redirect has failed ' + fail));
  }

  public onOpenForgotWindow(): void {
    this.authModalService.setAuthPopUp('restore-password');
  }

  private onSignInFailure(errors: HttpErrorResponse): void {
    if (!Array.isArray(errors.error)) {
      this.backEndError = errors.error.message;
      return;
    }

    errors.error.map((error) => {
      this.emailErrorMessageBackEnd = error.name === 'email' ? error.message : this.emailErrorMessageBackEnd;
      this.passwordErrorMessageBackEnd = error.name === 'password' ? error.message : this.passwordErrorMessageBackEnd;
    });
  }

  public onSignInWithGoogleSuccess(data: UserSuccessSignIn): void {
    this.userOwnSignInService.saveUserToLocalStorage(data);
    this.userOwnAuthService.getDataFromLocalStorage();
    this.router.navigate(['profile', data.userId])
      .then(success => {
        this.localStorageService.setFirstSignIn();
        console.log('redirect has succeeded ' + success);
      })
      .catch(fail => console.log('redirect has failed ' + fail));
  }

  public togglePassword(input: HTMLInputElement, src: HTMLImageElement): void {
    input.type = input.type === 'password' ? 'text' : 'password';
    src.src = input.type === 'password' ?
      this.hideShowPasswordImage.hidePassword : this.hideShowPasswordImage.showPassword;
  }

  // public closeSignInWindow(): void {
  //   this.matDialogRef.close();
  // }

  public signUpOpenWindow(): void {
    this.authModalService.setAuthPopUp('sign-up');
  }

  ngOnDestroy() {
    this.userIdSubscription.unsubscribe();
  }

  /**
 * Returns the string according to the error that needs to be translated later.
 *
 * @param {obj} x FormControl on which the error occurred.
 * @param {string} n Tag to know what element.
 * @return {string} x Which needs to be translated.
 */
  public getErrorMessage({errors}: FormControl | AbstractControl, tag: string){
    if(tag === 'email'){
      if(errors.required){
        return 'user.auth.sign-in.email-is-required';
      } else if (errors.email){
        return 'user.auth.sign-in.this-is-not-email';
      }
    }
    if(tag==='password'){
      if(errors.required){
        return 'user.auth.sign-in.password-is-required';
      } else if (errors.minlength){
        return 'user.auth.sign-in.password-must-be-at-least-8-characters-long';
      }
    }
    return false
  }
}
