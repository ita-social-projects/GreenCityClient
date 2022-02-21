import { FormControl } from '@angular/forms';
import { ErrorComponent } from './error.component';

describe('error component', () => {
  let component: ErrorComponent;

  beforeEach(() => {
    component = new ErrorComponent();
    component.formElement = new FormControl();
  });

  it('Shoud call ngOnChanges hook', () => {
    component.formElement.setErrors({ symbolInvalid: true });

    // @ts-ignore
    const spy = spyOn(component, 'getType');
    component.ngOnChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('Shoud return error type', () => {
    component.formElement.setErrors({ required: true });
    // @ts-ignore
    component.getType();

    expect(component.errorMessage).toBe('user.auth.sign-in.password-is-required');
  });

  it('Error: get email message', () => {
    // @ts-ignore
    expect(component.getErrorMsg[`email`]()).toBe('user.auth.sign-in.email-is-required');
  });

  it('Error: get required message', () => {
    // @ts-ignore
    expect(component.getErrorMsg[`required`]()).toBe('user.auth.sign-in.password-is-required');
  });

  it('Error: get passwordMismatch message', () => {
    // @ts-ignore
    expect(component.getErrorMsg[`passwordMismatch`]()).toBe('user.auth.sign-up.password-match');
  });

  it('Error: get minlength message', () => {
    // @ts-ignore
    expect(component.getErrorMsg[`minlength`]()).toBe('user.auth.sign-in.password-must-be-at-least-8-characters-long');
  });

  it('Error: get value for password', () => {
    component.controlName = 'password';
    // @ts-ignore
    expect(component.getErrorMsg[`symbolInvalid`]()).toBe('user.auth.sign-up.password-symbols-error');
  });

  it('Error: get value for password', () => {
    // @ts-ignore
    expect(component.getErrorMsg[`symbolInvalid`]()).toBe('user.auth.sign-up.user-name-size');
  });
});
