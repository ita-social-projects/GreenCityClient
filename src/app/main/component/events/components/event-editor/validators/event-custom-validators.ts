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

export const locationOrOnlineLinkValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control || !control.get('onlineLink') || !control.get('coordinates')) {
    return null;
  }

  const onlineLink = control.get('onlineLink')?.value;
  const longitude = control.get('coordinates')?.value.longitude;

  if (!onlineLink && (longitude === null || longitude === undefined || longitude === '')) {
    return { locationOrOnlineLinkRequired: true };
  }

  return null;
};
