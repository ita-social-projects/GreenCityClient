import { TipsListComponent} from './component/home/components';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HomepageComponent} from './component/home/components';
import { SearchAllResultsComponent} from './component/layout/components';
import { ConfirmRestorePasswordComponent } from '@global-auth/index';

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
    path: 'profile',
    loadChildren: () => import('./component/user/user.module').then(mod => mod.UserModule)
  },
  {
    path: 'welcome',
    component: HomepageComponent,
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
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  },
  {
    path: 'auth/restore',
    component: ConfirmRestorePasswordComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload', preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
