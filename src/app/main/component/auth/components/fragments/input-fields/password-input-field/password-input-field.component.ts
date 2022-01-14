import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { SignInIcons } from '../../../../../../image-pathes/sign-in-icons';
import { AbstractControl, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { PopUpViewService } from '@auth-service/pop-up/pop-up-view.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-password-input-field',
  templateUrl: './password-input-field.component.html',
  styleUrls: ['./password-input-field.component.scss'],
  viewProviders: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordInputFieldComponent),
      multi: true
    }
  ]
})
export class PasswordInputFieldComponent implements OnInit, OnDestroy {
  private destroy: Subject<boolean> = new Subject<boolean>();
  public passwordFormGroup: FormGroup;
  public hideShowPasswordImage = SignInIcons;
  public passwordErrorMessageBackEnd: string;
  public passwordField: AbstractControl;
  public passwordFieldValue: string;
  public backEndError: string;
  @Input() repeatPassword: boolean;

  constructor(private popUpViewService: PopUpViewService) {}

  ngOnInit(): void {
    this.popUpViewService.backendErrorSubject.pipe(takeUntil(this.destroy)).subscribe((value) => (this.backEndError = value));
    this.passwordFormGroup = new FormGroup({
      password: new FormControl(null, [Validators.required, Validators.minLength(8)])
    });
    this.passwordField = this.passwordFormGroup.get('password');
  }

  public configDefaultErrorMessage(): void {
    this.backEndError = null;
    this.passwordField.markAsTouched();
    if (this.passwordFormGroup.valid && this.passwordField.touched) {
      this.popUpViewService.setPasswordInputField(true);
    } else {
      this.popUpViewService.setPasswordInputField(false);
    }
  }

  public togglePassword(input: HTMLInputElement, src: HTMLImageElement): void {
    input.type = input.type === 'password' ? 'text' : 'password';
    src.src = input.type === 'password' ? this.hideShowPasswordImage.hidePassword : this.hideShowPasswordImage.showPassword;
    src.alt = input.type === 'password' ? 'show password' : 'hide password';
  }

  ngOnDestroy() {
    this.destroy.next(true);
    this.destroy.complete();
  }
}
