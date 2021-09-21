import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UbsAdminOrdersComponent } from './components/ubs-admin-orders/ubs-admin-orders.component';
import { UbsAdminEmployeeComponent } from './components/ubs-admin-employee/ubs-admin-employee.component';
import { UbsClientProfilePageComponent } from './components/ubs-client-profile-page/ubs-client-profile-page.component';
import { UbsAdminTableComponent } from './components/ubs-admin-table/ubs-admin-table.component';
import { UbsAdminComponent } from './ubs-admin.component';
import { UbsAdminOrderComponent } from './components/ubs-admin-order/ubs-admin-order.component';
import { UbsClientBonusesComponent } from './components/ubs-client-bonuses/ubs-client-bonuses.component';
import { UbsAdminGuardGuard } from './ubs-admin-guard.guard';
import { UbsAdminCertificateComponent } from './components/ubs-admin-certificate/ubs-admin-certificate.component';

const ubsAdminRoutes: Routes = [
  {
    path: '',
    component: UbsAdminComponent,
    canActivate: [UbsAdminGuardGuard],
    children: [
      { path: '', component: UbsAdminOrdersComponent },
      { path: 'certificates', component: UbsAdminCertificateComponent },
      { path: 'orders', component: UbsAdminTableComponent },
      { path: 'employee/:page', component: UbsAdminEmployeeComponent },
      { path: 'profile', component: UbsClientProfilePageComponent },
      { path: 'order', component: UbsAdminOrderComponent },
      { path: 'bonuses', component: UbsClientBonusesComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(ubsAdminRoutes)],
  exports: [RouterModule]
})
export class UBSAdminRoutingModule {}
