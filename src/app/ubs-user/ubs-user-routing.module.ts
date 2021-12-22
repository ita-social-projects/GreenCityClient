import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UbsUserGuardGuard } from './ubs-user-guard.guard';
import { UbsUserComponent } from './ubs-user.component';
import { UbsUserOrdersComponent } from './ubs-user-orders/ubs-user-orders.component';
import { UbsUserMessagesComponent } from './ubs-user-messages/ubs-user-messages.component';
import { UbsUserBonusesComponent } from './ubs-user-bonuses/ubs-user-bonuses.component';
import { UbsUserProfilePageComponent } from './ubs-user-profile-page/ubs-user-profile-page.component';

const routes: Routes = [
  {
    path: '',
    component: UbsUserComponent,
    canActivate: [UbsUserGuardGuard],
    children: [
      { path: 'profile', component: UbsUserProfilePageComponent },
      { path: 'orders', component: UbsUserOrdersComponent },
      { path: 'bonuses', component: UbsUserBonusesComponent },
      { path: `messages/:pageId`, component: UbsUserMessagesComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UbsUserRoutingModule {}
