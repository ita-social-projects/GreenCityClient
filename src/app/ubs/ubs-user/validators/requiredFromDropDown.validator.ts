import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export class RequiredFromDropdownValidator {
  static requiredFromDropdown(errorValue: boolean): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value && control.dirty && errorValue) {
        return { requiredFromDropdown: true };
      }
      return null;
    };
  }
}
