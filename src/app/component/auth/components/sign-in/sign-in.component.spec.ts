import { MatDialog } from '@angular/material/dialog';
import { AuthService, AuthServiceConfig } from 'angularx-social-login';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material';
import { SignUpComponent } from './../sign-up/sign-up.component';
import { SIGN_UP_TOKEN, SIGN_IN_TOKEN, RESTORE_PASSWORD_TOKEN } from './../../auth-token.constant';
import { GoogleBtnComponent } from './../google-btn/google-btn.component';
import { ErrorComponent } from './../error/error.component';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { async, ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';

import { SignInComponent } from './sign-in.component';
import { RestorePasswordComponent } from '@global-auth/restore-password/restore-password.component';
import { provideConfig } from 'src/app/config/GoogleAuthConfig';
import { ViewContainerRef } from '@angular/core';

describe('SignInNewComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignInComponent, ErrorComponent, GoogleBtnComponent ],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        MatDialogModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        AuthService,
        {
          provide: AuthServiceConfig,
          useFactory: provideConfig
        },
        { provide: MatDialogRef, useValue: [] },
        { provide: SIGN_UP_TOKEN, useValue: SignUpComponent },
        { provide: SIGN_IN_TOKEN, useValue: SignInComponent },
        { provide: RESTORE_PASSWORD_TOKEN, useValue: RestorePasswordComponent }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should init two method', () => {
    spyOn(component as any, 'configDefaultErrorMessage');
    spyOn(component as any, 'checkIfUserId');
    component.ngOnInit();

    expect((component as any).configDefaultErrorMessage).toHaveBeenCalledTimes(1);
    expect((component as any).checkIfUserId).toHaveBeenCalledTimes(1);
  });

  it('ngOnDestroy should destroy one method', () => {
    spyOn((component as any).userIdSubscription, 'unsubscribe');
    component.ngOnDestroy();
    expect((component as any).userIdSubscription.unsubscribe).toHaveBeenCalledTimes(1);
  });

  it('form fields validity', () => {
    const { email, password } = component.signInForm.controls;
    expect(email[`valid`] && password[`valid`] ).toBeFalsy();
  });

  it('submitting a form emits a user', () => {
    expect(component.signInForm.valid).toBeFalsy();
    component.signInForm.controls[`email`].setValue('test@test.com');
    component.signInForm.controls[`password`].setValue('12345678');
    expect(component.signInForm.valid).toBeTruthy();
  });

  it('submitting a form emits a user', () => {
    expect(component.signInForm[`valid`]).toBeFalsy();
    component.signInForm.controls[`email`].setValue('test@test.com');
    component.signInForm.controls[`password`].setValue('12345678');
    expect(component.signInForm[`valid`]).toBeTruthy();
  });

  it('getting error messages', () => {
    const passControl = component.signInForm.controls[`password`];
    const emailControl = component.signInForm.controls[`email`];
    passControl.setErrors( {required: true} );
    expect(component.getErrorMessage(passControl, 'password')).toBeTruthy();
    passControl.setErrors( {minlength: true} );
    expect(component.getErrorMessage(passControl, 'password')).toBeTruthy();
    emailControl.setErrors( {required: true} );
    expect(component.getErrorMessage(emailControl, 'email')).toBeTruthy();
    emailControl.setErrors( {email: true} );
    expect(component.getErrorMessage(emailControl, 'email')).toBeTruthy();
  });
});
