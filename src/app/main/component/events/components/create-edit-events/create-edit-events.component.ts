import { Component, EventEmitter, Injector, Input, OnDestroy, OnInit, Output } from '@angular/core';
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
  EventPageResponseDto,
  FormCollectionEmitter,
  PagePreviewDTO,
  TagObj
} from '../../models/events.interface';
import { Router } from '@angular/router';
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

@Component({
  selector: 'app-create-edit-events',
  templateUrl: './create-edit-events.component.html',
  styleUrls: ['./create-edit-events.component.scss']
})
export class CreateEditEventsComponent extends FormBaseComponent implements OnInit, OnDestroy {
  public title = '';
  public quillModules = {};
  public isOpen = true;
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
    return this._formsValues;
  }

  checkFormInformation({ form, valid, key }: FormCollectionEmitter<unknown>, type: string) {
    console.log(key);
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
    this.editMode = this.localStorageService.getEditMode();
    this._formsValues = this.eventsService.editorFormValues;
    if (!this.checkUserSigned()) {
      this.snackBar.openSnackBar('userUnauthorised');
    }

    this.routedFromProfile = this.localStorageService.getPreviousPage() === '/profile';
    this.previousPath = this.localStorageService.getPreviousPage() || '/events';
  }

  public onPreview() {
    this.eventsService.setSubmitFromPreview(false);
    this.eventsService.editorFormValues = this._formsValues;
    // this.imgToData();
    //const tagsArr: Array<string> = this.tags.filter((tag) => tag.isActive).reduce((ac, cur) => [...ac, cur], []);
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

  public onSubmit(): void {
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

    const formData: FormData = new FormData();
    const stringifyDataToSend = JSON.stringify(sendEventDto);
    const dtoName = this.editMode ? 'eventDto' : 'addEventDtoRequest';

    formData.append(dtoName, stringifyDataToSend);

    images.forEach((item) => {
      formData.append('images', item.file);
    });
    this.createEvent(formData);
    if (this.editMode) {
      sendEventDto = {
        ...sendEventDto,
        imagesToDelete: [],
        additionalImages: this.oldImages.length > 1 ? this.oldImages.slice(1) : null,
        id: this.editEvent.id,
        titleImage: this.oldImages[0]
      };
    }
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
      const finishDate = date.toISOString();
      const dates: Dates = {
        startDate,
        finishDate,
        coordinates: {
          latitude: coordinates.lat,
          longitude: coordinates.lng
        },
        id: undefined
      };
      if (onlineLink) {
        dates.onlineLink = onlineLink;
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
