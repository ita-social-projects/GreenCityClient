import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UbsUserGuardGuard } from './ubs-user-guard.guard';
import { UbsUserComponent } from './ubs-user.component';
import { UbsUserOrdersComponent } from './ubs-user-orders/ubs-user-orders.component';
import { UbsUserBonusesComponent } from './ubs-user-bonuses/ubs-user-bonuses.component';
const routes: Routes = [
  {
    path: '',
    component: UbsUserComponent,
    canActivate: [UbsUserGuardGuard],

    children: [
      { path: 'orders', component: UbsUserOrdersComponent },
      { path: 'bonuses', component: UbsUserBonusesComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UbsUserRoutingModule {}
