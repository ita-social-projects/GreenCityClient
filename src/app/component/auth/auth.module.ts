import { NgModule } from '@angular/core';
import { NewSignUpComponent } from './new-sign-up/new-sign-up.component';
import { SignInNewComponent } from './sign-in-new/sign-in-new.component';
import { CoreModule } from '../core/core.module';

@NgModule({
  declarations: [
    NewSignUpComponent,
    SignInNewComponent
  ],
  imports: [
    CoreModule
  ],
  entryComponents: [
    SignInNewComponent
  ],
  providers: []
})

export class AuthModule { }
