import { NgModule } from '@angular/core';
import { NewSignUpComponent } from './new-sign-up/new-sign-up.component';
import { RestorePasswordComponent } from './restore-password/restore-password.component';
import {CoreModule} from '../core/core.module';

@NgModule({
  declarations: [
    NewSignUpComponent,
    RestorePasswordComponent,
  ],
  imports: [
    CoreModule
  ],
  entryComponents: [
    RestorePasswordComponent
  ],
  providers: []
})

export class AuthModule { }
