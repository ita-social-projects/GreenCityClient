import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UbsFormComponent } from './components/ubs-form/ubs-form.component';
import { UbsComponent } from './ubs.component';

const ubsRoutes: Routes = [{
  path: '', component: UbsComponent, children: [
    {path: '', component: UbsFormComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(ubsRoutes)],
  exports: [RouterModule]
})
export class UbsRoutingModule { }
