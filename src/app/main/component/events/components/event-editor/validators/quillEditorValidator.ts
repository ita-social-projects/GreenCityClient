import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function customTextValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return { invalid: true };
  }
  const value = control.value.replace('<p>', '').replace('</p>', '');
  if (value.trim() !== value) {
    return { invalid: true };
  }

  if (/\s{3,}/.test(value)) {
    return { invalid: true };
  }

  const characterCount = value.replace(/\s+/g, '').length;
  if (characterCount < 10) {
    return { invalid: true };
  }

  return null;
}
