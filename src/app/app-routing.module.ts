import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthPageGuardService } from './service/route-guards/auth-page-guard.service';
import { HomepageComponent } from './component/home/components/homepage/homepage.component';
import { ProfileComponent } from './component/user/components/profile/profile.component';
import { SearchAllResultsComponent } from './component/layout/components/search-all-results/search-all-results.component';

export const routes: Routes = [
  {
    path: 'about',
    loadChildren: () => import('./component/about/about.module').then(mod => mod.AboutModule)
  },
  {
    path: 'map',
    loadChildren: () => import('./component/map/map.module').then(mod => mod.MapModule)
  },
  {
    path: 'news',
    loadChildren: () => import('./component/eco-news/eco-news.module').then(mod => mod.EcoNewsModule)
  },
  {
    path: 'welcome',
    component: HomepageComponent,
  },
  {
    path: ':id/profile',
    component: ProfileComponent,
    canActivate: [AuthPageGuardService],
  },
  {
    path: 'search',
    component: SearchAllResultsComponent,
  },
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
