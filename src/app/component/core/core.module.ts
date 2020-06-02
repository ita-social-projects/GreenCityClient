import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ModalComponent,
  ProposeCafeComponent
} from './components';
import { AgmCoreModule } from '@agm/core';
import { NgSelectModule } from '@ng-select/ng-select';
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
    NgSelectModule
  ],
    providers: []
})

export class CoreModule {}

