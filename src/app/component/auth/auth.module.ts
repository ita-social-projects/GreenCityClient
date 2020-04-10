import { NgModule } from '@angular/core';
import { NewSignUpComponent } from './new-sign-up/new-sign-up.component';
import { SignInNewComponent } from './sign-in-new/sign-in-new.component';
import { RestorePasswordComponent } from './restore-password/restore-password.component';
import { CoreModule } from '../core/core.module';

@NgModule({
  declarations: [
    NewSignUpComponent,
    SignInNewComponent,
    RestorePasswordComponent
  ],
  imports: [
    CoreModule
  ],
  entryComponents: [
    SignInNewComponent,
    NewSignUpComponent,
    RestorePasswordComponent,
  ],
  providers: []
})

export class AuthModule { }
