import { NgModule } from '@angular/core';
import { SignUpComponent } from './component/user/auth/sign-up/sign-up.component';
import { AuthComponent } from './component/user/auth/auth.component';
import { SignInComponent } from './component/user/auth/sign-in/sign-in.component';
import { SubmitEmailComponent } from './component/user/auth/submit-email/submit-email.component';
import { RestoreFormComponent } from './component/user/restore-form/restore-form.component';
import { UserHabitPageComponent } from './component/user/habit/user-habit-page/user-habit-page.component';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthPageGuardService } from './service/route-guards/auth-page-guard.service';
import { HomepageComponent } from './component/home/homepage/homepage.component';
import { ProfileComponent } from './component/user/profile/profile.component';
import {SearchAllResultsComponent} from "./component/layout/components/search-all-results/search-all-results.component";

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
    path: 'auth',
    component: AuthComponent,
    children: [
      { path: '', component: SignInComponent },
      { path: 'sign-up', component: SignUpComponent },
      { path: 'submit-email', component: SubmitEmailComponent },
      { path: 'restore/:token', component: RestoreFormComponent },
    ],
  },
  {
    path: ':id/habits',
    component: UserHabitPageComponent,
    canActivate: [AuthPageGuardService],
  },
  {
    path: 'profile',
    component: ProfileComponent,
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
