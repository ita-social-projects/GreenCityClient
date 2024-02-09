import { SharedMainModule } from '@shared/shared-main.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import { FooterComponent } from './components';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [FooterComponent],
  imports: [
    CommonModule,
    CoreModule,
    InfiniteScrollModule,
    MatSnackBarModule,
    NgxPageScrollModule,
    ReactiveFormsModule,
    FormsModule,
    SharedMainModule,
    SharedModule
  ],
  exports: [FooterComponent],
  providers: [MatSnackBarComponent]
})
export class LayoutModule {}
