import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { EcoNewsRoutingModule } from './eco-news-routing.module';
import { ChangeViewButtonComponent } from './news-list/change-view-button/change-view-button.component';
import { NewsListGalleryViewComponent } from './news-list/news-list-gallery-view/news-list-gallery-view.component';
import { NewsListListViewComponent } from './news-list/news-list-list-view/news-list-list-view.component';
import { EcoNewsComponent } from './eco-news.component';
import { CreateNewsComponent } from './create-news/create-news.component';
import { EcoNewsDetailComponent } from './eco-news-detail/eco-news-detail.component';
import { FilterNewsComponent } from './filter-news/filter-news.component';
import { NewsListComponent } from './news-list/news-list.component';
import { RemainingCountComponent } from './remaining-count/remaining-count.component';
import { CoreModule } from '../core/core.module';
import { FilterEcoNewsPipe } from '../../pipe/filter-ecoNews-pipe/filter-eco-news.pipe';
import { EcoNewsWidgetComponent } from './eco-news-detail/eco-news-widget/eco-news-widget.component';

@NgModule({
  declarations: [
    EcoNewsComponent,
    CreateNewsComponent,
    FilterNewsComponent,
    ChangeViewButtonComponent,
    NewsListGalleryViewComponent,
    NewsListListViewComponent,
    NewsListComponent,
    RemainingCountComponent,
    EcoNewsWidgetComponent,
    EcoNewsDetailComponent,
    FilterEcoNewsPipe
  ],
  imports: [
    CommonModule,
    InfiniteScrollModule,
    EcoNewsRoutingModule,
    CoreModule
  ],
  providers: []
})

export class EcoNewsModule  { }
