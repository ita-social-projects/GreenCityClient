import { AdminTableService } from './services/admin-table.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UbsAdminTableComponent } from './components/ubs-admin-table/ubs-admin-table.component';
import { UbsSidebarComponent } from './components/ubs-sidebar/ubs-sidebar.component';
import { MaterialModule } from '../material.module';
import { SharedModule } from '../shared/shared.module';
import { UbsAdminCabinetComponent } from './components/ubs-admin-cabinet/ubs-admin-cabinet.component';

@NgModule({
  declarations: [UbsAdminTableComponent, UbsSidebarComponent, UbsAdminCabinetComponent],
  imports: [CommonModule, MaterialModule, SharedModule],
  providers: [AdminTableService],
  entryComponents: [UbsAdminTableComponent]
})
export class UbsAdminModule {}
