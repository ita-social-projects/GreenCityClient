import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditCustomHabitComponent } from './add-edit-custom-habit/add-edit-custom-habit.component';
import { AddNewHabitComponent } from './add-new-habit/add-new-habit.component';
import { PendingChangesGuard } from '@global-service/pending-changes-guard/pending-changes.guard';

const habitRoutes: Routes = [
  {
    path: '',
    component: AddNewHabitComponent,
    children: [
      {
        path: 'edit-habit',
        component: AddEditCustomHabitComponent,
        canDeactivate: [PendingChangesGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(habitRoutes)],
  exports: [RouterModule]
})
export class HabitRoutingModule {}
