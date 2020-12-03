import { AllHabitsComponent } from './components/habit/all-habits/all-habits.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent, EditProfileComponent } from './components';
import { AuthPageGuardService } from '../../service/route-guards/auth-page-guard.service';
import { UserComponent } from './user.component';
import { AddFriendsListComponent } from './components/profile/users-friends/add-friends-list/add-friends-list.component';

export const userRoutes: Routes = [
  { path: '',
    component: UserComponent,
    canActivate: [ AuthPageGuardService ],
    children: [
      { path: ':id', component: ProfileComponent },
      { path: ':id/edit', component: EditProfileComponent },
      { path: ':id/allhabits', component: AllHabitsComponent },
      { path: '', component: ProfileComponent },
      { path: '/friends', component: AddFriendsListComponent},
      { path: '', redirectTo: ':id', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(userRoutes) ],
  exports: [ RouterModule ]
})
export class UserRoutingModule {}
