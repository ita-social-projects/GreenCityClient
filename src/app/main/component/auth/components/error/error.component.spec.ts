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

    const spy = spyOn(component as any, 'getType');
    component.ngOnChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('Error: get email message', () => {
    expect((component as any).getErrorMsg[`email`]()).toBe('user.auth.sign-in.email-is-required');
  });

  it('Error: get passwordMismatch message', () => {
    expect((component as any).getErrorMsg[`passwordMismatch`]()).toBe('user.auth.sign-up.password-match');
  });

  it('Error: get emptyPassword message', () => {
    expect((component as any).getErrorMsg[`passwordIsEmpty`]()).toBe('user.auth.sign-up.password-match-is-empty');
  });

  it('Error: get minlength message', () => {
    expect((component as any).getErrorMsg[`minlength`]()).toBe('user.auth.sign-in.password-must-be-at-least-8-characters-long');
  });

  it('Error: get maxlength message', () => {
    expect((component as any).getErrorMsg[`maxlength`]()).toBe('user.auth.sign-up.too-long-password');
  });

  it('Error: get value for password', () => {
    component.controlName = 'password';
    expect((component as any).getErrorMsg[`symbolInvalid`]()).toBe('user.auth.sign-up.password-symbols-error');
  });

  it('Error: get value for password', () => {
    expect((component as any).getErrorMsg[`symbolInvalid`]()).toBe('user.auth.sign-up.user-name-size');
  });
});
