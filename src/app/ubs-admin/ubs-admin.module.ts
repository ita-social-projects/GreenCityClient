import { AdminTableService } from './services/admin-table.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { SharedModule } from '../shared/shared.module';
import { UBSAdminRoutingModule } from './ubs-admin-routing.module';
import { UbsAdminTableComponent } from './components/ubs-admin-table/ubs-admin-table.component';
import { UbsSidebarComponent } from './components/ubs-sidebar/ubs-sidebar.component';
import { UbsHeaderComponent } from './components/ubs-header/ubs-header.component';
import { UbsAdminComponent } from './ubs-admin.component';
import { UbsClientProfilePageComponent } from './components/ubs-client-profile-page/ubs-client-profile-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UbsAdminResponsiblePersonsComponent } from './components/ubs-admin-responsible-persons/ubs-admin-responsible-persons.component';
import { UbsAdminExportDetailsComponent } from './components/ubs-admin-export-details/ubs-admin-export-details.component';
import { UbsAdminOrderPaymentComponent } from './components/ubs-admin-order-payment/ubs-admin-order-payment.component';
import { UbsAdminOrderClientInfoComponent } from './components/ubs-admin-order-client-info/ubs-admin-order-client-info.component';
import { UbsAdminOrderDetailsFormComponent } from './components/ubs-admin-order-details-form/ubs-admin-order-details-form.component';
import { UbsAdminOrderStatusComponent } from './components/ubs-admin-order-status/ubs-admin-order-status.component';
import { UbsAdminOrderComponent } from './components/ubs-admin-order/ubs-admin-order.component';
import { UbsAdminAddressDetailsComponent } from './components/ubs-admin-address-details/ubs-admin-address-details.component';
import { UbsClientBonusesComponent } from './components/ubs-client-bonuses/ubs-client-bonuses.component';

@NgModule({
  declarations: [
    UbsAdminTableComponent,
    UbsSidebarComponent,
    UbsHeaderComponent,
    UbsAdminComponent,
    UbsClientProfilePageComponent,
    UbsAdminOrderComponent,
    UbsAdminAddressDetailsComponent,
    UbsAdminOrderStatusComponent,
    UbsAdminResponsiblePersonsComponent,
    UbsAdminExportDetailsComponent,
    UbsAdminOrderPaymentComponent,
    UbsAdminOrderClientInfoComponent,
    UbsAdminOrderDetailsFormComponent,
    UbsClientBonusesComponent
  ],
  imports: [CommonModule, MaterialModule, SharedModule, RouterModule, UBSAdminRoutingModule, FormsModule, ReactiveFormsModule],
  providers: [AdminTableService],
  entryComponents: [UbsAdminTableComponent]
})
export class UbsAdminModule {}
