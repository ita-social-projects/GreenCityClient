import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CoreModule } from '@global-core/core.module';
import { HomeModule } from './modules/home/home.module';
import { SharedModule } from '../shared/shared.module';
import { SharedMainModule } from '@shared/shared-main.module';
import { SearchAllResultsComponent } from './components/search-all-results/search-all-results.component';
import { SearchPopupComponent } from './components/search-popup/search-popup.component';
import { SearchItemComponent } from './components/search-item/search-item.component';
import { SearchNotFoundComponent } from './components/search-not-found/search-not-found.component';

@NgModule({
  declarations: [SearchAllResultsComponent, SearchPopupComponent, SearchItemComponent, SearchNotFoundComponent],
  imports: [CommonModule, CoreModule, SharedModule, SharedMainModule, InfiniteScrollModule, HomeModule]
})
export class GreencityModule {}
