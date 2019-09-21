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
import {ModalService} from "../../user/_modal/modal.service";
import {PlaceService} from "../../../service/place/place.service";
import {CategoryService} from "../../../service/category.service";
import {SpecificationService} from "../../../service/specification.service";
import {UserService} from "../../../service/user/user.service";
import {MapsAPILoader, MouseEvent} from "@agm/core";
import {PlaceUpdatedDto} from "../../../model/place/placeUpdatedDto.model";
import {MAT_DIALOG_DATA} from "@angular/material";

@Component({
  selector: 'app-update-cafe',
  templateUrl: './update-cafe.component.html',
  styleUrls: ['./update-cafe.component.css']
})
export class UpdateCafeComponent implements OnInit {

  categoryName: any;
  name: any;
  nameOfSpecification: any;
  value: any;
  // discounts: number[] = new Array(100);
  discountsNumber = 101;
  placeName: any;
  place: PlaceUpdatedDto;
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
  public searchElementRef: ElementRef;

  // addTypeCategory = (term) => ({name: term});.

  constructor(private modalService: ModalService, private placeService: PlaceService, private categoryService: CategoryService,
              private specificationService: SpecificationService, private uService: UserService, private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.submitButtonEnabled = true;
  }

  getPlace() {
    this.placeService.getPlaceByID(this.data).subscribe(data => {
      this.place = data;
      console.log(data);
    });
  }

  ngOnInit() {
    this.placeService.getPlaceByID(this.data).subscribe(data => {
      this.place = data;
      this.openingHoursList=data.openingHoursList;
      this.discounts = data.discounts;
      this.placeName = data.name;
      this.name = this.place.category.name;

      this.openingHoursList.forEach(day=>{this.removeDay(day);});
      this.weekDays=this.weekDaysNew;
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

  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }

  addDiscountAndSpecification(nameOfSpecification: string, value: number) {
    let discount1 = new DiscountDto();
    discount1.value = value;
    let specification = new SpecificationNameDto();
    specification.name = nameOfSpecification;
    discount1.specification = specification;
    console.log(discount1);

    // if (this.discounts.length == 0) {
    //   this.discounts.push(discount1);
    //   console.log(this.discounts);
    //   discount1 = new DiscountDto();
    // } else if (this.discounts.length >= 1) {
    //   for (let i = 0; i < this.discounts.length; i++) {
    //     if (discount1.specification.name == this.discounts[i].specification.name) {
    //       alert("Already exists.")
    //     }
    //     else {
          let specificationsNew: SpecificationNameDto[] = [];
          this.specifications.forEach(val => {
            if (val !== discount1.specification.name) {
              specificationsNew.push(val);
              console.log(this.specifications);
            }
          });
          this.specifications = specificationsNew;
          this.discounts.push(discount1);
          console.log(this.discounts);
          discount1 = new DiscountDto();
        // }
    //   }
    // }
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
  weekDaysNew: WeekDays[] = [];
  removeDay(openingHours1){
    this.weekDays.forEach(val => {
      if (val !== openingHours1.weekDay) {
        this.weekDaysNew.push(val);
      }
    });

  }
  switch() {
    console.log('switch');
    this.isBreakTime = !this.isBreakTime;
  }

  deleteDay(openingHours: OpeningHours) {
    this.openingHoursList = this.openingHoursList.filter(item => item !== openingHours);
    this.weekDays.push(openingHours.weekDay);
  }

  deleteDayOfExist(openingHours: OpeningHours) {
    this.openingHoursList = this.openingHoursList.filter(item => item !== openingHours);
    this.weekDays.push(openingHours.weekDay);
  }

  delete(discount: DiscountDto) {
    this.place.discounts = this.place.discounts.filter(item => item !== discount);
  }

  onSubmit() {
    this.submitButtonEnabled = false;
    this.place.openingHoursList = this.openingHoursList;
    this.place.discounts = this.discounts;
    this.place.category.name = this.name;
    this.place.discounts = this.discounts;
    this.location.address = this.address;
    this.location.lat = this.latitude;
    this.location.lng = this.longitude;
    this.place.location = this.location;
    this.place.name = this.placeName;
    console.log(this.place);
    this.placeService.updatePlace(this.place);
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
