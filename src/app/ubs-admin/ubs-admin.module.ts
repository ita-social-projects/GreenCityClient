import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UbsAdminComponent } from './ubs-admin.component';



@NgModule({
  declarations: [UbsAdminComponent],
  exports: [UbsAdminComponent],
  imports: [
    CommonModule
  ]
})
export class UbsAdminModule { }
