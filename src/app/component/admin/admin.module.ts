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
import {MatPaginatorModule, MatSelectModule} from '@angular/material';
import { MatSortModule } from '@angular/material/sort';
import { PaginationModule } from 'ngx-bootstrap';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AdminNavComponent, PlacesComponent, UsersComponent, ErrorComponent],
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
    BrowserAnimationsModule
  ]
})
export class AdminModule { }
