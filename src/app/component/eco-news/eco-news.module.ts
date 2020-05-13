import { NgModule } from '@angular/core';

import { EcoNewsComponent } from './eco-news.component';
import { CreateNewsComponent } from './create-news/create-news.component';
import { FilterNewsComponent } from './filter-news/filter-news.component';
import { NewsListGalleryViewComponent } from './news-list/news-list-gallery-view/news-list-gallery-view.component';
import { NewsListListViewComponent } from './news-list/news-list-list-view/news-list-list-view.component';
import { NewsListComponent } from './news-list/news-list.component';
import { RemainingCountComponent } from './remaining-count/remaining-count.component';
import { EcoNewsWidgetComponent } from './eco-news-detail/eco-news-widget/eco-news-widget.component';
import { EcoNewsDetailComponent } from './eco-news-detail/eco-news-detail.component';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CoreModule } from '../core/core.module';
import { ChangeViewButtonComponent } from './news-list/change-view-button/change-view-button.component';
import { EcoNewsRoutingModule } from './eco-news-routing.module';
import { NewsPreviewPageComponent } from './news-preview-page/news-preview-page.component';
import { PostNewsLoaderComponent } from './post-news-loader/post-news-loader.component';
import { DragAndDropComponent } from './create-news/drag-and-drop/drag-and-drop.component';
import { DragAndDropDirective } from 'src/app/directives/drag-and-drop.directive';
import { CreateNewsCancelComponent } from './create-news/create-news-cancel/create-news-cancel.component';

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
    NewsPreviewPageComponent,
    PostNewsLoaderComponent,
    DragAndDropComponent,
    DragAndDropDirective,
    CreateNewsCancelComponent
  ],
  imports: [
    CommonModule,
    InfiniteScrollModule,
    CoreModule,
    EcoNewsRoutingModule,
  ],
  entryComponents: [CreateNewsCancelComponent],
  providers: []
})

export class EcoNewsModule  { }
