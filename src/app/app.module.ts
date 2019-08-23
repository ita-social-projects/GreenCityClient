import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from "./app.component";
import {AdminComponent} from "./component/admin/admin.component";
import {UserComponent} from "./component/user/user.component";
import {GeneralComponent} from "./component/general/general.component";
import {SignUpComponent} from "./component/user/auth/sign-up/sign-up.component";
import {NavBarComponent} from "./component/user/nav-bar/nav-bar.component";
import {AuthComponent} from "./component/user/auth/auth.component";
import {SignInComponent} from "./component/user/auth/sign-in/sign-in.component";
import {SubmitEmailComponent} from "./component/user/auth/submit-email/submit-email.component";
import {RouterModule} from "@angular/router";
import {router} from "./router";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    UserComponent,
    GeneralComponent,
    SignUpComponent,
    NavBarComponent,
    AuthComponent,
    SignInComponent,
    SubmitEmailComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(router),
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
