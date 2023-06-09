import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateEditEventsComponent } from './components/create-edit-events/create-edit-events.component';
import { EventDetailsComponent } from './components/event-details/event-details.component';
import { EventsListComponent } from './components/events-list/events-list.component';
import { EventsComponent } from './events.component';

const routes: Routes = [
  {
    path: '',
    component: EventsComponent,
    children: [
      {
        path: '',
        component: EventsListComponent
      },
      {
        path: 'create-event',
        component: CreateEditEventsComponent,
        children: [
          /*{
            path: ':id/:preview',
            component: EventDetailsComponent,
            //data: {preview: false}
          }*/
        ]
      },
      {
        path: ':id',
        component: EventDetailsComponent
        // data: {preview: false}
      },
      {
        path: ':id/:preview',
        component: EventDetailsComponent
        // data: {preview: false}
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule {}
