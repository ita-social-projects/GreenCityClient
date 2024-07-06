import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function emptyOrValid(validators: ValidatorFn[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === null || control.value === '') {
      return null;
    }

    let errors: ValidationErrors = {};
    for (let validator of validators) {
      const validationResult = validator(control);

      if (validationResult) {
        errors = { ...errors, ...validationResult };
      }
    }

    return errors ? errors : null;
  };
}
