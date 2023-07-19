import { Component, OnDestroy, OnInit, Injector, Input } from '@angular/core';
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
import { Router } from '@angular/router';
import { EventsService } from '../../../events/services/events.service';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReplaySubject } from 'rxjs';
import { DateObj, ItemTime, TagsArray, WeekArray } from '../../models/event-consts';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { ActionsSubject, Store } from '@ngrx/store';
import { ofType } from '@ngrx/effects';
import { CreateEcoEventAction, EditEcoEventAction, EventsActions } from 'src/app/store/actions/ecoEvents.actions';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { singleNewsImages } from '../../../../image-pathes/single-news-images';
import { take } from 'rxjs/operators';
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
  public dates: DateEvent[] = [];
  public quillModules = {};
  public editorHTML = '';
  public isOpen = true;
  public places: Place[] = [];
  public checkdates: boolean;
  public isPosting = false;
  public contentValid: boolean;
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
  public isAddressFill = true;
  public eventFormGroup: FormGroup;
  public isImageSizeError: boolean;
  public isImageTypeError = false;
  public images = singleNewsImages;
  public currentLang: string;
  public routeData: any;
  public selectedFile = null;
  public selectedFileUrl: string;
  public files = [];

  private imgArray: Array<File> = [];
  private imgArrayToPreview: string[] = [];
  private pipe = new DatePipe('en-US');
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  private matSnackBar: MatSnackBarComponent;
  public userId: number;
  public isDateDuplicate = false;

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

  public backRoute: string;
  public routedFromProfile: boolean;
  public duplindx: number;
  editDates = false;
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
    private languageService: LanguageService
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
      description: new FormControl('', [Validators.required, Validators.minLength(28), Validators.maxLength(63206)]),
      eventDuration: new FormControl(this.selectedDay, [Validators.required, Validators.minLength(2)])
    });

    if (this.editMode) {
      this.editEvent = this.editMode ? this.localStorageService.getEventForEdit() : null;
      this.setEditValue();
    } else {
      this.dates = [{ ...DateObj }];
    }

    if (!this.checkUserSigned()) {
      this.snackBar.openSnackBar('userUnauthorised');
    }

    this.routedFromProfile = this.localStorageService.getPreviousPage() === '/profile';
    this.backRoute = this.localStorageService.getPreviousPage();
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
    this.isTagValid = this.tags.some((el) => el.isActive);
  }

  public checkForm(form: DateFormObj, ind: number): void {
    this.addressForPreview = form;
    this.duplindx = -1;
    const date = form.date?.toLocaleDateString();
    const datesArray = this.dates.map((item, index) => {
      if (index !== ind) {
        return item.date?.toLocaleDateString();
      }
    });
    this.isDateDuplicate = datesArray.includes(date);
    if (!this.isDateDuplicate) {
      this.dates[ind].date = form.date;
      this.dates[ind].startDate = form.startTime;
      this.dates[ind].finishDate = form.endTime;
      this.dates[ind].onlineLink = form.onlineLink;
    } else {
      this.duplindx = ind;
      this.dates.splice(ind, 1, { ...DateObj });
      this.editDates = true;
    }
    this.isAddressFill = this.dates.some((el) => el.coordinatesDto.latitude || el.onlineLink);
  }

  public checkStatus(event: boolean, ind: number): void {
    this.dates[ind].valid = event;
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

  public setDateCount(value: number): void {
    if ((this.dates.length === 1 && !this.dates[0].date) || this.editMode) {
      this.dates = Array(value)
        .fill(null)
        .map(() => ({ ...DateObj }));
    } else {
      const startInd = this.dates.length;
      this.dates.length = value;
      if (startInd > 0) {
        this.dates.fill({ ...DateObj }, startInd);
      }
    }
    this.dates.forEach((item) => (item.date = new Date(item.date)));
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

  public setCoordsOnlOff(event: OfflineDto, ind: number): void {
    this.dates[ind].coordinatesDto = event;
    this.isAddressFill = this.dates.some((el) => el.coordinatesDto.latitude || el.onlineLink);
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
    const defaultAddress = this.dates.find((it) => it.coordinatesDto.latitude)?.coordinatesDto;
    const defaultLink = this.dates.find((it) => it.onlineLink)?.onlineLink;
    return this.dates.reduce((ac, cur) => {
      if (!cur.startDate) {
        cur.startDate = ItemTime.START;
      }
      if (!cur.finishDate) {
        cur.finishDate = ItemTime.END;
      }
      const start = this.getFormattedDate(cur.date, +cur.startDate.split(':')[0], +cur.startDate.split(':')[1]);
      const end = this.getFormattedDate(cur.date, +cur.finishDate.split(':')[0], +cur.finishDate.split(':')[1]);

      const coords = cur.coordinatesDto.latitude
        ? {
            latitude: cur.coordinatesDto.latitude,
            longitude: cur.coordinatesDto.longitude
          }
        : defaultAddress;

      const date: Dates = {
        startDate: this.pipe.transform(start, 'yyyy-MM-ddTHH:mm:ssZZZZZ'),
        finishDate: this.pipe.transform(end, 'yyyy-MM-ddTHH:mm:ssZZZZZ'),
        coordinates: coords,
        onlineLink: cur.onlineLink ? cur.onlineLink : defaultLink
      };

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

    if (this.checkdates && this.eventFormGroup.valid && this.isTagValid && this.isAddressFill) {
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
      this.checkAfterSend = false;
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

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
