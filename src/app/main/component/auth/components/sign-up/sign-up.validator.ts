import { FormGroup } from '@angular/forms';

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
    const regexpName = /^(?!\.)(?!.*\.$)(?!.*?\.\.)[a-z0-9_.]{6,30}$/gi;
    const regexpPass = new RegExp(
      [/^(?=.*[a-z]+)/, /(?=.*[A-Z]+)/, /(?=.*\d+)/, /(?=.*[~`!@#$%^&*()+=_\-{}|:;”’?/<>,.\]\[]+).{8,}$/]
        .map((reg) => {
          return reg.source;
        })
        .join('')
    );
    const regexp = controlName === 'firstName' ? regexpName : regexpPass;
    const control = formGroup.controls[controlName];
    if (control.value === '') {
      control.setErrors({ required: true });
    } else {
      if (controlName === 'password' && control.value.length < 8) {
        control.setErrors({ minlength: true });
      } else if (!control.value.match(regexp) || control.value.match(/\s/)) {
        control.setErrors({ symbolInvalid: true });
      } else {
        control.setErrors(null);
      }
    }
  };
}
