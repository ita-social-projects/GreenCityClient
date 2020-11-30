import { UserSharedModule } from './../user/components/shared/user-shared.module';
import { NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FileUploadModule } from 'ng2-file-upload';
import { MatCardModule } from '@angular/material';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {
  PhotoUploadComponent,
  CancelPopUpComponent,
  EditPhotoPopUpComponent
} from './components';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DragAndDropDirective } from '../eco-news/directives/drag-and-drop.directive';
import { DragAndDropComponent } from './components/drag-and-drop/drag-and-drop.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { DateLocalisationPipe } from '@pipe/date-localisation-pipe/date-localisation.pipe';
import { NoDataComponent } from './components/no-data/no-data.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { TagFilterComponent } from './components/tag-filter/tag-filter.component';

@NgModule({
  declarations: [
    PhotoUploadComponent,
    CancelPopUpComponent,
    DragAndDropDirective,
    DragAndDropComponent,
    EditPhotoPopUpComponent,
    DateLocalisationPipe,
    NoDataComponent,
    SpinnerComponent,
    TagFilterComponent
  ],
  imports: [
    ImageCropperModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    MDBBootstrapModule,
    FileUploadModule,
    MatCardModule,
    MatDialogModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    UserSharedModule
  ],
  exports: [
    CancelPopUpComponent,
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
    SpinnerComponent,
    TagFilterComponent,
    UserSharedModule
  ],
  providers: [MatSnackBarComponent, TranslateService],
})
export class SharedModule {}

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(
    httpClient,
    './assets/i18n/',
    '.json'
  );
}
