import { AdminTableService } from './services/admin-table.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UbsAdminTableComponent } from './components/ubs-admin-table/ubs-admin-table.component';
import { UbsBaseSidebarComponent } from '../shared/ubs-base-sidebar/ubs-base-sidebar.component';
import { UbsAdminSidebarComponent } from './components/ubs-admin-sidebar/ubs-admin-sidebar.component';
import { MaterialModule } from '../material.module';
import { SharedModule } from '../shared/shared.module';
import { UbsHeaderComponent } from './components/ubs-header/ubs-header.component';
import { UbsAdminComponent } from './ubs-admin.component';
import { UBSAdminRoutingModule } from './ubs-admin-routing.module';

@NgModule({
  declarations: [UbsAdminTableComponent, UbsBaseSidebarComponent, UbsHeaderComponent, UbsAdminComponent, UbsAdminSidebarComponent],
  imports: [CommonModule, MaterialModule, SharedModule, RouterModule, UBSAdminRoutingModule],
  providers: [AdminTableService],
  entryComponents: [UbsAdminTableComponent]
})
export class UbsAdminModule {}
