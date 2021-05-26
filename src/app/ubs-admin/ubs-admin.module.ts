import { AdminTableService } from './services/admin-table.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UbsAdminTableComponent } from './components/ubs-admin-table/ubs-admin-table.component';
import { UbsSidebarComponent } from './components/ubs-sidebar/ubs-sidebar.component';
import { MaterialModule } from '../material.module';

@NgModule({
  declarations: [UbsAdminTableComponent, UbsSidebarComponent],
  imports: [CommonModule, MaterialModule],
  providers: [AdminTableService],
  entryComponents: [UbsAdminTableComponent]
})
export class UbsAdminModule {}
