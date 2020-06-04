import {Component, ElementRef, EventEmitter, Inject, NgZone, OnInit, Output, ViewChild} from '@angular/core';
import {PlaceAddDto} from "../../../model/placeAddDto.model";
import {LocationDto} from "../../../model/locationDto.model";
import {DiscountDto} from "../../../model/discount/DiscountDto";
import {SpecificationNameDto} from "../../../model/specification/SpecificationNameDto";
import {OpeningHours} from "../../../model/openingHours.model";
import {WeekDays} from "../../../model/weekDays.model";
import {BreakTimes} from "../../../model/breakTimes.model";
import {CategoryDto} from "../../../model/category.model";
import {PlaceWithUserModel} from "../../../model/placeWithUser.model";
import {NgForm} from "@angular/forms";
import {NgSelectComponent} from "@ng-select/ng-select";
import {ModalService} from "../../core/_modal/modal.service";
import {PlaceService} from "../../../service/place/place.service";
import {CategoryService} from "../../../service/category.service";
import {SpecificationService} from "../../../service/specification.service";
import {UserService} from "../../../service/user/user.service";
import {MapsAPILoader, MouseEvent} from "@agm/core";
import {PlaceUpdatedDto} from "../../../model/place/placeUpdatedDto.model";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-update-cafe',
  templateUrl: './update-cafe.component.html',
  styleUrls: ['./update-cafe.component.css']
})
export class UpdateCafeComponent implements OnInit {
  name: any;
  nameOfSpecification: any;
  value: any;
  discountsNumber = 101;
  placeName: any;
  address: any;
  place: PlaceUpdatedDto;
  location: LocationDto;
  discountValues: DiscountDto[] = [];
  specification: SpecificationNameDto;
  openingHoursList: OpeningHours[] = [];
  weekDays: WeekDays[] = [WeekDays.MONDAY, WeekDays.TUESDAY, WeekDays.WEDNESDAY, WeekDays.THURSDAY, WeekDays.FRIDAY,
    WeekDays.SATURDAY, WeekDays.SUNDAY];
  openingHours: OpeningHours = new OpeningHours();
  breakTimes: BreakTimes = new BreakTimes();
  categories: any;
  specifications: any;
  category: CategoryDto;
  string: null;
  latitude = 49.841795;
  longitude = 24.031706;
  zoom = 13;
  private geoCoder;
  submitButtonEnabled: boolean;
  isBreakTime = false;
  @Output() newPlaceEvent = new EventEmitter<PlaceWithUserModel>();
  @ViewChild('saveForm', {static: true}) private saveForm: NgForm;
  @ViewChild(NgSelectComponent, {static: true}) ngSelectComponent: NgSelectComponent;
  @ViewChild('search', {static: true})
  public searchElementRef: ElementRef;

  constructor(private modalService: ModalService, private placeService: PlaceService, private categoryService: CategoryService,
              private specificationService: SpecificationService, private uService: UserService, private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone, @Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<UpdateCafeComponent>) {
    this.submitButtonEnabled = true;
  }

  ngOnInit() {
    this.placeService.getPlaceByID(this.data).subscribe(data => {
      this.place = data;
      this.address = this.place.location.address;
      this.latitude = data.location.lat;
      this.longitude = data.location.lng;
      this.zoom = 15;
      this.openingHoursList = data.openingHoursList;
      this.discountValues = data.discountValues;
      this.placeName = data.name;
      this.name = this.place.category.name;

      if (data.openingHoursList.length === 0) {
        this.weekDays;
      } else {
        data.openingHoursList.forEach(day => {
          this.removeDay(day);
        });
        this.weekDays = this.weekDaysNew;
      }
    });

    this.categoryService.findAllCategory().subscribe(data => {
      this.categories = data;
    });

    this.specificationService.findAllSpecification().subscribe(data => {
      this.specifications = data;
      this.nameOfSpecification = data.map(res => res.name);
    });

    this.discountsNumber = Array.apply(null, {length: this.discountsNumber}).map(Number.call, Number);

    // load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder();

      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ['address']
      });
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();

          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //  set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 15;
        });
      });
    });
  }

  addDiscountAndSpecification(nameOfSpecification: string, value: number) {
    let discount1 = new DiscountDto();
    discount1.value = value;
    let specification = new SpecificationNameDto();
    specification.name = nameOfSpecification;
    discount1.specification = specification;
    if (this.discountValues.length === 0) {
      this.discountValues.push(discount1);
    } else {
      let exist = false;
      for (let i = 0; i < this.discountValues.length; i++) {
        if (discount1.specification.name === this.discountValues[i].specification.name) {
          alert("Already exists.");
          exist = true;
        }
      }
      if (exist === false) {
        this.discountValues.push(discount1);
      }
    }
  }

  add(openingHours: OpeningHours, breakTimes: BreakTimes) {
    if (openingHours.closeTime < openingHours.openTime || breakTimes.endTime < breakTimes.startTime) {
      alert('Second time have to be late than first. Please, try again.');
      return;
    }

    let openingHours1 = new OpeningHours();
    openingHours1.closeTime = openingHours.closeTime;
    openingHours1.openTime = openingHours.openTime;
    openingHours1.weekDay = openingHours.weekDay;
    if (breakTimes.endTime && breakTimes.startTime !== undefined) {
      if (breakTimes.startTime > openingHours1.openTime && breakTimes.endTime < openingHours1.closeTime) {
        openingHours1.breakTime = breakTimes;
      } else {
        alert('Invalid break time.');
        return;
      }
    }
    const weekDaysNew: WeekDays[] = [];
    this.weekDays.forEach(val => {
      if (val !== openingHours1.weekDay) {
        weekDaysNew.push(val);
      }
    });
    this.weekDays = weekDaysNew;
    this.openingHoursList.push(openingHours1);
    this.openingHours = new OpeningHours();
    this.breakTimes = new BreakTimes();
    this.isBreakTime = false;
  }

  weekDaysNew: WeekDays[] = [];

  removeDay(openingHours1) {
    this.weekDays.forEach(val => {
      if (val !== openingHours1.weekDay) {
        this.weekDaysNew.push(val);
      }
    });
  }

  switch() {
    this.isBreakTime = !this.isBreakTime;
  }

  deleteDay(openingHours: OpeningHours) {
    this.openingHoursList = this.openingHoursList.filter(item => item !== openingHours);
    this.weekDays.push(openingHours.weekDay);
  }

  delete(discount: DiscountDto) {
    this.discountValues = this.discountValues.filter(item => item !== discount);
  }

  onSubmit() {
    this.placeService.getPlaceByID(this.data).subscribe(data => {
      this.place = data;
      this.submitButtonEnabled = false;
      this.place.openingHoursList = this.openingHoursList;
      this.place.discountValues = this.discountValues;
      this.place.category.name = this.name;
      this.place.discountValues = this.discountValues;
      this.place.location.address = this.address;
      this.place.location.lat = this.latitude;
      this.place.location.lng = this.longitude;
      this.place.name = this.placeName;
      this.placeService.updatePlace(this.place);
    });
    this.dialogRef.close();
  }

  markerDragEnd($event: MouseEvent) {
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({location: {lat: latitude, lng: longitude}}, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  }
}
