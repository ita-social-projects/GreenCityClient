import { MapsAPILoader } from '@agm/core';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { DateFormObj, OfflineDto } from '../../models/events.interface';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';

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

  private regionOptions = {
    types: ['(regions)'],
    componentRestrictions: { country: 'UA' }
  };

  @Input() check: boolean;

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
  }

  checkIfAllDay(event: MatCheckboxChange) {
    if (event.checked) {
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

  checkIfOnline(event: MatCheckboxChange): void {
    event.checked
      ? this.dateForm.addControl('onlineLink', new FormControl('', [Validators.required, Validators.pattern(/^$|^https?:\/\//)]))
      : this.dateForm.removeControl('onlineLink');
  }

  checkIfOffline(event: MatCheckboxChange): void {
    if (event.checked) {
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

  setPlaceAutocomplete(): void {
    this.mapsAPILoader.load().then(() => {
      this.autocomplete = new google.maps.places.Autocomplete(this.placesRef.nativeElement, this.regionOptions);

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
      this.timeArr.push(`${i} : 00`);
      this.timeArrStart.push(`${i} : 00`);
      this.timeArrEnd.push(`${i} : 00`);
    }
  }

  checkEndTime(time: string): void {
    if (time) {
      const checkTime = time.split(':');

      this.timeArrStart = [...this.timeArr.slice(0, +checkTime[0])];
    }
  }

  checkStartTime(time: string): void {
    if (time) {
      const checkTime = time.split(':');
      this.timeArrEnd = +checkTime[0] === 23 ? ['23 : 59'] : [...this.timeArr.slice(+checkTime[0] + 1)];
    }
  }
}
