import { AppRoutingModule } from './../../../app-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { ProposeCafeComponent } from './components';
import { GoogleMapsModule } from '@angular/google-maps';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedMainModule } from '../shared/shared-main.module';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from '@environment/environment';

@NgModule({
  declarations: [],
  imports: [
    AppRoutingModule,
    CommonModule,
    SharedMainModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    GoogleMapsModule,
    NgSelectModule,

    NgxPageScrollModule
  ],
  exports: [
    NgxPageScrollModule,
    // ProposeCafeComponent,
    CommonModule,
    TranslateModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    GoogleMapsModule,
    NgSelectModule
  ],
  providers: []
})
export class CoreModule {}
