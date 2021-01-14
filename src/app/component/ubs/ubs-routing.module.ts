import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UbsAboutComponent } from './components/ubs-about/ubs-about.component';
import { UbsFormComponent } from './components/ubs-form/ubs-form.component';
import { UbsComponent } from './ubs.component';

const ubsRoutes: Routes = [
  {
    path: '', component: UbsComponent, children: [
      {path: '', component: UbsAboutComponent},
      {path: 'form', component: UbsFormComponent}
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(ubsRoutes)],
  exports: [RouterModule]
})
export class UbsRoutingModule { }
