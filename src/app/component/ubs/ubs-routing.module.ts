import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UBSOrderFormComponent } from './components/ubs-order-form/ubs-order-form.component';
import { UbsComponent } from './ubs.component';

const ubsRoutes: Routes = [{
  path: '', component: UbsComponent, children: [
    {path: '', component: UBSOrderFormComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(ubsRoutes)],
  exports: [RouterModule]
})
export class UbsRoutingModule { }
