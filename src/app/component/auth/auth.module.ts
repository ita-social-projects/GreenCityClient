import { NgModule } from '@angular/core';
import { NewSignUpComponent } from './new-sign-up/new-sign-up.component';
import { SignInNewComponent } from './sign-in-new/sign-in-new.component';
import { RestorePasswordComponent } from './restore-password/restore-password.component';
import { CoreModule } from '../core/core.module';
import { SignInComponent } from '../user/auth/sign-in/sign-in.component';
import { InputcolorDirective } from '../../directives/inputcolor.directive';
import { SignUpComponent } from '../user/auth/sign-up/sign-up.component';
import { AuthComponent } from '../user/auth/auth.component';
import { SubmitEmailComponent } from '../user/auth/submit-email/submit-email.component';
import { RestoreComponent } from '../user/restore/restore.component';
import { RestoreFormComponent } from '../user/restore-form/restore-form.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    NewSignUpComponent,
    SignInNewComponent,
    RestorePasswordComponent,
    SignInComponent,
    InputcolorDirective,
    SignUpComponent,
    AuthComponent,
    SubmitEmailComponent,
    RestoreComponent,
    RestoreFormComponent,
  ],
  imports: [
    CoreModule,
    SharedModule
  ],
  entryComponents: [
    SignInNewComponent,
    NewSignUpComponent,
    RestorePasswordComponent,
  ],
  exports: [
    InputcolorDirective
  ],
  providers: []
})

export class AuthModule { }
