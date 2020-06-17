import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { InputcolorDirective } from '../../directives/inputcolor.directive';
import { SharedModule } from '../shared/shared.module';
import {
  RestoreComponent,
  RestoreFormComponent,
  RestorePasswordComponent,
  SignInComponent,
  SignUpComponent,
  SubmitEmailComponent
} from './components';
import { AuthSelectors } from './store/auth.selectors';

@NgModule({
  declarations: [
    SignUpComponent,
    SignInComponent,
    RestorePasswordComponent,
    InputcolorDirective,
    SubmitEmailComponent,
    RestoreComponent,
    RestoreFormComponent
  ],
  imports: [
    CoreModule,
    SharedModule,

  ],
  entryComponents: [
    SignInComponent,
    SignUpComponent,
    RestorePasswordComponent,
    SubmitEmailComponent
  ],
  exports: [
    InputcolorDirective
  ],
  providers: [
    AuthSelectors
  ]
})

export class AuthModule { }
