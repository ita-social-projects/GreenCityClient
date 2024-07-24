import { ErrorComponent } from './error.component';

describe('error component', () => {
  let component: ErrorComponent;

  beforeEach(() => {
    component = new ErrorComponent();
  });

  it('Error: get email message', () => {
    expect(component['ERROR_MESSAGE'].email()).toBe('user.auth.sign-in.email-is-required');
  });

  it('Error: get passwordMismatch message', () => {
    expect(component['ERROR_MESSAGE'].passwordMismatch()).toBe('user.auth.sign-up.password-match');
  });

  it('Error: get emptyPassword message', () => {
    expect(component['ERROR_MESSAGE'].passwordIsEmpty()).toBe('user.auth.sign-up.password-match-is-empty');
  });

  it('Error: get minlength message', () => {
    expect(component['ERROR_MESSAGE'].minlength()).toBe('user.auth.sign-in.password-must-be-at-least-8-characters-long');
  });

  it('Error: get maxlength message', () => {
    expect(component['ERROR_MESSAGE'].maxlength()).toBe('user.auth.sign-in.too-long-password');
  });

  it('Error: get value for password', () => {
    component.controlName = 'password';
    expect(component['ERROR_MESSAGE'].symbolInvalid()).toBe('user.auth.sign-up.password-symbols-error');
  });

  it('Error: get value for password', () => {
    expect(component['ERROR_MESSAGE'].symbolInvalid()).toBe('user.auth.sign-up.user-name-size');
  });
});
