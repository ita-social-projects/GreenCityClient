import { FormGroup } from "@angular/forms";

export function ConfirmPasswordValidator(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName]
    if (control.value !== matchingControl.value && matchingControl.value !== '') {
      matchingControl.setErrors({ passwordMismatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}

export function ValidatorRegExp(controlName: string) {
  return (formGroup: FormGroup) => {
    const regexpName = /^[a-z0-9][a-z0-9\.]{5,29}$/gi;
    const regexpPass = /^(?=.*[a-z]+)(?=.*[A-Z]+)(?=.*\d+)(?=.*[~`!@#$%^&*()+=_\-{}|:;”’?/<>,.\]\[]+).{8,}$/;
    const regexp = controlName === 'firstName' ? regexpName : regexpPass;
    const control = formGroup.controls[controlName];
    if (!control.value.match(regexp)) {
      control.setErrors({ symbolInvalid: true });
    } else {
      control.setErrors(null);
    }
  };
}