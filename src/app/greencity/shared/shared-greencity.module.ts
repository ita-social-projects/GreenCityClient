import { UserSharedModule } from '../modules/user/components/shared/user-shared.module';
import { NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { EditPhotoPopUpComponent, WarningPopUpComponent } from './components';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DragAndDropComponent } from './components/drag-and-drop/drag-and-drop.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { DateLocalisationPipe } from '@shared/pipes/date-localisation-pipe/date-localisation.pipe';
import { NoDataComponent } from './components/no-data/no-data.component';
import { TagFilterComponent } from './components/tag-filter/tag-filter.component';
import { CalendarBaseComponent } from 'src/app/greencity/shared/components';
import usLocale from '@angular/common/locales/en';
import ukLocale from '@angular/common/locales/uk';
import { FormBaseComponent } from '../../shared/components/form-base/form-base.component';
import { HabitsPopupComponent } from 'src/app/greencity/modules/user/components/profile/calendar/habits-popup/habits-popup.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { EventsListItemComponent } from './components/events-list-item/events-list-item.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RatingModule } from 'ngx-bootstrap/rating';
import { EventsListItemModalComponent } from './components/events-list-item/events-list-item-modal/events-list-item-modal.component';
import { TagsSelectComponent } from './components/tags-select/tags-select.component';
import { SelectImagesComponent } from './components/select-images/select-images.component';
import { FilterSelectComponent } from './components/filter-select/filter-select.component';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SavedSectionComponent } from './components/saved-tabs/saved-section.component';
import { DragAndDropDirective } from 'src/app/greencity/modules/eco-news/directives/drag-and-drop.directive';

registerLocaleData(usLocale, 'en-GB');
registerLocaleData(ukLocale, 'uk');
registerLocaleData(ukLocale, 'uk-UA');

@NgModule({
  declarations: [
    DragAndDropDirective,
    DragAndDropComponent,
    EditPhotoPopUpComponent,
    NoDataComponent,
    TagFilterComponent,
    CalendarBaseComponent,
    WarningPopUpComponent,
    FormBaseComponent,
    HabitsPopupComponent,
    EventsListItemComponent,
    EventsListItemModalComponent,
    TagsSelectComponent,
    SelectImagesComponent,
    FilterSelectComponent,
    SavedSectionComponent
  ],
  imports: [
    ModalModule.forRoot(),
    RatingModule.forRoot(),
    MatIconModule,
    ImageCropperModule,
    SharedModule,
    FormsModule,
    CommonModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    FileUploadModule,
    MatCardModule,
    MatDialogModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    UserSharedModule,
    MatTooltipModule,
    MatOptionModule,
    MatDividerModule,
    MatInputModule,
    MatSelectModule,
    NgbModule,
    DateLocalisationPipe
  ],
  exports: [
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadModule,
    MatCardModule,
    MatDialogModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    DragAndDropDirective,
    DragAndDropComponent,
    NoDataComponent,
    TagFilterComponent,
    UserSharedModule,
    WarningPopUpComponent,
    FormBaseComponent,
    EventsListItemComponent,
    EventsListItemModalComponent,
    TagsSelectComponent,
    SelectImagesComponent,
    FilterSelectComponent,
    MatDividerModule,
    MatExpansionModule,
    SavedSectionComponent
  ],
  providers: [TranslateService]
})
export class SharedGreenCityModule {}

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}
