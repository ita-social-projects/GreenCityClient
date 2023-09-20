import { MapsAPILoader } from '@agm/core';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, OnDestroy, Output, ViewChild } from '@angular/core';
import { DateEventResponceDto, DateFormObj, OfflineDto, InitialStartDate } from '../../models/events.interface';
import { Subscription, Subject } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Patterns } from 'src/assets/patterns/patterns';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { EventsService } from 'src/app/main/component/events/services/events.service';
import { takeUntil } from 'rxjs/operators';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { DateAdapter } from '@angular/material/core';
import { LanguageModel } from '../../../layout/components/models/languageModel';
import { Language, Locate } from 'src/app/main/i18n/Language';
import { TimeFront, TimeBack } from '../../models/event-consts';

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

  coordinates: OfflineDto = {
    latitude: null,
    longitude: null
  };
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
  private regionOptions = {
    types: ['address'],
    componentRestrictions: { country: 'UA' }
  };
  public duplindex: number;

  @Input() check: boolean;
  @Input() editDate: DateEventResponceDto;
  @Input() isDateDuplicate: boolean;
  @Input() editDates: boolean;
  @Input() firstFormIsSucceed: boolean;
  @Input() index: number;
  @Input() duplindx: number;

  @Output() status = new EventEmitter<boolean>();
  @Output() datesForm = new EventEmitter<DateFormObj>();
  @Output() coordOffline = new EventEmitter<OfflineDto>();
  @Output() linkOnline = new EventEmitter<string>();

  @ViewChild('placesRef') placesRef: ElementRef;

  public dateForm: FormGroup;
  public currentLang: string;
  private destroy: Subject<boolean> = new Subject<boolean>();
  public isLocationSelected = false;
  public arePlacesFilled: boolean[] = [];
  private subscriptions: Subscription[] = [];

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private langService: LanguageService,
    private translate: TranslateService,
    private localStorageService: LocalStorageService,
    private eventsService: EventsService,
    private adapter: DateAdapter<LanguageModel>
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
      coordinatesDto: new FormControl(this.coordinates),
      onlineLink: new FormControl('', [Validators.pattern(Patterns.linkPattern)])
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
    if (this.editDate && !this.editDates) {
      this.setDataEditing();
    }
    this.localStorageService.languageBehaviourSubject.pipe(takeUntil(this.destroy)).subscribe((lang: string) => {
      this.currentLang = lang;
      this.bindLang(this.currentLang);
      const locale = lang !== Language.UA ? Locate.EN : Locate.UA;
      this.adapter.setLocale(locale);
      if (this.editDate) {
        this.dateForm.patchValue({
          place:
            lang === Language.UA
              ? this.eventsService.createAdresses(this.editDate.coordinates, 'Ua')
              : this.eventsService.createAdresses(this.editDate.coordinates, 'En')
        });
      }
    });

    const isAddressFilledSubscription = this.eventsService.getCheckedPlacesObservable().subscribe((values) => {
      this.arePlacesFilled = values;
    });
    this.subscriptions.push(isAddressFilledSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  private initialStartTime(editMode?: boolean): InitialStartDate {
    let initialDate;
    let initialStartTime = '';
    if (this.firstFormIsSucceed || editMode) {
      const currentHour = new Date().getHours();
      initialDate = currentHour !== 23 ? new Date() : this.minDate;
      initialStartTime = currentHour !== 23 ? `${currentHour + 1}${TimeFront.DIVIDER}${TimeFront.MINUTES}` : TimeFront.START;
    } else {
      initialDate = '';
    }
    return { initialDate, initialStartTime };
  }

  private bindLang(lang: string): void {
    this.translate.setDefaultLang(lang);
  }

  private setDataEditing(): void {
    const startEditTime = this.pipe.transform(this.editDate.startDate, 'H:mm');
    let endEditTime = this.pipe.transform(this.editDate.finishDate, 'H:mm');
    if (endEditTime === TimeBack.END) {
      endEditTime = TimeFront.END;
    }
    if (endEditTime === TimeFront.END && startEditTime === TimeFront.START) {
      this.checkedAllDay = true;
      this.dateForm.get('startTime').disable();
      this.dateForm.get('endTime').disable();
    }
    if (this.hasTheDatePassed('startDate')) {
      this.dateForm.get('date').disable();
      this.dateForm.get('startTime').disable();
      this.isAllDayDisabled = true;
    }
    if (this.hasTheDatePassed('finishDate')) {
      this.dateForm.get('endTime').disable();
      this.isPlaceDisabled = true;
      this.dateForm.get('onlineLink').disable();
    }

    this.dateForm.patchValue({
      date: new Date(this.editDate.startDate),
      startTime: startEditTime,
      endTime: endEditTime
    });

    if (this.editDate.coordinates) {
      this.checkOfflinePlace = true;
      this.dateForm.addControl('place', new FormControl(''));
      this.dateForm.addControl('coordinatesDto', new FormControl(''));
      setTimeout(() => this.setPlaceAutocomplete(), 0);
      this.coordinates.latitude = this.editDate.coordinates.latitude;
      this.coordinates.longitude = this.editDate.coordinates.longitude;
      this.zoom = 8;

      this.dateForm.patchValue({
        place: this.getLangValue(
          this.eventsService.createAdresses(this.editDate.coordinates, 'Ua'),
          this.eventsService.createAdresses(this.editDate.coordinates, 'En')
        ),
        coordinatesDto: { latitude: this.editDate.coordinates.latitude, longitude: this.editDate.coordinates.longitude }
      });
      if (this.hasTheDatePassed('finishDate')) {
        this.dateForm.get('place').disable();
      }
      this.coordinates.latitude = this.editDate.coordinates.latitude;
      this.coordinates.longitude = this.editDate.coordinates.longitude;
    }

    if (this.editDate.onlineLink) {
      this.checkOnlinePlace = true;
      this.dateForm.addControl('onlineLink', new FormControl('', [Validators.pattern(Patterns.linkPattern)]));
      this.dateForm.patchValue({
        onlineLink: this.editDate.onlineLink
      });
    }
  }

  private hasTheDatePassed(date: string): boolean {
    return new Date().getTime() >= new Date(this.editDate[date]).getTime();
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
      }
    });
  }

  public checkIfOnline(): void {
    this.checkOnlinePlace = !this.checkOnlinePlace;
    if (this.checkOnlinePlace) {
      this.dateForm.addControl('onlineLink', new FormControl('', [Validators.pattern(Patterns.linkPattern)]));
      this.dateForm.get('onlineLink').valueChanges.subscribe((newValue) => {
        this.linkOnline.emit(newValue);
      });
    } else {
      this.dateForm.removeControl('onlineLink');
      this.linkOnline.emit('');
    }
  }

  public checkIfOffline(): void {
    this.checkOfflinePlace = !this.checkOfflinePlace;
    if (this.checkOfflinePlace) {
      this.dateForm.addControl('place', new FormControl(''));
      setTimeout(() => this.setPlaceAutocomplete(), 0);
    } else {
      this.coordinates.latitude = null;
      this.coordinates.longitude = null;
      this.coordOffline.emit(this.coordinates);
      this.autocomplete.unbindAll();
      this.dateForm.removeControl('place');
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
          this.dateForm.patchValue({
            place: locationName.formatted_address
          });

          this.isLocationSelected = false;
        } else {
          this.isLocationSelected = true;
        }
      });
    });
  }

  onChangePickerOnMap(event): void {
    this.coordinates.latitude = event.coords.lat;
    this.coordinates.longitude = event.coords.lng;
    this.isLocationSelected = false;
    this.getAddress(this.coordinates.latitude, this.coordinates.longitude);
  }

  getAddress(latitude, longitude) {
    const geoCoder = new google.maps.Geocoder();
    geoCoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        this.address = results[0].formatted_address;
        this.dateForm.get('place').setValue(this.address);
      } else {
        this.isLocationSelected = true;
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

  public getLangValue(uaValue, enValue): string {
    return this.langService.getLangValue(uaValue, enValue) as string;
  }
}
