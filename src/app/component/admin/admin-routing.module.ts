import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { PlacesComponent } from './components/places/places.component';
import { UsersComponent } from './components/users/users.component';
import { FeedbacksComponent } from './components/feedbacks/feedbacks.component';

const adminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'places', pathMatch: 'prefix' },
      { path: 'places', component: PlacesComponent },
      { path: 'users', component: UsersComponent },
      { path: 'feedbacks', component: FeedbacksComponent }
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule]
})

export class AdminRoutingModule { }
