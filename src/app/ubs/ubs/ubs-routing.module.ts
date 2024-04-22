import { UbsConfirmPageComponent } from './components/ubs-confirm-page/ubs-confirm-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthPageGuardService } from '@global-service/route-guards/auth-page-guard.service';
import { UBSOrderFormComponent } from './components/ubs-order-form/ubs-order-form.component';
import { UbsOrderComponent } from './ubs-order.component';
import { UbsMainPageComponent } from './components/ubs-main-page/ubs-main-page.component';
import { UbsSubmitOrderNotificationComponent } from './components/ubs-submit-order/ubs-submit-order-notification/ubs-submit-order-notification.component';
import { ConfirmRestorePasswordComponent } from '@global-auth/confirm-restore-password/confirm-restore-password.component';
import { ConfirmRestorePasswordGuard } from '@global-service/route-guards/confirm-restore-password.guard';
import { UBSOrderDetailsComponent } from './components/ubs-order-details/ubs-order-details.component';
import { PreventNavigationBackGuard } from 'src/app/shared/guards/prevent-navigation-back.guard';

const ubsRoutes: Routes = [
  {
    path: '',
    component: UbsOrderComponent,
    children: [
      { path: '', component: UbsMainPageComponent },
      { path: 'order', component: UBSOrderFormComponent, canActivate: [AuthPageGuardService], canDeactivate: [PreventNavigationBackGuard] },
      { path: 'confirm', component: UbsConfirmPageComponent, canActivate: [AuthPageGuardService] },
      { path: `notification/confirm/:orderId`, component: UbsSubmitOrderNotificationComponent, canActivate: [AuthPageGuardService] },
      { path: 'auth/restore', component: ConfirmRestorePasswordComponent, canActivate: [ConfirmRestorePasswordGuard] },
      { path: 'ubs/order/:isThisExistingOrder', component: UBSOrderDetailsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(ubsRoutes)],
  exports: [RouterModule]
})
export class UbsRoutingModule {}
