import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import {
  HeaderComponent,
  FooterComponent,
  SearchPopupComponent,
  SearchNotFoundComponent,
  SearchItemComponent,
  SearchAllResultsComponent
} from './components';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CloseDropdownDirective } from './directives/close-dropdown.directive';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SearchPopupComponent,
    SearchItemComponent,
    SearchNotFoundComponent,
    SearchAllResultsComponent,
    CloseDropdownDirective,
  ],
  imports: [
    CommonModule,
    CoreModule,
    InfiniteScrollModule,
    NgxPageScrollModule,
    FormsModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    SearchPopupComponent
  ],
  providers: [

  ]
})
export class LayoutModule {}
