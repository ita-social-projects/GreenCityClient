import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { InputcolorDirective } from '../../directives/inputcolor.directive';
import { SharedModule } from '@shared/shared.module';
import { RestoreComponent, RestorePasswordComponent, SignInComponent, SignUpComponent, SubmitEmailComponent } from './components';
import { ErrorComponent } from './components/error/error.component';
import { ConfirmRestorePasswordComponent } from './components/confirm-restore-password/confirm-restore-password.component';
import { GoogleBtnComponent } from './components/google-btn/google-btn.component';
import { AuthModalComponent } from './components/auth-modal/auth-modal.component';
import { MatSnackBarModule } from '@angular/material';
import { MessageBackEndComponent } from './components/message-back-end/message-back-end.component';

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
    MessageBackEndComponent
  ],
  imports: [CoreModule, SharedModule, ReactiveFormsModule],
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
