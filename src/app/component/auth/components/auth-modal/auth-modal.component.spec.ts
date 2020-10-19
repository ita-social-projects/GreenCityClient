import { GoogleBtnComponent } from './../google-btn/google-btn.component';
import { AuthModalServiceService } from './../../services/auth-service.service';
import { HttpClientModule } from '@angular/common/http';
import { ErrorComponent } from '../error/error.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RestorePasswordComponent } from './../restore-password/restore-password.component';
import { SignUpComponent } from './../sign-up/sign-up.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SignInComponent } from '@global-auth/sign-in/sign-in.component';

import { AuthModalComponent } from './auth-modal.component';
import { MatDialogModule, MatDialogRef } from '@angular/material';

describe('AuthModalComponent', () => {
  let component: AuthModalComponent;
  let fixture: ComponentFixture<AuthModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AuthModalComponent,
        SignInComponent,
        SignUpComponent,
        RestorePasswordComponent,
        ErrorComponent,
        GoogleBtnComponent
      ],
      imports: [
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        MatDialogModule
      ],
      providers: [
        AuthModalServiceService,
        { provide: MatDialogRef, useValue: {} },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
