import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UbsAdminOrdersComponent } from './components/ubs-admin-orders/ubs-admin-orders.component';
import { UbsClientProfilePageComponent } from './components/ubs-client-profile-page/ubs-client-profile-page.component';
import { UbsAdminTableComponent } from './components/ubs-admin-table/ubs-admin-table.component';
import { UbsAdminComponent } from './ubs-admin.component';
import { UbsAdminOrderComponent } from './components/ubs-admin-order/ubs-admin-order.component';

const ubsAdminRoutes: Routes = [
  {
    path: '',
    component: UbsAdminComponent,
    children: [
      { path: '', component: UbsAdminTableComponent },
      { path: 'orders', component: UbsAdminOrdersComponent },
      { path: 'profile', component: UbsClientProfilePageComponent },
      { path: 'order', component: UbsAdminOrderComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(ubsAdminRoutes)],
  exports: [RouterModule]
})
export class UBSAdminRoutingModule {}
