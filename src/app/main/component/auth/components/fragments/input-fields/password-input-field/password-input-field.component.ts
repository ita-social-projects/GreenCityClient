import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { SignInIcons } from '../../../../../../image-pathes/sign-in-icons';
import { AbstractControl, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';

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
export class PasswordInputFieldComponent implements OnInit {
  public passwordFormGroup: FormGroup;
  public hideShowPasswordImage = SignInIcons;
  public passwordErrorMessageBackEnd: string;
  public passwordField: AbstractControl;
  public passwordFieldValue: string;
  public backEndError: string;
  @Input() repeatPassword: boolean;

  constructor() {}

  ngOnInit(): void {
    this.passwordFormGroup = new FormGroup({
      password: new FormControl(null, [Validators.required, Validators.minLength(8)])
    });
    this.passwordField = this.passwordFormGroup.get('password');
  }

  public configDefaultErrorMessage(): void {
    if (this.passwordField.valid) {
    }
  }

  public togglePassword(input: HTMLInputElement, src: HTMLImageElement): void {
    input.type = input.type === 'password' ? 'text' : 'password';
    src.src = input.type === 'password' ? this.hideShowPasswordImage.hidePassword : this.hideShowPasswordImage.showPassword;
    src.alt = input.type === 'password' ? 'show password' : 'hide password';
  }
}
