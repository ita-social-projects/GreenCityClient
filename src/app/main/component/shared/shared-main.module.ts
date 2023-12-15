import { UserSharedModule } from '../user/components/shared/user-shared.module';
import { NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FileUploadModule } from 'ng2-file-upload';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { WarningPopUpComponent, PhotoUploadComponent, EditPhotoPopUpComponent } from './components';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { DragAndDropDirective } from '../eco-news/directives/drag-and-drop.directive';
import { DragAndDropComponent } from './components/drag-and-drop/drag-and-drop.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { DateLocalisationPipe } from '@pipe/date-localisation-pipe/date-localisation.pipe';
import { NoDataComponent } from './components/no-data/no-data.component';
import { TagFilterComponent } from './components/tag-filter/tag-filter.component';
import { CalendarBaseComponent } from '@shared/components';
import usLocale from '@angular/common/locales/en-US-POSIX';
import ruLocale from '@angular/common/locales/ru';
import ukLocale from '@angular/common/locales/uk';
import { FormBaseComponent } from './components/form-base/form-base.component';
import { HabitsPopupComponent } from '@global-user/components/profile/calendar/habits-popup/habits-popup.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { EventsListItemComponent } from './components/events-list-item/events-list-item.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RatingModule } from 'ngx-bootstrap/rating';
import { EventsListItemModalComponent } from './components/events-list-item/events-list-item-modal/events-list-item-modal.component';
import { TagsSelectComponent } from './components/tags-select/tags-select.component';
import { InputErrorComponent } from './components/input-error/input-error.component';
import { SelectImagesComponent } from './components/select-images/select-images.component';
import { FilterSelectComponent } from './components/filter-select/filter-select.component';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatExpansionModule } from '@angular/material/expansion';

registerLocaleData(usLocale, 'en');
registerLocaleData(ruLocale, 'ru');
registerLocaleData(ukLocale, 'ua');

@NgModule({
  declarations: [
    PhotoUploadComponent,
    DragAndDropDirective,
    DragAndDropComponent,
    EditPhotoPopUpComponent,
    DateLocalisationPipe,
    NoDataComponent,
    TagFilterComponent,
    CalendarBaseComponent,
    WarningPopUpComponent,
    FormBaseComponent,
    HabitsPopupComponent,
    EventsListItemComponent,
    EventsListItemModalComponent,
    TagsSelectComponent,
    InputErrorComponent,
    SelectImagesComponent,
    FilterSelectComponent
  ],
  imports: [
    ModalModule.forRoot(),
    RatingModule.forRoot(),
    ImageCropperModule,
    SharedModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    MDBBootstrapModule,
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
    MatDividerModule,
    MatExpansionModule
  ],
  exports: [
    EditPhotoPopUpComponent,
    TranslateModule,
    PhotoUploadComponent,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule,
    FileUploadModule,
    MatCardModule,
    MatDialogModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    DragAndDropDirective,
    DragAndDropComponent,
    DateLocalisationPipe,
    NoDataComponent,
    TagFilterComponent,
    UserSharedModule,
    WarningPopUpComponent,
    FormBaseComponent,
    EventsListItemComponent,
    EventsListItemModalComponent,
    TagsSelectComponent,
    InputErrorComponent,
    SelectImagesComponent,
    FilterSelectComponent,
    MatDividerModule,
    MatExpansionModule
  ],
  providers: [MatSnackBarComponent, TranslateService]
})
export class SharedMainModule {}

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}
