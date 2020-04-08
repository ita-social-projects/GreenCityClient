import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from './map-component/map.component';

const mapRoutes: Routes = [
    {
        path: 'map',
        component: MapComponent,
    },
]

@NgModule({
    imports: [RouterModule.forChild(mapRoutes)],
    exports: [RouterModule]
  })

export class MapRoutesModule {}
