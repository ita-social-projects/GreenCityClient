import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './components';
import { AuthPageGuardService } from '../../service/route-guards/auth-page-guard.service';

export const userRoutes: Routes = [
  { path: '',
    component: ProfileComponent,
    canActivate: [ AuthPageGuardService ],
    children: [
      { path: ':id', component: ProfileComponent }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(userRoutes) ],
  exports: [ RouterModule ]
})
export class UserRoutingModule {}
