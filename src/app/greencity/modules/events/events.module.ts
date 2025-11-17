import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SharedGreenCityModule } from '@shared/shared-greencity.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { QuillModule } from 'ngx-quill';
import { NgxPaginationModule } from 'ngx-pagination';
import { EventsListComponent } from './components';
import { HttpClient } from '@angular/common/http';
import { EventEditorComponent } from './components/event-editor/event-editor.component';
import { MatNativeDateModule } from '@angular/material/core';
import { PlaceOnlineComponent } from './components/event-editor/components/create-event-dates/place-online/place-online.component';
import { ImagesContainerComponent } from './components/event-editor/components/create-event-information/components/images-container/images-container.component';
import { EventDetailsComponent } from './components/event-details/event-details.component';
import { RatingModule } from 'ngx-bootstrap/rating';
import { ImagesSliderComponent } from './components/event-details/images-slider/images-slider.component';
import { MatMenuModule } from '@angular/material/menu';
import { EventScheduleOverlayComponent } from './components/event-details/event-schedule-overlay/event-schedule-overlay.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { EventScheduleComponent } from './components/event-details/event-schedule/event-schedule.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { ImageCropperModule } from 'ngx-image-cropper';
import { CommentsModule } from '../comments/comments.module';
import { CommentsService } from '../comments/services/comments.service';
import { DateTimeComponent } from './components/event-editor/components/create-event-dates/date-time/date-time.component';
import { CreateEventInformationComponent } from './components/event-editor/components/create-event-information/create-event-information.component';
import { EventsRoutingModule } from './events-routing.module';
import { EventsComponent } from './events.component';
import { EventStoreService } from './services/event-store.service';
import { IMaskModule } from 'angular-imask';
import { EditImagePopUpComponent } from './components/event-editor/components/edit-image-pop-up/edit-image-pop-up.component';
import { ResizableBottomSheetComponent } from './components/event-details/resizable-bottom-sheet/resizable-bottom-sheet.component';
import { EventsCommentsService } from './services/events-comments.service';
import { DateLocalisationPipe } from '@shared/pipes/date-localisation-pipe/date-localisation.pipe';

@NgModule({
  declarations: [
    EventsComponent,
    EventsListComponent,
    EventEditorComponent,
    PlaceOnlineComponent,
    ImagesContainerComponent,
    EventDetailsComponent,
    EventScheduleOverlayComponent,
    EventScheduleComponent,
    CreateEventInformationComponent,
    EditImagePopUpComponent,
    ResizableBottomSheetComponent,
    DateTimeComponent,
    ImagesSliderComponent
  ],
  imports: [
    MatDialogModule,
    RatingModule.forRoot(),
    ReactiveFormsModule,
    CommonModule,
    EventsRoutingModule,
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    MatGridListModule,
    NgxPaginationModule,
    GoogleMapsModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatSelectModule,
    SharedGreenCityModule,
    IMaskModule,
    SharedModule,
    InfiniteScrollModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      },
      isolate: true
    }),
    QuillModule.forRoot(),
    MatMenuModule,
    DragDropModule,
    MatBottomSheetModule,
    NgbDropdownModule,
    MatIconModule,
    MatDividerModule,
    CommentsModule,
    MatChipsModule,
    ImageCropperModule,
    DateLocalisationPipe
  ],
  providers: [{ provide: CommentsService, useClass: EventsCommentsService }, EventStoreService],
  exports: [TranslateModule]
})
export class EventsModule {}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
