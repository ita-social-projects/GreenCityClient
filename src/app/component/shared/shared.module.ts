import { NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FileUploadModule } from 'ng2-file-upload';
import { MatCardModule } from '@angular/material';
import {
  PhotoUploadComponent,
  CancelPopUpComponent
} from './components';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DragAndDropDirective } from '../eco-news/directives/drag-and-drop.directive';
import { DragAndDropComponent } from './components/drag-and-drop/drag-and-drop.component';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  declarations: [
    PhotoUploadComponent,
    CancelPopUpComponent,
    DragAndDropDirective,
    DragAndDropComponent,
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
  ],
  exports: [
    CancelPopUpComponent,
    TranslateModule,
    PhotoUploadComponent,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule,
    FileUploadModule,
    MatCardModule,
    MatDialogModule,
    MatCheckboxModule,
    DragAndDropDirective,
    DragAndDropComponent,
  ],
  providers: [],
})
export class SharedModule {}

function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(
    httpClient,
    './assets/i18n/',
    '.json'
  );
}
