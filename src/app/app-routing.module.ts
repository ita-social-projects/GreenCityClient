import { ConfirmRestorePasswordComponent } from '@global-auth/index';
import { TipsListComponent } from './component/home/components';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HomepageComponent } from './component/home/components';
import { SearchAllResultsComponent } from './component/layout/components';

export const routes: Routes = [
  {
    path: 'about',
    loadChildren: () => import('./component/about/about.module').then((mod) => mod.AboutModule),
  },
  {
    path: 'places',
    loadChildren: () => import('./component/places/places.module').then((mod) => mod.PlacesModule),
  },
  {
    path: 'news',
    loadChildren: () => import('./component/eco-news/eco-news.module').then((mod) => mod.EcoNewsModule),
  },
  {
    path: 'profile',
    loadChildren: () => import('./component/user/user.module').then((mod) => mod.UserModule),
  },
  {
    path: 'ubs',
    loadChildren: () => import('./component/ubs/ubs.module').then((mod) => mod.UbsModule),
  },
  {
    path: 'tips',
    component: TipsListComponent,
  },
  {
    path: 'search',
    component: SearchAllResultsComponent,
  },
  {
    path: 'auth/restore',
    component: ConfirmRestorePasswordComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    component: HomepageComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload', preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
