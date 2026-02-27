import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { DragDirective } from './directives/drag-and-drop/dragDrop.directive';
import { CloseDropdownDirective } from './directives/close-dropdown.directive';
import { ServerTranslatePipe } from '@ubs/shared/pipes/translate-pipe/translate-pipe.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HeaderComponent } from './components/header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { FilterLocationListByLangPipe } from './pipes/filter-location-list-by-lang/filter-location-list-by-lang.pipe';
import { MaxTextLengthPipe } from './pipes/max-text-length-pipe/max-text-length.pipe';
import { DialogPopUpComponent } from './components/dialog-pop-up/dialog-pop-up.component';
import { SpacePreventDirective } from './directives/space-prevent.directive';
import { NewsListGalleryViewComponent } from '@shared/components/news-list-gallery-view/news-list-gallery-view.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { SafeHtmlTransformPipe } from './pipes/events-description-transforn/safe-html-transform.pipe';
import { LinkifyDirective } from 'src/app/shared/directives/linkify.directive';
import { RemoveLeadingZeroDirective } from 'src/app/shared/directives/remove-leading-zero/remove-leading-zero.directive';
import { RatingDisplayComponent } from 'src/app/greencity/shared/components/events-list-item/rating-display/rating-display.component';
import { RelativeDatePipe } from './pipes/relative-date/relative-date.pipe';
import { LangValueDirective } from './directives/lang-value/lang-value.directive';
import { GoogleMapsModule } from '@angular/google-maps';
import { InputGoogleAutocompleteComponent } from './components/input-google-autocomplete/input-google-autocomplete.component';
import { InputErrorComponent } from './components/input-error/input-error.component';
import { DateLocalisationPipe } from '@shared/pipes/date-localisation-pipe/date-localisation.pipe';
import { TrimValueDirective } from './directives/trim-value.directive';

@NgModule({
  declarations: [
    SpinnerComponent,
    DragDirective,
    HeaderComponent,
    CloseDropdownDirective,
    ServerTranslatePipe,
    FilterLocationListByLangPipe,
    MaxTextLengthPipe,
    DialogPopUpComponent,
    NewsListGalleryViewComponent,
    SpacePreventDirective,
    SafeHtmlTransformPipe,
    LinkifyDirective,
    InputGoogleAutocompleteComponent,
    RemoveLeadingZeroDirective,
    RatingDisplayComponent,
    RelativeDatePipe,
    LangValueDirective,
    InputErrorComponent,
    TrimValueDirective
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
    ImageCropperModule,
    DateLocalisationPipe
  ],
  exports: [
    SpinnerComponent,
    DragDirective,
    CloseDropdownDirective,
    ServerTranslatePipe,
    FilterLocationListByLangPipe,
    HeaderComponent,
    MaxTextLengthPipe,
    NewsListGalleryViewComponent,
    SpacePreventDirective,
    SafeHtmlTransformPipe,
    MaterialModule,
    LinkifyDirective,
    InputGoogleAutocompleteComponent,
    RemoveLeadingZeroDirective,
    RatingDisplayComponent,
    RelativeDatePipe,
    LangValueDirective,
    InputErrorComponent,
    InfiniteScrollModule,
    TrimValueDirective
  ]
})
export class SharedModule {}
