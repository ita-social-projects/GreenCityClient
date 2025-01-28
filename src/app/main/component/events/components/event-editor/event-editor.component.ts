import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { ofType } from '@ngrx/effects';
import { ActionsSubject, Store } from '@ngrx/store';
import { FormBaseComponent } from '@shared/components/form-base/form-base.component';
import Quill from 'quill';
import 'quill-emoji/dist/quill-emoji.js';
import ImageResize from 'quill-image-resize-module';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { singleNewsImages } from 'src/app/main/image-pathes/single-news-images';
import { DialogPopUpComponent } from 'src/app/shared/dialog-pop-up/dialog-pop-up.component';
import { CreateEcoEventAction, EditEcoEventAction, EventsActions } from 'src/app/store/actions/ecoEvents.actions';
import { Place } from '../../../places/models/place';
import { DefaultCoordinates } from '../../models/event-consts';
import {
  DateInformation,
  Dates,
  EventDTO,
  EventForm,
  EventInformation,
  EventResponse,
  FormControllers,
  NewEvent,
  TagObj
} from '../../models/events.interface';
import { EventStoreService } from '../../services/event-store.service';
import { EventsService } from '../../services/events.service';
import { quillConfig } from './quillEditorFunc';
import moment from 'moment';

@Component({
  selector: 'app-event-editor',
  templateUrl: './event-editor.component.html',
  styleUrls: ['./event-editor.component.scss']
})
export class EventEditorComponent extends FormBaseComponent implements OnInit {
  isUpdating: boolean;
  @Input() cancelChanges: boolean;
  @Input({ required: true }) eventId: number;
  quillModules = {};
  places: Place[] = [];
  isPosting: boolean;
  isFetching: boolean;
  isAuthor: boolean;
  authorId: number;
  tags: Array<TagObj>;
  images = singleNewsImages;
  submitButtonName = 'create-event.publish';
  subscription: Subscription;
  previousPath: string;
  eventForm: FormGroup;
  event: NewEvent;
  routedFromProfile: boolean;

  constructor(
    public readonly dialog: MatDialog,
    public readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder,
    public readonly localStorageService: LocalStorageService,
    private readonly actionsSubj: ActionsSubject,
    private readonly store: Store,
    private readonly snackBar: MatSnackBarComponent,
    public readonly dialogRef: MatDialogRef<DialogPopUpComponent>,
    private readonly eventsService: EventsService,
    private readonly eventStoreService: EventStoreService,
    private readonly cdRef: ChangeDetectorRef
  ) {
    super(router, dialog);
    this.quillModules = quillConfig;
    Quill.register('modules/imageResize', ImageResize);
  }

  get eventInformation(): FormGroup {
    return this.eventForm.get('eventInformation') as FormGroup;
  }

  get eventDateForm(): FormArray {
    return this.eventForm.get('dates') as FormArray;
  }

  get imagesArray(): FormArray {
    return this.eventForm.get('images') as FormArray;
  }

  ngOnInit(): void {
    this.event = this.eventsService.getEvent();
    if (!this.event) {
      const userId = this.localStorageService.getUserId();
      this.route.params.subscribe((params) => {
        const isAuthor = this.authorId === userId;
        this.eventId = params['id'];
        console.log(isAuthor && this.eventId);
        if (isAuthor && this.eventId) {
          this.isFetching = true;
          this.isUpdating = true;
          this.submitButtonName = 'create-event.save-event';
          this.eventStoreService.setEventId(Number(this.eventId));
          this.eventsService.getEventById(this.eventId).subscribe({
            next: (response) => {
              // this.event = response
              // this.eventsService.setEvent(response)
              this.authorId = response.organizer.id;
              this.isAuthor = this.authorId === userId;
              this.isFetching = false;
              this.cdRef.detectChanges();
            },
            error: (error) => {
              this.isFetching = false;
              this.isAuthor = false;
              this.cdRef.detectChanges();
            }
          });
        }
      });
    }
    this.createFormEvent();
    this.routedFromProfile = this.localStorageService.getPreviousPage() === '/profile';
    this.previousPath = this.localStorageService.getPreviousPage() || '/events';
    this.subscribeOnChangeDuration();
  }

  private subscribeOnChangeDuration(): void {
    this.eventForm
      .get('eventInformation')
      .get('duration')
      .valueChanges.subscribe((numberDays: number) => {
        const currentLength = this.eventDateForm.length;

        if (currentLength > numberDays) {
          for (let i = currentLength - 1; i >= numberDays; i--) {
            this.eventDateForm.removeAt(i, { emitEvent: false });
          }
        } else {
          for (let i = currentLength; i < numberDays; i++) {
            const previousDay = this.eventDateForm.at(i - 1);
            const previousDate = previousDay ? new Date(previousDay.value.day.startDate) : new Date();

            const nextDate = new Date(previousDate.getTime() + 24 * 60 * 60 * 1000);

            this.eventDateForm.push(
              this.fb.group({
                day: [moment(nextDate), Validators.required],
                startDate: [nextDate, Validators.required],
                finishDate: [nextDate, Validators.required],
                startTime: ['', Validators.required],
                finishTime: ['', Validators.required],
                allDay: [false],
                minDate: [nextDate],
                maxDate: [null],
                coordinates: [
                  {
                    latitude: DefaultCoordinates.LATITUDE,
                    longitude: DefaultCoordinates.LONGITUDE,
                    streetEn: '',
                    streetUa: '',
                    houseNumber: '',
                    cityEn: '',
                    cityUa: '',
                    regionEn: '',
                    regionUa: '',
                    countryEn: '',
                    countryUa: '',
                    formattedAddressEn: '',
                    formattedAddressUa: ''
                  }
                ],
                onlineLink: new FormControl(''),
                place: new FormControl(''),
                appliedLinkForAll: [false],
                appliedPlaceForAll: [false]
              })
            );
          }
        }

        this._updateDateRanges();
      });
  }
  private _updateDateRanges(): void {
    this.eventDateForm.controls.forEach((dayGroup, index) => {
      const currentDay = new Date(dayGroup.get('startDate').value);
      /* eslint-disable indent */
      const prevDate = index > 0 ? new Date(this.eventDateForm.at(index - 1).get('startDate').value) : null;
      /* eslint-disable indent */
      const nextDate = index < this.eventDateForm.length - 1 ? new Date(this.eventDateForm.at(index).get('startDate').value) : null;
      console.log(prevDate, nextDate);
      dayGroup.get('minDate').setValue(prevDate ? new Date(prevDate.getTime() + 24 * 60 * 60 * 1000) : currentDay);
      dayGroup.get('maxDate').setValue(nextDate ? nextDate : null);
    });
  }

  private createFormEvent(): void {
    const information = this.event?.eventInformation;
    const date = this.event?.dates ?? [];

    this.eventForm = this.fb.group({
      eventInformation: this.fb.group({
        title: [information?.title ?? '', [Validators.required, Validators.maxLength(70)]],
        description: [information?.description ?? '', [Validators.required, Validators.minLength(20)]],
        open: [information?.open ?? true, Validators.required],
        duration: [information?.duration ?? 1, Validators.required],
        tags: [information?.tags ?? [], [Validators.required, Validators.minLength(1)]]
      }),
      images: this.fb.array([]),
      dates: this.fb.array(date.length > 0 ? date.map((date) => this.createDateFormGroup(date)) : [this.createDateFormGroup()]),
      titleImage: [this.event?.titleImage ?? undefined],
      additionalImages: [this.event?.additionalImages ?? undefined]
    });
  }

  private createDateFormGroup(date?: DateInformation): FormGroup<FormControllers<DateInformation>> {
    return this.fb.group({
      day: [date?.startDate ? moment(date.startDate) : moment()],
      startDate: [date?.startDate ? new Date(date.startDate) : new Date(), [Validators.required]],
      finishDate: [date?.finishDate ? new Date(date.finishDate) : new Date(), [Validators.required]],
      startTime: [date?.startDate ? `${new Date(date.startDate).getHours()}:${new Date(date.startDate).getMinutes()}` : ''],
      finishTime: [date?.finishDate ? `${new Date(date.finishDate).getHours()}:${new Date(date.finishDate).getMinutes()}` : ''],
      allDay: [date?.allDay ?? false],
      minDate: [date?.minDate ? new Date(date.minDate) : new Date()],
      maxDate: [date?.maxDate ? new Date(date.maxDate) : null],
      coordinates: [
        date?.coordinates ?? {
          latitude: DefaultCoordinates.LATITUDE,
          longitude: DefaultCoordinates.LONGITUDE,
          streetEn: '',
          streetUa: '',
          houseNumber: '',
          cityEn: '',
          cityUa: '',
          regionEn: '',
          regionUa: '',
          countryEn: '',
          countryUa: '',
          formattedAddressEn: '',
          formattedAddressUa: ''
        }
      ],
      onlineLink: new FormControl(date?.onlineLink ?? ''),
      place: new FormControl(date?.place ?? ''),
      appliedLinkForAll: [date?.appliedLinkForAll ?? false],
      appliedPlaceForAll: [date?.appliedPlaceForAll ?? false]
    });
  }

  onPreview(): void {
    const currentRoute = this.router.url;
    this.cdRef.detectChanges();

    if (currentRoute.includes('create-event')) {
      this.eventsService.setIsFromCreateEvent(true);
    } else {
      this.eventsService.setIsFromCreateEvent(false);
    }

    this.eventsService.setEvent(this.eventForm.value);
    this.router.navigate(['events', 'preview']);
  }

  submitEvent(): void {
    // const { eventInformation, dateInformation } = this.eventForm.value;
    // const { open, tags, description, title, images } = eventInformation;
    // const dates: Dates[] = this.transformDatesFormToDates(dateInformation);
    // let sendEventDto: EventDTO = {
    //   title,
    //   description: description,
    //   open,
    //   tags,
    //   datesLocations: dates
    // };
    // if (this.isUpdating) {
    //   if (!this.eventId) {
    //     const urlSegments = this.router.url.split('/');
    //     this.eventId = Number(urlSegments[urlSegments.length - 1]);
    //   }
    //   const currentImages = (images || []).filter((value) => !value.file).map((value) => value.url);
    //   sendEventDto = {
    //     ...sendEventDto,
    //     additionalImages: currentImages.slice(1),
    //     id: this.eventId,
    //     titleImage: currentImages[0]
    //   };
    // }
    // const formData: FormData = new FormData();
    // const stringifyDataToSend = JSON.stringify(sendEventDto);
    // const dtoName = this.isUpdating ? 'eventDto' : 'addEventDtoRequest';
    // formData.append(dtoName, stringifyDataToSend);
    // images.forEach((item) => {
    //   if (item.file) {
    //     formData.append('images', item.file);
    //   }
    // });
    // const formData = this.eventsService.prepareEventForSubmit(this.eventForm.value, this.eventId, this.isUpdating);
    // this.createEvent(formData);
  }

  clear(): void {
    this.eventForm.reset();
  }

  escapeFromCreateEvent(): void {
    this.router.navigate(['/events']);
    this.eventSuccessfullyAdded();
  }

  private eventSuccessfullyAdded(): void {
    if (this.isUpdating) {
      this.snackBar.openSnackBar('updatedEvent');
    }
    if (!this.isUpdating) {
      this.snackBar.openSnackBar('addedEvent');
    }
  }

  private createEvent(sendData: FormData): void {
    this.isPosting = true;
    this.isUpdating
      ? this.store.dispatch(EditEcoEventAction({ data: sendData, id: this.eventId }))
      : this.store.dispatch(CreateEcoEventAction({ data: sendData }));

    this.actionsSubj.pipe(ofType(EventsActions.CreateEcoEventSuccess, EventsActions.EditEcoEventSuccess), take(1)).subscribe(() => {
      this.isPosting = false;
      this.escapeFromCreateEvent();
    });
  }
}
