import { NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { PhotoUploadComponent } from '../core/photo-upload/photo-upload.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FileUploadModule } from 'ng2-file-upload';
import { MatCardModule } from '@angular/material';
import { CreateNewsCancelComponent } from './create-news-cancel/create-news-cancel.component';

@NgModule({
  declarations: [
    PhotoUploadComponent,
    CreateNewsCancelComponent
  ],
  imports: [
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
    MatCardModule

  ],
  exports: [
    CreateNewsCancelComponent,
    TranslateModule,
    PhotoUploadComponent,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule,
    FileUploadModule,
    MatCardModule
  ],
  providers: [

  ]
})
export class SharedModule {}

 function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(
    httpClient,
    './assets/i18n/',
    '.json'
  );
}
