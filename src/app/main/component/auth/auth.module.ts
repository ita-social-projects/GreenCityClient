import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { InputcolorDirective } from '../../directives/inputcolor.directive';
import { SharedMainModule } from '@shared/shared-main.module';
import { RestoreComponent, RestorePasswordComponent, SignInComponent, SignUpComponent, SubmitEmailComponent } from './components';
import { ErrorComponent } from './components/error/error.component';
import { ConfirmRestorePasswordComponent } from './components/confirm-restore-password/confirm-restore-password.component';
import { GoogleBtnComponent } from './components/fragments/buttons/google-btn/google-btn.component';
import { AuthModalComponent } from './components/auth-modal/auth-modal.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { EmailInputFieldComponent } from './components/fragments/input-fields/email-input-field/email-input-field.component';
import { PasswordInputFieldComponent } from './components/fragments/input-fields/password-input-field/password-input-field.component';
import { SubmitButtonComponent } from './components/fragments/buttons/submit-button/submit-button.component';
import { UsernameInputFieldComponent } from './components/fragments/input-fields/username-input-field/username-input-field.component';

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
    AuthModalComponent,
    EmailInputFieldComponent,
    PasswordInputFieldComponent,
    SubmitButtonComponent,
    UsernameInputFieldComponent
  ],
  imports: [CoreModule, SharedMainModule, SharedModule, ReactiveFormsModule],
  entryComponents: [
    SignInComponent,
    SignUpComponent,
    RestorePasswordComponent,
    SubmitEmailComponent,
    ConfirmRestorePasswordComponent,
    AuthModalComponent
  ],
  exports: [InputcolorDirective],
  providers: [MatSnackBarModule]
})
export class AuthModule {}
