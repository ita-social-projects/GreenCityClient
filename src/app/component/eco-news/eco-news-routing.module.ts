import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EcoNewsComponent } from './eco-news.component';
import { CreateNewsComponent } from './create-news/create-news.component';
import { EcoNewsDetailComponent } from './eco-news-detail/eco-news-detail.component';
import { NewsPreviewPageComponent } from './news-preview-page/news-preview-page.component';
import { PostNewsLoaderComponent } from './post-news-loader/post-news-loader.component';
import { NewsListComponent } from './news-list/news-list.component';


const ecoNewsRoutes: Routes = [
  {
    path: '',
    component: EcoNewsComponent,
    children: [
      {
        path: 'preview',
        component: NewsPreviewPageComponent
      },
      {
        path: 'create-news',
        component: CreateNewsComponent
      },
      {
        path: 'post-news-loader',
        component: PostNewsLoaderComponent
      },
      {
        path: ':id',
        component: EcoNewsDetailComponent
      },

      {
        path: '',
        component: NewsListComponent
      },
      {
        path: '',
        redirectTo: 'news',
        pathMatch: 'full'
      }
    ]
  },
];

@NgModule({
  imports: [ RouterModule.forChild(ecoNewsRoutes) ],
  exports: [ RouterModule ]
})

export class EcoNewsRoutingModule { }
