import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { router } from './router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { MapComponent } from './component/user/map/map.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SignUpComponent } from './component/user/auth/sign-up/sign-up.component';
import { NavBarComponent } from './component/user/nav-bar/nav-bar.component';
import { GeneralComponent } from './component/general/general.component';
import { UserComponent } from './component/user/user.component';
import { AuthComponent } from './component/user/auth/auth.component';
import { SignInComponent } from './component/user/auth/sign-in/sign-in.component';
import { SubmitEmailComponent } from './component/user/auth/submit-email/submit-email.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalModule } from './component/user/_modal/modal.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ProposeCafeComponent } from './component/user/propose-cafe/propose-cafe.component';
import { InterceptorService } from './service/interceptor.service';
import { AdminModule } from './component/admin/admin.module';
import { NgFlashMessagesModule } from 'ng-flash-messages';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FilterComponent } from './component/filter/filter.component';
import {
  DeleteFavoriteComponent,
  EditFavoriteNameComponent,
  FavoritePlaceComponent
} from './component/user/favorite-place/favorite-place.component';
import { AuthServiceConfig, SocialLoginModule } from 'angularx-social-login';
import { AgmDirectionModule } from 'agm-direction';
import { DatePipe } from '@angular/common';
import {
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatDialogRef,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatRadioModule,
  MatSelectModule,
  MatSliderModule,
  MatTableModule,
  MatTreeModule
} from '@angular/material';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { Ng5SliderModule } from 'ng5-slider';
import { provideConfig } from './config/GoogleAuthConfig';
import { RestoreComponent } from './component/user/restore/restore.component';
import { RestoreFormComponent } from './component/user/restore-form/restore-form.component';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { FileUploadModule } from 'ng2-file-upload';
import { AddCommentComponent } from './component/user/add-comment/add-comment.component';
import { RatingModule } from 'ngx-bootstrap';
import { PhotoUploadComponent } from './component/user/photo-upload/photo-upload.component';
import { UserSettingComponent } from './component/user/user-setting/user-setting.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserHabitPageComponent } from './component/user/habit/user-habit-page/user-habit-page.component';
import { LowerNavBarComponent } from './component/user/lower-nav-bar/lower-nav-bar.component';
import { UserLogComponentComponent } from './component/user/habit/day-statistics/user-log-component/user-log-component.component';
import { ButtonComponentComponent } from './component/user/habit/day-statistics/button-component/button-component.component';

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    GeneralComponent,
    SignUpComponent,
    NavBarComponent,
    AuthComponent,
    SignInComponent,
    SubmitEmailComponent,
    MapComponent,
    ProposeCafeComponent,
    FilterComponent,
    FavoritePlaceComponent,
    EditFavoriteNameComponent,
    DeleteFavoriteComponent,
    RestoreComponent,
    RestoreFormComponent,
    PhotoUploadComponent,
    AddCommentComponent,
    UserSettingComponent,
    UserHabitPageComponent,
    LowerNavBarComponent,
    UserLogComponentComponent,
    ButtonComponentComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(router),
    HttpClientModule,
    SocialLoginModule,
    FormsModule,
    FileUploadModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC7q2v0VgRy60dAoItfv3IJhfJQEEoeqCI',
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
    MatSliderModule,
    MatTreeModule,
    Ng5SliderModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    MatCardModule,
    RatingModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    NgbModule
  ],
  entryComponents: [
    ProposeCafeComponent,
    FavoritePlaceComponent,
    EditFavoriteNameComponent,
    RestoreComponent,
    DeleteFavoriteComponent,
    UserSettingComponent,
    AddCommentComponent
  ],

  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    },
    { provide: MatDialogRef, useValue: {} },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { hasBackdrop: false }
    },
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    },
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
