import { AuthService, AuthServiceConfig } from 'angularx-social-login';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material';
import { GoogleBtnComponent } from './../google-btn/google-btn.component';
import { ErrorComponent } from './../error/error.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInComponent } from './sign-in.component';
import { provideConfig } from 'src/app/config/GoogleAuthConfig';
import { By } from '@angular/platform-browser';

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

  it('should containt h2 tag', () => {
    const h2El = fixture.debugElement.query(By.css('h2'));
    expect(h2El.nativeElement.textContent).toBe( 'user.auth.sign-in.fill-form' );
  });
});
