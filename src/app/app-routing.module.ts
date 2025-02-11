import { ConfirmRestorePasswordGuard } from './shared/guards/route-guards/confirm-restore-password.guard';
import { HomepageComponent } from 'src/app/greencity/modules/home/components';
import { ConfirmRestorePasswordComponent } from '@global-auth/index';
import { SearchAllResultsComponent } from './greencity/components/search-all-results/search-all-results.component';
import { MainComponent } from './main/main.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { UbsAdminGuard } from '@ubs/ubs-admin/ubs-admin-guard.guard';
import { UbsUserGuard } from '@ubs/ubs-user/guards/ubs-user-guard.guard';
import { NonAdminGuard } from 'src/app/shared/guards/non-admin.guard';
import { UnsubscribeComponent } from './greencity/modules/home/components/unsubscribe/unsubscribe.component';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'ubs',
        loadChildren: () => import('./ubs/ubs/ubs-order.module').then((mod) => mod.UbsOrderModule),
        canActivate: [NonAdminGuard]
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'greenCity'
      },
      {
        path: 'greenCity',
        loadChildren: () => import('./greencity/greencity.module').then((mod) => mod.GreencityModule),
        canActivate: [NonAdminGuard]
      },
      // {
      //   path: 'greenCity',
      //   component: HomepageComponent,
      //   canActivate: [NonAdminGuard]
      // },
      // {
      //   path: 'about',
      //   loadChildren: () => import('./greencity/modules/about/about.module').then((mod) => mod.AboutModule),
      //   canActivate: [NonAdminGuard]
      // },
      // {
      //   path: 'places',
      //   loadChildren: () => import('./greencity/modules/places/places.module').then((mod) => mod.PlacesModule),
      //   canActivate: [NonAdminGuard]
      // },
      // {
      //   path: 'news',
      //   loadChildren: () => import('./greencity/modules/eco-news/eco-news.module').then((mod) => mod.EcoNewsModule),
      //   canActivate: [NonAdminGuard]
      // },
      // {
      //   path: 'events',
      //   loadChildren: () => import('./greencity/modules/events/events.module').then((mod) => mod.EventsModule),
      //   canActivate: [NonAdminGuard]
      // },
      {
        path: 'profile',
        loadChildren: () => import('./main/component/user/user.module').then((mod) => mod.UserModule),
        canActivate: [NonAdminGuard]
      },
      // {
      //   path: 'search',
      //   component: SearchAllResultsComponent,
      //   canActivate: [NonAdminGuard]
      // },
      {
        path: 'auth/restore',
        component: ConfirmRestorePasswordComponent,
        canActivate: [ConfirmRestorePasswordGuard, NonAdminGuard]
      }
      // {
      //   path: 'unsubscribe',
      //   component: UnsubscribeComponent,
      //   canActivate: [NonAdminGuard]
      // }
    ]
  },
  // {
  //   path: 'ubs-admin',
  //   loadChildren: () => import('./ubs/ubs-admin/ubs-admin.module').then((mod) => mod.UbsAdminModule),
  //   canLoad: [UbsAdminGuard]
  // },
  // {
  //   path: 'ubs-user',
  //   loadChildren: () => import('./ubs/ubs-user/ubs-user.module').then((mod) => mod.UbsUserModule),
  //   canLoad: [UbsUserGuard]
  // },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload', preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
