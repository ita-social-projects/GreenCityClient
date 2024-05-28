import { Component, Injector, Input, OnInit } from '@angular/core';
import { quillConfig } from './quillEditorFunc';
import Quill from 'quill';
import 'quill-emoji/dist/quill-emoji.js';
import ImageResize from 'quill-image-resize-module';
import { Place } from '../../../places/models/place';
import {
  DateInformation,
  Dates,
  EventDTO,
  EventForm,
  EventInformation,
  EventResponse,
  FormCollectionEmitter,
  PagePreviewDTO,
  TagObj
} from '../../models/events.interface';
import { NavigationStart, Router } from '@angular/router';
import { EventsService } from '../../services/events.service';
import { Subscription } from 'rxjs';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { ActionsSubject, Store } from '@ngrx/store';
import { ofType } from '@ngrx/effects';
import { CreateEcoEventAction, EditEcoEventAction, EventsActions } from 'src/app/store/actions/ecoEvents.actions';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { singleNewsImages } from '../../../../image-pathes/single-news-images';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogPopUpComponent } from 'src/app/shared/dialog-pop-up/dialog-pop-up.component';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { FormBaseComponent } from '@shared/components/form-base/form-base.component';
import { filter, take } from 'rxjs/operators';
import { EventStoreService } from '../../services/event-store.service';

@Component({
  selector: 'app-event-editor',
  templateUrl: './event-editor.component.html',
  styleUrls: ['./event-editor.component.scss']
})
export class EventEditorComponent extends FormBaseComponent implements OnInit {
  public quillModules = {};
  @Input() isUpdating: boolean;
  public places: Place[] = [];
  public isPosting = false;
  public editEvent: EventResponse;
  public tags: Array<TagObj>;
  public isImageSizeError: boolean;
  public isImageTypeError = false;
  public images = singleNewsImages;
  public currentLang: string;
  public submitButtonName = 'create-event.publish';
  public subscription: Subscription;
  public imgArray: Array<File> = [];
  public userId: number;
  public previousPath: string;
  public popupConfig = {
    hasBackdrop: true,
    closeOnNavigation: true,
    disableClose: true,
    panelClass: 'popup-dialog-container',
    data: {
      popupTitle: 'homepage.events.events-popup.title',
      popupSubtitle: 'homepage.events.events-popup.subtitle',
      popupConfirm: 'homepage.events.events-popup.confirm',
      popupCancel: 'homepage.events.events-popup.cancel'
    }
  };
  public routedFromProfile: boolean;
  @Input() cancelChanges: boolean;
  public formsIsValid = false;
  private matSnackBar: MatSnackBarComponent;
  private _invalidFormsMap = new Map();
  private _formsValues: EventForm = {
    eventInformation: undefined,
    dateInformation: undefined
  };
  private _savedFormValues: EventForm;
  private initialForm: EventForm;
  private eventId: number;

  constructor(
    public dialog: MatDialog,
    public router: Router,
    public localStorageService: LocalStorageService,
    private actionsSubj: ActionsSubject,
    private store: Store,
    private snackBar: MatSnackBarComponent,
    public dialogRef: MatDialogRef<DialogPopUpComponent>,
    private languageService: LanguageService,
    private eventsService: EventsService,
    private eventStore: EventStoreService,
    private injector: Injector
  ) {
    super(router, dialog);
    this.quillModules = quillConfig;
    Quill.register('modules/imageResize', ImageResize);

    this.matSnackBar = injector.get(MatSnackBarComponent);
  }

  @Input({ required: true }) set formInput(value: EventForm) {
    if (value) {
      this._savedFormValues = value;
    } else {
      this._savedFormValues = this.eventStore.getEditorValues();
    }
  }

  get formValues(): EventForm {
    return this._savedFormValues;
  }

  checkFormInformation({ form, valid, key }: FormCollectionEmitter<unknown>, type: string) {
    switch (type) {
      case 'date':
        this._formsValues.dateInformation = form as DateInformation[];
        break;
      case 'event':
        this._formsValues.eventInformation = form as EventInformation;
        break;
      // Add more cases for other types if needed
      default:
        break;
    }
    this._checkValidness(key, valid);
  }

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        take(1)
      )
      .subscribe((value: NavigationStart) => {
        if (!value.url.includes('preview')) {
          this.eventStore.setEditorValues({
            dateInformation: undefined,
            eventInformation: undefined
          });
        }
      });
    //maybe rewrite for component store
    this._savedFormValues = this.eventStore.getEditorValues();
    if (!this.checkUserSigned()) {
      this.snackBar.openSnackBar('userUnauthorised');
    }
    if (this.isUpdating) {
      this.submitButtonName = 'create-event.save-event';
      this.initialForm = structuredClone(this._savedFormValues);
    }
    this.routedFromProfile = this.localStorageService.getPreviousPage() === '/profile';
    this.previousPath = this.localStorageService.getPreviousPage() || '/events';
  }

  public onPreview() {
    this.eventStore.setEditorValues(structuredClone(this._formsValues));
    const { dateInformation, eventInformation } = this._formsValues;
    const { images, duration, title, description, open, tags } = eventInformation;
    const dates: Dates[] = this.transformDatesFormToDates(dateInformation);
    const imagesUrl = images.map((value) => value.url);
    const sendEventDto: PagePreviewDTO = {
      title,
      description,
      eventDuration: duration,
      editorText: description,
      open,
      dates,
      tags: tags,
      imgArray: imagesUrl,
      imgArrayToPreview: imagesUrl,
      location: dateInformation[0].placeOnline.place
    };
    this.eventsService.setForm(sendEventDto);
    this.router.navigate(['events', 'preview']);
  }

  public clear() {
    const clearedForm = {
      eventInformation: undefined,
      dateInformation: undefined
    };
    this._formsValues = clearedForm;
    this.eventStore.setEditorValues(clearedForm);
    this.cancel(true);
  }

  public submitEvent(): void {
    console.log(this._formsValues);
    const { eventInformation, dateInformation } = this._formsValues;
    const { open, tags, editorText, title, images } = eventInformation;
    const dates: Dates[] = this.transformDatesFormToDates(dateInformation);
    let sendEventDto: EventDTO = {
      title,
      description: editorText,
      open,
      tags,
      datesLocations: dates
    };

    //TODO CAN WE CHANGE TITLE IMAGE?
    if (this.isUpdating) {
      const responseImages = this.initialForm.eventInformation.images.map((value) => value.url);
      const currentImages = this._savedFormValues.eventInformation.images.filter((value) => !value.file).map((value) => value.url);
      const removedImages = responseImages.filter((value) => !currentImages.includes(value));
      sendEventDto = {
        ...sendEventDto,
        imagesToDelete: removedImages,
        additionalImages: currentImages.slice(1),
        id: this.eventId,
        titleImage: responseImages[0]
      };
    }
    const formData: FormData = new FormData();
    const stringifyDataToSend = JSON.stringify(sendEventDto);
    const dtoName = this.isUpdating ? 'eventDto' : 'addEventDtoRequest';

    formData.append(dtoName, stringifyDataToSend);

    images.forEach((item) => {
      if (item.file) {
        formData.append('images', item.file);
      }
    });
    console.log('update work');
    this.createEvent(formData);
  }

  transformDatesFormToDates(form: DateInformation[]): Dates[] {
    return form.map((value) => {
      const { date, endTime, startTime } = value.dateTime;
      const { onlineLink, place, coordinates } = value.placeOnline;
      let [hours, minutes] = startTime.split(':');
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      const startDate = date.toISOString();

      [hours, minutes] = endTime.split(':');
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      const finishDate = date.toISOString();
      const dates: Dates = {
        startDate,
        finishDate,
        id: undefined
      };
      if (onlineLink) {
        dates.onlineLink = onlineLink;
      }
      if (place) {
        dates.coordinates = {
          latitude: coordinates.lat,
          longitude: coordinates.lng
        };
      }
      return dates;
    });
  }

  public escapeFromCreateEvent(): void {
    this.router.navigate(['/events']);
    this.eventSuccessfullyAdded();
  }

  public getLangValue(uaValue: string, enValue: string): string {
    return this.languageService.getLangValue(uaValue, enValue) as string;
  }

  private _checkValidness(key: any, valid: boolean) {
    if (valid) {
      this._invalidFormsMap.delete(key);
      if (this._invalidFormsMap.size === 0) {
        this.formsIsValid = true;
      }
    } else {
      this._invalidFormsMap.set(key, 0);
      this.formsIsValid = false;
    }
  }

  //TODO
  private eventSuccessfullyAdded(): void {
    if (this.isUpdating) {
      this.snackBar.openSnackBar('updatedEvent');
    }
    if (!this.isUpdating) {
      this.snackBar.openSnackBar('addedEvent');
    }
  }

  private createEvent(sendData: FormData) {
    this.isPosting = true;
    this.isUpdating
      ? this.store.dispatch(EditEcoEventAction({ data: sendData }))
      : this.store.dispatch(CreateEcoEventAction({ data: sendData }));

    this.actionsSubj.pipe(ofType(EventsActions.CreateEcoEventSuccess, EventsActions.EditEcoEventSuccess), take(1)).subscribe(() => {
      this.isPosting = false;
      this.eventsService.setForm(null);
      this.escapeFromCreateEvent();
    });
  }

  private checkUserSigned(): boolean {
    this.userId = this.localStorageService.getUserId();
    return this.userId != null && !isNaN(this.userId);
  }
}
