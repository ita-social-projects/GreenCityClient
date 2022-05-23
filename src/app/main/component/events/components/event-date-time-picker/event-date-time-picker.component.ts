import { MapsAPILoader } from '@agm/core';
import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSelectChange } from '@angular/material/select';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OnlineOflineDto } from '../../models/events.interface';

@Component({
  selector: 'app-event-date-time-picker',
  templateUrl: './event-date-time-picker.component.html',
  styleUrls: ['./event-date-time-picker.component.scss']
})
export class EventDateTimePickerComponent implements OnInit, AfterViewInit {
  public minDate: Date;
  public startDisabled: boolean;
  public endDisabled: boolean;
  public dateDisabled: boolean;
  public timeArrStart = [];
  public timeArrEnd = [];

  coordinates: OnlineOflineDto = {
    latitude: null,
    longitude: null,
    onlineLink: ''
  };

  public onlineLink: string;

  public isOfline: boolean;
  public isOnline: boolean;

  public autocomplete: google.maps.places.Autocomplete;

  private regionOptions = {
    types: ['(regions)'],
    componentRestrictions: { country: 'UA' }
  };

  private pipe = new DatePipe('en-US');

  @Output() date = new EventEmitter<string>();
  @Output() startTime = new EventEmitter<string>();
  @Output() endTime = new EventEmitter<string>();

  @Output() coordOflineOnline = new EventEmitter<OnlineOflineDto>();

  @ViewChild('placesRef') placesRef: ElementRef;

  constructor(private mapsAPILoader: MapsAPILoader, private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.minDate = new Date();
    this.fillTimeArray();
    this.endDisabled = true;
  }

  ngAfterViewInit(): void {
    this.mapsAPILoader.load().then(() => {
      this.autocomplete = new google.maps.places.Autocomplete(this.placesRef.nativeElement, this.regionOptions);

      this.autocomplete.addListener('place_changed', () => {
        const locationName = this.autocomplete.getPlace();

        this.coordinates.latitude = locationName.geometry.location.lat();
        this.coordinates.longitude = locationName.geometry.location.lng();
        this.coordinates.onlineLink = this.onlineLink;
        if (!this.isOnline) {
          this.coordinates.onlineLink = '';
        }
        this.coordOflineOnline.emit(this.coordinates);
      });
    });
  }

  public setOnlineLink(): void {
    this.coordinates.onlineLink = this.onlineLink;
    if (!this.isOfline) {
      this.coordinates.latitude = null;
      this.coordinates.longitude = null;
    }
    this.coordOflineOnline.emit(this.coordinates);
  }

  private fillTimeArray(): void {
    for (let i = 0; i < 24; i++) {
      this.timeArrStart.push(`${i} : 00`);
      this.timeArrEnd.push(`${i} : 00`);
    }
  }

  public addDate(date: MatDatepickerInputEvent<Date>): void {
    const formattedDate = this.pipe.transform(date.value, 'yyyy/MM/dd');
    this.date.emit(formattedDate);
    this.dateDisabled = true;
  }

  public addStartTime(time: MatSelectChange): void {
    this.startTime.emit(time.value);
    this.startDisabled = true;
    this.endDisabled = false;
    const checkTime = time.value.split(':');

    +checkTime[0] === 23 ? (this.timeArrEnd = ['23 : 59']) : (this.timeArrEnd = [...this.timeArrStart.slice(+checkTime[0] + 1)]);
  }
  public addEndTime(time: MatSelectChange): void {
    this.endTime.emit(time.value);
    this.endDisabled = true;
  }

  public clear(): void {
    this.startDisabled = false;
    this.dateDisabled = false;
  }
}
