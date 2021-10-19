import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { SpinnerComponent } from './spinner/spinner.component';
import { LocalizedCurrencyPipe } from './localized-currency-pipe/localized-currency.pipe';
import { VolumePipe } from './volume-pipe/volume.pipe';
import { DragDirective } from './drag-and-drop/dragDrop.directive';
import { CloseDropdownDirective } from './directives/close-dropdown.directive';
import { PhoneNumberTreatPipe } from './phone-number-treat/phone-number-treat.pipe';
import { UbsBaseSidebarComponent } from './ubs-base-sidebar/ubs-base-sidebar.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import {
  HeaderComponent,
  SearchAllResultsComponent,
  SearchItemComponent,
  SearchNotFoundComponent,
  SearchPopupComponent
} from '../main/component/layout/components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxPageScrollModule } from 'ngx-page-scroll';

@NgModule({
  exports: [
    SpinnerComponent,
    LocalizedCurrencyPipe,
    DragDirective,
    VolumePipe,
    CloseDropdownDirective,
    PhoneNumberTreatPipe,
    UbsBaseSidebarComponent,
    HeaderComponent,
    SearchPopupComponent
  ],
  declarations: [
    SpinnerComponent,
    LocalizedCurrencyPipe,
    DragDirective,
    VolumePipe,
    CloseDropdownDirective,
    PhoneNumberTreatPipe,
    UbsBaseSidebarComponent,
    HeaderComponent,
    SearchPopupComponent,
    SearchItemComponent,
    SearchNotFoundComponent,
    SearchAllResultsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    TranslateModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    MatSnackBarModule,
    NgxPageScrollModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class SharedModule {}
