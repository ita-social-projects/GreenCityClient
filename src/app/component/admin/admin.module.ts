import { MatTableModule } from '@angular/material/table';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgFlashMessagesModule } from 'ng-flash-messages';
import { BrowserModule } from '@angular/platform-browser';
import { IconsModule, TableModule } from 'angular-bootstrap-md';
import { NgxPaginationModule } from 'ngx-pagination';
import {
  MAT_DIALOG_DATA,
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatCheckboxModule,
  MatDialogModule,
  MatDialogRef,
  MatIconModule,
  MatPaginatorModule,
  MatSelectModule,
  MatMenuModule
} from '@angular/material';
import { MatSortModule } from '@angular/material/sort';
import { PaginationModule } from 'ngx-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgSelectModule } from '@ng-select/ng-select';
import { AgmCoreModule } from '@agm/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../service/admin/admin.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationDialogService } from './services/confirmation-dialog-service.service';
import { AdminComponent } from './admin.component';
import { TranslateModule } from '@ngx-translate/core';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
import {
  AdminNavComponent,
  ConfirmModalComponent,
  ErrorComponent,
  DialogPhotoComponent,
  FeedbacksComponent,
  PlacesComponent,
  UpdateCafeComponent,
  UsersComponent
} from './components/index';

@NgModule({
  declarations: [
    AdminNavComponent,
    AdminComponent,
    PlacesComponent,
    UsersComponent,
    ErrorComponent,
    ConfirmModalComponent,
    UpdateCafeComponent,
    FeedbacksComponent,
    DialogPhotoComponent
  ],
  exports: [
    AdminNavComponent,
    AdminComponent,
    UsersComponent,
    PlacesComponent,
    ErrorComponent,
    BrowserModule,
    TableModule
  ],
  imports: [
    AdminRoutingModule,
    CommonModule,
    SharedModule,
    NgFlashMessagesModule,
    NgxPaginationModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    PaginationModule.forRoot(),
    BrowserAnimationsModule,
    RouterModule,
    FormsModule,
    MatMenuModule,
    MatIconModule,
    IconsModule,
    NgbModule,
    MatDialogModule,
    NgSelectModule,
    MatCheckboxModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyB3xs7Kczo46LFcQRFKPMdrE0lU4qsR_S4',
      libraries: ['places']
    }),
    TranslateModule
  ],
  providers: [
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}},
    {
      provide: MatDialogRef,
      useValue: {}
    },
    {
      provide: MAT_DIALOG_DATA,
      useValue: {}
    },
    ConfirmationDialogService,
    AdminService
  ],
  entryComponents: [ConfirmModalComponent, UpdateCafeComponent, DialogPhotoComponent],
  bootstrap: [AdminComponent],
})
export class AdminModule {}
