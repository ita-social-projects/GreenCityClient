import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainModule } from './main/main.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { UbsAdminModule } from './ubs-admin/ubs-admin.module';
@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    MainModule,
    UbsAdminModule
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
