import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatSortModule } from '@angular/material/sort';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacySliderModule as MatSliderModule } from '@angular/material/legacy-slider';
import { MatTreeModule } from '@angular/material/tree';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';

@NgModule({
  imports: [
    MatTableModule,
    MatSortModule,
    MatInputModule,
    MatPaginatorModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    DragDropModule,
    MatDialogModule,
    MatSliderModule,
    MatTreeModule,
    MatSelectModule,
    MatRadioModule,
    MatMenuModule,
    MatProgressBarModule
  ],
  exports: [
    MatTableModule,
    MatSortModule,
    MatInputModule,
    MatPaginatorModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    DragDropModule,
    MatDialogModule,
    MatSliderModule,
    MatTreeModule,
    MatSelectModule,
    MatRadioModule,
    MatMenuModule,
    MatProgressBarModule
  ]
})
export class MaterialModule {}
