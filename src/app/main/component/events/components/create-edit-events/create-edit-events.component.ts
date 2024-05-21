import { Component, EventEmitter, Injector, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { quillConfig } from './quillEditorFunc';
import Quill from 'quill';
import 'quill-emoji/dist/quill-emoji.js';
import ImageResize from 'quill-image-resize-module';
import { Place } from '../../../places/models/place';
import {
  DateEventResponseDto,
  DateInformation,
  Dates,
  EventDTO,
  EventForm,
  EventInformation,
  EventPageResponseDto,
  FormCollectionEmitter,
  ImagesContainer,
  PagePreviewDTO,
  TagObj
} from '../../models/events.interface';
import { NavigationStart, Router } from '@angular/router';
import { EventsService } from '../../services/events.service';
import { Subscription } from 'rxjs';
import { WeekArray } from '../../models/event-consts';
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

@Component({
  selector: 'app-create-edit-events',
  templateUrl: './create-edit-events.component.html',
  styleUrls: ['./create-edit-events.component.scss']
})
export class CreateEditEventsComponent extends FormBaseComponent implements OnInit, OnDestroy {
  public quillModules = {};
  public places: Place[] = [];
  public checkdates: boolean;
  public isPosting = false;
  public dateArrCount = WeekArray;
  public editMode: boolean;
  public editEvent: EventPageResponseDto;
  public oldImages: string[] = [];
  public imagesForEdit: string[];
  public tags: Array<TagObj>;
  public isImageSizeError: boolean;
  public isImageTypeError = false;
  public images = singleNewsImages;
  public currentLang: string;
  public nameBtn = 'create-event.publish';
  public subscription: Subscription;
  public imgArray: Array<File> = [];
  public imgArrayToPreview: string[] = [];
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
  @Output() defaultImage = new EventEmitter<string>();
  public formsIsValid = false;
  private subscriptions: Subscription[] = [];
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
    private injector: Injector
  ) {
    super(router, dialog);
    this.quillModules = quillConfig;
    Quill.register('modules/imageResize', ImageResize);

    this.matSnackBar = injector.get(MatSnackBarComponent);
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

  ngOnDestroy() {
    this.subscriptions.forEach((value) => value.unsubscribe());
  }

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        take(1)
      )
      .subscribe((value: NavigationStart) => {
        console.log(value);
        if (!value.url.includes('preview')) {
          this.eventsService.editorFormValues = {
            dateInformation: undefined,
            eventInformation: undefined
          };
        }
      });

    this.editMode = this.localStorageService.getEditMode();
    if (this.editMode) {
      this.eventId = this.eventsService.getEventResponse().id;
      this.initialForm = this._transformResponseToForm(this.eventsService.getEventResponse());
      this._savedFormValues = this.initialForm;
    } else {
      this._savedFormValues = this.eventsService.editorFormValues;
    }
    if (!this.checkUserSigned()) {
      this.snackBar.openSnackBar('userUnauthorised');
    }

    this.routedFromProfile = this.localStorageService.getPreviousPage() === '/profile';
    this.previousPath = this.localStorageService.getPreviousPage() || '/events';
  }

  // TODO MAIN IMAGE DONT PASS
  public onPreview() {
    this.eventsService.editorFormValues = structuredClone(this._formsValues);
    const { dateInformation, eventInformation } = this._formsValues;
    const { images, duration, editorText, title, description, open, tags } = eventInformation;
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
    this.eventsService.editorFormValues = clearedForm;
    this.cancel(true);
  }

  public submitEvent(): void {
    const { eventInformation, dateInformation } = this._formsValues;
    const { open, tags, description, editorText, title, images, duration } = eventInformation;
    console.log(this._formsValues);
    const dates: Dates[] = this.transformDatesFormToDates(dateInformation);
    // console.log(dates);
    let sendEventDto: EventDTO = {
      title,
      description: editorText,
      open,
      tags,
      datesLocations: dates
    };

    //TODO CAN WE CHANGE TITLE IMAGE?
    if (this.editMode) {
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
    const dtoName = this.editMode ? 'eventDto' : 'addEventDtoRequest';

    formData.append(dtoName, stringifyDataToSend);

    images.forEach((item) => {
      if (item.file) {
        formData.append('images', item.file);
      }
    });

    this.createEvent(formData);
  }

  transformDatesFormToDates(form: DateInformation[]): Dates[] {
    return form.map((value) => {
      const { date, endTime, startTime, allDay } = value.dateTime;
      const { onlineLink, place, coordinates } = value.placeOnline;
      let [hours, minutes] = startTime.split(':');
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      const startDate = date.toISOString();

      [hours, minutes] = endTime.split(':');
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      console.log(date);
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

  private _transformResponseToForm(form: EventPageResponseDto): EventForm {
    const { title, description, open, dates, creationDate, id, titleImage, tags, additionalImages } = form;
    const tagsForm = tags.map((value) => value.nameEn);
    additionalImages.unshift(titleImage);
    const correctImages: ImagesContainer[] = additionalImages.map((value, index) => ({
      file: undefined,
      url: value,
      main: index === 0
    }));
    console.log(correctImages);
    //TODO
    const eventInformation: EventInformation = {
      title,
      description,
      open,
      duration: dates.length,
      editorText: description,
      tags: tagsForm,
      images: correctImages
    };
    const dateInformation: DateInformation[] = this._transformDatesToForm(form.dates);
    return {
      dateInformation,
      eventInformation
    };
  }

  private _transformDatesToForm(form: DateEventResponseDto[]): DateInformation[] {
    const place = form[0].coordinates.formattedAddressUa;
    const allPlace = form.every((value) => place === value.coordinates.formattedAddressUa);

    const link = form[0].onlineLink;
    const allLink = form.every((value) => link === value.onlineLink);

    return form.map((value, index) => {
      const { finishDate, startDate, onlineLink, coordinates } = value;
      const _startDate = new Date(startDate);
      const startHours = _startDate.getHours().toString().padStart(2, '0'); // Get hours and pad with leading zero if needed
      const startMinutes = _startDate.getMinutes().toString().padStart(2, '0');
      const formattedStartTime = `${startHours}:${startMinutes}`;
      _startDate.setHours(0, 0, 0, 0);

      const _endDate = new Date(finishDate);
      const endHours = _endDate.getHours().toString().padStart(2, '0'); // Get hours and pad with leading zero if needed
      const endMinutes = _endDate.getMinutes().toString().padStart(2, '0');
      const formattedEndTime = `${endHours}:${endMinutes}`;
      _startDate.setHours(0, 0, 0, 0);

      const place = this.languageService.getCurrentLanguage() === 'ua' ? coordinates.formattedAddressUa : coordinates.formattedAddressEn;

      return {
        dateTime: { startTime: formattedStartTime, date: _startDate, endTime: formattedEndTime, allDay: false },
        placeOnline: {
          appliedPlaceForAll: allPlace,
          appliedLinkForAll: allLink,
          place,
          onlineLink,
          coordinates: { lat: coordinates.latitude, lng: coordinates.longitude }
        }
      };
    });
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

  //TODO WHAT?
  private eventSuccessfullyAdded(): void {
    // if (this.editMode && this.eventFormGroup.valid) {
    //   this.snackBar.openSnackBar('updatedEvent');
    // }
    // if (!this.editMode && this.eventFormGroup.valid) {
    //   this.snackBar.openSnackBar('addedEvent');
    // }
  }

  private createEvent(sendData: FormData) {
    this.isPosting = true;
    this.editMode
      ? this.store.dispatch(EditEcoEventAction({ data: sendData }))
      : this.store.dispatch(CreateEcoEventAction({ data: sendData }));

    this.actionsSubj.pipe(ofType(EventsActions.CreateEcoEventSuccess, EventsActions.EditEcoEventSuccess)).subscribe(() => {
      this.isPosting = false;
      this.eventsService.setForm(null);
      this.escapeFromCreateEvent();
    });
  }

  private checkUserSigned(): boolean {
    this.getUserId();
    return this.userId != null && !isNaN(this.userId);
  }

  private getUserId() {
    this.userId = this.localStorageService.getUserId();
  }
}
