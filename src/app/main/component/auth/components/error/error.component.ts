import { Component, Input, OnChanges } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html'
})
export class ErrorComponent implements OnChanges {
  @Input() public controlName: string;
  @Input() public formElement: AbstractControl;
  @Input() public emailFieldValue: string;
  @Input() public nameFieldValue: string;
  @Input() public isSignInPassword: boolean;
  @Input() public passwordConfirmFieldValue: string;

  public errorMessage = '';

  private getErrorMsg = {
    required: () => {
      if (this.controlName === 'email') {
        return 'user.auth.sign-in.email-is-required';
      } else if (this.controlName === 'firstName') {
        return 'user.auth.sign-up.first-name-is-required';
      } else if (this.controlName === 'password') {
        return 'user.auth.sign-up.password-is-required';
      } else {
        return 'user.auth.sign-up.password-confirm-is-required';
      }
    },
    email: () => 'user.auth.sign-in.email-is-required',
    pattern: () => 'user.auth.sign-in.this-is-not-email',
    passwordMismatch: () => 'user.auth.sign-up.password-match',
    passwordIsEmpty: () => 'user.auth.sign-up.password-match-is-empty',
    minlength: () => 'user.auth.sign-in.password-must-be-at-least-8-characters-long',
    maxlength: () => (this.isSignInPassword ? 'user.auth.sign-in.too-long-password' : 'user.auth.sign-up.too-long-password'),
    symbolInvalid: () => (this.controlName === 'password' ? 'user.auth.sign-up.password-symbols-error' : 'user.auth.sign-up.user-name-size')
  };

  ngOnChanges() {
    this.getType();
  }

  private getType() {
    Object.keys(this.formElement.errors).forEach((error) => {
      this.errorMessage = this.getErrorMsg[error]();
      return this.errorMessage;
    });
  }
}
