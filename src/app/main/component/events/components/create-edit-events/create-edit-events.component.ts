import { Component, OnInit, Injector, Input, ChangeDetectionStrategy } from '@angular/core';
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
  PagePreviewDTO
} from '../../models/events.interface';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill';
import { Router } from '@angular/router';
import { EventsService } from '../../../events/services/events.service';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DateObj, ItemTime, TagsArray, WeekArray } from '../../models/event-consts';
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
  styleUrls: ['./create-edit-events.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
  public files = [];

  private editorText = '';
  private imgArray: Array<File> = [];
  private imgArrayToPreview: string[] = [];
  private pipe = new DatePipe('en-US');
  private matSnackBar: MatSnackBarComponent;
  public userId: number;
  public isDateDuplicate = false;
  private submitIsFalse = false;
  private destroy$: Subject<void> = new Subject<void>();

  public previousPath = '/events';
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

  constructor(
    private injector: Injector,
    public dialog: MatDialog,
    public router: Router,
    private localStorageService: LocalStorageService,
    private actionsSubj: ActionsSubject,
    private store: Store,
    private eventService: EventsService,
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
    this.tags = TagsArray.reduce((ac, cur) => [...ac, { ...cur }], []);
    this.eventFormGroup = new FormGroup({
      titleForm: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(70)]),
      description: new FormControl('', [Validators.required, Validators.minLength(20), Validators.maxLength(63206)]),
      eventDuration: new FormControl(this.selectedDay, [Validators.required, Validators.minLength(2)])
    });
    if (this.editMode) {
      this.editEvent = this.editMode ? this.localStorageService.getEventForEdit() : null;
      this.dates = this.editEvent.dates.reduce((newDates, currentDate) => {
        const { startDate, finishDate } = currentDate;
        const date: DateEvent = { startDate, finishDate, check: false, valid: false };
        if (currentDate.onlineLink) {
          date.onlineLink = currentDate.onlineLink;
        }
        if (currentDate.coordinates) {
          date.coordinatesDto = { latitude: currentDate.coordinates.latitude, longitude: currentDate.coordinates.longitude };
        }
        newDates.push(date);
        return newDates;
      }, []);
      this.setEditValue();
      this.editorText = this.eventFormGroup.get('description').value;
    } else {
      this.dates = [{ ...DateObj }];
    }

    if (!this.checkUserSigned()) {
      this.snackBar.openSnackBar('userUnauthorised');
    }

    this.routedFromProfile = this.localStorageService.getPreviousPage() === '/profile';
    this.backRoute = this.localStorageService.getPreviousPage();
    this.eventsService.setInitialValueForPlaces();
    this.subscription = this.eventsService
      .getCheckedPlacesObservable()
      .pipe(takeUntil(this.destroy$))
      .subscribe((values) => {
        this.arePlacesFilled = values;
      });
  }

  get titleForm() {
    return this.eventFormGroup.get('titleForm');
  }

  private setEditValue(): void {
    this.eventFormGroup.patchValue({
      titleForm: this.editEvent.title,
      eventDuration: this.dateArrCount[this.editEvent.dates.length - 1],
      description: this.editEvent.description
    });
    this.setDateCount(this.editEvent.dates.length);
    this.imagesForEdit = [this.editEvent.titleImage, ...this.editEvent.additionalImages];
    this.tags.forEach((item) => (item.isActive = this.editEvent.tags.some((name) => name.nameEn === item.nameEn)));
    this.isTagValid = this.tags.some((el) => el.isActive);
    this.isOpen = this.editEvent.open;
    this.oldImages = this.imagesForEdit;
  }

  public checkTab(tag: TagObj): void {
    tag.isActive = !tag.isActive;
    this.checkAfterSend = this.tags.some((t) => t.isActive);
    this.isTagValid = this.tags.some((el) => el.isActive);
  }

  public checkFormSetDates(form: DateFormObj, ind: number): void {
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
    this.isDateDuplicate = datesArray.includes(date);
    if (!this.isDateDuplicate || !form.date) {
      this.dates[ind].date = form.date;
      this.dates[ind].startDate = form.startTime;
      this.dates[ind].finishDate = form.endTime;
      this.dates[ind].onlineLink = form.onlineLink;
      this.dates[ind].coordinatesDto = form.coordinatesDto;
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
      this.editorText = event.text;
    }
  }

  public handleErrorClass(errorClassName: string): string {
    const descriptionControl = this.eventFormGroup.get('description');
    const isValidDescription = this.editorText.length > 20;
    if (!isValidDescription) {
      descriptionControl.setErrors({ invalidDescription: isValidDescription });
    } else {
      descriptionControl.setErrors(null);
    }
    return this.submitIsFalse && !isValidDescription ? errorClassName : '';
  }

  public escapeFromCreateEvent(): void {
    this.router.navigate(['/events']);
  }

  public changeToOpen(): void {
    this.isOpen = true;
  }

  public changeToClose(): void {
    this.isOpen = false;
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
    this.eventsService.setArePlacesFilled(this.dates);
  }

  public getImageTosend(imageArr: Array<File>): void {
    this.imgArray = [...imageArr];
    this.checkFileExtensionAndSize(imageArr);
  }

  public getImagesToDelete(imagesSrc: Array<string>): void {
    this.imagesToDelete = imagesSrc;
  }

  public getOldImages(imagesSrc: Array<string>): void {
    this.oldImages = imagesSrc;
  }

  public setCoordsOffline(coordinates: OfflineDto, ind: number): void {
    this.dates[ind].coordinatesDto = coordinates;
    this.updateAreAddressFilled(this.dates, false, true, ind);
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

  private getFormattedDate(dateString: Date, hour: number, min: number): string {
    const date = new Date(dateString);
    date.setHours(hour, min);
    return date.toString();
  }

  private createDates(): Array<Dates> {
    return this.dates.reduce((ac, cur) => {
      if (!cur.startDate) {
        cur.startDate = ItemTime.START;
      }
      if (!cur.finishDate || cur.finishDate === '00:00') {
        cur.finishDate = ItemTime.END;
      }
      const start = this.getFormattedDate(cur.date, +cur.startDate.split(':')[0], +cur.startDate.split(':')[1]);
      const end = this.getFormattedDate(cur.date, +cur.finishDate.split(':')[0], +cur.finishDate.split(':')[1]);

      const date: Dates = {
        startDate: this.pipe.transform(start, 'yyyy-MM-ddTHH:mm:ssZZZZZ'),
        finishDate: this.pipe.transform(end, 'yyyy-MM-ddTHH:mm:ssZZZZZ')
      };
      if (cur.onlineLink) {
        date.onlineLink = cur.onlineLink;
      }
      if (cur.coordinatesDto.latitude) {
        date.coordinates = { latitude: cur.coordinatesDto.latitude, longitude: cur.coordinatesDto.longitude };
      }
      ac.push(date);
      return ac;
    }, []);
  }

  public onSubmit(): void {
    this.checkDates();

    let datesDto: Array<Dates>;
    if (this.checkdates) {
      datesDto = this.createDates();
    }
    const tagsArr: Array<string> = this.tags.filter((tag) => tag.isActive).reduce((ac, cur) => [...ac, cur.nameEn], []);

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

    const checks = this.checkdates && this.eventFormGroup.valid && this.isTagValid;
    if (checks && this.arePlacesFilled.every((el) => !el)) {
      this.checkAfterSend = true;
      const formData: FormData = new FormData();
      const stringifiedDataToSend = JSON.stringify(sendEventDto);

      const dtoName = this.editMode ? 'eventDto' : 'addEventDtoRequest';

      formData.append(dtoName, stringifiedDataToSend);

      this.imgArray.forEach((item) => {
        formData.append('images', item);
      });
      this.createEvent(formData);
    } else {
      this.eventFormGroup.markAllAsTouched();
      this.checkAfterSend = this.isTagValid;
      this.submitIsFalse = true;
    }
  }

  public backToEditing() {
    this.router.navigate(['/events', 'create-event']);
  }

  public onPreview() {
    this.imgToData();
    const tagsArr: Array<string> = this.tags.filter((tag) => tag.isActive).reduce((ac, cur) => [...ac, cur], []);
    const sendEventDto: PagePreviewDTO = {
      title: this.eventFormGroup.get('titleForm').value.trim(),
      description: this.eventFormGroup.get('description').value,
      open: this.isOpen,
      datesLocations: this.dates,
      tags: tagsArr,
      imgArray: this.imgArrayToPreview,
      location: this.addressForPreview
    };
    this.eventService.setForm(sendEventDto);
    this.router.navigate(['events', 'preview']);
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
    this.imgArray.forEach((img) => {
      this.files.push({ url: selectedFileUrl, file: img });
    });
    this.files.forEach((file) => {
      this.imgArrayToPreview.push(file.url);
    });
  }

  private createEvent(sendData: FormData) {
    this.isPosting = true;
    this.editMode
      ? this.store.dispatch(EditEcoEventAction({ data: sendData }))
      : this.store.dispatch(CreateEcoEventAction({ data: sendData }));

    this.actionsSubj.pipe(ofType(EventsActions.CreateEcoEventSuccess, EventsActions.EditEcoEventSuccess)).subscribe(() => {
      this.isPosting = false;
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

  private checkFileExtensionAndSize(file: any): void {
    this.isImageSizeError = file.size >= 10485760;
    this.isImageTypeError = !(file.type === 'image/jpeg' || file.type === 'image/png');
  }

  public getLangValue(uaValue: string, enValue: string): string {
    return this.languageService.getLangValue(uaValue, enValue) as string;
  }
}
