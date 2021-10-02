import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UbsUserGuardGuard } from './ubs-user-guard.guard';
import { UbsUserComponent } from './ubs-user.component';
import { UbsUserOrdersComponent } from './ubs-user-orders/ubs-user-orders.component';
import { UbsClientBonusesComponent } from '../ubs-admin/components/ubs-client-bonuses/ubs-client-bonuses.component';
import { UbsUserMessagesComponent } from './ubs-user-messages/ubs-user-messages.component';
import { UbsUserBonusesComponent } from './ubs-user-bonuses/ubs-user-bonuses.component';
const routes: Routes = [
  {
    path: '',
    component: UbsUserComponent,
    canActivate: [UbsUserGuardGuard],

    children: [
      { path: 'orders', component: UbsUserOrdersComponent },
      { path: 'bonuses', component: UbsClientBonusesComponent },
      { path: `messages/:pageId`, component: UbsUserMessagesComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UbsUserRoutingModule {}
