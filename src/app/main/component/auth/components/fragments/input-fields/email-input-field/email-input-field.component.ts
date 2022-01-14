import { Component, forwardRef, OnInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';

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
export class EmailInputFieldComponent implements OnInit {
  public emailFormGroup: FormGroup;
  public emailControl: AbstractControl;
  public emailFieldValue: string;
  public emailErrorMessageBackEnd: string;
  public backEndError: string;

  constructor() {}

  ngOnInit(): void {
    this.emailFormGroup = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email])
    });
    this.emailControl = this.emailFormGroup.get('email');
  }

  public configDefaultErrorMessage(): void {
    this.emailFieldValue = this.emailControl.value;
  }
}
