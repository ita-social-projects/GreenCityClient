import {MatTableModule} from '@angular/material/table';

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdminNavComponent} from './admin-nav/admin-nav.component';
import {PlacesComponent} from './places/places.component';
import {UsersComponent} from './users/users.component';
import {NgFlashMessagesModule} from 'ng-flash-messages';
import {ErrorComponent} from '../general/error/error.component';
import {BrowserModule} from '@angular/platform-browser';
import {TableModule} from 'angular-bootstrap-md';
import {NgxPaginationModule} from 'ngx-pagination';
import {
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatCheckboxModule,
  MatDialogModule,
  MatPaginatorModule,
  MatSelectModule
} from '@angular/material';
import { MatSortModule } from '@angular/material/sort';
import { PaginationModule } from 'ngx-bootstrap';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { UpdateCafeComponent } from './update-cafe/update-cafe.component';
import {NgSelectModule} from "@ng-select/ng-select";
import {AgmCoreModule} from "@agm/core";
import {FormsModule} from "@angular/forms";
import {ProposeCafeComponent} from "../user/propose-cafe/propose-cafe.component";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {InterceptorService} from "../../service/interceptor.service";
import {AppComponent} from "../../app.component";
import {AdminComponent} from "./admin.component";

@NgModule({
  declarations: [AdminNavComponent, PlacesComponent, UsersComponent, ErrorComponent, UpdateCafeComponent],
  exports: [
    AdminNavComponent,
    UsersComponent,
    PlacesComponent,
    ErrorComponent,
    BrowserModule,
    TableModule
  ],
  imports: [
    CommonModule,
    NgFlashMessagesModule,
    NgxPaginationModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    PaginationModule.forRoot(),
    BrowserAnimationsModule,
    MatDialogModule,
    NgSelectModule,
    MatCheckboxModule,
    FormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC7q2v0VgRy60dAoItfv3IJhfJQEEoeqCI',
      libraries: ['places']
    }),
  ],
  providers: [
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}
  ],
  bootstrap: [AdminComponent],
  entryComponents: [UpdateCafeComponent]
})
export class AdminModule { }
