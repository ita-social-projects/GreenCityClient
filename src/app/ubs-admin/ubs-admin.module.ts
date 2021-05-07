import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UbsAdminComponent } from './ubs-admin.component';
import { AdminRoutingModule } from './admin-routing-module';

@NgModule({
  declarations: [UbsAdminComponent],
  exports: [UbsAdminComponent],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class UbsAdminModule { }
