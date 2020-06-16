import { NgModule } from '@angular/core';
import { EcoNewsComponent } from './eco-news.component';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { EcoNewsRoutingModule } from './eco-news-routing.module';
import { DragAndDropDirective } from 'src/app/component/eco-news/directives/drag-and-drop.directive';
import { SharedModule } from '../shared/shared.module';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CommentLikeReplyComponent } from '../comment-like-reply/comment-like-reply.component';
import {
  CreateNewsComponent,
  DragAndDropComponent,
  EcoNewsDetailComponent,
  EcoNewsWidgetComponent,
  FilterNewsComponent,
  NewsListComponent,
  ChangeViewButtonComponent,
  NewsListGalleryViewComponent,
  NewsListListViewComponent,
  NewsPreviewPageComponent,
  PostNewsLoaderComponent,
  RemainingCountComponent
} from './components';
import { ImageCropperModule } from 'ngx-image-cropper';
import { EffectsModule } from '@ngrx/effects';
import { EcoNewsEffects } from './store/eco-news.effects';
import { EcoNewsSelectors } from './store/eco-news.selectors';

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
    CommentLikeReplyComponent
  ],
  imports: [
    EffectsModule.forFeature([EcoNewsEffects]),
    CommonModule,
    SharedModule,
    InfiniteScrollModule,
    EcoNewsRoutingModule,
    ImageCropperModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      },
      isolate: true
    })
  ],
  exports: [
    TranslateModule,
  ],
  entryComponents: [

  ],
  providers: [
    EcoNewsSelectors
  ]
})

export class EcoNewsModule  { }

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
