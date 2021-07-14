import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EcoNewsComponent } from './eco-news.component';
import { EcoNewsDetailComponent } from './components';
import { NewsPreviewPageComponent } from './components';
import { PostNewsLoaderComponent } from './components';
import { NewsListComponent } from './components';
import { CreateEditNewsComponent } from './components';
import { PendingChangesGuard } from '@global-service/pending-changes-guard/pending-changes.guard';

const ecoNewsRoutes: Routes = [
  {
    path: '',
    component: EcoNewsComponent,
    children: [
      {
        path: 'preview',
        component: NewsPreviewPageComponent,
      },
      {
        path: 'create-news',
        component: CreateEditNewsComponent,
        canDeactivate: [PendingChangesGuard],
      },
      {
        path: 'post-news-loader',
        component: PostNewsLoaderComponent,
      },
      {
        path: ':id',
        component: EcoNewsDetailComponent,
      },

      {
        path: '',
        component: NewsListComponent,
      },
      {
        path: '',
        redirectTo: 'news',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(ecoNewsRoutes)],
  exports: [RouterModule],
})
export class EcoNewsRoutingModule {}
