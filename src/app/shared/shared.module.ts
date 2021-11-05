import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { SpinnerComponent } from './spinner/spinner.component';
import { LocalizedCurrencyPipe } from './localized-currency-pipe/localized-currency.pipe';
import { VolumePipe } from './volume-pipe/volume.pipe';
import { DragDirective } from './drag-and-drop/dragDrop.directive';
import { CloseDropdownDirective } from './directives/close-dropdown.directive';
import { PhoneNumberTreatPipe } from './phone-number-treat/phone-number-treat.pipe';
import { ServerTranslatePipe } from './translate-pipe/translate-pipe.pipe';
import { UbsBaseSidebarComponent } from './ubs-base-sidebar/ubs-base-sidebar.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FilterListByLangPipe } from './sort-list-by-lang/filter-list-by-lang.pipe';

import { HeaderComponent } from './header/header.component';
import { SearchAllResultsComponent } from './search-all-results/search-all-results.component';
import { SearchItemComponent } from './search-item/search-item.component';
import { SearchPopupComponent } from './search-popup/search-popup.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { SearchNotFoundComponent } from './search-not-found/search-not-found.component';
import { UbsFooterComponent } from './ubs-footer/ubs-footer.component';

@NgModule({
  declarations: [
    SpinnerComponent,
    LocalizedCurrencyPipe,
    DragDirective,
    HeaderComponent,
    VolumePipe,
    CloseDropdownDirective,
    PhoneNumberTreatPipe,
    ServerTranslatePipe,
    SearchPopupComponent,
    UbsBaseSidebarComponent,
    HeaderComponent,
    FilterListByLangPipe,
    SearchAllResultsComponent,
    SearchItemComponent,
    SearchPopupComponent,
    SearchNotFoundComponent,
    UbsFooterComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    TranslateModule,
    RouterModule,
    InfiniteScrollModule,
    MatSnackBarModule,
    NgxPageScrollModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    SpinnerComponent,
    LocalizedCurrencyPipe,
    DragDirective,
    VolumePipe,
    CloseDropdownDirective,
    PhoneNumberTreatPipe,
    ServerTranslatePipe,
    UbsBaseSidebarComponent,
    FilterListByLangPipe,
    HeaderComponent,
    SearchPopupComponent,
    SearchAllResultsComponent,
    SearchItemComponent,
    SearchPopupComponent,
    SearchNotFoundComponent,
    UbsFooterComponent
  ]
})
export class SharedModule {}
