import { UbsAdminCustomerViolationsComponent } from './components/ubs-admin-customers/ubs-admin-customer-violations/ubs-admin-customer-violations/ubs-admin-customer-violations.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UbsAdminEmployeeComponent } from './components/ubs-admin-employee/ubs-admin-employee.component';
import { UbsAdminTableComponent } from './components/ubs-admin-table/ubs-admin-table.component';
import { UbsAdminComponent } from './ubs-admin.component';
import { UbsAdminOrderComponent } from './components/ubs-admin-order/ubs-admin-order.component';
import { UbsAdminGuardGuard } from './ubs-admin-guard.guard';
import { UbsAdminCertificateComponent } from './components/ubs-admin-certificate/ubs-admin-certificate.component';
import { UbsAdminCustomersComponent } from './components/ubs-admin-customers/ubs-admin-customers.component';
import { UbsAdminTariffsLocationDashboardComponent } from './components/ubs-admin-tariffs/ubs-admin-tariffs-location-dashboard.component';
import { UbsAdminTariffsPricingPageComponent } from './components/ubs-admin-tariffs/ubs-admin-tariffs-pricing-page/ubs-admin-tariffs-pricing-page.component';
import { UbsAdminCustomerDetailsComponent } from './components/ubs-admin-customers/ubs-admin-customer-details/ubs-admin-customer-details.component';
import { UbsAdminCustomerOrdersComponent } from './components/ubs-admin-customers/ubs-admin-customer-orders/ubs-admin-customer-orders.component';
import { UbsAdminNotificationListComponent } from './components/ubs-admin-notification-list/ubs-admin-notification-list.component';
import { UbsAdminNotificationComponent } from './components/ubs-admin-notification/ubs-admin-notification.component';

const ubsAdminRoutes: Routes = [
  {
    path: '',
    component: UbsAdminComponent,
    canActivate: [UbsAdminGuardGuard],
    children: [
      { path: 'customers', component: UbsAdminCustomersComponent },
      { path: 'customers/:username', component: UbsAdminCustomerDetailsComponent },
      { path: 'certificates', component: UbsAdminCertificateComponent },
      { path: 'orders', component: UbsAdminTableComponent },
      { path: 'employee/:page', component: UbsAdminEmployeeComponent },
      { path: 'tariffs', component: UbsAdminTariffsLocationDashboardComponent },
      { path: `tariffs/location/:id`, component: UbsAdminTariffsPricingPageComponent },
      { path: `customerOrders/:id`, component: UbsAdminCustomerOrdersComponent },
      { path: `customerViolations/:id`, component: UbsAdminCustomerViolationsComponent },
      { path: 'notifications', component: UbsAdminNotificationListComponent },
      { path: 'notification/:id', component: UbsAdminNotificationComponent }
    ]
  },
  { path: 'order/:id', component: UbsAdminOrderComponent }
];

@NgModule({
  imports: [RouterModule.forChild(ubsAdminRoutes)],
  exports: [RouterModule]
})
export class UBSAdminRoutingModule {}
