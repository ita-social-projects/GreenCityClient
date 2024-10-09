import { ErrorComponent } from './error.component';
import { FormControl } from '@angular/forms';

describe('ErrorComponent', () => {
  let component: ErrorComponent;

  beforeEach(() => {
    component = new ErrorComponent();
    component.control = new FormControl(); // Mocking the FormControl input
  });

  it('Error: get email required message', () => {
    component.controlName = 'email';
    expect(component['ERROR_MESSAGE'].required()).toBe('user.auth.sign-in.email-is-required');
  });

  it('Error: get firstName required message', () => {
    component.controlName = 'firstName';
    expect(component['ERROR_MESSAGE'].required()).toBe('user.auth.sign-in.name-is-required');
  });

  it('Error: get default required message', () => {
    component.controlName = 'other';
    expect(component['ERROR_MESSAGE'].required()).toBe('user.auth.sign-in.field-is-required');
  });

  it('Error: get email message', () => {
    expect(component['ERROR_MESSAGE'].email()).toBe('user.auth.sign-in.email-is-required');
  });

  it('Error: get passwordMismatch message', () => {
    expect(component['ERROR_MESSAGE'].passwordMismatch()).toBe('user.auth.sign-up.password-match');
  });

  it('Error: get passwordIsEmpty message', () => {
    expect(component['ERROR_MESSAGE'].passwordIsEmpty()).toBe('user.auth.sign-up.password-match-is-empty');
  });

  it('Error: get minlength message', () => {
    expect(component['ERROR_MESSAGE'].minlength()).toBe('user.auth.sign-in.password-must-be-at-least-8-characters-long');
  });

  it('Error: get maxlength message', () => {
    expect(component['ERROR_MESSAGE'].maxlength()).toBe('user.auth.sign-in.too-long-password');
  });

  it('Error: get symbolInvalid message for password', () => {
    component.controlName = 'password';
    expect(component['ERROR_MESSAGE'].symbolInvalid()).toBe('user.auth.sign-up.password-symbols-error');
  });

  it('Error: get symbolInvalid message for other field', () => {
    component.controlName = 'username';
    expect(component['ERROR_MESSAGE'].symbolInvalid()).toBe('user.auth.sign-up.user-name-size');
  });
});
