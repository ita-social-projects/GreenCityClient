import { AdminTableService } from './services/admin-table.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UbsAdminTableComponent } from './components/ubs-admin-table/ubs-admin-table.component';
import { UbsSidebarComponent } from './components/ubs-sidebar/ubs-sidebar.component';
import { MaterialModule } from '../material.module';
import { SharedModule } from '../shared/shared.module';
import { UbsHeaderComponent } from './components/ubs-header/ubs-header.component';
import { UbsAdminComponent } from './ubs-admin.component';
import { UBSAdminRoutingModule } from './ubs-admin-routing.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [UbsAdminTableComponent, UbsSidebarComponent, UbsHeaderComponent, UbsAdminComponent],
  imports: [CommonModule, MaterialModule, SharedModule, RouterModule, UBSAdminRoutingModule, InfiniteScrollModule],
  providers: [AdminTableService],
  entryComponents: [UbsAdminTableComponent]
})
export class UbsAdminModule {}
