import { Component, Input, OnChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-ubs-input-error',
  templateUrl: './ubs-input-error.component.html',
})
export class UBSInputErrorComponent implements OnChanges {
  @Input() public controlName: string;
  @Input() public formElement: FormControl;
  @Input() public certificateFieldValue: string;
  @Input() public firstNameFieldValue: string;
  @Input() public lastNameFieldValue: string;
  @Input() public emailFieldValue: string;
  @Input() public phoneNumberFieldValue: string;
  @Input() public streetFieldValue: string;
  @Input() public houseNumberFieldValue: string;

  public errorMessage;
  private getErrorMsg = {
    required: () => 'input-error.required',
    email: () => (this.emailFieldValue ? 'input-error.email-wrong' : 'input-error.email-empty'),
    minlength: () => (this.phoneNumberFieldValue ? 'input-error.minlength-unfull' : 'minlength-short'),
    maxlength: () => 'input-error.maxlenght',
    pattern: () => 'input-error.pattern',
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
