import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html'
})
export class ErrorComponent implements OnChanges {
  @Input() public controlName: string;
  @Input() public formElement: FormControl;
  public errorMessage = '';

  private getErrorMsg = {
    required: () => 'user.auth.sign-in.field-is-required',
    email: () => 'user.auth.sign-in.this-is-not-email',
    passwordMismatch: () => 'user.auth.sign-up.password-match',
    minlength: () => 'user.auth.sign-in.password-must-be-at-least-8-characters-long',
    symbolInvalid: () => this.controlName === 'password' ? 'user.auth.sign-up.password-symbols-error' : 'user.auth.sign-up.user-name-size',
  };

  constructor() {}

  ngOnChanges() {
    this.getType();
  }

  private getType() {
    Object.keys(this.formElement.errors).map(error => {
      return this.errorMessage = this.getErrorMsg[error]();
    });
  }
}
