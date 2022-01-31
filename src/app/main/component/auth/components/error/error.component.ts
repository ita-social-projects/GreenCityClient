import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { PopUpViewService } from '@auth-service/pop-up/pop-up-view.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html'
})
export class ErrorComponent implements OnChanges, OnInit, OnDestroy {
  private destroy: Subject<boolean> = new Subject<boolean>();
  @Input() public controlName: string;
  @Input() public formElement: AbstractControl;
  @Input() public emailFieldValue: string;
  @Input() public nameFieldValue: string;
  @Input() public passwordFieldValue: string;
  @Input() public passwordConfirmFieldValue: string;
  public errorMessage = '';

  constructor(private popUpViewService: PopUpViewService) {}

  private getErrorMsg = {
    required: () => {
      if (this.controlName === 'email') {
        return 'user.auth.sign-in.email-is-required';
      } else if (this.controlName === 'firstName') {
        return 'user.auth.sign-up.first-name-is-required';
      } else {
        return 'user.auth.sign-in.password-is-required';
      }
    },
    email: () => (this.emailFieldValue ? 'user.auth.sign-in.this-is-not-email' : 'user.auth.sign-in.email-is-required'),
    minlength: () => 'user.auth.sign-in.password-must-be-at-least-8-characters-long',
    symbolInvalid: () => (this.controlName === 'password' ? 'user.auth.sign-up.password-symbols-error' : 'user.auth.sign-up.user-name-size')
  };

  ngOnChanges() {
    this.getType();
  }

  private getType() {
    try {
      Object.keys(this.formElement.errors).forEach((error) => {
        this.errorMessage = this.getErrorMsg[error]();
        return this.errorMessage;
      });
    } catch (e) {}
  }

  ngOnInit(): void {
    this.popUpViewService.passwordMismatchSubject.pipe(takeUntil(this.destroy)).subscribe((value) => {
      if (value === 'noValid') {
        this.errorMessage = 'user.auth.sign-up.password-match';
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.complete();
  }
}
