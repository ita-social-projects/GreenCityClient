import { Component, OnInit, Injector, Input, Output, EventEmitter } from '@angular/core';
import { quillConfig } from './quillEditorFunc';
import Quill from 'quill';
import 'quill-emoji/dist/quill-emoji.js';
import ImageResize from 'quill-image-resize-module';
import { Place } from '../../../places/models/place';
import {
  DateEvent,
  DateFormObj,
  Dates,
  EventDTO,
  EventPageResponceDto,
  OfflineDto,
  TagObj,
  PagePreviewDTO,
  DateEventResponceDto
} from '../../models/events.interface';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill';
import { Router } from '@angular/router';
import { EventsService } from '../../../events/services/events.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DateObj, TimeBack, TimeFront, TagsArray, WeekArray } from '../../models/event-consts';
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
export class CreateEditEventsComponent extends FormBaseComponent implements OnInit {
  public title = '';
  public dates: DateEvent[] = [];
  public quillModules = {};
  public editorHTML = '';
  public isOpen = true;
  public places: Place[] = [];
  public checkdates: boolean;
  public isPosting = false;
  public checkAfterSend = true;
  public dateArrCount = WeekArray;
  public selectedDay = WeekArray[0];
  public addressForPreview: DateFormObj;
  public editMode: boolean;
  public editEvent: EventPageResponceDto;
  public imagesToDelete: string[] = [];
  public oldImages: string[] = [];
  public imagesForEdit: string[];
  public tags: Array<TagObj>;
  public isTagValid: boolean;
  public arePlacesFilled: boolean[] = [];
  public eventFormGroup: FormGroup;
  public isImageSizeError: boolean;
  public isImageTypeError = false;
  public images = singleNewsImages;
  public currentLang: string;
  public routeData: any;
  public selectedFile = null;
  public selectedFileUrl: string;
  public previewDates: PagePreviewDTO | EventPageResponceDto;
  public submitSelected: boolean;
  public nameBtn = 'create-event.publish';

  public fromPreview: boolean;
  public editorText = '';
  private isDescriptionValid: boolean;
  public imgArray: Array<File> = [];
  public imgArrayToPreview: string[] = [];
  private matSnackBar: MatSnackBarComponent;
  public userId: number;
  public isDateDuplicate: boolean;
  private submitIsFalse = false;
  private destroy$: Subject<void> = new Subject<void>();
  public locationForAllDays: OfflineDto;
  public appliedForAllLocations: boolean;

  public previousPath: string;
  public isImagesArrayEmpty: boolean;
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
  public firstFormIsSucceed = true;
  public backRoute: string;
  public routedFromProfile: boolean;
  public duplindx = -1;
  editDates = false;
  private subscription: Subscription;
  @Input() cancelChanges: boolean;
  @Output() defaultImage = new EventEmitter<string>();

  constructor(
    private injector: Injector,
    public dialog: MatDialog,
    public router: Router,
    public localStorageService: LocalStorageService,
    private actionsSubj: ActionsSubject,
    private store: Store,
    private snackBar: MatSnackBarComponent,
    public dialogRef: MatDialogRef<DialogPopUpComponent>,
    private languageService: LanguageService,
    private eventsService: EventsService
  ) {
    super(router, dialog);
    this.quillModules = quillConfig;
    Quill.register('modules/imageResize', ImageResize);

    this.matSnackBar = injector.get(MatSnackBarComponent);
  }

  ngOnInit(): void {
    this.editMode = this.localStorageService.getEditMode();
    this.fromPreview = this.eventsService.getBackFromPreview();
    const submitFromPreview = this.eventsService.getSubmitFromPreview();
    this.tags = TagsArray.reduce((ac, cur) => [...ac, { ...cur }], []);
    this.eventFormGroup = new FormGroup({
      titleForm: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(70)]),
      description: new FormControl('', [Validators.required, Validators.minLength(20), Validators.maxLength(63206)]),
      eventDuration: new FormControl(this.selectedDay, [Validators.required, Validators.minLength(2)])
    });
    if (this.editMode && !this.fromPreview && !submitFromPreview) {
      this.setDates(true);
      this.setEditValue();
      this.isLocationForAllDays();
    } else if (submitFromPreview) {
      this.backFromPreview();
      this.isLocationForAllDays();
      setTimeout(() => this.onSubmit());
    } else if (this.fromPreview) {
      this.backFromPreview();
      this.isLocationForAllDays();
    } else {
      this.dates = [{ ...DateObj }];
    }

    if (!this.checkUserSigned()) {
      this.snackBar.openSnackBar('userUnauthorised');
    }

    this.routedFromProfile = this.localStorageService.getPreviousPage() === '/profile';
    this.previousPath = this.localStorageService.getPreviousPage() || '/events';
    this.eventsService.setInitialValueForPlaces();
    this.subscription = this.eventsService
      .getCheckedPlacesObservable()
      .pipe(takeUntil(this.destroy$))
      .subscribe((values) => {
        this.arePlacesFilled = values;
      });

    window.onpopstate = () => {
      this.toEventsList();
    };
  }

  get titleForm() {
    return this.eventFormGroup.get('titleForm');
  }

  public setEditValue(): void {
    this.eventFormGroup.patchValue({
      titleForm: this.editEvent.title,
      eventDuration: this.dateArrCount[this.editEvent.dates.length - 1],
      description: this.editEvent.description
    });
    this.imgArrayToPreview = [this.editEvent.titleImage, ...this.editEvent.additionalImages];
    this.setDateCount(this.editEvent.dates.length);
    this.imagesForEdit = [this.editEvent.titleImage, ...this.editEvent.additionalImages];
    this.tags.forEach((item) => (item.isActive = this.editEvent.tags.some((name) => name.nameEn === item.nameEn)));
    this.isTagValid = this.tags.some((el) => el.isActive);
    this.isOpen = this.editEvent.open;
    this.oldImages = this.imagesForEdit;
    this.editorText = this.editEvent.description;
    this.nameBtn = 'create-event.save-event';
  }

  private isLocationForAllDays(): void {
    const previewOrEdit = this.fromPreview ? 'previewDates' : 'editEvent';
    if (this[previewOrEdit].dates?.length > 1) {
      const { latitude, longitude } = this[previewOrEdit].dates[0].coordinates;
      const sameCoordinates = this[previewOrEdit].dates.every((el) => {
        return latitude === el.coordinates.latitude && longitude === el.coordinates.longitude;
      });

      if (sameCoordinates) {
        this.locationForAllDays = this[previewOrEdit].dates[0].coordinates;
        this.appliedForAllLocations = true;
      }
      this.firstFormIsSucceed = false;
    }
  }

  public setDates(init: boolean, dates?: DateEvent[] | DateEventResponseDto[]): void {
    let datesEvent: DateEvent[] | DateEventResponceDto[];
    if (init) {
      datesEvent = this.localStorageService.getEventForEdit().dates;
      this.editEvent = this.localStorageService.getEventForEdit();
    } else if (this.editMode) {
      datesEvent = dates;
      this.editEvent = this.localStorageService.getEventForEdit();
    } else {
      datesEvent = dates;
    }
    this.dates = (datesEvent as DateEventResponceDto[]).reduce((newDates: DateEvent[], currentDate: DateEventResponceDto) => {
      const { startDate, finishDate, check, valid } = currentDate;
      const date: DateEvent = { startDate, finishDate, check: init ? false : check, valid: init ? false : valid };
      if (currentDate.onlineLink) {
        date.onlineLink = currentDate.onlineLink;
      }
      if (currentDate.coordinates) {
        date.coordinates = { latitude: currentDate.coordinates.latitude, longitude: currentDate.coordinates.longitude };
      }
      newDates.push(date);
      return newDates;
    }, []);
  }

  private backFromPreview(): void {
    this.previewDates = this.eventsService.getForm();
    const { title, description, open, dates, tags, imgArray, editorText } = this.previewDates;
    this.setDates(false, dates);
    if (this.editMode) {
      this.imgArrayToPreview = imgArray;
      this.oldImages = imgArray;
    } else {
      this.imgArray = imgArray;
    }
    this.imagesForEdit = imgArray;
    this.isOpen = open;
    this.tags.forEach((item) => (item.isActive = tags.some((name: any) => name.nameEn === item.nameEn)));
    this.eventFormGroup.patchValue({
      titleForm: title,
      description,
      eventDuration: this.dateArrCount[dates.length - 1]
    });
    this.isDescriptionValid = editorText.length > 19;
    this.editorText = editorText;
  }

  public toEventsList(): void {
    this.fromPreview = false;
    this.eventsService.setBackFromPreview(false);
  }

  public checkTab(tag: TagObj): void {
    tag.isActive = !tag.isActive;
    this.checkAfterSend = this.tags.some((t) => t.isActive);
    this.isTagValid = this.tags.some((el) => el.isActive);
  }

  public checkFormSetDates(form, ind: number): void {
    this.addressForPreview = form;
    this.duplindx = -1;
    let date: string;
    if (form.date) {
      date = form.date.toLocaleDateString();
    }
    const datesArray = this.dates.map((item, index) => {
      if (index !== ind) {
        return item.date?.toLocaleDateString();
      }
    });
    this.isDateDuplicate = datesArray.some((d) => d === date);
    if (!this.isDateDuplicate || !form.date) {
      this.dates[ind].date = form.date;
      this.dates[ind].startDate = form.startTime;
      this.dates[ind].finishDate = form.endTime;
      this.dates[ind].onlineLink = form.onlineLink;
      if (form.coordinates) {
        this.dates[ind].coordinates = { latitude: form.coordinates.latitude, longitude: form.coordinates.longitude };
      }
    } else {
      this.duplindx = ind;
      this.dates[ind].date = null;
      this.editDates = true;
    }
  }

  public checkStatus(event: boolean, ind: number): void {
    this.dates[ind].valid = event;
  }

  public changedEditor(event: EditorChangeContent | EditorChangeSelection): void {
    if (event.event !== 'selection-change') {
      this.editorText = event.text.substring(event.text.length, 1);
    }
  }

  public handleErrorClass(errorClassName: string): string {
    const descriptionControl = this.eventFormGroup.get('description');
    this.isDescriptionValid = this.editorText.length > 19;
    this.isDescriptionValid
      ? descriptionControl.setErrors(null)
      : descriptionControl.setErrors({ invalidDescription: this.isDescriptionValid });
    return this.submitIsFalse && !this.isDescriptionValid ? errorClassName : '';
  }

  public changeEventType(): void {
    this.isOpen = !this.isOpen;
  }

  public setDateCount(length: number): void {
    this.firstFormIsSucceed = false;
    this.isDateDuplicate = false;
    if (length < this.dates.length) {
      this.duplindx = -1;
      this.dates = this.dates.slice(0, length);
    } else {
      const additionalDates = Array.from({ length: length - this.dates.length }, () => ({ ...DateObj }));
      this.dates.push(...additionalDates);
    }
    if (this.dates.length === 1) {
      this.firstFormIsSucceed = true;
    }
    this.eventsService.setArePlacesFilled(this.dates);
  }

  public getImageTosend(imageArr: Array<File>): void {
    this.imgArray = [...imageArr];
  }

  public getImagesToDelete(imagesSrc: Array<string>): void {
    this.imagesToDelete = imagesSrc;
    this.imgArrayToPreview = this.imgArrayToPreview.filter((img) => img !== imagesSrc[imagesSrc.length - 1]);
  }

  public getOldImages(imagesSrc: Array<string>): void {
    this.oldImages = imagesSrc;
  }

  public setCoordsOffline(coordinates: OfflineDto, ind: number): void {
    this.dates[ind].coordinates = coordinates;
    this.updateAreAddressFilled(this.dates, false, true, ind);
  }

  public applyCoordToAll(coordinates: OfflineDto): void {
    if (coordinates.latitude) {
      this.dates.forEach((date) => (date.coordinates = { ...coordinates }));
    }
    this.locationForAllDays = { ...coordinates };
    this.appliedForAllLocations = !!coordinates.latitude;
    this.updateAreAddressFilled(this.dates, true);
  }

  public setOnlineLink(link: string, ind: number): void {
    this.dates[ind].onlineLink = link;
    this.updateAreAddressFilled(this.dates, false, true, ind);
  }

  public updateAreAddressFilled(newValue: DateEvent[], submit?: boolean, check?: boolean, ind?: number): void {
    this.eventsService.setArePlacesFilled(newValue, submit, check, ind);
  }

  private checkDates(): void {
    this.dates.forEach((item) => {
      item.check = !item.valid;
    });
    this.checkdates = !this.dates.some((element) => !element.valid);
  }

  private createDates(): Array<Dates> {
    return this.dates.reduce((ac, cur) => {
      if (!cur.startDate) {
        cur.startDate = TimeBack.START;
      }
      if (!cur.finishDate || cur.finishDate === TimeFront.END) {
        cur.finishDate = TimeBack.END;
      }

      const date: Dates = {
        startDate: this.eventsService.transformDate(cur, 'startDate'),
        finishDate: this.eventsService.transformDate(cur, 'finishDate')
      };

      if (cur.onlineLink) {
        date.onlineLink = cur.onlineLink;
      }
      if (cur.coordinates?.latitude) {
        date.coordinates = { latitude: cur.coordinates.latitude, longitude: cur.coordinates.longitude };
      }
      ac.push(date);
      return ac;
    }, []);
  }

  public onSubmit(): void {
    this.submitSelected = true;
    this.eventsService.setSubmitFromPreview(false);
    this.checkDates();
    const datesDto: Dates[] = this.checkdates ? this.createDates() : [];
    const tagsArr: string[] = this.tags.filter((tag) => tag.isActive).map((tag) => tag.nameEn);

    let sendEventDto: EventDTO = {
      title: this.eventFormGroup.get('titleForm').value.trim(),
      description: this.eventFormGroup.get('description').value,
      open: this.isOpen,
      datesLocations: datesDto,
      tags: tagsArr
    };

    if (this.editMode) {
      sendEventDto = {
        ...sendEventDto,
        imagesToDelete: this.imagesToDelete,
        additionalImages: this.oldImages.length > 1 ? this.oldImages.slice(1) : null,
        id: this.editEvent.id,
        titleImage: this.oldImages[0]
      };
    }

    this.updateAreAddressFilled(this.dates, true);

    this.isTagValid = this.tags.some((el) => el.isActive);
    const isFormValid = this.checkdates && this.eventFormGroup.valid && this.isTagValid;
    const arePlacesFilled = this.arePlacesFilled.every((el) => !el);
    this.checkAfterSend = this.tags.some((t) => t.isActive);

    if (isFormValid && arePlacesFilled && this.isDescriptionValid) {
      this.checkAfterSend = true;
      this.isImagesArrayEmpty = this.editMode ? !this.imgArray.length && !this.imagesForEdit.length : !this.imgArray.length;

      setTimeout(() => {
        const formData = this.prepareFormData(sendEventDto);
        this.createEvent(formData);
      }, 250);
    } else {
      this.eventFormGroup.markAllAsTouched();
      this.checkAfterSend = this.isTagValid;
      this.submitIsFalse = true;
    }
  }

  private prepareFormData(sendEventDto: EventDTO): FormData {
    const formData: FormData = new FormData();
    const stringifiedDataToSend = JSON.stringify(sendEventDto);
    const dtoName = this.editMode ? 'eventDto' : 'addEventDtoRequest';

    formData.append(dtoName, stringifiedDataToSend);

    this.imgArray.forEach((item) => {
      formData.append('images', item);
    });

    return formData;
  }

  public backToEditing() {
    this.router.navigate(['/events', 'create-event']);
  }

  public escapeFromCreateEvent(): void {
    this.router.navigate(['/events']);
    this.eventSuccessfullyAdded();
  }

  private eventSuccessfullyAdded(): void {
    if (this.editMode && this.eventFormGroup.valid) {
      this.snackBar.openSnackBar('updatedEvent');
    }
    if (!this.editMode && this.eventFormGroup.valid) {
      this.snackBar.openSnackBar('addedEvent');
    }
  }

  public onPreview() {
    this.eventsService.setSubmitFromPreview(false);
    this.imgToData();
    const tagsArr: Array<string> = this.tags.filter((tag) => tag.isActive).reduce((ac, cur) => [...ac, cur], []);
    const sendEventDto: PagePreviewDTO = {
      title: this.eventFormGroup.get('titleForm').value.trim(),
      description: this.eventFormGroup.get('description').value,
      eventDuration: this.eventFormGroup.get('eventDuration').value,
      editorText: this.editorText,
      open: this.isOpen,
      dates: this.dates,
      tags: tagsArr,
      imgArray: this.editMode ? this.imgArrayToPreview : this.imgArray,
      imgArrayToPreview: this.imgArrayToPreview,
      location: this.addressForPreview
    };
    this.eventsService.setForm(sendEventDto);
    this.router.navigate(['events', 'preview']);
  }

  public applyCommonLocation(): void {
    this.dates.forEach((date) => (date.coordinates = { ...this.locationForAllDays }));
  }

  private imgToData(): void {
    this.imgArray.forEach((img) => {
      const reader: FileReader = new FileReader();
      reader.readAsDataURL(img);
      reader.onload = (ev) => this.handleFile(ev);
    });
  }

  private handleFile(event): void {
    const binaryString = event.target.result;
    const selectedFileUrl = binaryString;
    this.imgArrayToPreview.push(selectedFileUrl);
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

  public getLangValue(uaValue: string, enValue: string): string {
    return this.languageService.getLangValue(uaValue, enValue) as string;
  }
}
