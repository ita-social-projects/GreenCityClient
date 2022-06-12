import { MapsAPILoader } from '@agm/core';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { DateEventResponceDto, DateFormObj, OfflineDto } from '../../models/events.interface';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-event-date-time-picker',
  templateUrl: './event-date-time-picker.component.html',
  styleUrls: ['./event-date-time-picker.component.scss']
})
export class EventDateTimePickerComponent implements OnInit, OnChanges {
  public minDate = new Date();
  public timeArrStart = [];
  public timeArrEnd = [];

  public timeArr: Array<string> = [];

  private coordinates: OfflineDto = {
    latitude: null,
    longitude: null
  };

  public isOfline: boolean;
  public autocomplete: google.maps.places.Autocomplete;
  private pipe = new DatePipe('en-US');
  public checkTime = false;
  public checkOfflinePlace = false;
  public checkOnlinePlace = false;
  private geoCoder: any;

  private regionOptions = {
    types: ['(regions)'],
    componentRestrictions: { country: 'UA' }
  };

  @Input() check: boolean;
  @Input() editDate: DateEventResponceDto;

  @Output() status = new EventEmitter<boolean>();
  @Output() datesForm = new EventEmitter<DateFormObj>();
  @Output() coordOffline = new EventEmitter<OfflineDto>();

  @ViewChild('placesRef') placesRef: ElementRef;

  public dateForm: FormGroup;

  constructor(private mapsAPILoader: MapsAPILoader) {}

  ngOnInit(): void {
    const curDay = new Date().getDate();
    this.minDate.setDate(curDay + 1);
    this.fillTimeArray();

    this.dateForm = new FormGroup({
      date: new FormControl('', [Validators.required]),
      startTime: new FormControl('', [Validators.required]),
      endTime: new FormControl('', [Validators.required])
    });

    this.dateForm.valueChanges.subscribe((value) => {
      this.checkStartTime(value.startTime);
      this.checkEndTime(value.endTime);

      this.coordOffline.emit(this.coordinates);
      this.status.emit(this.dateForm.valid);

      this.datesForm.emit(value);
    });
    if (this.editDate) {
      this.mapsAPILoader.load().then(() => {
        this.geoCoder = new google.maps.Geocoder();
      });
      this.setEditData();
    }
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
      date: this.editDate.startDate,
      startTime: startEditTime,
      endTime: endEditTime
    });

    if (this.editDate.coordinates.latitude) {
      this.checkOfflinePlace = true;
      this.dateForm.addControl('place', new FormControl('', [Validators.required]));
      setTimeout(() => this.setPlaceAutocomplete(), 0);
      setTimeout(() => this.setGeocode(), 2000);

      this.coordinates.latitude = this.editDate.coordinates.latitude;
      this.coordinates.longitude = this.editDate.coordinates.longitude;
    }

    if (this.editDate.onlineLink) {
      this.checkOnlinePlace = true;
      this.dateForm.addControl('onlineLink', new FormControl('', [Validators.required, Validators.pattern(/^$|^https?:\/\//)]));
      this.dateForm.patchValue({
        onlineLink: this.editDate.onlineLink
      });
    }
  }

  private setGeocode(): void {
    this.geoCoder.geocode(
      { location: { lat: this.editDate.coordinates.latitude, lng: this.editDate.coordinates.longitude } },
      (results, status) => {
        if (status === 'OK') {
          this.dateForm.patchValue({
            place: results[0].formatted_address
          });
        }
      }
    );
  }

  public checkIfAllDay(): void {
    this.checkTime = !this.checkTime;
    if (this.checkTime) {
      this.dateForm.get('startTime').disable();
      this.dateForm.get('endTime').disable();
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

  public checkIfOnline(): void {
    this.checkOnlinePlace = !this.checkOnlinePlace;
    this.checkOnlinePlace
      ? this.dateForm.addControl('onlineLink', new FormControl('', [Validators.required, Validators.pattern(/^$|^https?:\/\//)]))
      : this.dateForm.removeControl('onlineLink');
  }

  public checkIfOffline(): void {
    this.checkOfflinePlace = !this.checkOfflinePlace;
    if (this.checkOfflinePlace) {
      this.isOfline = true;
      this.dateForm.addControl('place', new FormControl('', [Validators.required]));
      setTimeout(() => this.setPlaceAutocomplete(), 0);
    } else {
      this.isOfline = false;
      this.coordinates.latitude = null;
      this.coordinates.longitude = null;
      this.coordOffline.emit(this.coordinates);
      this.autocomplete.unbindAll();
      this.dateForm.removeControl('place');
    }
  }

  private setPlaceAutocomplete(): void {
    this.mapsAPILoader.load().then(() => {
      this.autocomplete = new google.maps.places.Autocomplete(this.placesRef.nativeElement, this.regionOptions);
      if (this.editDate) {
        this.autocomplete.setValues(this.editDate.coordinates);
      }

      this.autocomplete.addListener('place_changed', () => {
        const locationName = this.autocomplete.getPlace();

        this.coordinates.latitude = locationName.geometry.location.lat();
        this.coordinates.longitude = locationName.geometry.location.lng();

        this.coordOffline.emit(this.coordinates);

        this.dateForm.patchValue({
          place: locationName.formatted_address
        });
      });
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
}
