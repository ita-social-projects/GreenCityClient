import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UbsAdminComponent } from './ubs-admin.component';

export const routes: Routes = [
  {
    path: '',
    component: UbsAdminComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
