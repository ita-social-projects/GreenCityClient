import {Component, ElementRef, EventEmitter, Inject, NgZone, OnInit, Output, ViewChild} from '@angular/core';
import {OpeningHours} from "../../../model/openingHours.model";
import {PlaceAddDto} from "../../../model/placeAddDto.model";
import {CategoryDto} from "../../../model/category.model";
import {LocationDto} from "../../../model/locationDto.model";
import {WeekDays} from "../../../model/weekDays.model";
import {PlaceWithUserModel} from "../../../model/placeWithUser.model";
import {ModalService} from "../_modal/modal.service";
import {CategoryService} from "../../../service/category.service";
import {UserService} from "../../../service/user/user.service";
import {NgForm} from "@angular/forms";
import {NgSelectComponent} from "@ng-select/ng-select";
import {MapsAPILoader, MouseEvent} from "@agm/core";
import {PlaceService} from "../../../service/place/place.service";
import {BreakTimes} from "../../../model/breakTimes.model";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {SpecificationService} from "../../../service/specification.service";
import {DiscountDto} from "../../../model/discount/DiscountDto";
import {SpecificationNameDto} from "../../../model/specification/SpecificationNameDto";
import {Specification} from "../../../model/specification/specification";

@Component({
  selector: 'app-propose-cafe',
  templateUrl: './propose-cafe.component.html',
  styleUrls: ['./propose-cafe.component.css']
})
export class ProposeCafeComponent implements OnInit {
  name: any;
  nameOfSpecification: any;
  value: any;
  discountsNumber = 101;
  placeName: any;
  place: PlaceAddDto;
  location: LocationDto;
  discounts: DiscountDto[] = [];
  specification: SpecificationNameDto;
  openingHoursList: OpeningHours[] = [];
  weekDays: WeekDays[] = [WeekDays.MONDAY, WeekDays.TUESDAY, WeekDays.WEDNESDAY, WeekDays.THURSDAY, WeekDays.FRIDAY,
    WeekDays.SATURDAY, WeekDays.SUNDAY];
  openingHours: OpeningHours = new OpeningHours();
  breakTimes: BreakTimes = new BreakTimes();
  discount: DiscountDto;
  categories: any;
  specifications: any;
  category: CategoryDto;
  string: null;
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  private geoCoder;
  submitButtonEnabled: boolean;
  isBreakTime = false;

  @Output() newPlaceEvent = new EventEmitter<PlaceWithUserModel>();
  @ViewChild('saveForm', {static: true}) private saveForm: NgForm;
  @ViewChild(NgSelectComponent, {static: true}) ngSelectComponent: NgSelectComponent;
  @ViewChild('search', {static: true})
  @ViewChild('choice', {static: true}) private choice: any;

  public searchElementRef: ElementRef;

  // addTypeCategory = (term) => ({name: term});.

  constructor(private modalService: ModalService, private placeService: PlaceService, private categoryService: CategoryService,
              private specificationService: SpecificationService, private uService: UserService, private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone, private dialogRef: MatDialogRef<ProposeCafeComponent>) {
    this.category = new CategoryDto();
    this.discount = new DiscountDto();
    this.location = new LocationDto();
    this.place = new PlaceAddDto();
    this.place.category = this.category;
    this.submitButtonEnabled = true;
  }

  ngOnInit() {
    console.log(this.place.openingHoursList);
    this.categoryService.findAllCategory().subscribe(data => {
      this.categories = data;
    });

    this.specificationService.findAllSpecification().subscribe(data => {
      this.specifications = data;
    });

    this.discountsNumber = Array.apply(null, {length: this.discountsNumber}).map(Number.call, Number);

    // load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
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
          this.zoom = 12;
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
    // this.discounts.push(discount1);
    if (this.discounts.length == 0) {
      this.discounts.push(discount1);
      console.log(this.discounts);
      discount1 = new DiscountDto();
    } else if (this.discounts.length === 1) {
      for (let i = 0; i < this.discounts.length; i++) {
        if (discount1.specification.name !== this.discounts[i].specification.name) {
          this.discounts.push(discount1);
        } else {
          alert("Already exists.");
        }
      }
    }else {
      for (let i = 0; i < this.discounts.length; i++) {
        for (let j = i + 1; j < this.discounts.length; i++) {
          if (discount1.specification.name == this.discounts[i].specification.name ||
            discount1.specification.name == this.discounts[j].specification.name) {
            alert("Already exists.");
          }
        }
      }
    }
  }

  add(openingHours: OpeningHours, breakTimes: BreakTimes) {
    console.log(openingHours);
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
        console.log(openingHours1.breakTime);
        console.log(breakTimes);
        openingHours1.breakTime = breakTimes;
        console.log(openingHours1.breakTime);
      } else {
        alert('Invalid break time.');
        return;
      }
    }
    let weekDaysNew: WeekDays[] = [];
    this.weekDays.forEach(val => {
      if (val !== openingHours1.weekDay) {
        weekDaysNew.push(val);
      }
    });
    this.weekDays = weekDaysNew;

    console.log(openingHours1);
    this.openingHoursList.push(openingHours1);
    this.openingHours = new OpeningHours();
    this.breakTimes = new BreakTimes();
    console.log(this.openingHoursList);
    this.isBreakTime = false;
  }

  switch() {
    console.log('switch');
    this.isBreakTime = !this.isBreakTime;
  }

  deleteDay(openingHours: OpeningHours) {
    this.openingHoursList = this.openingHoursList.filter(item => item !== openingHours);
    this.weekDays.push(openingHours.weekDay);
  }

  delete(discount: DiscountDto) {
    this.discounts = this.discounts.filter(item => item !== discount);
  }

  onSubmit() {

    this.submitButtonEnabled = false;
    this.place.openingHoursList = this.openingHoursList;
    this.place.discounts = this.discounts;
    this.place.category.name = this.name;
    this.place.discounts = this.discounts;
    this.place.location.address = this.address;
    this.place.location.lat = this.latitude;
    this.place.location.lng = this.longitude;
    // this.place.location = this.location;
    this.place.name = this.placeName;
    console.log(this.place);
    this.placeService.save(this.place);
    this.dialogRef.close();
  }

  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 8;
        this.getAddress(this.latitude, this.longitude);
      });
    }
  }

  markerDragEnd($event: MouseEvent) {
    console.log($event);
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
