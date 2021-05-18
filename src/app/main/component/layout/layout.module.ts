import { SharedModule } from '../shared/shared.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import {
  HeaderComponent,
  FooterComponent,
  SearchPopupComponent,
  SearchNotFoundComponent,
  SearchItemComponent,
  SearchAllResultsComponent,
} from './components';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CloseDropdownDirective } from './directives/close-dropdown.directive';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
    MatSnackBarModule,
    NgxPageScrollModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
  ],
  exports: [HeaderComponent, FooterComponent, SearchPopupComponent],
  providers: [MatSnackBarComponent],
})
export class LayoutModule {}
