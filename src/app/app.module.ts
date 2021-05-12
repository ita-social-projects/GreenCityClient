import { AppRoutingModule } from './app-routing.module';
import { MainModule } from './main/main.module';
import { UbsAdminComponent } from './ubs-admin/ubs-admin/ubs-admin.component';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HashLocationStrategy } from '@angular/common';
import { LocationStrategy } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    UbsAdminComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MainModule,
    HttpClientModule
  ],
  providers: [
    // we use HashLocationStrategy because
    // so it is to avoid collisions in two types of routes (BE and FE)
    // also this is to stylistically separate them from each other
    // Also some articles write that this is a well-known mistake of the angular SPA and gh-pages
    // and I didn't find how to solve it
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
