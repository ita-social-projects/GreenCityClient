import { DragDropModule } from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MainComponent } from './main.component';
import { ConfirmRestorePasswordGuard } from './service/route-guards/confirm-restore-password.guard';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogRef } from '@angular/material/dialog';
import { CoreModule } from '@global-core/core.module';
import { ErrorComponent } from '@global-errors/error/error.component';
import { PendingChangesGuard } from '@global-service/pending-changes-guard/pending-changes.guard';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from '../material.module';
import { InterceptorService } from '../shared/interceptors/interceptor.service';
import { AuthModule } from './component/auth/auth.module';
import { HomeModule } from './component/home/home.module';
import { LayoutModule } from './component/layout/layout.module';

@NgModule({
  declarations: [MainComponent, ErrorComponent],
  imports: [
    NgbModule,
    LayoutModule,
    AuthModule,
    CoreModule,
    HomeModule,
    InfiniteScrollModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    NgxPaginationModule,
    MaterialModule,
    SharedModule
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
    DatePipe,
    PendingChangesGuard,
    ConfirmRestorePasswordGuard
  ],
  exports: [MainComponent]
})
export class MainModule {}
