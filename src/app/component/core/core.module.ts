import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProposeCafeComponent } from './propose-cafe/propose-cafe.component';
import { ModalComponent } from './_modal/modal.component';
import { AgmCoreModule } from '@agm/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { MatCheckboxModule, MatDialogModule, MatCardModule } from '@angular/material';
import { PhotoUploadComponent } from './photo-upload/photo-upload.component';
import { FileUploadModule } from 'ng2-file-upload';

import {SharedModule} from '../shared/shared.module';
import {NgxPageScrollModule} from 'ngx-page-scroll';

@NgModule({
    declarations: [
        ProposeCafeComponent,
        ModalComponent,
        PhotoUploadComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyC7q2v0VgRy60dAoItfv3IJhfJQEEoeqCI',
            libraries: ['places', 'geometry']
          }),
          NgSelectModule,
          MDBBootstrapModule,
          MatCheckboxModule,
          MatDialogModule,
          FileUploadModule,
          MatCardModule,
          NgxPageScrollModule

    ],
  exports: [
    NgxPageScrollModule,
    ProposeCafeComponent,
    ModalComponent,
    PhotoUploadComponent,
    CommonModule,
    TranslateModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AgmCoreModule,
    NgSelectModule,
    MDBBootstrapModule,
    MatCheckboxModule,
    MatDialogModule,
    FileUploadModule,
    MatCardModule,

  ],
    providers: []
})

export class CoreModule {}

