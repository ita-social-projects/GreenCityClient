import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventDetailsComponent } from './components/event-details/event-details.component';
import { EventsListComponent } from './components';
import { EventsComponent } from './events.component';
import { AuthPageGuardService } from '@global-service/route-guards/auth-page-guard.service';
import { UpdateEventComponent } from './components/update-event/update-event.component';
import { EventEditorComponent } from './components/event-editor/event-editor.component';

const routes: Routes = [
  {
    path: '',
    component: EventsComponent,
    children: [
      {
        path: 'preview',
        component: EventDetailsComponent
      },
      {
        path: '',
        component: EventsListComponent
      },
      {
        path: 'create-event',
        component: EventEditorComponent,
        canActivate: [AuthPageGuardService]
      },
      {
        path: 'update-event/:id',
        component: UpdateEventComponent
      },
      {
        path: ':id',
        component: EventDetailsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule {}
