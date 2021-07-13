import { UbsConfirmPageComponent } from './components/ubs-confirm-page/ubs-confirm-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthPageGuardService } from '@global-service/route-guards/auth-page-guard.service';
import { UBSOrderFormComponent } from './components/ubs-order-form/ubs-order-form.component';
import { UbsMainPageComponent } from './components/ubs-main-page/ubs-main-page.component';
import { UbsComponent } from './ubs.component';

const ubsRoutes: Routes = [
  {
    path: '',
    component: UbsComponent,
    canActivate: [AuthPageGuardService],
    children: [
      { path: 'home', component: UbsMainPageComponent },
      { path: '', component: UBSOrderFormComponent },
      { path: 'confirm', component: UbsConfirmPageComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(ubsRoutes)],
  exports: [RouterModule]
})
export class UbsRoutingModule {}
