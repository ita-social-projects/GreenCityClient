import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DbTablesComponent } from './components/db-tables/db-tables.component';
import { TableListComponent } from './components/table-list/table-list.component';
import { TableViewComponent } from './components/table-view/table-view.component';
import { UbsDbDisplayRoutingModule } from './ubs-db-display-routing.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [DbTablesComponent, TableListComponent, TableViewComponent],
  imports: [CommonModule, UbsDbDisplayRoutingModule, FormsModule, SharedModule]
})
export class UbsDbDisplayModule {}
