import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EcoNewsComponent } from './eco-news.component';
import { CreateNewsComponent } from './create-news/create-news.component';
import { EcoNewsDetailComponent } from './eco-news-detail/eco-news-detail.component';
import { NewsPreviewPageComponent } from './news-preview-page/news-preview-page.component';
import { PostNewsLoaderComponent } from './post-news-loader/post-news-loader.component';


const ecoNewsRoutes: Routes = [
  {
    path: 'create-news',
    component: CreateNewsComponent
  },
  {
    path: 'news',
    component: EcoNewsComponent,
  },
  {
    path: 'news/:id',
    component: EcoNewsDetailComponent
  },
  {
    path: 'create-news/preview',
    component: NewsPreviewPageComponent
  },
  {
    path: 'post-news-loader',
    component: PostNewsLoaderComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(ecoNewsRoutes)],
  exports: [RouterModule]
})

export class EcoNewsRoutingModule { }
