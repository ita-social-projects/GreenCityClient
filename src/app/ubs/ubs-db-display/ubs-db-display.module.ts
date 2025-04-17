import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DbTablesComponent } from './components/db-tables/db-tables.component';
import { TableListComponent } from './components/table-list/table-list.component';
import { TableViewComponent } from './components/table-view/table-view.component';

@NgModule({
  declarations: [DbTablesComponent, TableListComponent, TableViewComponent],
  imports: [CommonModule]
})
export class UbsDbDisplayModule {}
