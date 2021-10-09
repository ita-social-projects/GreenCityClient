import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UbsAdminEmployeeComponent } from './components/ubs-admin-employee/ubs-admin-employee.component';
import { UbsAdminTableComponent } from './components/ubs-admin-table/ubs-admin-table.component';
import { UbsAdminComponent } from './ubs-admin.component';
import { UbsAdminOrderComponent } from './components/ubs-admin-order/ubs-admin-order.component';
import { UbsAdminGuardGuard } from './ubs-admin-guard.guard';
import { UbsAdminCertificateComponent } from './components/ubs-admin-certificate/ubs-admin-certificate.component';
import { UbsAdminTariffsComponent } from './components/ubs-admin-tariffs/ubs-admin-tariffs.component';

const ubsAdminRoutes: Routes = [
  {
    path: '',
    component: UbsAdminComponent,
    canActivate: [UbsAdminGuardGuard],
    children: [
      { path: 'certificates', component: UbsAdminCertificateComponent },
      { path: 'orders', component: UbsAdminTableComponent },
      { path: 'employee/:page', component: UbsAdminEmployeeComponent },
      { path: 'order', component: UbsAdminOrderComponent },
      { path: 'tariffs', component: UbsAdminTariffsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(ubsAdminRoutes)],
  exports: [RouterModule]
})
export class UBSAdminRoutingModule {}
