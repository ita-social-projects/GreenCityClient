import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UbsUserComponent } from './ubs-user.component';
import { UbsUserOrdersComponent } from './ubs-user-orders/ubs-user-orders.component';
import { UbsUserMessagesComponent } from './ubs-user-messages/ubs-user-messages.component';
import { UbsUserBonusesComponent } from './ubs-user-bonuses/ubs-user-bonuses.component';
import { UbsUserProfilePageComponent } from './ubs-user-profile-page/ubs-user-profile-page.component';
import { UbsUserGuard } from '@ubs/ubs-user/ubs-user-guard.guard';

const routes: Routes = [
  {
    path: '',
    component: UbsUserComponent,
    canActivate: [UbsUserGuard],
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
