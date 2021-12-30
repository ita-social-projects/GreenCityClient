import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UbsOrderModule } from './ubs/ubs-order.module';
import { UbsAdminModule } from './ubs-admin/ubs-admin.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, UbsOrderModule, UbsAdminModule]
})
export class UbsModule {}
