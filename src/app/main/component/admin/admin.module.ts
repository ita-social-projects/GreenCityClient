import { MatTableModule } from '@angular/material/table';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { IconsModule, TableModule } from 'angular-bootstrap-md';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { PaginationModule } from 'ngx-bootstrap/pagination';
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
import { SharedMainModule } from '../shared/shared-main.module';
import { MatSelectModule } from '@angular/material/select';
import {
  AdminNavComponent,
  ConfirmModalComponent,
  ErrorComponent,
  DialogPhotoComponent,
  FeedbacksComponent,
  OldPlacesComponent,
  UpdateCafeComponent,
  UsersComponent
} from './components/index';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { environment } from '@environment/environment';

@NgModule({
  declarations: [
    AdminNavComponent,
    AdminComponent,
    OldPlacesComponent,
    UsersComponent,
    ErrorComponent,
    ConfirmModalComponent,
    UpdateCafeComponent,
    FeedbacksComponent,
    DialogPhotoComponent
  ],
  exports: [AdminNavComponent, AdminComponent, UsersComponent, OldPlacesComponent, ErrorComponent, BrowserModule, TableModule],
  imports: [
    AdminRoutingModule,
    CommonModule,
    SharedMainModule,
    SharedModule,
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
      apiKey: environment.apiMapKey,
      libraries: ['places']
    }),
    TranslateModule
  ],
  providers: [
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },
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
  bootstrap: [AdminComponent]
})
export class AdminModule {}
