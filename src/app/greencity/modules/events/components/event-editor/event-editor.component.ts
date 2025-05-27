import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { defaultCoordinates } from '@assets/mocks/events/mock-events';
import { MatSnackBarService } from '@global-service/mat-snack-bar/mat-snack-bar.service';
import { ofType } from '@ngrx/effects';
import { ActionsSubject, Store } from '@ngrx/store';
import moment from 'moment';
import Quill from 'quill';
import 'quill-emoji/dist/quill-emoji.js';
import ImageResize from 'quill-image-resize-module';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { singleNewsImages } from 'src/app/greencity/image-paths/single-news-images';
import { DialogPopUpComponent } from 'src/app/shared/components/dialog-pop-up/dialog-pop-up.component';
import { FormBaseComponent } from 'src/app/shared/components/form-base/form-base.component';
import { quillConfig } from 'src/app/shared/helpers/quillEditorFunc';
import { LanguageService } from 'src/app/shared/i18n/language.service';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { CreateEcoEventAction, EditEcoEventAction, EventsActions } from 'src/app/store/actions/ecoEvents.actions';
import { DateInformation, EventDto, FormControllers } from '../../models/events.interface';
import { EventStoreService } from '../../services/event-store.service';
import { EventsService } from '../../services/events.service';
import { customTextValidator, locationOrOnlineLinkValidator } from './validators/event-custom-validators';
import { Patterns } from '@assets/patterns/patterns';
@Component({
  selector: 'app-event-editor',
  templateUrl: './event-editor.component.html',
  styleUrls: ['./event-editor.component.scss']
})
export class EventEditorComponent extends FormBaseComponent implements OnInit, OnDestroy {
  isUpdating: boolean;
  @Input() cancelChanges: boolean;
  @Input({ required: true }) eventId: number;
  quillModules = {};
  isPosting: boolean;
  isFetching: boolean;
  isAuthor: boolean;
  authorId: number;
  images = singleNewsImages;
  submitButtonName = 'create-event.publish';
  subscription: Subscription;
  previousPath: string;
  eventForm: FormGroup;
  event: EventDto;
  routedFromProfile: boolean;

  private timePattern = Patterns.timePattern;
  constructor(
    private readonly eventStore: EventStoreService,
    public readonly dialog: MatDialog,
    router: Router,
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder,
    public readonly localStorageService: LocalStorageService,
    private readonly actionsSubj: ActionsSubject,
    private readonly store: Store,
    private readonly snackBar: MatSnackBarService,
    public readonly dialogRef: MatDialogRef<DialogPopUpComponent>,
    private readonly eventsService: EventsService,
    private readonly languageService: LanguageService,
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
        this.eventId = params['id'];
        if (this.eventId) {
          this.isFetching = true;
          this.isUpdating = true;
          this.submitButtonName = 'create-event.save-event';
          this.eventStore.setEventId(Number(this.eventId));
          this.eventsService.getEventById(this.eventId).subscribe({
            next: (response) => {
              this.event = response;
              this.eventsService.setEvent(response);
              this.authorId = response.organizer.id;
              this.isAuthor = this.authorId === userId;
              this.isFetching = false;
              this.createFormEvent();
              this.subscribeOnChangeDuration();
              this.cdRef.detectChanges();
            },
            error: (_) => {
              this.isFetching = false;
              this.isAuthor = false;
              this.cdRef.detectChanges();
            }
          });
        }
      });
    }
    if (!this.isFetching) {
      this.createFormEvent();
      this.subscribeOnChangeDuration();
    }
    this.routedFromProfile = this.localStorageService.getPreviousPage() === '/profile';
    this.previousPath = this.localStorageService.getPreviousPage() || '/events';
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
            const previousDate = previousDay ? new Date(previousDay.value.startDate) : new Date();

            const nextDate = new Date(previousDate.getTime() + 24 * 60 * 60 * 1000);
            this.eventDateForm.push(
              this.fb.group(
                {
                  day: [moment(nextDate.toISOString()), Validators.required],
                  startDate: [nextDate, Validators.required],
                  finishDate: [nextDate, Validators.required],
                  startTime: ['', [Validators.required, Validators.pattern(this.timePattern)]],
                  finishTime: ['', [Validators.required, Validators.pattern(this.timePattern)]],
                  allDay: [false],
                  minDate: [nextDate],
                  maxDate: [null],
                  coordinates: [defaultCoordinates],
                  onlineLink: new FormControl(''),
                  place: new FormControl(''),
                  appliedLinkForAll: [false],
                  appliedPlaceForAll: [false]
                },
                { validators: locationOrOnlineLinkValidator }
              )
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
        description: [information?.description ?? '', [Validators.required, customTextValidator]],
        open: [information?.open ?? true, Validators.required],
        duration: [information?.duration ?? 1, Validators.required],
        tags: [information?.tags ? information.tags.map((item) => item.nameEn) : [], [Validators.required, Validators.minLength(1)]]
      }),
      images: this.fb.array([]),
      dates: this.fb.array(date.length > 0 ? date.map((date) => this.createDateFormGroup(date)) : [this.createDateFormGroup()])
    });

    if (this.event?.titleImage) {
      this.imagesArray.push(new FormControl({ file: null, main: true, url: this.event.titleImage }));
    }
    if (this.event?.additionalImages) {
      this.event.additionalImages.forEach((additionalImage) =>
        this.imagesArray.push(new FormControl({ file: null, main: false, url: additionalImage }))
      );
    }
  }

  private createDateFormGroup(date?: DateInformation): FormGroup<FormControllers<DateInformation>> {
    return this.fb.group(
      {
        day: [date?.startDate ? moment(date.startDate) : moment()],
        startDate: [date?.startDate ? new Date(date.startDate) : new Date(), [Validators.required]],
        finishDate: [date?.finishDate ? new Date(date.finishDate) : new Date(), [Validators.required]],
        startTime: [
          date?.startDate
            ? // eslint-disable-next-line max-len
              `${new Date(date.startDate).getHours().toString().padStart(2, '0')}:${new Date(date.startDate).getMinutes().toString().padStart(2, '0')}`
            : '',
          [Validators.required, Validators.pattern(this.timePattern)]
        ],
        finishTime: [
          date?.finishDate
            ? // eslint-disable-next-line max-len
              `${new Date(date.finishDate).getHours().toString().padStart(2, '0')}:${new Date(date.finishDate).getMinutes().toString().padStart(2, '0')}`
            : '',
          [Validators.required, Validators.pattern(this.timePattern)]
        ],
        allDay: [date?.allDay ?? false],
        minDate: [date?.minDate ? new Date(date.minDate) : new Date()],
        maxDate: [date?.maxDate ? new Date(date.maxDate) : null],
        coordinates: [date?.coordinates ?? defaultCoordinates],
        onlineLink: new FormControl(date?.onlineLink ?? ''),
        place: new FormControl(''),
        appliedLinkForAll: [date?.appliedLinkForAll ?? false],
        appliedPlaceForAll: [date?.appliedPlaceForAll ?? false]
      },
      { validators: [locationOrOnlineLinkValidator] }
    );
  }

  onPreview(): void {
    this.eventsService.setEvent(this.eventForm.value);
    this.router.navigate(['greenCity/events/', 'preview']);
  }

  submitEvent(): void {
    const formData = this.eventsService.prepareForSumbit(
      this.eventInformation.value,
      this.eventDateForm.value,
      this.imagesArray.value,
      this.eventId,
      this.isUpdating
    );

    this.createEvent(formData);
  }

  clear(): void {
    this.eventForm.reset();
  }

  escapeFromCreateEvent(): void {
    this.router.navigate(['/greenCity/events']);
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
      this.eventSuccessfullyAdded();
      this.escapeFromCreateEvent();
    });
    this.actionsSubj.pipe(ofType(EventsActions.ReceivedFailure), take(1)).subscribe(({ error }) => {
      this.isPosting = false;
      this.snackBar.openSnackBar(error);
      this.escapeFromCreateEvent();
    });
  }

  ngOnDestroy(): void {
    if (this.router.url !== '/greenCity/events/preview') {
      this.eventsService.setEvent(null);
    }
  }
}
