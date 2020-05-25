import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from './components/map-component/map.component';

const mapRoutes: Routes = [
    {
        path: '',
        component: MapComponent,
    },
];

@NgModule({
    imports: [ RouterModule.forChild(mapRoutes) ],
    exports: [ RouterModule ]
  })

export class MapRoutesModule {}
