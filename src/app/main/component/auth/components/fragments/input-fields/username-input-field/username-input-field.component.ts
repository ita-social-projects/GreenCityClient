import { Component, forwardRef, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';

@Component({
  selector: 'app-username-input-field',
  templateUrl: './username-input-field.component.html',
  styleUrls: ['./username-input-field.component.scss'],
  viewProviders: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UsernameInputFieldComponent),
      multi: true
    }
  ]
})
export class UsernameInputFieldComponent implements OnInit {
  public passwordErrorMessageBackEnd: string;
  public backEndError: string;
  public firstNameErrorMessageBackEnd: string;
  public userNameInputForm: FormGroup;
  public nameField: AbstractControl;
  public userNameValue: string;

  constructor() {}

  ngOnInit(): void {
    this.userNameInputForm = new FormGroup({
      firstName: new FormControl(null)
    });
    this.nameField = this.userNameInputForm.get('firstName');
  }

  public setError(): void {
    this.passwordErrorMessageBackEnd = null;
    this.userNameValue = this.nameField.value;
  }
}
