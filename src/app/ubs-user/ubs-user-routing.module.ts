import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UbsUserGuardGuard } from './ubs-user-guard.guard';
import { UbsUserComponent } from './ubs-user.component';

const routes: Routes = [
  {
    path: '',
    component: UbsUserComponent,
    canActivate: [UbsUserGuardGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UbsUserRoutingModule {}
