import { UbsConfirmPageComponent } from './components/ubs-confirm-page/ubs-confirm-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthPageGuardService } from '@global-service/route-guards/auth-page-guard.service';
import { UBSOrderFormComponent } from './components/ubs-order-form/ubs-order-form.component';
import { UbsComponent } from './ubs.component';
import { UbsMainPageComponent } from './components/ubs-main-page/ubs-main-page.component';

const ubsRoutes: Routes = [
  {
    path: '',
    component: UbsComponent,
    children: [
      { path: '', component: UbsMainPageComponent },
      { path: 'order', component: UBSOrderFormComponent, canActivate: [AuthPageGuardService] },
      { path: 'confirm', component: UbsConfirmPageComponent, canActivate: [AuthPageGuardService] }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(ubsRoutes)],
  exports: [RouterModule]
})
export class UbsRoutingModule {}
