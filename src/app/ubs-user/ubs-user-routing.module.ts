import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UbsUserGuardGuard } from './ubs-user-guard.guard';
import { UbsUserComponent } from './ubs-user.component';
import { UbsClientBonusesComponent } from '../ubs-admin/components/ubs-client-bonuses/ubs-client-bonuses.component';
import { UbsClientProfilePageComponent } from '../ubs-admin/components/ubs-client-profile-page/ubs-client-profile-page.component';

const routes: Routes = [
  {
    path: '',
    component: UbsUserComponent,
    canActivate: [UbsUserGuardGuard],
    children: [
      { path: 'bonuses', component: UbsClientBonusesComponent },
      { path: 'profile', component: UbsClientProfilePageComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UbsUserRoutingModule {}
