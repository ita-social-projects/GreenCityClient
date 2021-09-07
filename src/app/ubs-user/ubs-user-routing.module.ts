import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UbsUserComponent } from './ubs-user.component';

const routes: Routes = [
  {
    path: '',
    component: UbsUserComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UbsUserRoutingModule {}
