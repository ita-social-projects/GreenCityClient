import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export function ConfirmPasswordValidator(password: string, repeatPassword: string): boolean {
  return password === repeatPassword;
}

export function ValidatorRegExp(controlName: string): ValidatorFn {
  return (formGroup: FormGroup): ValidationErrors => {
    const regexpName = /^(?!\.)(?!.*\.$)(?!.*?\.\.)[a-zA-Z0-9_.]{6,30}$/gi;
    const regexpPass = /^(?=.*[a-z]+)(?=.*[A-Z]+)(?=.*\d+)(?=.*[~`!@#$%^&*()+=_\-{}|:;”’?/<>,.\]\[]+).{8,}$/;
    const regexp = controlName === 'firstName' ? regexpName : regexpPass;
    const control = formGroup.controls[controlName];
    const stringValue = control.value;
    if (control.value === '') {
      control.setErrors({ required: true });
    } else {
      if (controlName === 'password' && stringValue.length < 8) {
        control.setErrors({ minlength: true });
      } else if (!stringValue.match(regexp)) {
        control.setErrors({ symbolInvalid: true });
      } else {
        control.setErrors(null);
      }
    }
    return;
  };
}
