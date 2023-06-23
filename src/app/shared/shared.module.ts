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
import { MatTooltipModule } from '@angular/material/tooltip';

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
import { FilterLocationListByLangPipe } from './filter-location-list-by-lang/filter-location-list-by-lang.pipe';
import { MaxImageNamePipe } from '../ubs/ubs-admin/components/shared/max-image-name/max-image-name.pipe';
import { ShowImgsPopUpComponent } from './show-imgs-pop-up/show-imgs-pop-up.component';
import { DialogPopUpComponent } from './dialog-pop-up/dialog-pop-up.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { UBSAddAddressPopUpComponent } from './ubs-add-address-pop-up/ubs-add-address-pop-up.component';
import { UBSInputErrorComponent } from './ubs-input-error/ubs-input-error.component';
import { SpacePreventDirective } from './directives/space-prevent.directive';
import { LocalizedDatePipe } from './localized-date-pipe/localized-date.pipe';
import { TranslateDatePipe } from './translate-date-pipe/translate-date.pipe';
import { RepeatPipe } from './repeat-pipe/repeat.pipe';
import { CronPipe } from './cron-pipe/cron.pipe';
import { ResizableBottomSheetComponent } from './resizable-bottom-sheet/resizable-bottom-sheet.component';
import { NewsListGalleryViewComponent } from './news-list-gallery-view/news-list-gallery-view.component';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

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
    UbsFooterComponent,
    FilterLocationListByLangPipe,
    MaxImageNamePipe,
    ShowImgsPopUpComponent,
    DialogPopUpComponent,
    UBSAddAddressPopUpComponent,
    UBSInputErrorComponent,
    NewsListGalleryViewComponent,
    SpacePreventDirective,
    LocalizedDatePipe,
    TranslateDatePipe,
    RepeatPipe,
    CronPipe,
    ResizableBottomSheetComponent
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
    FormsModule,
    MatAutocompleteModule,
    MatTooltipModule,
    GooglePlaceModule
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
    FilterLocationListByLangPipe,
    HeaderComponent,
    SearchPopupComponent,
    SearchAllResultsComponent,
    SearchItemComponent,
    SearchPopupComponent,
    SearchNotFoundComponent,
    UbsFooterComponent,
    MaxImageNamePipe,
    UBSAddAddressPopUpComponent,
    UBSInputErrorComponent,
    NewsListGalleryViewComponent,
    SpacePreventDirective,
    LocalizedDatePipe,
    TranslateDatePipe,
    RepeatPipe,
    CronPipe,
    ResizableBottomSheetComponent
  ]
})
export class SharedModule {}
