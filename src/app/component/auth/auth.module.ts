import { SIGN_UP_TOKEN, SIGN_IN_TOKEN, RESTORE_PASSWORD_TOKEN } from './auth-token.constant';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { InputcolorDirective } from '../../directives/inputcolor.directive';
import { SharedModule } from '@shared/shared.module';
import {
  RestoreComponent,
  RestorePasswordComponent,
  SignInComponent,
  SignUpComponent,
  SubmitEmailComponent,
} from './components';
import { ErrorComponent } from './components/error/error.component';
import { ConfirmRestorePasswordComponent } from './components/confirm-restore-password/confirm-restore-password.component';
import { GoogleBtnComponent } from './components/google-btn/google-btn.component';
import { AuthModalComponent } from './components/auth-modal/auth-modal.component';

@NgModule({
  declarations: [
    SignUpComponent,
    SignInComponent,
    RestorePasswordComponent,
    InputcolorDirective,
    SubmitEmailComponent,
    RestoreComponent,
    ConfirmRestorePasswordComponent,
    ErrorComponent,
    GoogleBtnComponent,
    AuthModalComponent
  ],
  imports: [
    CoreModule,
    SharedModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    SignInComponent,
    SignUpComponent,
    RestorePasswordComponent,
    SubmitEmailComponent,
    ConfirmRestorePasswordComponent,
    AuthModalComponent
  ],
  exports: [
    InputcolorDirective
  ],
  providers: [
    { provide: SIGN_UP_TOKEN, useValue: SignUpComponent },
    { provide: SIGN_IN_TOKEN, useValue: SignInComponent },
    { provide: RESTORE_PASSWORD_TOKEN, useValue: RestorePasswordComponent }
  ]
})
export class AuthModule { }
