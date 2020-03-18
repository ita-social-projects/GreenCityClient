import {Component, ElementRef, EventEmitter, Inject, NgZone, OnInit, Output, ViewChild} from '@angular/core';
import {OpeningHours} from '../../../model/openingHours.model';
import {PlaceAddDto} from '../../../model/placeAddDto.model';
import {CategoryDto} from '../../../model/category.model';
import {LocationDto} from '../../../model/locationDto.model';
import {WeekDays} from '../../../model/weekDays.model';
import {PlaceWithUserModel} from '../../../model/placeWithUser.model';
import {ModalService} from '../_modal/modal.service';
import {CategoryService} from '../../../service/category.service';
import {UserService} from '../../../service/user/user.service';
import {FormBuilder, NgForm} from '@angular/forms';
import {NgSelectComponent} from '@ng-select/ng-select';
import {MapsAPILoader, MouseEvent} from '@agm/core';
import {PlaceService} from '../../../service/place/place.service';
import {BreakTimes} from '../../../model/breakTimes.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {SpecificationService} from '../../../service/specification.service';
import {DiscountDto} from '../../../model/discount/DiscountDto';
import {SpecificationNameDto} from '../../../model/specification/SpecificationNameDto';
import {AngularFireStorage} from '@angular/fire/storage';
import {AngularFirestore} from '@angular/fire/firestore';
import {Photo} from "../../../model/photo/photo";


@Component({
  selector: 'app-propose-cafe',
  templateUrl: './propose-cafe.component.html',
  styleUrls: ['./propose-cafe.component.scss']
})
export class ProposeCafeComponent implements OnInit {
  photoLoadingStatus = false;
  name: any;
  nameOfSpecification: any;
  value: any;
  discountsNumber = 101;
  placeName: any;
  place: PlaceAddDto;
  location: LocationDto;
  discountValues: DiscountDto[] = [];
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
  submitButtonEnabled: boolean;
  isBreakTime = false;
  countOfPhotos: number;
  photos: Photo[] = [];
  photo: Photo;
  @Output() newPlaceEvent = new EventEmitter<PlaceWithUserModel>();
  @ViewChild(NgSelectComponent, {static: true}) ngSelectComponent: NgSelectComponent;
  @ViewChild('search', {static: true})
  public searchElementRef: ElementRef;
  private geoCoder;
  @ViewChild('saveForm', {static: true}) private saveForm: NgForm;
  @ViewChild('choice', {static: true}) private choice: any;

  constructor(private modalService: ModalService, private placeService: PlaceService, private categoryService: CategoryService,
              private specificationService: SpecificationService, private uService: UserService, private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone, private dialogRef: MatDialogRef<ProposeCafeComponent>, private storage: AngularFireStorage,
              private db: AngularFirestore, private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.category = new CategoryDto();
    this.discount = new DiscountDto();
    this.location = new LocationDto();
    this.place = new PlaceAddDto();
    this.photo = new Photo();
    this.place.category = this.category;
    this.submitButtonEnabled = true;
    this.countOfPhotos = this.data;
  }

  ngOnInit() {
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
    if (openingHours.closeTime <= openingHours.openTime || breakTimes.endTime <= breakTimes.startTime) {
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
    let weekDaysNew: WeekDays[] = [];
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
    this.submitButtonEnabled = false;
    this.place.openingHoursList = this.openingHoursList;
    this.place.discountValues = this.discountValues;
    this.place.category.name = this.name;
    this.place.discountValues = this.discountValues;
    this.location.address = this.address;
    this.location.lat = this.latitude;
    this.location.lng = this.longitude;
    this.place.location = this.location;
    this.place.name = this.placeName;
    this.placeService.save(this.place);
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

  setListOfPhotos(photos: Photo[]) {
    this.place.photos = photos;
  }

  changeStatus() {
    this.photoLoadingStatus = !this.photoLoadingStatus;
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
}
