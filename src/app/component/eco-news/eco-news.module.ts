import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ImageCropperModule } from 'ngx-image-cropper';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { registerLocaleData } from '@angular/common';
import usLocale from '@angular/common/locales/en-US-POSIX';
import ruLocale from '@angular/common/locales/ru';
import ukLocale from '@angular/common/locales/uk';

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
import { CommentsModule } from '../comments/comments.module';
import { NoNewsComponent } from './components/no-news/no-news.component';
import { MatSnackBarComponent } from './../errors/mat-snack-bar/mat-snack-bar.component';
import { EcoNewsComponent } from './eco-news.component';
import { DateLocalisationPipe } from '../../pipe/date-localisation-pipe/date-localisation.pipe';

registerLocaleData(usLocale, 'en');
registerLocaleData(ruLocale, 'ru');
registerLocaleData(ukLocale, 'uk');

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
    MatSnackBarComponent,
    DateLocalisationPipe
  ],
  imports: [
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
    MatSnackBarComponent
  ]
})

export class EcoNewsModule  { }

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
