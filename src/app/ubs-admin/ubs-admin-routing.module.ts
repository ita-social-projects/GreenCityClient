import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UbsAdminOrdersComponent } from './components/ubs-admin-orders/ubs-admin-orders.component';
import { UbsAdminTableComponent } from './components/ubs-admin-table/ubs-admin-table.component';
import { UbsAdminComponent } from './ubs-admin.component';

const ubsAdminRoutes: Routes = [
  {
    path: '',
    component: UbsAdminComponent,
    children: [
      { path: '', component: UbsAdminTableComponent },
      { path: 'orders', component: UbsAdminOrdersComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(ubsAdminRoutes)],
  exports: [RouterModule]
})
export class UBSAdminRoutingModule {}
