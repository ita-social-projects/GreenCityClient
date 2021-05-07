import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe, HashLocationStrategy } from '@angular/common';
import {
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatButtonModule,
  MatDialogModule,
  MatDialogRef,
  MatFormFieldModule,
  MatInputModule,
  MatRadioModule,
  MatSelectModule,
  MatSliderModule,
  MatTreeModule,
} from '@angular/material';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { LocationStrategy } from '@angular/common';
import { AuthServiceConfig, SocialLoginModule } from 'angularx-social-login';
import { NgFlashMessagesModule } from 'ng-flash-messages';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MainRoutingModule } from './main-routing-module';
import { provideConfig } from './config/GoogleAuthConfig';
import { environment } from '@environment/environment';
import { ProposeCafeComponent } from 'src/app/main/component/core/components';
import { AdminModule } from './component/admin/admin.module';
import { RestoreComponent } from 'src/app/main/component/auth/components/restore/restore.component';
import { InterceptorService } from './service/interceptors/interceptor.service';
import { CoreModule } from 'src/app/main/component/core/core.module';
import { AuthModule } from './component/auth/auth.module';
import { HomeModule } from './component/home/home.module';
import { LayoutModule } from './component/layout/layout.module';
import { EditPhotoPopUpComponent } from 'src/app/main/component/shared/components/edit-photo-pop-up/edit-photo-pop-up.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ErrorComponent } from 'src/app/main/component/errors/error/error.component';
import { PendingChangesGuard } from 'src/app/main/service/pending-changes-guard/pending-changes.guard';
import { MainComponent } from './main.component';


@NgModule({
  declarations: [MainComponent, ErrorComponent],
  exports: [MainComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MainRoutingModule,
    LayoutModule,
    MatDialogModule,
    AuthModule,
    CoreModule,
    HomeModule,
    InfiniteScrollModule,
    HttpClientModule,
    SocialLoginModule,
    FormsModule,
    AdminModule,
    NgFlashMessagesModule.forRoot(),
    ReactiveFormsModule,
    MatSliderModule,
    MatTreeModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    MatSelectModule,
    MatRadioModule,
    DragDropModule,
    NgxPaginationModule,
  ],
  entryComponents: [ProposeCafeComponent, RestoreComponent, EditPhotoPopUpComponent, ErrorComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true,
    },
    { provide: MatDialogRef, useValue: {} },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { hasBackdrop: false },
    },
    // we use HashLocationStrategy because
    // so it is to avoid collisions in two types of routes (BE and FE)
    // also this is to stylistically separate them from each other
    // Also some articles write that this is a well-known mistake of the angular SPA and gh-pages
    // and I didn't find how to solve it
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig,
    },
    DatePipe,
    PendingChangesGuard,
  ]
})export class MainModule { }
