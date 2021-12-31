import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UbsOrderModule } from './ubs/ubs-order.module';
import { UbsAdminModule } from './ubs-admin/ubs-admin.module';
import { UbsUserModule } from './ubs-user/ubs-user.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, UbsOrderModule, UbsAdminModule, UbsUserModule]
})
export class UbsModule {}
