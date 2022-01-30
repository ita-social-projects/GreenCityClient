import { Component, forwardRef, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { PopUpViewService } from '@auth-service/pop-up/pop-up-view.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-email-input-field',
  templateUrl: './email-input-field.component.html',
  styleUrls: ['./email-input-field.component.scss'],
  viewProviders: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EmailInputFieldComponent),
      multi: true
    }
  ]
})
export class EmailInputFieldComponent implements OnInit, OnDestroy {
  private destroy: Subject<boolean> = new Subject<boolean>();
  public emailFormGroup: FormGroup;
  public emailControl: AbstractControl;
  public emailFieldValue: string;
  public emailErrorMessageBackEnd: string;
  public backEndError: string;

  constructor(private popUpViewService: PopUpViewService) {}

  ngOnInit(): void {
    this.popUpViewService.backendErrorSubject.pipe(takeUntil(this.destroy)).subscribe((value) => (this.backEndError = value));
    this.popUpViewService.emailBackendErrorSubject.pipe(takeUntil(this.destroy)).subscribe((value) => {
      this.emailErrorMessageBackEnd = value;
      this.getEmailError();
    });
    this.emailFormGroup = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email])
    });
    this.emailControl = this.emailFormGroup.get('email');
  }

  public getEmailError(): string {
    return /already registered/.test(this.emailErrorMessageBackEnd)
      ? 'user.auth.sign-up.the-user-already-exists-by-this-email'
      : 'user.auth.sign-up.this-is-not-email'
      ? /already-sent/.test(this.emailErrorMessageBackEnd)
        ? 'user.auth.forgot-password.already-sent'
        : 'user.auth.forgot-password.email-not-exist'
      : null;
  }

  public configDefaultErrorMessage(): void {
    this.backEndError = null;
    this.emailErrorMessageBackEnd = null;
    this.emailControl.markAsTouched();
    this.emailFieldValue = this.emailControl.value;
    const isValid = this.emailFormGroup.valid && this.emailControl.touched;
    this.popUpViewService.setEmailInputField(isValid);
  }

  ngOnDestroy() {
    this.destroy.next(true);
    this.destroy.complete();
  }
}
