import { MapsAPILoader } from '@agm/core';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, OnDestroy, Output, ViewChild } from '@angular/core';
import { DateEventResponseDto, DateFormObj, OfflineDto, InitialStartDate, DateEvent } from '../../models/events.interface';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Patterns } from 'src/assets/patterns/patterns';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { EventsService } from 'src/app/main/component/events/services/events.service';
import { TimeFront, TimeBack, DefaultCoordinates } from '../../models/event-consts';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-event-date-time-picker',
  templateUrl: './event-date-time-picker.component.html',
  styleUrls: ['./event-date-time-picker.component.scss']
})
export class EventDateTimePickerComponent implements OnInit, OnChanges, OnDestroy {
  public minDate = new Date();
  public timeArrStart = [];
  public timeArrEnd = [];

  public timeArr: Array<string> = [];

  public coordinates: OfflineDto = {
    latitude: DefaultCoordinates.LATITUDE,
    longitude: DefaultCoordinates.LONGITUDE
  };
  public onlineLink = '';

  public zoom = 8;
  address: string;

  public autocomplete: google.maps.places.Autocomplete;
  private pipe = new DatePipe('en-US');
  public checkedAllDay = false;
  private checkAllDay = false;
  public checkOfflinePlace = false;
  public checkOnlinePlace = false;
  public isAllDayDisabled = false;
  public isPlaceDisabled = false;
  public isLinkDisabled: boolean;
  public isLocationDisabled: boolean;
  public isFirstDay: boolean;
  public readyToApplyLocation: boolean;
  public readyToApplyLink: boolean;
  private regionOptions = {
    types: ['address'],
    componentRestrictions: { country: 'UA' }
  };
  public duplindex: number;

  @Input() appliedForAllLocations: boolean;
  @Input() check: boolean;
  @Input() editDate: DateEventResponseDto;
  @Input() isDateDuplicate: boolean;
  @Input() editDates: boolean;
  @Input() firstFormIsSucceed: boolean;
  @Input() locationForAllDays: OfflineDto;
  @Input() linkForAllDays: string;
  @Input() index: number;
  @Input() duplindx: number;
  @Input() fromPreview: boolean;
  @Input() previewData: DateEvent;
  @Input() submitSelected: boolean;
  @Input() appliedForAllLink: boolean;

  @Output() status = new EventEmitter<boolean>();
  @Output() datesForm = new EventEmitter<DateFormObj>();
  @Output() coordOffline = new EventEmitter<OfflineDto>();
  @Output() linkOnline = new EventEmitter<string>();
  @Output() applyCoordToAll = new EventEmitter<OfflineDto>();
  @Output() applyLinkToAll = new EventEmitter<string>();

  @ViewChild('placesRef') placesRef: ElementRef;

  public dateForm: FormGroup;
  public currentLang: string;
  public isLocationSelected = false;
  public arePlacesFilled: boolean[] = [];
  private subscriptions: Subscription[] = [];

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private langService: LanguageService,
    private eventsService: EventsService,
    private adapter: DateAdapter<any>
  ) {}

  ngOnInit(): void {
    const curDate = new Date();
    const curDay = curDate.getDate();
    this.minDate.setDate(curDay + (curDate.getHours() !== 23 ? 0 : 1));
    this.fillTimeArray();

    const { initialDate, initialStartTime } = this.initialStartTime();
    this.dateForm = new FormGroup({
      date: new FormControl(initialDate, [Validators.required]),
      startTime: new FormControl(initialStartTime, [Validators.required]),
      endTime: new FormControl('', [Validators.required]),
      coordinates: new FormControl({ latitude: null, longitude: null }),
      onlineLink: new FormControl(this.onlineLink, [Validators.pattern(Patterns.linkPattern)]),
      place: new FormControl('')
    });
    const startTime = this.dateForm.get('startTime').value;
    const endTime = this.dateForm.get('endTime').value;
    this.updateTimeArrays(startTime, endTime);
    if (this.firstFormIsSucceed) {
      this.datesForm.emit(this.dateForm.value);
    }

    this.dateForm.valueChanges.subscribe((value) => {
      this.updateTimeArrays(value.startTime, value.endTime);
      this.status.emit(this.dateForm.valid);
      this.datesForm.emit(this.dateForm.getRawValue());
      if (this.dateForm.get('date').value) {
        this.duplindex = -1;
      }
    });

    if ((this.editDate && !this.editDates) || this.fromPreview) {
      if (this.locationForAllDays?.latitude) {
        this.isLocationDisabled = true;
        this.applyLocationForAllDays();
      }

      if (this.linkForAllDays) {
        this.applyLinkForAllDays();
      }
      this.readyToApplyLocation = true;
      this.setDataEditing();
    }
    if (this.appliedForAllLocations) {
      this.applyLocationForAllDays();
    }

    if (this.appliedForAllLink) {
      this.applyLinkForAllDays();
    }

    this.langService.getCurrentLangObs().subscribe((lang) => {
      const locale = lang !== 'ua' ? 'en-GB' : 'uk-UA';
      this.adapter.setLocale(locale);
      this.getCoordinates();
    });

    const isAddressFilledSubscription = this.eventsService.getCheckedPlacesObservable().subscribe((values) => {
      this.arePlacesFilled = values;
    });
    this.subscriptions.push(isAddressFilledSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  get startTime() {
    return this.dateForm.get('startTime');
  }

  get endTime() {
    return this.dateForm.get('endTime');
  }

  get date() {
    return this.dateForm.get('date');
  }

  get place() {
    return this.dateForm.get('place');
  }

  private initialStartTime(editMode?: boolean): InitialStartDate {
    let initialDate;
    let initialStartTime = '';
    if (this.firstFormIsSucceed || editMode) {
      const currentHour = new Date().getHours();
      initialDate = currentHour !== 23 ? new Date() : this.minDate;
      initialStartTime = currentHour !== 23 ? `${currentHour + 1}${TimeFront.DIVIDER}${TimeFront.MINUTES}` : TimeFront.START;
    } else {
      initialDate = null;
    }
    return { initialDate, initialStartTime };
  }

  private setDataEditing(): void {
    const data = this.fromPreview ? 'fromPreview' : 'editDate';

    const startEditTime = this.pipe.transform(this.fromPreview ? this.previewData?.startDate : this.editDate.startDate, 'H:mm');
    const isMidnight = /T00:00:\d{2}\+\d{2}:\d{2}/.test(this.previewData?.finishDate);
    let endEditTime = this.pipe.transform(
      this.fromPreview ? this.previewData?.finishDate : this.editDate.finishDate,
      isMidnight ? 'HH:mm' : 'H:mm'
    );

    if (endEditTime === TimeBack.END) {
      endEditTime = TimeFront.END;
    }
    if (endEditTime === TimeFront.END && startEditTime === TimeFront.START) {
      this.checkedAllDay = true;
      this.dateForm.get('startTime').disable();
      this.dateForm.get('endTime').disable();
    }
    if (this.hasTheDatePassed('startDate', data)) {
      this.dateForm.get('date').disable();
      this.dateForm.get('startTime').disable();
      this.isAllDayDisabled = true;
    }
    if (this.hasTheDatePassed('finishDate', data)) {
      this.dateForm.get('endTime').disable();
      this.isLinkDisabled = true;
      this.dateForm.get('onlineLink').disable();
    }

    this.dateForm.patchValue({
      date: this.fromPreview ? this.previewData?.date : new Date(this.editDate.startDate),
      startTime: startEditTime,
      endTime: endEditTime
    });

    this.handleCoordinatesAndOnlineLink(data);
  }

  private handleCoordinatesAndOnlineLink(data: string): void {
    const isCoordinates = this.fromPreview ? this.previewData?.coordinates : this.editDate.coordinates;
    const isOnlineLink = this.fromPreview ? this.previewData?.onlineLink : this.editDate.onlineLink;

    if (isCoordinates) {
      this.handleCoordinates();
      if (this.hasTheDatePassed('finishDate', data)) {
        this.isPlaceDisabled = true;
        this.dateForm.get('place').disable();
      }
      this.isLocationSelected = true;
    }

    if (isOnlineLink) {
      this.handleOnlineLink();
    }
  }

  private handleCoordinates(): void {
    this.checkOfflinePlace = true;
    this.dateForm.addControl('place', new FormControl('', [Validators.required]));
    this.dateForm.addControl('coordinates', new FormControl(''));
    setTimeout(() => this.setPlaceAutocomplete(), 0);
    this.updateCoordinates();
  }

  private updateCoordinates(): void {
    const sourceCoordinates = this.fromPreview ? this.previewData.coordinates : this.editDate.coordinates;
    this.coordinates.latitude = sourceCoordinates.latitude;
    this.coordinates.longitude = sourceCoordinates.longitude;
    this.zoom = 8;

    const coordinates = { latitude: sourceCoordinates.latitude, longitude: sourceCoordinates.longitude };

    this.dateForm.patchValue({
      place: this.fromPreview ? this.previewData.coordinates : this.eventsService.getFormattedAddress(this.editDate.coordinates),
      coordinates
    });
  }

  private handleOnlineLink(): void {
    this.checkOnlinePlace = true;
    this.dateForm.addControl('onlineLink', new FormControl(this.onlineLink, [Validators.pattern(Patterns.linkPattern)]));
    this.dateForm.patchValue({
      onlineLink: this.fromPreview ? this.previewData.onlineLink : this.editDate.onlineLink
    });
  }

  public getCoordinates(): void {
    if (this.editDate) {
      this.dateForm.patchValue({ place: this.eventsService.getFormattedAddress(this.editDate.coordinates) });
    }
  }

  private hasTheDatePassed(date: string, data = 'editDate'): boolean {
    return new Date().getTime() >= new Date(this[data][date]).getTime();
  }

  public checkIfAllDay(): void {
    this.checkedAllDay = !this.checkedAllDay;
    const startTime = this.dateForm.get('startTime');
    const endTime = this.dateForm.get('endTime');
    if (this.checkedAllDay) {
      startTime.disable();
      endTime.disable();
    } else {
      startTime.enable();
      endTime.enable();
    }
    if (this.checkDay()) {
      const initialStartTime = this.initialStartTime(true).initialStartTime;
      startTime.setValue(initialStartTime);
    } else {
      startTime.setValue(this.timeArr[0]);
    }
    endTime.setValue(this.timeArr[24]);
  }

  ngOnChanges(): void {
    if (this.check) {
      this.dateForm.markAllAsTouched();
    }
    if (this.isDateDuplicate && this.index === this.duplindx) {
      this.duplindex = this.duplindx;
      this.dateForm.patchValue({ date: null });
      this.dateForm.get('date').markAsTouched();
    }
    this.applyLocationForAllDays();
    this.applyLinkForAllDays();
  }

  public toggleForAllLocations(): void {
    if (!this.appliedForAllLocations) {
      this.applyCoordToAll.emit(this.coordinates);
    } else {
      this.applyCoordToAll.emit({ longitude: null, latitude: null });
    }
  }

  public toggleForAllLinks(): void {
    const link = this.dateForm.get('onlineLink').value;
    if (!this.appliedForAllLink) {
      this.applyLinkToAll.emit(link);
    } else {
      this.applyLinkToAll.emit('');
    }
  }

  private applyLocationForAllDays(): void {
    this.isFirstDay = 0 === this.index;
    if (this.dateForm) {
      if (this.locationForAllDays !== undefined && !this.isFirstDay) {
        this.setupLocationControls();
      }
      const shouldResetLocation = this.locationForAllDays?.latitude === null ? !this.isFirstDay && !this.locationForAllDays.latitude : null;
      if (shouldResetLocation) {
        this.resetLocationControls();
      }
    }
  }

  private applyLinkForAllDays(): void {
    this.isFirstDay = 0 === this.index;
    if (this.dateForm) {
      if (this.linkForAllDays && !this.isFirstDay) {
        this.setupLinkControls();
      }
      if (!this.appliedForAllLink && !this.isFirstDay) {
        this.resetLinkControls();
      }
    }
  }

  private setupLocationControls(): void {
    this.dateForm.addControl('place', new FormControl('', [Validators.required]));
    this.onChangePickerOnMap(this.locationForAllDays, true);
    this.checkOfflinePlace = true;
    this.isLocationDisabled = true;
    this.dateForm.patchValue({
      coordinates: { latitude: this.coordinates.latitude, longitude: this.coordinates.longitude }
    });
    this.dateForm.get('place').disable();
    this.isPlaceDisabled = true;
  }

  private setupLinkControls(): void {
    this.dateForm.addControl('onlineLink', new FormControl(''));
    this.checkOnlinePlace = true;
    this.dateForm.patchValue({
      onlineLink: this.linkForAllDays
    });
    this.dateForm.get('onlineLink').disable();
  }

  private resetLocationControls(): void {
    this.checkOfflinePlace = !this.checkOfflinePlace;
    this.coordinates = { latitude: null, longitude: null };
    this.dateForm.patchValue({
      coordinates: { latitude: this.coordinates.latitude, longitude: this.coordinates.longitude }
    });
    this.coordOffline.emit(this.coordinates);
    this.dateForm.removeControl('place');
    this.isLocationSelected = false;
    this.isLocationDisabled = false;
    this.isPlaceDisabled = false;
  }

  private resetLinkControls(): void {
    if (this.onlineLink.trim().length) {
      this.checkOnlinePlace = !this.checkOnlinePlace;
    }

    this.linkForAllDays = '';
    this.dateForm.patchValue({
      onlineLink: this.linkForAllDays
    });
    this.dateForm.removeControl('onlineLink');
  }

  private setCurrentLocation(): void {
    if (this.editDate) {
      return;
    }
    navigator.geolocation.getCurrentPosition((position) => {
      if (position.coords) {
        this.coordinates.latitude = position.coords.latitude;
        this.coordinates.longitude = position.coords.longitude;
        this.zoom = 8;
        this.getAddress(position.coords.latitude, position.coords.longitude);
        this.coordOffline.emit(this.coordinates);
        this.readyToApplyLocation = true;
      }
    });
  }

  public checkIfOnline(): void {
    this.checkOnlinePlace = !this.checkOnlinePlace;
    if (this.checkOnlinePlace) {
      this.dateForm.addControl('onlineLink', new FormControl(this.onlineLink, [Validators.pattern(Patterns.linkPattern)]));
      this.dateForm.get('onlineLink').valueChanges.subscribe((newValue) => {
        this.linkOnline.emit(newValue);
      });
    } else {
      if (this.appliedForAllLink) {
        this.toggleForAllLinks();
      }
      this.dateForm.removeControl('onlineLink');
      this.linkOnline.emit('');
    }
  }

  public checkIfOffline(): void {
    this.checkOfflinePlace = !this.checkOfflinePlace;
    if (this.checkOfflinePlace) {
      this.coordinates.latitude = DefaultCoordinates.LATITUDE;
      this.coordinates.longitude = DefaultCoordinates.LONGITUDE;
      this.isLocationSelected = true;
      this.dateForm.addControl('place', new FormControl('', [Validators.required]));
      setTimeout(() => this.setPlaceAutocomplete(), 0);
    } else {
      if (this.appliedForAllLocations) {
        this.toggleForAllLocations();
      }
      this.coordinates.latitude = null;
      this.coordinates.longitude = null;
      this.coordOffline.emit(this.coordinates);
      this.autocomplete.unbindAll();
      this.dateForm.removeControl('place');
      this.dateForm.removeControl('coordinates');
      this.isLocationSelected = false;
    }
  }

  private setPlaceAutocomplete(): void {
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.autocomplete = new google.maps.places.Autocomplete(this.placesRef.nativeElement, this.regionOptions);
      this.autocomplete.addListener('place_changed', () => {
        const locationName = this.autocomplete.getPlace();
        if (locationName.formatted_address) {
          this.coordinates.latitude = locationName.geometry.location.lat();
          this.coordinates.longitude = locationName.geometry.location.lng();
          this.coordOffline.emit(this.coordinates);
          this.isLocationSelected = true;
          this.readyToApplyLocation = true;
          if (this.appliedForAllLocations) {
            this.applyCoordToAll.emit(this.coordinates);
          }
        } else {
          this.isLocationSelected = false;
        }
      });
    });
  }

  public onChangePickerOnMap(event, applyToAll?: boolean): void {
    this.coordinates.latitude = !applyToAll ? event.coords.lat : event.latitude;
    this.coordinates.longitude = !applyToAll ? event.coords.lng : event.longitude;
    this.isLocationSelected = true;
    setTimeout(() => this.getAddress(this.coordinates.latitude, this.coordinates.longitude));
  }

  private getAddress(latitude: number, longitude: number) {
    const geoCoder = new google.maps.Geocoder();
    geoCoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        this.address = results[0].formatted_address;
        this.dateForm.get('place').setValue(this.address);
        this.isLocationSelected = true;
      } else {
        this.isLocationSelected = false;
      }
    });
  }

  private fillTimeArray(): void {
    this.timeArr = [];
    this.timeArrStart = [];
    this.timeArrEnd = [];
    for (let i = 0; i < 24; i++) {
      this.timeArr.push(`${i}${TimeFront.DIVIDER}${TimeFront.MINUTES}`);
      this.timeArrStart.push(`${i}${TimeFront.DIVIDER}${TimeFront.MINUTES}`);
      this.timeArrEnd.push(`${i + 1}${TimeFront.DIVIDER}${TimeFront.MINUTES}`);
    }
    this.timeArr.push(TimeFront.END);
    this.timeArrEnd[23] = TimeFront.END;
  }

  private checkEndTime(time: string, curTime?: number): void {
    if (time) {
      const checkTime = time.split(TimeFront.DIVIDER)[0] === TimeFront.MINUTES ? 24 : Number(time.split(TimeFront.DIVIDER)[0]);
      this.timeArrStart = curTime !== null ? [...this.timeArr.slice(curTime + 1, checkTime)] : [...this.timeArr.slice(0, checkTime)];
    }
  }

  private checkStartTime(time: string): void {
    if (time) {
      const checkTime = Number(time.split(TimeFront.DIVIDER)[0]);
      this.timeArrEnd = [...this.timeArr.slice(checkTime + 1)];
    }
  }

  private checkDay(): boolean {
    const curDay = new Date().toDateString();
    const selectDay = new Date(this.dateForm.get('date').value).toDateString();
    return curDay === selectDay;
  }

  private updateTimeArrays(startTime: string, endTime: string): void {
    this.fillTimeArray();
    const curTime = new Date().getHours();
    const startDatePassed = this.editDate && this.hasTheDatePassed('startDate');

    if (startDatePassed && !this.hasTheDatePassed('finishDate')) {
      this.timeArrEnd = [...this.timeArr.slice(curTime + 1)];
      return;
    }

    if (this.checkAllDay || startDatePassed) {
      return;
    }

    if (this.checkDay()) {
      this.timeArrStart = [...this.timeArr.slice(curTime + 1, 24)];
      this.checkStartTime(startTime);
      this.checkEndTime(endTime, curTime);
    } else {
      this.checkStartTime(startTime);
      this.checkEndTime(endTime);
    }
  }

  public getLangValue(uaValue: string, enValue: string): string {
    return this.langService.getLangValue(uaValue, enValue) as string;
  }
}
