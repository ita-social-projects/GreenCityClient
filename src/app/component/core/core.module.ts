import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProposeCafeComponent } from './propose-cafe/propose-cafe.component';
import { ModalComponent } from './_modal/modal.component';
import { AgmCoreModule } from '@agm/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatCheckboxModule, MatDialogModule  } from '@angular/material';
import { SharedModule } from '../shared/shared.module';
import { NgxPageScrollModule } from 'ngx-page-scroll';

@NgModule({
    declarations: [
        ProposeCafeComponent,
        ModalComponent,
    ],
    imports: [
        AppRoutingModule,
        CommonModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyC7q2v0VgRy60dAoItfv3IJhfJQEEoeqCI',
            libraries: ['places', 'geometry']
          }),
        NgSelectModule,
        MatCheckboxModule,
        MatDialogModule,
        NgxPageScrollModule
    ],
  exports: [
    NgxPageScrollModule,
    ProposeCafeComponent,
    ModalComponent,
    CommonModule,
    TranslateModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AgmCoreModule,
    NgSelectModule,
    MatCheckboxModule,
    MatDialogModule,
  ],
    providers: []
})

export class CoreModule {}

