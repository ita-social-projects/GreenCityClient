import { NgModule } from '@angular/core';
import { NewSignUpComponent } from './new-sign-up/new-sign-up.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

@NgModule({
  declarations: [
    NewSignUpComponent,
    ForgotPasswordComponent
  ],
  imports: [],
  entryComponents: [
    ForgotPasswordComponent
  ],
  providers: []
})

export class AuthModule { }
