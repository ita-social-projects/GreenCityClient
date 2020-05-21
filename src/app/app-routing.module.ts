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

export const routes: Routes = [
  {
    path: 'welcome',
    component: HomepageComponent,
  },
  {
    path: 'about',
    loadChildren: () => import('./component/about/about.module').then(mod => mod.AboutModule)
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
