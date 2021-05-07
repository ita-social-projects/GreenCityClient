import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainModule } from './main/main.module';
import { AppComponent } from './app.component';
import { UbsAdminModule } from './ubs-admin/ubs-admin.module';
import { AppRoutingModule } from './app-routing-module';
@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    MainModule,
    UbsAdminModule,
    AppRoutingModule
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
