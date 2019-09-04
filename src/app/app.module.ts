import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {NgxPaginationModule} from 'ngx-pagination';
import {PaginationModule} from 'ngx-bootstrap';
import {MatSelectModule, MatTableModule} from '@angular/material';
import {ModerateRegisteredUsersComponent} from './component/moderate-registered-users/moderate-registered-users.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgFlashMessagesModule} from 'ng-flash-messages';



@NgModule({
  declarations: [
    AppComponent,
    ModerateRegisteredUsersComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatTableModule,
    NgxPaginationModule,
    PaginationModule.forRoot(),
    MatSelectModule,
    BrowserAnimationsModule,
    NgFlashMessagesModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
