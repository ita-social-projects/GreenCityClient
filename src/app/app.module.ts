import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import {router} from './router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AgmCoreModule} from '@agm/core';
import {MapComponent} from './component/user/map/map.component';
import {Ng2SearchPipeModule} from 'ng2-search-filter';
import {AdminComponent} from './component/admin/admin.component';
import {SignUpComponent} from './component/user/auth/sign-up/sign-up.component';
import {NavBarComponent} from './component/user/nav-bar/nav-bar.component';
import {GeneralComponent} from './component/general/general.component';
import {UserComponent} from './component/user/user.component';
import {AuthComponent} from './component/user/auth/auth.component';
import {SignInComponent} from './component/user/auth/sign-in/sign-in.component';
import {SubmitEmailComponent} from './component/user/auth/submit-email/submit-email.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {ModalModule} from './component/user/_modal/modal.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ProposeCafeComponent} from './component/user/propose-cafe/propose-cafe.component';
import {InterceptorService} from './service/interceptor.service';
import {AdminModule} from './component/admin/admin.module';
import {NgFlashMessagesModule} from 'ng-flash-messages';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  FavoritePlaceEditModalComponent,
  FavoritePlaceModalComponent,
  FvPlaceTableComponent
} from './component/user/favorite-place/fvplace-table';
import {MatSliderModule, MatTableModule, MatTreeModule} from '@angular/material';
import {MatIconModule} from '@angular/material/icon';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {FilterComponent} from './component/filter/filter.component';
import {Ng5SliderModule} from 'ng5-slider';
import {provideConfig} from './config/GoogleAuthConfig';
import {AuthServiceConfig, SocialLoginModule} from 'angularx-social-login';
import {AgmDirectionModule} from 'agm-direction';

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
    SubmitEmailComponent,
    MapComponent,
    ProposeCafeComponent,
    FvPlaceTableComponent,
    FavoritePlaceModalComponent,
    FavoritePlaceEditModalComponent,
    FilterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(router),
    HttpClientModule,
    FormsModule,
    SocialLoginModule,
    FormsModule,
    AgmCoreModule.forRoot({

      apiKey: '',
      libraries: ['places', 'geometry']
    }),
    AgmDirectionModule,
    Ng2SearchPipeModule,
    AdminModule,
    NgFlashMessagesModule.forRoot(),
    NgSelectModule,
    MatTableModule,
    MatIconModule,
    MDBBootstrapModule,
    ModalModule,
    ReactiveFormsModule,
    NgFlashMessagesModule.forRoot(),
    MatSliderModule,
    MatTreeModule,
    Ng5SliderModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    },
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
