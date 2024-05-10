import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DateFormGroup, DateFormInformation, TimeRange } from '../../models/events.interface';
import { combineLatest, Subscription } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Patterns } from 'src/assets/patterns/patterns';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { DefaultCoordinates } from '../../models/event-consts';
import { DateAdapter } from '@angular/material/core';
import { GoogleMap } from '@angular/google-maps';
import { GeocoderService } from '@global-service/geocoder/geocoder.service';
import { FormBridgeService } from '../../services/form-bridge.service';
import { dateFormValidator } from './validators/dateFormValidator';
import { startWith, take, tap } from 'rxjs/operators';
import { timeValidator } from './validators/timeValidator';

@Component({
  selector: 'app-event-date-time-picker',
  templateUrl: './event-date-time-picker.component.html',
  styleUrls: ['./event-date-time-picker.component.scss'],
  providers: []
})
export class EventDateTimePickerComponent implements OnInit, OnDestroy {
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
  @ViewChild('placesRef') placesRef: ElementRef;
  public placeSelected = false;
  public isOnline = false;
  public isPlaceDisabled = false;
  public isLinkDisabled: boolean;
  public isLocationDisabled: boolean;
  public appliedForAllLocations = false;
  public today: Date = new Date();
  @Input() form: DateFormInformation & TimeRange;
  @Input() dayNumber: number;
  public isLocationSelected = false;
  public mapMarkerCoords: google.maps.LatLngLiteral = { lng: null, lat: null };
  public dateFilterBind = this.dateFilter.bind(this);
  public startOptionsArr: string[];
  public endOptionsArr: string[];
  public appliedForAllLink = false;
  private _isAllDayDisabled = false;
  private _upperTimeLimit = 0;
  private _indexStartTime: number;
  private _indexEndTime: number;
  private _timeArr: Array<string> = [];
  // FORM
  public dateForm: FormGroup<DateFormGroup> = this.fb.nonNullable.group(
    {
      date: [this.today, [Validators.required]],
      timeRange: this.fb.nonNullable.group(
        {
          startTime: new FormControl('', [Validators.required]),
          endTime: new FormControl('', [Validators.required])
        },
        { validators: timeValidator(this._timeArr[this._upperTimeLimit]) }
      ),
      coordinates: new FormControl({ lat: 50, lng: 50 }),
      onlineLink: new FormControl(''),
      place: new FormControl(''),
      allDay: new FormControl({ value: false, disabled: this._isAllDayDisabled })
    },
    { validators: dateFormValidator() }
  );
  private _lowerTimeLimit: number = this._timeArr.length - 1;
  private _coordinates: google.maps.LatLngLiteral = {
    lat: DefaultCoordinates.LATITUDE,
    lng: DefaultCoordinates.LONGITUDE
  };
  private _isCurrentDay = true;
  private _autocomplete: google.maps.places.Autocomplete;
  private _checkedAllDay = false;
  private _key = crypto.randomUUID();
  public mapOptions: google.maps.MapOptions = {
    center: this._coordinates,
    zoom: 8,
    gestureHandling: 'greedy',
    minZoom: 4,
    maxZoom: 20,
    mapId: this._key
  };
  private _componentKey = Symbol('key');
  private _regionOptions = {
    types: ['address'],
    componentRestrictions: { country: 'UA' }
  };
  private _subscriptions: Subscription[] = [];
  private _lastTimeValues: string[] = [];

  constructor(
    private langService: LanguageService,
    private adapter: DateAdapter<any>,
    private geocoderService: GeocoderService,
    private bridge: FormBridgeService,
    private fb: FormBuilder
  ) {}

  get startTime() {
    return this.dateForm.get('timeRange.startTime');
  }

  get endTime() {
    return this.dateForm.get('timeRange.endTime');
  }

  get date() {
    return this.dateForm.get('date');
  }

  get place() {
    return this.dateForm.get('place');
  }

  initializeForm() {
    if (this.form) {
      this.dateForm.setValue(this.form);
      const { allDay, date, place, coordinates, onlineLink } = this.form;
      this.today = date;
      if (allDay) {
        this.toggleAllDay();
      }
      if (place) {
        if (this.dayNumber === 0) {
          this.bridge
            .$locationUpdate()
            .pipe(take(1))
            .subscribe((value) => {
              console.log(1);
              if (value.address) {
                this.appliedForAllLocations = true;
              }
            });
          this.toggleLocation();
        }
        if (!this.appliedForAllLink && this.dayNumber > 0) {
          console.log(2);
          this.toggleLocation();
        }
        setTimeout(() => {
          this.updateMap(coordinates);
        }, 0);
      }
      if (onlineLink) {
        if (this.dayNumber === 0) {
          this.bridge
            .$linkUpdate()
            .pipe(take(1))
            .subscribe((value) => {
              if (value) {
                this.appliedForAllLink = true;
              }
            });
        }
        this.toggleOnline();
      }
    } else {
      const initialStartTime = this.initialStartTime();
      this._upperTimeLimit = this._timeArr.indexOf(initialStartTime);
      this.dateForm.patchValue(
        {
          date: this.today,
          timeRange: {
            startTime: initialStartTime
          }
        },
        { emitEvent: true }
      );
      this.bridge.changeDay(this.dayNumber, this.today);
      this.updateTimeIndex(initialStartTime, this.endTime.value);
    }
  }

  subscribeToLinkChanges() {
    const s = this.bridge.$linkUpdate().subscribe((value) => {
      if (value) {
        this.isLinkDisabled = true;
        this.isOnline = true;
        this.dateForm.get('onlineLink').disable();
        this.dateForm.patchValue({ onlineLink: value });
      } else {
        this.isLinkDisabled = false;
        this.isOnline = false;
        this.dateForm.get('onlineLink').enable();
        this.dateForm.patchValue({ onlineLink: '' });
      }
    });
    this._subscriptions.push(s);
  }

  toggleForAllLink() {
    this.appliedForAllLink = !this.appliedForAllLink;
    console.log(this.appliedForAllLink);
    if (!this.appliedForAllLink) {
      this.bridge.setLinkForAll('');
      return;
    }
    const link = this.dateForm.controls.onlineLink.value;
    this.bridge.setLinkForAll(link);
  }

  subscribeToLocationChanges() {
    console.log('hi', this._componentKey);
    const sub = this.bridge.$locationUpdate().subscribe((update) => {
      console.log(update);
      if (update.address) {
        this.appliedForAllLocations = true;
        this.isLocationDisabled = true;
        this.placeSelected = true;
        this.isPlaceDisabled = true;
        this.dateForm.get('place').disable();
        this.dateForm.patchValue({ coordinates: update.coords, place: update.address });
      } else {
        this.appliedForAllLocations = false;
        this.isLocationDisabled = false;
        this.placeSelected = false;
        this.isPlaceDisabled = false;
        this.dateForm.get('place').enable();
        this.dateForm.patchValue({ coordinates: update.coords, place: update.address });
      }
    });
    this._subscriptions.push(sub);
  }

  toggleForAllLocations(): void {
    this.appliedForAllLocations = !this.appliedForAllLocations;
    if (!this.appliedForAllLocations) {
      this.bridge.setLocationForAll({ address: '', coords: null });
      return;
    }
    const address = this.dateForm.get('place').value;
    const coordinates = this.dateForm.get('coordinates').value;
    this.bridge.setLocationForAll({ address, coords: coordinates });
  }

  initializeGeocoder() {
    const sub = this.geocoderService.$getGeocoderResult(this._componentKey).subscribe((result: google.maps.GeocoderResult[]) => {
      const address = result[0].formatted_address;
      this.dateForm.patchValue({
        coordinates: this._coordinates,
        place: address
      });
      this.isLocationSelected = true;
      if (this.appliedForAllLocations) {
        this.bridge.setLocationForAll({ address, coords: this._coordinates });
      }
    });
    this._subscriptions.push(sub);
  }

  subscribeToFormChanges() {
    const startTime$ = this.startTime.valueChanges.pipe(
      startWith(''),
      tap(() => this.checkForColumn('startTime')),
      tap(() => {
        this.dateForm.controls.timeRange.setValidators(timeValidator(this._timeArr[this._upperTimeLimit]));
      })
    );

    const endTime$ = this.endTime.valueChanges.pipe(
      startWith(''),
      tap(() => this.checkForColumn('endTime'))
    );

    const date$ = this.dateForm.controls.date.valueChanges.pipe(
      startWith(this.today),
      tap((value) => {
        this.bridge.changeDay(this.dayNumber, value);
        this._isCurrentDay = this.checkIsCurrentDate(value);
        if (this._isCurrentDay) {
          this._upperTimeLimit = this._timeArr.indexOf(this.initialStartTime());
        } else {
          this._upperTimeLimit = 0;
        }
      })
    );

    const allDay$ = this.dateForm.controls.allDay.valueChanges.pipe(startWith(false));
    const formChanges$ = combineLatest([startTime$, endTime$, date$, allDay$]);
    const subscription = formChanges$.subscribe(([startTime, endTime, _, allDay]) => {
      if (allDay) {
        return;
      }
      this.updateTimeIndex(startTime, endTime);
      this.startOptionsArr = this.filterAutoOptions(startTime, this._upperTimeLimit, this._indexEndTime);
      this.endOptionsArr = this.filterAutoOptions(endTime, this._indexStartTime, this._lowerTimeLimit);
    });

    this._subscriptions.push(subscription);
  }

  updateTimeIndex(startTime: string, endTime: string): void {
    if (this._timeArr.indexOf(endTime) < 0) {
      this._indexEndTime = this._lowerTimeLimit - 1;
    } else {
      this._indexEndTime = this._timeArr.indexOf(endTime);
    }

    if (this._timeArr.slice(this._upperTimeLimit).indexOf(startTime) < 0) {
      this._indexStartTime = this._upperTimeLimit + 1;
    } else {
      this._indexStartTime = this._timeArr.indexOf(startTime) + 1;
    }
  }

  public filterAutoOptions(value: string, startPosition: number, endPosition: number) {
    const filtered = this._timeArr.slice(startPosition, endPosition).filter((time) => time.includes(value));
    return filtered.length >= 2 ? filtered : this._timeArr.slice(startPosition, endPosition);
  }

  setDay(n: number) {
    const day = this.bridge.getDayFromMap(n - 1);
    if (day) {
      const currentDay = day.getDate();
      const newDate = new Date(day.getTime());
      // Create a copy to avoid modifying the original
      newDate.setDate(currentDay + 1);
      return newDate;
    }
    const f = new Date();
    f.setHours(0, 0, 0, 0);
    return f;
  }

  ngOnInit(): void {
    this.today = this.setDay(this.dayNumber);
    this.fillTimeArray();
    this.initializeGeocoder();
    // FORM BLOCK START
    this.subscribeToFormChanges();
    this.subscribeToFormStatus();
    if (this.dayNumber > 0) {
      this.subscribeToLocationChanges();
      this.subscribeToLinkChanges();
    }
    this.initializeForm();
    // FORM BLOCK END
    this.langService.getCurrentLangObs().subscribe((lang) => {
      const locale = lang !== 'ua' ? 'en-GB' : 'uk-UA';
      this.adapter.setLocale(locale);
    });
  }

  subscribeToFormStatus() {
    const sub = this.dateForm.statusChanges.subscribe((status) => {
      if (status === 'VALID') {
        this.bridge.updateDatesFormStatus(true, this.dayNumber, this.dateForm.getRawValue());
      } else {
        this.bridge.updateDatesFormStatus(false, this.dayNumber);
      }
    });

    const sub1 = this.dateForm.controls.onlineLink.statusChanges.subscribe((status) => {
      if (this.appliedForAllLink) {
        if (status === 'VALID') {
          {
            this.bridge.setLinkForAll(this.dateForm.controls.onlineLink.value);
          }
        }
      }
    });

    this._subscriptions.push(sub);
    this._subscriptions.push(sub1);
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.bridge.deleteRecordFromDayMap(this.dayNumber);
  }

  public toggleAllDay(): void {
    this._checkedAllDay = !this._checkedAllDay;
    const startTime = this.startTime;
    const endTime = this.endTime;
    [startTime, endTime].forEach((control) => control[this._checkedAllDay ? 'disable' : 'enable']());
    // IF toggle true disable forms and memorize last values
    if (this._checkedAllDay) {
      this._lastTimeValues = [startTime.value, endTime.value];
      this.dateForm.patchValue({
        timeRange: {
          startTime: this._timeArr[0],
          endTime: this._timeArr[this._lowerTimeLimit - 1]
        }
      });
    } else {
      this.dateForm.patchValue({
        timeRange: {
          startTime: this._lastTimeValues[0],
          endTime: this._lastTimeValues[1]
        }
      });
    }
  }

  public toggleOnline(): void {
    this.isOnline = !this.isOnline;
    if (this.isOnline) {
      this.dateForm.controls.onlineLink.setValidators([Validators.required, Validators.pattern(Patterns.linkPattern)]);
      this.dateForm.controls.onlineLink.updateValueAndValidity();
    } else {
      this.dateForm.controls.onlineLink.clearValidators();
      this.dateForm.patchValue({ onlineLink: '' });
    }
  }

  public toggleLocation(): void {
    if (!this.place.value) {
      this.setCurrentLocation();
    }
    this.placeSelected = !this.placeSelected;
    if (this.placeSelected) {
      this.dateForm.controls.place.setValidators(Validators.required);
      this._coordinates.lat = DefaultCoordinates.LATITUDE;
      this._coordinates.lng = DefaultCoordinates.LONGITUDE;
      this.isLocationSelected = true;
      setTimeout(() => {
        this.setPlaceAutocomplete();
      }, 0);
    } else {
      this.dateForm.controls.place.clearValidators();
      if (this.appliedForAllLocations) {
        this.toggleForAllLocations();
      }
      this._coordinates.lat = null;
      this._coordinates.lng = null;
      this._autocomplete.unbindAll();
      this.dateForm.patchValue(
        {
          coordinates: null,
          place: ''
        },
        { emitEvent: true }
      );
      this.isLocationSelected = false;
    }
  }

  public setPlaceAutocomplete(): void {
    this._autocomplete = new google.maps.places.Autocomplete(this.placesRef.nativeElement, this._regionOptions);
    this._autocomplete.addListener('place_changed', () => {
      const locationName = this._autocomplete.getPlace();
      if (locationName.formatted_address) {
        const lat = locationName.geometry.location.lat();
        const lng = locationName.geometry.location.lng();
        const coords = { lat, lng };
        this._coordinates = coords;
        this.updateMapAndLocation(coords);
        this.dateForm.patchValue({
          place: locationName.formatted_address,
          coordinates: { lat: this._coordinates.lat, lng: this._coordinates.lng }
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
    const dateTime = date.getTime();
    let prevDate: Date | undefined;
    for (let i = this.dayNumber - 1; i >= 0 && !prevDate; i--) {
      prevDate = this.bridge.getDayFromMap(i);
    }
    let nextDate: Date | undefined;
    for (let i = this.dayNumber + 1; i <= this.bridge.getDaysLength() && !nextDate; i++) {
      nextDate = this.bridge.getDayFromMap(i);
    }
    if (prevDate && nextDate) {
      return prevDate.getTime() < dateTime && nextDate.getTime() > dateTime;
    }
    if (prevDate && !nextDate) {
      return prevDate.getTime() < dateTime;
    }
    if (!nextDate) {
      return this.today.getTime() <= dateTime;
    }
    if (nextDate) {
      return this.today.getTime() <= dateTime && nextDate.getTime() > dateTime;
    }
  }

  public getLangValue(uaValue: string, enValue: string): string {
    return this.langService.getLangValue(uaValue, enValue) as string;
  }

  public checkIsCurrentDate(value: Date): boolean {
    const curDay = new Date().toDateString();
    const selectDay = new Date(value).toDateString();
    return (this._isCurrentDay = curDay === selectDay);
  }

  private checkForColumn(controller: 'startTime' | 'endTime') {
    let value = this.dateForm.controls.timeRange.controls[controller].value;
    if (value.length === 3 && value.indexOf(':') === -1) {
      value = value.slice(0, 2) + ':' + value.slice(2);
      this.dateForm.patchValue({ timeRange: { [controller]: value } }, { emitEvent: false });
    }
  }

  private initialStartTime(): string {
    const today = new Date();
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();
    if (currentMinute - 20 < 0) {
      return `${currentHour > 9 ? currentHour : '0' + currentHour}:30`;
    }
    const nextHour = currentHour + 1;
    return `${nextHour > 9 ? nextHour : '0' + nextHour}:00`;
  }

  private setCurrentLocation(): void {
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
  }

  private handleGeolocationError(error: GeolocationPositionError) {
    console.error(error);
  }

  private updateMap(latLngLiteral: google.maps.LatLngLiteral) {
    this.mapMarkerCoords = latLngLiteral;
    this.map.panTo(latLngLiteral);
    this.map.center = latLngLiteral;
  }

  private updateMapAndLocation(latLngLiteral: google.maps.LatLngLiteral) {
    this.mapMarkerCoords = latLngLiteral;
    this.map.panTo(latLngLiteral);
    this.map.center = latLngLiteral;
    this._coordinates = latLngLiteral;
    this.geocoderService.changeAddress(latLngLiteral, this._componentKey);
  }

  private fillTimeArray(): void {
    const timeArr = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        // Pad hours and minutes with leading zeros for consistent formatting
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        timeArr.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    timeArr.push('23:59');
    this._timeArr = timeArr;
    this._lowerTimeLimit = this._timeArr.length;
  }
}
