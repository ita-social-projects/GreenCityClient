import { MapsAPILoader } from '@agm/core';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, OnDestroy, Output, ViewChild } from '@angular/core';
import { DateEventResponceDto, DateFormObj, OfflineDto } from '../../models/events.interface';
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
  public checkTime = false;
  public checkOfflinePlace = false;
  public checkOnlinePlace = false;
  private regionOptions = {
    types: ['address'],
    componentRestrictions: { country: 'UA' }
  };

  @Input() check: boolean;
  @Input() editDate: DateEventResponceDto;
  @Input() isDateDuplicate: boolean;
  @Input() editDates: boolean;

  @Output() status = new EventEmitter<boolean>();
  @Output() datesForm = new EventEmitter<DateFormObj>();
  @Output() coordOffline = new EventEmitter<OfflineDto>();
  @Output() linkOnline = new EventEmitter<string>();

  @ViewChild('placesRef') placesRef: ElementRef;

  public dateForm: FormGroup;
  public currentLang: string;
  private destroy: Subject<boolean> = new Subject<boolean>();
  public isLocationSelected = false;
  public isAddressFill: boolean[] = [];
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
    const curDay = new Date().getDate();
    this.minDate.setDate(curDay);
    this.fillTimeArray();

    this.dateForm = new FormGroup({
      date: new FormControl('', [Validators.required]),
      startTime: new FormControl('', [Validators.required]),
      endTime: new FormControl('', [Validators.required]),
      coordinatesDto: new FormControl(this.coordinates, [Validators.required]),
      onlineLink: new FormControl('', [Validators.required, Validators.pattern(Patterns.linkPattern)])
    });

    this.dateForm.valueChanges.subscribe((value) => {
      this.checkStartTime(value.startTime);
      this.checkEndTime(value.endTime);
      this.datesForm.emit(value);
    });
    if (this.editDate && !this.editDates) {
      this.setEditData();
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
    if (this.isDateDuplicate) {
      this.dateForm.get('date').markAsTouched();
    }
    const isAddressFillSubscription = this.eventsService.getIsAddressFillObservable().subscribe((values) => {
      this.isAddressFill = values;
    });
    this.subscriptions.push(isAddressFillSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  private bindLang(lang: string): void {
    this.translate.setDefaultLang(lang);
  }

  get isEditAdressDefault(): boolean {
    return (
      this.editDate.coordinates.latitude === this.coordinates.latitude && this.editDate.coordinates.longitude === this.coordinates.longitude
    );
  }

  private setEditData(): void {
    const startEditTime = this.pipe.transform(this.editDate.startDate, 'H:mm');
    const endEditTime = this.pipe.transform(this.editDate.finishDate, 'H:mm');
    if (endEditTime === '23:59') {
      this.checkTime = true;
      this.dateForm.get('startTime').disable();
      this.dateForm.get('endTime').disable();
    }
    this.dateForm.patchValue({
      date: new Date(this.editDate.startDate),
      startTime: startEditTime,
      endTime: endEditTime
    });

    if (this.editDate.coordinates.latitude) {
      if (!this.isEditAdressDefault) {
        this.checkOfflinePlace = true;
        this.dateForm.addControl('place', new FormControl('', [Validators.required]));
        this.dateForm.addControl('coordinatesDto', new FormControl('', [Validators.required]));
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

        this.coordinates.latitude = this.editDate.coordinates.latitude;
        this.coordinates.longitude = this.editDate.coordinates.longitude;
      }
    }

    if (this.editDate.onlineLink) {
      this.checkOnlinePlace = true;
      this.dateForm.addControl('onlineLink', new FormControl('', [Validators.required, Validators.pattern(Patterns.linkPattern)]));
      this.dateForm.patchValue({
        onlineLink: this.editDate.onlineLink
      });
    }
  }

  public checkIfAllDay(): void {
    this.checkTime = !this.checkTime;
    if (this.checkTime) {
      this.dateForm.get('startTime').disable();
      this.dateForm.get('endTime').disable();
      this.dateForm.get('startTime').setValue(this.timeArrStart[9]);
      this.dateForm.get('endTime').setValue(this.timeArrEnd[21]);
    } else {
      this.dateForm.get('startTime').enable();
      this.dateForm.get('endTime').enable();
    }
  }

  ngOnChanges(): void {
    if (this.check) {
      this.dateForm.markAllAsTouched();
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
      this.dateForm.addControl('onlineLink', new FormControl('', [Validators.required, Validators.pattern(Patterns.linkPattern)]));
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
      this.dateForm.addControl('place', new FormControl('', [Validators.required]));
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
    for (let i = 0; i < 24; i++) {
      this.timeArr.push(`${i}:00`);
      this.timeArrStart.push(`${i}:00`);
      this.timeArrEnd.push(`${i}:00`);
    }
  }

  private checkEndTime(time: string): void {
    if (time) {
      const checkTime = time.split(':');

      this.timeArrStart = [...this.timeArr.slice(0, +checkTime[0])];
    }
  }

  private checkStartTime(time: string): void {
    if (time) {
      const checkTime = time.split(':');
      this.timeArrEnd = +checkTime[0] === 23 ? ['23 : 59'] : [...this.timeArr.slice(+checkTime[0] + 1)];
    }
  }

  public getLangValue(uaValue, enValue): string {
    return this.langService.getLangValue(uaValue, enValue) as string;
  }
}
