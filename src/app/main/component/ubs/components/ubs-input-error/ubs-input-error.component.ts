import { Component, Input, OnChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-ubs-input-error',
  templateUrl: './ubs-input-error.component.html'
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
  private validationErrors = {
    email: 'input-error.email-wrong',
    minlength: 'input-error.minlength-short',
    maxlength: 'input-error.max-length',
    pattern: 'input-error.pattern',
    required: 'input-error.required'
  };

  ngOnChanges() {
    this.getType();
  }

  private getType() {
    for (const error in this.validationErrors) {
      if (this.formElement.errors[error]) {
        this.errorMessage = this.validationErrors[error];
        break;
      }
    }
  }
}
