import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorComponent } from './error.component';

describe('error component', () => {
  let component: ErrorComponent;
  let componentFixture: ComponentFixture<ErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorComponent ],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        FormsModule,
        ReactiveFormsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    componentFixture = TestBed.createComponent(ErrorComponent);
    component = componentFixture.componentInstance;
    componentFixture.detectChanges();
  });

  it('Error: get email message', () => {
    component.formElement = new FormControl();
    component.formElement.setErrors({ email: true });
    expect(component.getErrorMessage()).toBe('user.auth.sign-in.this-is-not-email');
  });

  it('Error: get required message', () => {
    component.formElement = new FormControl();
    component.formElement.setErrors({ required: true });
    expect(component.getErrorMessage()).toBe('user.auth.sign-in.field-is-required');
  });

  it('Error: get passwordMismatch message', () => {
    component.formElement = new FormControl();
    component.formElement.setErrors({ passwordMismatch: true });
    expect(component.getErrorMessage()).toBe('user.auth.sign-up.password-match');
  });

  it('Error: get minlength message', () => {
    component.formElement = new FormControl();
    component.formElement.setErrors({ minlength: true });
    expect(component.getErrorMessage()).toBe('user.auth.sign-in.password-must-be-at-least-8-characters-long');
  });
});
