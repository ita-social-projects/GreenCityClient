import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Patterns } from 'src/assets/patterns/patterns';

enum errorType {
  email = 'email',
  pattern = 'pattern',
  minlength = 'minlength',
  maxlength = 'maxlength',
  required = 'required'
}
@Component({
  selector: 'app-ubs-input-error',
  templateUrl: './ubs-input-error.component.html',
  styleUrls: ['./ubs-input-error.component.scss']
})
export class UBSInputErrorComponent implements OnInit {
  @Input() public formElement: FormControl;

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
    wrongName: 'input-error.name-wrong',
    wrongNumber: 'input-error.number-wrong',
    wrongCity: 'input-error.city-wrong',
    wrongHouse: 'input-error.house-wrong',
    wrongCorpus: 'input-error.corpus-wrong',
    wrongEntrance: 'input-error.entrance-wrong',
    numberLength: 'input-error.number-length'
  };

  ngOnInit() {
    this.getType();
    this.formElement.valueChanges.pipe().subscribe(() => {
      this.getType();
    });
  }

  getType() {
    Object.values(errorType).forEach((err) => {
      if (this.formElement.errors?.[err]) {
        switch (err) {
          case errorType.pattern:
            this.errorMessage = this.getPatternErrorMessage(this.formElement.errors.pattern.requiredPattern);
            break;
          case errorType.maxlength:
            this.errorMessage = this.getMaxlengthErrorMessage(this.formElement.errors.maxlength.requiredLength);
            break;
          default:
            this.errorMessage = this.validationErrors[err];
        }
      }
    });
  }

  getPatternErrorMessage(pattern: string): string {
    switch (pattern) {
      case Patterns.ubsWithDigitPattern.toString():
        return this.validationErrors.wrongCity;
      case Patterns.ubsHousePattern.toString():
        return this.validationErrors.wrongHouse;
      case Patterns.ubsCorpusPattern.toString():
        return this.validationErrors.wrongCorpus;
      case Patterns.ubsEntrNumPattern.toString():
        return this.validationErrors.wrongEntrance;
      case Patterns.NamePattern.toString():
        return this.validationErrors.wrongName;
      case Patterns.ubsMailPattern.toString():
        return this.validationErrors.email;
      case Patterns.adminPhone.toString():
        return this.validationErrors.wrongNumber;
      default:
        return this.validationErrors.pattern;
    }
  }

  getMaxlengthErrorMessage(maxlength: number): string {
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
