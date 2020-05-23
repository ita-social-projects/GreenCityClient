import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import { FooterComponent } from './footer/footer.component';
import { SearchPopupComponent } from './search-popup/search-popup.component';
import { SearchItemComponent } from './search-popup/search-item/search-item.component';
import { SearchNotFoundComponent } from './search-popup/search-not-found/search-not-found.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SearchPopupComponent,
    SearchItemComponent,
    SearchNotFoundComponent,
  ],
  imports: [
    CommonModule,
    CoreModule
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
