import { AbstractControl, ValidationErrors } from '@angular/forms';

export class LimitsValidator {
  static cannotBeEmpty(control: AbstractControl): ValidationErrors | null {
    if (control.value === 0) {
      return { cannotBeEmpty: true };
    }
    if (control.value === null) {
      return { cannotBeEmpty: true };
    }
    return null;
  }
}
