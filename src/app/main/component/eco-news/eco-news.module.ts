import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { ImageCropperModule } from 'ngx-image-cropper';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { EcoNewsRoutingModule } from './eco-news-routing.module';
import { SharedMainModule } from '@shared/shared-main.module';
import {
  CreateEditNewsComponent,
  EcoNewsDetailComponent,
  EcoNewsWidgetComponent,
  NewsListComponent,
  ChangeViewButtonComponent,
  NewsListListViewComponent,
  NewsPreviewPageComponent,
  PostNewsLoaderComponent,
  RemainingCountComponent
} from './components';
import { CommentsModule } from '../comments/comments.module';
import { MatSnackBarComponent } from '../errors/mat-snack-bar/mat-snack-bar.component';
import { EcoNewsComponent } from './eco-news.component';
import { ACTION_CONFIG, ACTION_TOKEN } from './components/create-edit-news/action.constants';
import { SharedModule } from 'src/app/shared/shared.module';
import { QuillModule } from 'ngx-quill';
import { SafeHtmlPipe } from '@pipe/safe-html-pipe/safe-html.pipe';
import { UrlHostnamePipe } from '@pipe/url-hostname-pipe/url-hostname.pipe';
import { CommentsService } from '../comments/services/comments.service';
import { EcoNewsCommentsService } from '@eco-news-service/eco-news-comments.service';

@NgModule({
  declarations: [
    EcoNewsComponent,
    ChangeViewButtonComponent,
    NewsListListViewComponent,
    NewsListComponent,
    RemainingCountComponent,
    EcoNewsWidgetComponent,
    EcoNewsDetailComponent,
    NewsPreviewPageComponent,
    PostNewsLoaderComponent,
    MatSnackBarComponent,
    CreateEditNewsComponent,
    SafeHtmlPipe,
    UrlHostnamePipe
  ],
  imports: [
    CommonModule,
    CommentsModule,
    SharedMainModule,
    SharedModule,
    MatIconModule,
    InfiniteScrollModule,
    EcoNewsRoutingModule,
    ImageCropperModule,
    MatSnackBarModule,
    CommentsModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      },
      isolate: true
    }),
    QuillModule.forRoot()
  ],
  exports: [TranslateModule],
  entryComponents: [],
  providers: [
    MatSnackBarComponent,
    { provide: ACTION_TOKEN, useValue: ACTION_CONFIG },
    { provide: CommentsService, useClass: EcoNewsCommentsService }
  ]
})
export class EcoNewsModule {}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
