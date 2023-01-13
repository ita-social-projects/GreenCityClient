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
  @Input() public anotherClientFirstNameFieldValue: string;
  @Input() public lastNameFieldValue: string;
  @Input() public anotherClientLastNameFieldValue: string;
  @Input() public emailFieldValue: string;
  @Input() public anotherClientEmailFieldValue: string;
  @Input() public phoneNumberFieldValue: string;
  @Input() public anotherClientPhoneNumberFieldValue: string;
  @Input() public streetFieldValue: string;
  @Input() public houseNumberFieldValue: string;

  public errorMessage: string | undefined;
  private validationErrors = {
    email: 'input-error.email-wrong',
    minlength: 'input-error.minlength-short',
    maxlength: 'input-error.max-length',
    maxlengthEntrance: 'input-error.max-length-entrance',
    maxlengthHouse: 'input-error.max-length-house',
    maxlengthStreet: 'input-error.max-length-street',
    maxlengthComment: 'input-error.max-length-comment',
    pattern: 'input-error.pattern',
    required: 'input-error.required',
    wrongNumber: 'input-error.number-wrong',
    numberLength: 'input-error.number-length'
  };

  ngOnChanges() {
    this.getType();
  }

  private getType() {
    for (const error in this.validationErrors) {
      if (this.formElement.errors[error]) {
        if (this.formElement.errors.maxlength) {
          this.errorMessage = this.getMaxlengthErrorMessage(this.formElement.errors.maxlength.requiredLength);
          break;
        }

        this.errorMessage = this.validationErrors[error];
        break;
      }
    }
  }

  private getMaxlengthErrorMessage(maxlength: number): string {
    switch (maxlength) {
      case 2:
        return this.validationErrors.maxlengthEntrance;
      case 4:
        return this.validationErrors.maxlengthHouse;
      case 120:
        return this.validationErrors.maxlengthStreet;
      case 255:
        return this.validationErrors.maxlengthComment;
      default:
        return this.validationErrors.maxlength;
    }
  }
}
