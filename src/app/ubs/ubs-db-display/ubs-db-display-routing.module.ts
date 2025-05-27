import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DbTablesComponent } from './components/db-tables/db-tables.component';

const routes: Routes = [
  {
    path: '',
    component: DbTablesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UbsDbDisplayRoutingModule {}
