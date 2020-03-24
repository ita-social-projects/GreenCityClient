import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EcoNewsComponent } from './eco-news.component';
import { CreateNewsComponent } from './create-news/create-news.component';
import { EcoNewsDetailComponent } from './eco-news-detail/eco-news-detail.component';


const ecoNewsRoutes: Routes = [
  {
    path: 'news',   component: EcoNewsComponent,
  },
  {
    path: 'create-news', component: CreateNewsComponent,
  },
  {
    path: 'news/:id',
    component: EcoNewsDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(ecoNewsRoutes)],
  exports: [RouterModule]
})

export class EcoNewsRoutingModule { }
