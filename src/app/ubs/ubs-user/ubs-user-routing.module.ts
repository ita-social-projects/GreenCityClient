import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UbsUserComponent } from './ubs-user.component';
import { UbsUserOrdersComponent } from './components/ubs-user-orders/ubs-user-orders.component';
import { UbsUserMessagesComponent } from './components/ubs-user-messages/ubs-user-messages.component';
import { UbsUserBonusesComponent } from './components/ubs-user-bonuses/ubs-user-bonuses.component';
import { UbsUserProfilePageComponent } from './components/ubs-user-profile-page/ubs-user-profile-page.component';
import { UbsUserGuard } from '@ubs/ubs-user/guards/ubs-user-guard.guard';

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
