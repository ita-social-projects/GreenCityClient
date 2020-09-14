import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { EffectsModule } from '@ngrx/effects';
import { ImageCropperModule } from 'ngx-image-cropper';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { EcoNewsRoutingModule } from './eco-news-routing.module';
import { SharedModule } from '../shared/shared.module';
import {
  CreateNewsComponent,
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
import { EcoNewsEffects } from './store/eco-news.effects';
import { EcoNewsSelectors } from './store/eco-news.selectors';
import { CommentsModule } from '../comments/comments.module';
import { NoNewsComponent } from './components/no-news/no-news.component';
import { MatSnackBarComponent } from './../errors/mat-snack-bar/mat-snack-bar.component';
import { EcoNewsComponent } from './eco-news.component';


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
    NoNewsComponent,
    MatSnackBarComponent
  ],
  imports: [
    EffectsModule.forFeature([EcoNewsEffects]),
    CommonModule,
    CommentsModule,
    SharedModule,
    InfiniteScrollModule,
    EcoNewsRoutingModule,
    ImageCropperModule,
    MatSnackBarModule,
    CommentsModule,
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
    TranslateModule
  ],
  entryComponents: [

  ],
  providers: [
    EcoNewsSelectors, MatSnackBarComponent
  ]
})

export class EcoNewsModule  { }

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
