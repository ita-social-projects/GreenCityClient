import { ConfirmRestorePasswordGuard } from './service/route-guards/confirm-restore-password.guard';
import { MainComponent } from './main.component';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
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
  MatTreeModule
} from '@angular/material';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AuthServiceConfig, SocialLoginModule } from 'angularx-social-login';
import { NgFlashMessagesModule } from 'ng-flash-messages';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
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

@NgModule({
  declarations: [MainComponent, ErrorComponent],
  imports: [
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
    NgxPaginationModule
  ],
  entryComponents: [MainComponent, ProposeCafeComponent, RestoreComponent, EditPhotoPopUpComponent, ErrorComponent],
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
    DatePipe,
    PendingChangesGuard,
    ConfirmRestorePasswordGuard
  ],
  exports: [MainComponent]
})
export class MainModule {}
