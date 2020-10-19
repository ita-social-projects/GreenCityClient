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

const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('646908969284899')
  }
]);
export function provideConfig() {
  return config;
}
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

    for (let i = 0; i < controlsName.length; i++) {
      testWrapper(controlsName[i]);
    };


    // function invalidNameWrapper(itemValue) {
    //   it(`The formControl: firstName should be marked as invalid if the value is ${invalidName[itemValue]}.`, () => {
    //     const control = component.signUpForm.get('firstName');
    //     control.setValue(invalidName[itemValue]);
    //     expect(control.valid).toBeFalsy();
    //   });
    // }

    // for (let i = 0; i < invalidName.length; i++) {
    //   invalidNameWrapper(i);
    // }

    // function validNameWrapper(itemValue) {
    //   it(`The formControl: firstName should be marked as invalid if the value is ${validName[itemValue]}.`, () => {
    //     const control = component.signUpForm.get('firstName');
    //     control.setValue(validName[itemValue]);
    //     expect(control.valid).toBeTruthy();
    //   });
    // }

    // for (let i = 0; i < validName.length; i++) {
    //   validNameWrapper(i);
    // }

    function controlsValidator(itemValue, controlName, status) {
      it(`The formControl: ${controlName} should be marked as ${status} if the value is ${itemValue}.`, () => {
        const control = component.signUpForm.get(controlName);
        control.setValue(itemValue);
        status === 'valid'
          ? expect(control.valid).toBeTruthy()
          : expect(control.valid).toBeFalsy();
      });
    }

    for (let i = 0; i < invalidName.length; i++) {
      controlsValidator(invalidName[i], 'firstName', 'invalid');
    }

    for (let i = 0; i < validName.length; i++) {
      controlsValidator(validName[i], 'firstName', 'valid');
    }

    for (let i = 0; i < invalidPassword.length; i++) {
      controlsValidator(invalidPassword[i], 'password', 'invalid');
    }

    for (let i = 0; i < validPassword.length; i++) {
      controlsValidator(validPassword[i], 'password', 'valid');
    }
  })
})
