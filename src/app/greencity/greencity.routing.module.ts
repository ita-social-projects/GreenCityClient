import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './modules/home/components';
import { NonAdminGuard } from '../shared/guards/non-admin.guard';
import { SearchAllResultsComponent } from './components/search-all-results/search-all-results.component';
import { UnsubscribeComponent } from './modules/home/components/unsubscribe/unsubscribe.component';
import { GreencityMainComponent } from './components/greencity-main/greencity-main.component';
import { ChatComponent } from '../chat/component/chat-page/chat-page.component';

const greencityRoutes: Routes = [
  {
    path: '',
    component: GreencityMainComponent,
    children: [
      {
        path: '',
        component: HomepageComponent,
        canActivate: [NonAdminGuard]
      },
      {
        path: 'chat-page',
        component: ChatComponent,
        canActivate: [NonAdminGuard]
      },
      {
        path: 'about',
        loadChildren: () => import('./modules/about/about.module').then((mod) => mod.AboutModule),
        canActivate: [NonAdminGuard]
      },
      {
        path: 'places',
        loadChildren: () => import('./modules/places/places.module').then((mod) => mod.PlacesModule),
        canActivate: [NonAdminGuard]
      },
      {
        path: 'news',
        loadChildren: () => import('./modules/eco-news/eco-news.module').then((mod) => mod.EcoNewsModule),
        canActivate: [NonAdminGuard]
      },
      {
        path: 'events',
        loadChildren: () => import('./modules/events/events.module').then((mod) => mod.EventsModule),
        canActivate: [NonAdminGuard]
      },
      {
        path: 'profile',
        loadChildren: () => import('./modules/user/user.module').then((mod) => mod.UserModule),
        canActivate: [NonAdminGuard]
      },
      {
        path: 'search',
        component: SearchAllResultsComponent,
        canActivate: [NonAdminGuard]
      },
      {
        path: 'unsubscribe',
        component: UnsubscribeComponent,
        canActivate: [NonAdminGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(greencityRoutes)],
  exports: [RouterModule]
})
export class GreencityRoutingModule {}
