import { AllHabitsComponent } from './components/habit/all-habits/all-habits.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent, EditProfileComponent } from './components';
import { AuthPageGuardService } from '../../service/route-guards/auth-page-guard.service';
import { UserComponent } from './user.component';
import { AddNewHabitComponent } from './components/habit/add-new-habit/add-new-habit.component';

export const userRoutes: Routes = [
  { path: '',
    component: UserComponent,
    canActivate: [ AuthPageGuardService ],
    children: [
      { path: ':id', component: ProfileComponent },
      { path: ':id/edit', component: EditProfileComponent },
      { path: ':id/allhabits', component: AllHabitsComponent },
      { path: ':id/allhabits/addhabit/:habitId', component: AddNewHabitComponent },
      { path: '', component: ProfileComponent },
      { path: '', redirectTo: ':id', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(userRoutes) ],
  exports: [ RouterModule ]
})
export class UserRoutingModule {}
