import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { DateEvent, DateEventResponseDto, DateFormObj, OfflineDto } from '../../models/events.interface';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Patterns } from 'src/assets/patterns/patterns';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { EventsService } from 'src/app/main/component/events/services/events.service';
import { DefaultCoordinates, TimeBack, TimeFront } from '../../models/event-consts';
import { DateAdapter } from '@angular/material/core';
import { GoogleMap } from '@angular/google-maps';
import { GeocoderService } from '@global-service/geocoder/geocoder.service';
import { FormBridgeService } from '../../services/form-bridge.service';

@Component({
  selector: 'app-event-date-time-picker',
  templateUrl: './event-date-time-picker.component.html',
  styleUrls: ['./event-date-time-picker.component.scss']
})
export class EventDateTimePickerComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
  @ViewChild('placesRef') placesRef: ElementRef;
  public timeArrStart = [];
  public timeArrEnd = [];
  public timeArr: Array<string> = [];

  public coordinates: google.maps.LatLngLiteral = {
    lat: DefaultCoordinates.LATITUDE,
    lng: DefaultCoordinates.LONGITUDE
  };
  public isCurrentDay = true;
  public currentDay: Date = new Date();
  public onlineLink = '';
  address: string;
  public autocomplete: google.maps.places.Autocomplete;
  public checkedAllDay = false;
  public checkOfflinePlace = false;
  public checkOnlinePlace = false;
  public isAllDayDisabled = false;
  public isPlaceDisabled = false;
  public isLinkDisabled: boolean;
  public isLocationDisabled: boolean;
  public isFirstDay: boolean;
  public readyToApplyLocation: boolean;
  public readyToApplyLink: boolean;
  public subscription: Subscription;
  public duplindex: number;
  @Input() appliedForAllLocations: boolean;
  @Input() check: boolean;
  @Input() editDate: DateEventResponseDto;
  @Input() isDateDuplicate: boolean;
  @Input() editDates: boolean;
  @Input() firstFormIsSucceed: boolean;
  @Input() locationForAllDays: google.maps.LatLngLiteral;
  @Input() linkForAllDays: string;
  @Input() dayNumber: number;
  @Input() duplindx: number;
  @Input() fromPreview: boolean;
  @Input() previewData: DateEvent;
  @Input() submitSelected: boolean;
  @Input() appliedForAllLink: boolean;

  @Output() status = new EventEmitter<boolean>();
  @Output() datesForm = new EventEmitter<DateFormObj>();
  @Output() coordOffline = new EventEmitter<OfflineDto>();
  @Output() linkOnline = new EventEmitter<string>();
  @Output() applyCoordsToAll = new EventEmitter<OfflineDto>();
  @Output() applyLinkToAll = new EventEmitter<string>();

  public dateForm: FormGroup;
  public currentLang: string;
  public isLocationSelected = false;
  public arePlacesFilled: boolean[] = [];
  public mapMarkerCoords: google.maps.LatLngLiteral = { lng: null, lat: null };
  key = crypto.randomUUID();
  public mapOptions: google.maps.MapOptions = {
    center: this.coordinates,
    zoom: 8,
    gestureHandling: 'greedy',
    minZoom: 4,
    maxZoom: 20,
    mapId: this.key
  };
  public today: Date;
  binded = this.dateFilter.bind(this);
  private componentKey = Symbol('key');
  private pipe = new DatePipe('en-US');
  private checkAllDay = false;
  private regionOptions = {
    types: ['address'],
    componentRestrictions: { country: 'UA' }
  };
  private subscriptions: Subscription[] = [];

  constructor(
    private langService: LanguageService,
    private eventsService: EventsService,
    private adapter: DateAdapter<any>,
    private geocoderService: GeocoderService,
    private bridge: FormBridgeService
  ) {}

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

  initializeForm() {
    const initialStartTime = this.initialStartTime();
    this.dateForm = new FormGroup({
      date: new FormControl('', [Validators.required]),
      startTime: new FormControl(initialStartTime, [Validators.required]),
      endTime: new FormControl('', [Validators.required]),
      coordinates: new FormControl({ lat: null, lnt: null }),
      onlineLink: new FormControl('', [Validators.pattern(Patterns.linkPattern)]),
      place: new FormControl('')
    });
    this.updateTimeArrays(initialStartTime, this.dateForm.get('endTime').value); // Use initialStartTime
  }

  initializeGeocoder() {
    const sub = this.geocoderService.$getGeocoderResult(this.componentKey).subscribe((result: google.maps.GeocoderResult[]) => {
      const address = result[0].formatted_address;
      this.dateForm.patchValue({
        coordinates: this.coordinates,
        place: address
      });
      this.isLocationSelected = true;
      console.log(this.appliedForAllLocations);
      if (this.appliedForAllLocations) {
        this.bridge.setLocationForAll({ address, coords: this.coordinates });
      }
    });
    this.subscriptions.push(sub);
  }

  subscribeToFormChanges() {
    const sub = this.dateForm.valueChanges.subscribe((value) => {
      this.updateTimeArrays(value.startTime, value.endTime);
      this.status.emit(this.dateForm.valid);
      this.datesForm.emit(this.dateForm.getRawValue());
    });
    this.subscriptions.push(sub);
  }

  setDay(date: Date, n: number) {
    const newDate = new Date(date.getTime()); // Create a copy to avoid modifying the original
    newDate.setDate(newDate.getDate() + n);
    const dateString = newDate.toDateString();
    this.bridge.changeDay(this.dayNumber, undefined);
    return newDate;
  }

  subscribeToLocationChanges() {
    const sub = this.bridge.$locationUpdate().subscribe((update) => {
      console.log('IMHERE');
      this.isLocationDisabled = true;
      this.dateForm.get('place').disable();
      this.dateForm.patchValue({ coordinates: update.coords, place: update.address });
    });
    this.subscriptions.push(sub);
  }

  ngOnInit(): void {
    this.today = this.setDay(new Date(), this.dayNumber);
    this.fillTimeArray();
    this.initializeGeocoder();
    this.initializeForm();
    this.subscribeToFormChanges();

    if (this.dayNumber > 0) {
      this.subscribeToLocationChanges();
    }

    if ((this.editDate && !this.editDates) || this.fromPreview) {
      if (this.locationForAllDays?.lat) {
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
    this.dateForm.statusChanges.subscribe((status) => {
      if (status === 'VALID') {
        this.bridge.updateFormStatus(true, this.componentKey);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.bridge.deleteRecordFromDayMap(this.dayNumber);
  }

  public getCoordinates(): void {
    if (this.editDate) {
      this.dateForm.patchValue({ place: this.eventsService.getFormattedAddress(this.editDate.coordinates) });
    }
  }

  public toggleAllDay(): void {
    this.checkedAllDay = !this.checkedAllDay;
    const startTime = this.dateForm.get('startTime');
    const endTime = this.dateForm.get('endTime');
    let startValue: string;
    [startTime, endTime].forEach((control) => control[this.checkedAllDay ? 'disable' : 'enable']());
    if (this.isCurrentDay) {
      const currentHour = new Date().getHours();
      startValue = this.timeArr[currentHour + 1];
    } else {
      startValue = this.timeArr[0];
    }
    this.dateForm.patchValue({ startTime: startValue, endTime: this.timeArr[24] });
  }

  ngAfterViewInit() {
    // this.setPlaceAutocomplete();
  }

  ngOnChanges(): void {
    if (this.check) {
      this.dateForm.markAllAsTouched();
    }
    if (this.isDateDuplicate && this.dayNumber === this.duplindx) {
      this.duplindex = this.duplindx;
      this.dateForm.patchValue({ date: null });
      this.dateForm.get('date').markAsTouched();
    }
    this.applyLocationForAllDays();
    this.applyLinkForAllDays();
  }

  public toggleForAllLocations(): void {
    this.appliedForAllLocations = !this.appliedForAllLocations;
    if (!this.appliedForAllLocations) {
      this.applyCoordsToAll.emit(this.coordinates);
    } else {
      this.applyCoordsToAll.emit({ lng: null, lat: null });
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

  public toggleLocation(): void {
    this.checkOfflinePlace = !this.checkOfflinePlace;
    if (this.checkOfflinePlace) {
      this.coordinates.lat = DefaultCoordinates.LATITUDE;
      this.coordinates.lng = DefaultCoordinates.LONGITUDE;
      this.isLocationSelected = true;
      this.dateForm.addControl('place', new FormControl('', [Validators.required]));
      setTimeout(() => {
        this.setPlaceAutocomplete();
      }, 0);
    } else {
      if (this.appliedForAllLocations) {
        this.toggleForAllLocations();
      }
      this.coordinates.lat = null;
      this.coordinates.lng = null;
      this.coordOffline.emit(this.coordinates);
      this.autocomplete.unbindAll();
      this.dateForm.removeControl('place');
      this.dateForm.removeControl('coordinates');
      this.isLocationSelected = false;
    }
  }

  public setPlaceAutocomplete(): void {
    this.setCurrentLocation();
    this.autocomplete = new google.maps.places.Autocomplete(this.placesRef.nativeElement, this.regionOptions);
    this.autocomplete.addListener('place_changed', () => {
      const locationName = this.autocomplete.getPlace();
      if (locationName.formatted_address) {
        const lat = locationName.geometry.location.lat();
        const lng = locationName.geometry.location.lng();
        const coords = { lat, lng };
        this.coordinates = coords;
        this.updateMapAndLocation(coords);
        this.coordOffline.emit(this.coordinates);
        this.dateForm.patchValue({
          place: locationName.formatted_address,
          coordinatesDto: { latitude: this.coordinates.lat, longitude: this.coordinates.lng }
        });
        this.isLocationSelected = false;
      } else {
        this.isLocationSelected = true;
      }
    });
  }

  public mapClick(event: google.maps.MapMouseEvent): void {
    const coords = event.latLng.toJSON();
    this.updateMapAndLocation(coords);
    this.isLocationSelected = true;
  }

  dateFilter(date: Date | null): boolean {
    if (!date) {
      return false; // Handle invalid dates
    }
    const time = date.getTime();
    // Search for prevDate efficiently using a loop with a maximum search depth
    let prevDate: Date | undefined;
    const maxSearchDepth = this.bridge.getDaysLength(); // Adjust this as needed (e.g., based on expected day number range)
    for (let i = this.dayNumber - 1; i >= 0 && !prevDate && i > this.dayNumber - maxSearchDepth; i--) {
      prevDate = this.bridge.getDayFromMap(i);
    }
    // If still no prevDate, use a default date
    if (!prevDate) {
      prevDate = new Date();
    }
    // Search for nextDate efficiently using a loop with a maximum search depth
    let nextDate: Date | undefined;
    for (let i = this.dayNumber + 1; i <= this.bridge.getDaysLength() && !nextDate; i++) {
      nextDate = this.bridge.getDayFromMap(i);
    }
    // Efficient date range check using ternary operator
    return (this.today || prevDate.getTime() < time) && (nextDate ? time < nextDate.getTime() : true);
  }

  public getLangValue(uaValue: string, enValue: string): string {
    return this.langService.getLangValue(uaValue, enValue) as string;
  }

  public checkDay(): void {
    // this.bridge.addDayToSelectedMap(this.date.value.toDateString());
    // this.bridge.deleteSelectedDay(this.today.toDateString());
    this.today = this.date.value;
    this.bridge.changeDay(this.dayNumber, this.today);
    // if (this.today === this.date.value) {
    //   return;
    // }
    // if (this.bridge.isDuplicateDay(this.date.value.toDateString())) {
    //   this.date.setValue(this.today);
    //   console.log('Duplicate');
    // }
    console.log(this.today);
    console.log('Change date');
    const curDay = new Date().toDateString();
    const selectDay = new Date(this.dateForm.get('date').value).toDateString();
    this.isCurrentDay = curDay === selectDay;
  }

  private initialStartTime(): string {
    let initialStartTime = '';
    const currentHour = new Date().getHours();
    initialStartTime = currentHour !== 23 ? `${currentHour + 1}${TimeFront.DIVIDER}${TimeFront.MINUTES}` : TimeFront.START;
    return initialStartTime;
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
    this.coordinates.lat = sourceCoordinates.latitude;
    this.coordinates.lng = sourceCoordinates.longitude;

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

  private hasTheDatePassed(date: string, data = 'editDate'): boolean {
    return new Date().getTime() >= new Date(this[data][date]).getTime();
  }

  private applyLocationForAllDays(): void {
    this.isFirstDay = 0 === this.dayNumber;
    if (this.dateForm) {
      if (this.locationForAllDays !== undefined && !this.isFirstDay) {
        this.setupLocationControls();
      }
      const shouldResetLocation = this.locationForAllDays?.lat === null ? !this.isFirstDay && !this.locationForAllDays.lat : null;
      if (shouldResetLocation) {
        this.resetLocationControls();
      }
    }
  }

  private applyLinkForAllDays(): void {
    this.isFirstDay = 0 === this.dayNumber;
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
    // TODO CHANGE TO WORK
    //  this.mapClick(this.locationForAllDays, true);
    this.checkOfflinePlace = true;
    this.isLocationDisabled = true;
    this.dateForm.patchValue({
      coordinates: { latitude: this.coordinates.lat, longitude: this.coordinates.lng }
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
    this.coordinates = { lat: null, lng: null };
    this.dateForm.patchValue({
      coordinates: { latitude: this.coordinates.lat, longitude: this.coordinates.lng }
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

    navigator.geolocation.getCurrentPosition(
      (position) => this.handleGeolocationSuccess(position),
      (error) => this.handleGeolocationError(error)
    );
  }

  private handleGeolocationSuccess(position: GeolocationPosition) {
    if (!position.coords) {
      return;
    }

    const latLngLiteral: google.maps.LatLngLiteral = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };

    this.updateMapAndLocation(latLngLiteral);
    this.coordOffline.emit(this.coordinates);
    this.readyToApplyLocation = true;
  }

  private handleGeolocationError(error: GeolocationPositionError) {
    // Handle geolocation error (optional: display message to user)
    console.error('Error getting geolocation:', error);
  }

  private updateMapAndLocation(latLngLiteral: google.maps.LatLngLiteral) {
    this.mapMarkerCoords = latLngLiteral;
    this.map.panTo(latLngLiteral);
    this.map.center = latLngLiteral;
    this.coordinates = latLngLiteral;
    this.geocoderService.changeAddress(latLngLiteral, this.componentKey);
  }

  private fillTimeArray(): void {
    const minutes = TimeFront.MINUTES;
    const divider = TimeFront.DIVIDER;
    const end = TimeFront.END;
    this.timeArr = Array.from({ length: 24 }, (_, i) => `${i}${divider}${minutes}`);
    this.timeArrStart = this.timeArr.slice();
    this.timeArrEnd = this.timeArr.map((time, index) => (index === 23 ? end : `${index + 1}${divider}${minutes}`));
    this.timeArr[24] = end;
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

  private updateTimeArrays(startTime: string, endTime: string): void {
    let start = 0;
    let endPosition = 24;

    if (this.isCurrentDay) {
      start = new Date().getHours() + 1;
    }
    const startPosition = parseInt(startTime, 10);

    if (endTime) {
      endPosition = endTime !== TimeFront.END ? parseInt(endTime, 10) : 24;
    }
    this.timeArrStart = this.timeArr.slice(start, endPosition);
    this.timeArrEnd = this.timeArr.slice(startPosition + 1);
  }
}
