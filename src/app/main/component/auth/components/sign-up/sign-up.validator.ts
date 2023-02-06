import { FormGroup } from '@angular/forms';
import { Patterns } from 'src/assets/patterns/patterns';

export function ConfirmPasswordValidator(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];
    if (matchingControl.value === '') {
      matchingControl.setErrors({ required: true });
    } else {
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ passwordMismatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  };
}

export function ValidatorRegExp(controlName: string) {
  return (formGroup: FormGroup) => {
    const namePattern = Patterns.NamePattern;
    const regexpPass = Patterns.regexpPass;
    const regexp = controlName === 'firstName' ? namePattern : regexpPass;
    const control = formGroup.controls[controlName];
    if (control.value === '') {
      control.setErrors({ required: true });
    } else {
      if (controlName === 'password' && control.value.length < 8) {
        control.setErrors({ minlength: true });
      } else if (controlName === 'password' && control.value.length > 20) {
        control.setErrors({ maxlength: true });
      } else if (!control.value.match(regexp)) {
        control.setErrors({ symbolInvalid: true });
      } else {
        control.setErrors(null);
      }
    }
  };
}
