import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UbsAdminTableComponent } from './ubs-admin-table/ubs-admin-table.component';
import { BrowserModule } from '@angular/platform-browser';
import { MatSort} from '@angular/material/sort';
import { MatTableDataSource, MatCheckboxModule } from '@angular/material';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { UbsSidebarComponent } from './ubs-sidebar/ubs-sidebar.component';

@NgModule({
  declarations: [
    UbsAdminTableComponent,
    UbsSidebarComponent,

  ],
  imports: [
    CommonModule,
    BrowserModule,
    MatTableModule,
    MatSortModule,
    MatInputModule,
    MatPaginatorModule,
    DragDropModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCheckboxModule
  ],
  providers: [MatSort, MatTableDataSource],
  entryComponents: [
    UbsAdminTableComponent
  ],
})
export class UbsAdminModule { }
