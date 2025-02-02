import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { SpinnerComponent } from './spinner/spinner.component';
import { DragDirective } from './directives/drag-and-drop/dragDrop.directive';
import { CloseDropdownDirective } from './directives/close-dropdown.directive';
import { ServerTranslatePipe } from '../ubs/shared/pipes/translate-pipe/translate-pipe.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';

import { HeaderComponent } from './components/header/header.component';
import { SearchAllResultsComponent } from './search-all-results/search-all-results.component';
import { SearchItemComponent } from './search-item/search-item.component';
import { SearchPopupComponent } from './search-popup/search-popup.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { SearchNotFoundComponent } from './search-not-found/search-not-found.component';
import { FilterLocationListByLangPipe } from './pipes/filter-location-list-by-lang/filter-location-list-by-lang.pipe';
import { MaxTextLengthPipe } from './pipes/max-text-length-pipe/max-text-length.pipe';
import { DialogPopUpComponent } from './components/dialog-pop-up/dialog-pop-up.component';
import { SpacePreventDirective } from './directives/space-prevent.directive';
import { TranslateDatePipe } from './translate-date-pipe/translate-date.pipe';
import { ResizableBottomSheetComponent } from './resizable-bottom-sheet/resizable-bottom-sheet.component';
import { NewsListGalleryViewComponent } from './news-list-gallery-view/news-list-gallery-view.component';
import { CorrectUnitPipe } from './correct-unit-pipe/correct-unit.pipe';
import { ImageCropperModule } from 'ngx-image-cropper';
import { SafeHtmlTransformPipe } from './events-description-transforn/safe-html-transform.pipe';
import { LinkifyDirective } from 'src/app/shared/directives/linkify.directive';
import { RemoveLeadingZeroDirective } from 'src/app/shared/directives/remove-leading-zero/remove-leading-zero.directive';
import { RatingDisplayComponent } from 'src/app/shared/rating-display/rating-display.component';
import { RelativeDatePipe } from './relative-date.pipe';
import { EditImagePopUpComponent } from './edit-image-pop-up/edit-image-pop-up.component';
import { LangValueDirective } from './directives/lang-value/lang-value.directive';
import { GoogleMapsModule } from '@angular/google-maps';
import { InputGoogleAutocompleteComponent } from './components/input-google-autocomplete/input-google-autocomplete.component';

@NgModule({
  declarations: [
    SpinnerComponent,
    DragDirective,
    HeaderComponent,
    CloseDropdownDirective,
    ServerTranslatePipe,
    SearchPopupComponent,
    HeaderComponent,
    SearchAllResultsComponent,
    SearchItemComponent,
    SearchNotFoundComponent,
    FilterLocationListByLangPipe,
    MaxTextLengthPipe,
    DialogPopUpComponent,
    NewsListGalleryViewComponent,
    SpacePreventDirective,
    TranslateDatePipe,
    ResizableBottomSheetComponent,
    CorrectUnitPipe,
    SafeHtmlTransformPipe,
    LinkifyDirective,
    InputGoogleAutocompleteComponent,
    RemoveLeadingZeroDirective,
    RatingDisplayComponent,
    RelativeDatePipe,
    EditImagePopUpComponent,
    LangValueDirective
  ],
  imports: [
    CommonModule,
    MaterialModule,
    TranslateModule,
    RouterModule,
    InfiniteScrollModule,
    NgxPageScrollModule,
    ReactiveFormsModule,
    FormsModule,
    MatTooltipModule,
    GoogleMapsModule,
    ImageCropperModule
  ],
  exports: [
    SpinnerComponent,
    DragDirective,
    CloseDropdownDirective,
    ServerTranslatePipe,
    FilterLocationListByLangPipe,
    HeaderComponent,
    SearchAllResultsComponent,
    SearchItemComponent,
    SearchPopupComponent,
    SearchNotFoundComponent,
    MaxTextLengthPipe,
    NewsListGalleryViewComponent,
    SpacePreventDirective,
    TranslateDatePipe,
    SafeHtmlTransformPipe,
    ResizableBottomSheetComponent,
    CorrectUnitPipe,
    MaterialModule,
    LinkifyDirective,
    InputGoogleAutocompleteComponent,
    RemoveLeadingZeroDirective,
    RatingDisplayComponent,
    RelativeDatePipe,
    LangValueDirective
  ]
})
export class SharedModule {}
