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
import { UbsClientProfilePageComponent } from './components/ubs-client-profile-page/ubs-client-profile-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UbsProfileChangePasswordPopUpComponent } from './components/ubs-client-profile-page/ubs-profile-change-password-pop-up/ubs-profile-change-password-pop-up.component';
import { UbsProfileDeletePopUpComponent } from './components/ubs-client-profile-page/ubs-profile-delete-pop-up/ubs-profile-delete-pop-up.component';

@NgModule({
  declarations: [
    UbsAdminTableComponent,
    UbsSidebarComponent,
    UbsHeaderComponent,
    UbsAdminComponent,
    UbsClientProfilePageComponent,
    UbsProfileChangePasswordPopUpComponent,
    UbsProfileDeletePopUpComponent
  ],
  imports: [CommonModule, MaterialModule, SharedModule, RouterModule, UBSAdminRoutingModule, ReactiveFormsModule],
  providers: [AdminTableService],
  entryComponents: [UbsAdminTableComponent, UbsProfileChangePasswordPopUpComponent, UbsProfileDeletePopUpComponent]
})
export class UbsAdminModule {}
