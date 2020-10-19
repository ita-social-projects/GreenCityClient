import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { Observable } from 'rxjs';

import { SignUpComponent } from './sign-up.component';
import {AuthService, AuthServiceConfig, GoogleLoginProvider} from 'angularx-social-login';
import { AuthModalServiceService } from '../../services/auth-service.service';
import { UserOwnSignInService } from '@global-service/auth/user-own-sign-in.service';
import { UserOwnSignUpService } from '@global-service/auth/user-own-sign-up.service';
import { GoogleSignInService } from '@global-service/auth/google-sign-in.service';
import { provideConfig } from 'src/app/config/GoogleAuthConfig';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SignUpComponent,
       ],
      imports: [
        ReactiveFormsModule,
        MatDialogModule,
        RouterTestingModule,
        HttpClientTestingModule,
        AgmCoreModule,
        TranslateModule.forRoot(),
      ],

      providers: [
        AuthService,
        AuthModalServiceService,
        GoogleSignInService,
        UserOwnSignInService,
        UserOwnSignUpService,
        { provide: MatDialogRef, useValue: {} },
        { provide: AuthServiceConfig, useFactory: provideConfig },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should init three method', () => {
    spyOn(component as any, 'InitFormReactive');
    spyOn(component as any, 'getFormFields');
    spyOn(component as any, 'setNullAllMessage');
    component.ngOnInit();

    expect((component as any).InitFormReactive).toHaveBeenCalledTimes(1);
    expect((component as any).getFormFields).toHaveBeenCalledTimes(1);
    expect((component as any).setNullAllMessage).toHaveBeenCalledTimes(1);
  });

  describe('Testing controls for the signUpForm:', () => {
    const controlsName = ['email', 'firstName', 'password', 'repeatPassword'];
    const invalidName = ['.Jhon', 'Nick&', 'Mi$ke', '@Andrian'];
    const validName = ['JhonSmith', 'Nick12', 'Angela', 'Andrian'];
    const invalidPassword = ['12345aS', '12345aaS', '123456S@', '123456a@'];
    const validPassword = ['12345aS@', 'Aqwert1%', 'Pi$98765', '!1234567kT'];

    function testWrapper(itemValue) {
      it(`should create form with formControl: ${itemValue};`, () => {
        expect(component.signUpForm.contains(itemValue)).toBeTruthy();
      });
    }

    controlsName.forEach(el => testWrapper(el));

    function controlsValidator(itemValue, controlName, status) {
      it(`The formControl: ${controlName} should be marked as ${status} if the value is ${itemValue}.`, () => {
        const control = component.signUpForm.get(controlName);
        control.setValue(itemValue);
        status === 'valid'
          ? expect(control.valid).toBeTruthy()
          : expect(control.valid).toBeFalsy();
      });
    }

    invalidName.forEach(el => controlsValidator(el, 'firstName', 'invalid'));

    validName.forEach(el => controlsValidator(el, 'firstName', 'valid'));

    invalidPassword.forEach(el => controlsValidator(el, 'password', 'invalid'));

    validPassword.forEach(el => controlsValidator(el, 'password', 'valid'));

  });

  
});
