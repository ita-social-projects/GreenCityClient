import { NgModule } from '@angular/core';
import { SignUpComponent } from './component/user/auth/sign-up/sign-up.component';
import { AuthComponent } from './component/user/auth/auth.component';
import { SignInComponent } from './component/user/auth/sign-in/sign-in.component';
import { SubmitEmailComponent } from './component/user/auth/submit-email/submit-email.component';
import { RestoreFormComponent } from './component/user/restore-form/restore-form.component';
import { UserHabitPageComponent } from './component/user/habit/user-habit-page/user-habit-page.component';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './component/general/homepage/homepage/homepage.component';
import { AuthPageGuardService } from './service/route-guards/auth-page-guard.service';
import { HomePageGuardService } from './service/route-guards/home-page-guard.service';
import { AppComponent } from './app.component';
import { AboutPageComponent } from './component/about-page/about-page.component';
import { FilterComponent } from './component/map/filter/filter.component';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    canActivate: [HomePageGuardService]
  },
  {
    path: 'welcome',
    component: HomepageComponent
  },
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      { path: '', component: SignInComponent },
      { path: 'sign-up', component: SignUpComponent },
      { path: 'submit-email', component: SubmitEmailComponent },
      { path: 'restore/:token', component: RestoreFormComponent }
    ]
  },
  {
    path: '',
    component: FilterComponent
  },
  {
    path: ':id/habits',
    component: UserHabitPageComponent,
    canActivate: [AuthPageGuardService]
  },
  {
    path: 'about',
    component: AboutPageComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule {}
