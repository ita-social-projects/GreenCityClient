import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { UsersComponent } from './components/users/users.component';
import { FeedbacksComponent } from './components/feedbacks/feedbacks.component';
// import { OldPlacesComponent } from './components';

const adminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      // { path: '', redirectTo: 'oldPlaces', pathMatch: 'prefix' },
      // { path: 'oldPlaces', component: OldPlacesComponent },
      { path: 'users', component: UsersComponent },
      { path: 'feedbacks', component: FeedbacksComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
