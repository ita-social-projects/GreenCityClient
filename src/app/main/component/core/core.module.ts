import { AppRoutingModule } from './../../../app-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedMainModule } from '../shared/shared-main.module';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from '@environment/environment';

@NgModule({
  imports: [
    AppRoutingModule,
    CommonModule,
    SharedMainModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: environment.apiMapKey,
      libraries: ['places', 'geometry']
    }),
    NgSelectModule,

    NgxPageScrollModule
  ],
  exports: [
    NgxPageScrollModule,
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
