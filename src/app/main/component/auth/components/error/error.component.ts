import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html'
})
export class ErrorComponent implements OnInit, OnDestroy {
  @Input() public control: FormControl;
  @Input() public controlName: string;

  private readonly ERROR_MESSAGE = {
    required: () => 'user.auth.sign-in.field-is-required',
    email: () => 'user.auth.sign-in.email-is-required',
    pattern: () => 'user.auth.sign-in.this-is-not-email',
    passwordMismatch: () => 'user.auth.sign-up.password-match',
    passwordIsEmpty: () => 'user.auth.sign-up.password-match-is-empty',
    minlength: () => 'user.auth.sign-in.password-must-be-at-least-8-characters-long',
    maxlength: () => 'user.auth.sign-in.too-long-password',
    symbolInvalid: () => (this.controlName === 'password' ? 'user.auth.sign-up.password-symbols-error' : 'user.auth.sign-up.user-name-size')
  };

  private $destroy: Subject<void> = new Subject<void>();
  errorMessage = '';

  ngOnInit(): void {
    this.control.valueChanges.pipe(takeUntil(this.$destroy)).subscribe(() => {
      if (this.control.valid) {
        this.errorMessage = '';
        return;
      }

      this.errorMessage = this.ERROR_MESSAGE[Object.keys(this.control?.errors)?.[0]]();
    });
  }

  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }
}
