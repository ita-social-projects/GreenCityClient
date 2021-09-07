import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatButtonToggleModule,
  MatCheckboxModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSortModule,
  MatTableModule,
  MatToolbarModule,
  MatTreeModule,
  MatMenuModule,
  MAT_RADIO_DEFAULT_OPTIONS
} from '@angular/material';
import { DragDropModule } from '@angular/cdk/drag-drop';

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
    MatMenuModule
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
    MatMenuModule
  ]
  //   providers: [{
  //     provide: MAT_RADIO_DEFAULT_OPTIONS,
  //     useValue: { color: 'accent' },
  // }]
})
export class MaterialModule {}
