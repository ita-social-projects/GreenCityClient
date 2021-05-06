import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlacesComponent } from './places.component';

const mapRoutes: Routes = [
  {
    path: '',
    component: PlacesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(mapRoutes)],
  exports: [RouterModule]
})
export class PlacesRoutesModule {}
