import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { SharedMainModule } from '@shared/shared-main.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { QuillModule } from 'ngx-quill';

import { EventsRoutingModule } from './events-routing.module';
import { EventsComponent } from './events.component';
import { EventsListComponent } from './components/events-list/events-list.component';
import { HttpClient } from '@angular/common/http';
import { CreateEditEventsComponent } from './components/create-edit-events/create-edit-events.component';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  declarations: [EventsComponent, EventsListComponent, CreateEditEventsComponent],
  imports: [
    CommonModule,
    EventsRoutingModule,
    MatDatepickerModule,
    MatInputModule,

    MatFormFieldModule,
    MatNativeDateModule,

    SharedMainModule,
    SharedModule,
    // MatIconModule,
    InfiniteScrollModule,
    // EcoNewsRoutingModule,
    // ImageCropperModule,
    // MatSnackBarModule,
    // CommentsModule,

    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      },
      isolate: true
    }),
    QuillModule.forRoot()
  ],
  exports: [TranslateModule]
})
export class EventsModule {}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
