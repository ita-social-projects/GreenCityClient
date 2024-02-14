import { GoogleBtnComponent } from '../google-btn/google-btn.component';
import { HttpClientModule } from '@angular/common/http';
import { ErrorComponent } from '../error/error.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RestorePasswordComponent } from '../restore-password/restore-password.component';
import { SignUpComponent } from '../sign-up/sign-up.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SignInComponent } from '@global-auth/sign-in/sign-in.component';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthModalComponent } from './auth-modal.component';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

describe('AuthModalComponent', () => {
  let component: AuthModalComponent;
  let fixture: ComponentFixture<AuthModalComponent>;
  let router: Router;

  const MatDialogRefMock = {
    close: () => {}
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AuthModalComponent, SignInComponent, SignUpComponent, RestorePasswordComponent, ErrorComponent, GoogleBtnComponent],
      imports: [TranslateModule.forRoot(), ReactiveFormsModule, FormsModule, HttpClientModule, MatDialogModule, RouterTestingModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: MatDialogRefMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = fixture.debugElement.injector.get(Router);
    spyOn(router.url, 'includes').and.returnValue(false);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the function to close the dialog', () => {
    const spy = spyOn(component.matDialogRef, 'close').and.callThrough();
    component.closeWindow();
    expect(spy).toHaveBeenCalled();
  });

  it('should change authPage after call the function changeAuthPage', () => {
    component.changeAuthPage('sign-up');
    expect(component.authPage).toBe('sign-up');
  });
});
