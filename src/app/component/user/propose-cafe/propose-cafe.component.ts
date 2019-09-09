import {Component, ElementRef, EventEmitter, NgZone, OnInit, Output, ViewChild} from '@angular/core';
import {OpeningHours} from "../../../model/openingHours.model";
import {PlaceAddDto} from "../../../model/placeAddDto.model";
import {CategoryDto} from "../../../model/category.model";
import {LocationDto} from "../../../model/locationDto.model";
import {WeekDays} from "../../../model/weekDays.model";
import {PlaceWithUserModel} from "../../../model/placeWithUser.model";
import {ModalService} from "../_modal/modal.service";
import {PlaceService} from "../../../service/place.service";
import {CategoryService} from "../../../service/category.service";
import {UserService} from "../../../service/user/user.service";
import {FormArray, FormBuilder, FormControl, FormGroup, NgForm, NgModel, NgModelGroup} from "@angular/forms";
import {NgSelectComponent} from "@ng-select/ng-select";
import {MapsAPILoader, MouseEvent} from "@agm/core";
import {NgFlashMessageService, NgFlashMessagesModule} from "ng-flash-messages";

@Component({
  selector: 'app-propose-cafe',
  templateUrl: './propose-cafe.component.html',
  styleUrls: ['./propose-cafe.component.css']
})
export class ProposeCafeComponent implements OnInit {
  place: PlaceAddDto = new PlaceAddDto();
  location: LocationDto = new LocationDto();
  openingHoursList: OpeningHours[] = [];
  weekDays: WeekDays[] = [WeekDays.MONDAY, WeekDays.TUESDAY, WeekDays.WEDNESDAY, WeekDays.THURSDAY, WeekDays.FRIDAY,
    WeekDays.SATURDAY, WeekDays.SUNDAY];
  openingHours: OpeningHours = new OpeningHours();
  categories: any;
  category: CategoryDto = new CategoryDto();
  string: null;
  title = 'AGM project';
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  private geoCoder;
  submitButtonEnabled: boolean;
  private element: any;
  selectedType: string;

  @Output() newPlaceEvent = new EventEmitter<PlaceWithUserModel>();
  @ViewChild('saveForm',  {static: true}) private saveForm: NgForm;
  @ViewChild('weekDays-selector',  {static: true}) private weekdaySelect: NgModel;
  @ViewChild(NgSelectComponent, {static: true}) ngSelectComponent: NgSelectComponent;
  @ViewChild('search', {static: true})
  public searchElementRef: ElementRef;

  addTypeCategory = (term) => ({name: term});

  isChecked: boolean[] = [false, false, false, false, false, false, false];

  constructor(private modalService: ModalService, private placeService: PlaceService, private categoryService: CategoryService,
              private uService: UserService,  private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private _fb: FormBuilder,
              private ngFlashMessageService: NgFlashMessageService) {
    this.submitButtonEnabled = true;
  }

  ngOnInit() {
    this.categoryService.findAllCategory().subscribe(data => {
      this.categories = data;
    });

    // this.weekDays.forEach(obj => {
    //   this.openingHours = new OpeningHours();
    //   console.log(this.openingHours);
    //   this.openingHours.weekDay = obj;
    //   console.log(this.openingHours.weekDay);
    //   this.openingHoursList.push(this.openingHours);
    //   this.place.openingHoursList = this.openingHoursList;
    // });

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
          // @ts-ignore
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();

          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //  set latitude, longitude and zoom
          this.location.lat = this.latitude = place.geometry.location.lat();
          this.location.lng = this.longitude= place.geometry.location.lng();
          this.zoom = 12;
        });
      });
    });
  }

  add(openingHours: OpeningHours) {
    let openingHours1 = new OpeningHours();
    openingHours1.closeTime=openingHours.closeTime;
    openingHours1.openTime=openingHours.openTime;
    openingHours1.weekDay=openingHours.weekDay;

    this.openingHoursList.push(openingHours1);
    this.place.openingHoursList = this.openingHoursList;
  }

  delete(openingHours: OpeningHours) {
    this.openingHoursList = this.openingHoursList.filter(item => item !== openingHours);
  }

  switch(i: number) {
    this.isChecked[i] = !this.isChecked[i];
  }

  onSubmit() {
    this.submitButtonEnabled = false;
    // this.place.openingHoursList = this.place.openingHoursList.filter(value => {
    //   return value.openTime !== undefined && value.closeTime !== undefined;
    // });
    this.place.openingHoursList = this.openingHoursList;
    console.log(this.category);
    this.place.category = this.category;
    this.place.location = this.location;
    this.placeService.save(this.place).subscribe( () => {
      this.ngFlashMessageService.showFlashMessage({
        messages: ["Cafe " + this.place.name + " was added for approving."],
        dismissible: true,
        timeout: 3000,
        type: 'success'
      });
    });
     console.log(this.place);
     // alert("Cafe " + this.place.name + " was added for approving.");
    this.closeModal('custom-_modal-1');
    this.saveForm.onReset();
    this.ngSelectComponent.handleClearClick();
  }

  successfulAction(message: string) {
    this.ngFlashMessageService.showFlashMessage({
      messages: [message],
      dismissible: true,
      timeout: 3000,
      type: 'success'
    });
  }

  closeModal(id: string) {
    this.modalService.close(id);
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
    this.location.lat = $event.coords.lat;
    this.location.lng = $event.coords.lng;
    this.getAddress(this.location.lat, this.location.lng);
    this.location.address = this.address;
    this.location.lat = this.latitude;
    this.location.lng = this.longitude;
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({location: {lat: latitude, lng: longitude}}, (results, status) => {
      console.log(results);
      console.log(status);
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
