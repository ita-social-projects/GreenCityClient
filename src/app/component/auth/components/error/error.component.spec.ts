import { FormControl } from '@angular/forms';
import { ErrorComponent } from './error.component';

describe('error component', () => {
  let component: ErrorComponent;

  beforeEach(() => {
    component = new ErrorComponent();
    component.formElement = new FormControl();
  });

  it('Error: get email message', () => {
    component.formElement.setErrors({ email: true });
    expect(component.getErrorMessage()).toBe('user.auth.sign-in.this-is-not-email');
  });

  it('Error: get required message', () => {
    component.formElement.setErrors({ required: true });
    expect(component.getErrorMessage()).toBe('user.auth.sign-in.field-is-required');
  });

  it('Error: get passwordMismatch message', () => {
    component.formElement.setErrors({ passwordMismatch: true });
    expect(component.getErrorMessage()).toBe('user.auth.sign-up.password-match');
  });

  it('Error: get minlength message', () => {
    component.formElement.setErrors({ minlength: true });
    expect(component.getErrorMessage()).toBe('user.auth.sign-in.password-must-be-at-least-8-characters-long');
  });

  it('Error: get default value', () => {
    component.formElement.setErrors({ iAmDefaultValue: true });
    expect(component.getErrorMessage()).toBeTruthy();
  });

  it('Error: get value for password', () => {
    component.formElement.setErrors({ symbolInvalid: true });
    expect(component.getErrorMessage()).toBeTruthy();
  });
});
