import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateEditEventsComponent } from './components/create-edit-events/create-edit-events.component';
import { EventDetailsComponent } from './components/event-details/event-details.component';
import { EventsListComponent } from './components/events-list/events-list.component';
import { EventsPreviewPageComponent } from './components/events-preview-page/events-preview-page.component';
import { EventsComponent } from './events.component';

const routes: Routes = [
  {
    path: '',
    component: EventsComponent,
    children: [
      {
        path: 'preview',
        component: EventsPreviewPageComponent
      },
      {
        path: '',
        component: EventsListComponent
      },
      {
        path: 'create-event',
        component: CreateEditEventsComponent
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
