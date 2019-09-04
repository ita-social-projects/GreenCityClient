import { NgModule } from '@angular/core';
import {ModerateRegisteredUsersComponent} from './moderate-registered-users.component';
import {BrowserModule} from '@angular/platform-browser';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import {CommonModule} from '@angular/common';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {AppComponent} from '../../app.component';
import {NgFlashMessagesModule} from 'ng-flash-messages';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    HttpClientModule,
    NgFlashMessagesModule.forRoot()
  ],
  exports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
})
export class ModerateRegisteredUsersModule { }
