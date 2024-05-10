import { Component, EventEmitter, Injector, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { quillConfig } from './quillEditorFunc';
import Quill from 'quill';
import 'quill-emoji/dist/quill-emoji.js';
import ImageResize from 'quill-image-resize-module';
import { Place } from '../../../places/models/place';
import { DateForm, Dates, EventDTO, EventInformation, EventPageResponseDto, PagePreviewDTO, TagObj } from '../../models/events.interface';
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
import { FormBridgeService } from '../../services/form-bridge.service';

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
  informationForm: EventInformation;
  public informationFormStatus;
  dateFormsStatus: boolean;
  private subscriptions: Subscription[] = [];
  private datesForm: DateForm[];
  private matSnackBar: MatSnackBarComponent;

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
    private bridge: FormBridgeService,
    private injector: Injector
  ) {
    super(router, dialog);
    this.quillModules = quillConfig;
    Quill.register('modules/imageResize', ImageResize);

    this.matSnackBar = injector.get(MatSnackBarComponent);
  }

  setDatesForm(forms: DateForm[]) {
    this.datesForm = forms;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((value) => value.unsubscribe());
  }

  subToDatesFormsStatus() {
    const sub = this.bridge.$datesFormsIsValid.subscribe((value) => {
      this.dateFormsStatus = value;
      this.checkFormsValid();
    });
    this.subscriptions.push(sub);
  }

  ngOnInit(): void {
    this.subToDatesFormsStatus();

    this.editMode = this.localStorageService.getEditMode();

    if (!this.checkUserSigned()) {
      this.snackBar.openSnackBar('userUnauthorised');
    }

    this.routedFromProfile = this.localStorageService.getPreviousPage() === '/profile';
    this.previousPath = this.localStorageService.getPreviousPage() || '/events';
  }

  public onPreview() {
    this.eventsService.setSubmitFromPreview(false);
    // this.imgToData();
    //const tagsArr: Array<string> = this.tags.filter((tag) => tag.isActive).reduce((ac, cur) => [...ac, cur], []);
    const informationForm = this.informationForm;
    console.log(informationForm);
    const dates: Dates[] = this.transformDatesFormToDates(this.datesForm);
    const imagesUrl = this.informationForm.images.map((value) => value.url);
    const sendEventDto: PagePreviewDTO = {
      title: informationForm.title,
      description: informationForm.description,
      eventDuration: informationForm.duration,
      editorText: informationForm.description,
      open: informationForm.open,
      dates: dates,
      tags: informationForm.tags,
      imgArray: this.editMode ? this.imgArrayToPreview : this.imgArray,
      imgArrayToPreview: imagesUrl,
      location: this.datesForm[0].place
    };
    this.eventsService.setForm(sendEventDto);
    this.router.navigate(['events', 'preview']);
  }

  transformDatesFormToDates(form: DateForm[]): Dates[] {
    return form.map((value) => {
      let [hours, minutes] = value.timeRange.startTime.split(':');
      const date = new Date(value.date);
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      const startDate = date.toISOString();

      [hours, minutes] = value.timeRange.endTime.split(':');
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      const finishDate = date.toISOString();
      const dates: Dates = {
        startDate,
        finishDate,
        coordinates: {
          latitude: value.coordinates.lat,
          longitude: value.coordinates.lng
        },
        id: undefined
      };
      if (value.onlineLink) {
        dates.onlineLink = value.onlineLink;
      }
      return dates;
    });
  }

  public onSubmit(): void {
    const { open, tags, description, editorText, title, images, duration } = this.informationForm;
    const imagesFiles = images.map((value) => value.file);
    // const datesDto: Dates[] = this.checkdates ? this.createDates() : [];
    // const tagsArr: string[] = this.tags.filter((tag) => tag.isActive).map((tag) => tag.nameEn);
    const dates: Dates[] = this.transformDatesFormToDates(this.datesForm);
    const sendEventDto: EventDTO = {
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
    // if (this.editMode) {
    //   sendEventDto = {
    //     ...sendEventDto,
    //     imagesToDelete: this.imagesToDelete,
    //     additionalImages: this.oldImages.length > 1 ? this.oldImages.slice(1) : null,
    //     id: this.editEvent.id,
    //     titleImage: this.oldImages[0]
    //   };
    // }
  }

  public escapeFromCreateEvent(): void {
    this.router.navigate(['/events']);
    this.eventSuccessfullyAdded();
  }

  checkFormsValid() {
    this.formsIsValid = this.informationFormStatus && this.dateFormsStatus;
  }

  handleInformationStatus({ status, form }: { status: boolean; form: EventInformation }) {
    this.informationFormStatus = status;
    this.informationForm = form;
    this.checkFormsValid();
  }

  public getLangValue(uaValue: string, enValue: string): string {
    return this.languageService.getLangValue(uaValue, enValue) as string;
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
