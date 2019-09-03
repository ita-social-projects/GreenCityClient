import {Component, OnInit} from '@angular/core';
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {PlaceAddDto} from "../../../model/placeAddDto.model";
import {CategoryDto} from "../../../model/category.model";
import {LocationDto} from "../../../model/locationDto.model";
import {OpeningHours} from "../../../model/openingHours.model";
import {WeekDays} from "../../../model/weekDays.model";
import {ModalService} from "./add-cafe/_modal/modal.service";
import {PlaceService} from "../../../service/place.service";
import {CategoryService} from "../../../service/category.service";
import {PlaceWithUserModel} from "../../../model/placeWithUser.model";
import {UserService} from "../../../service/user/user.service";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  private firstName: string = null;

  constructor() {
  }
  place: PlaceAddDto = new PlaceAddDto();

  category: CategoryDto = new CategoryDto();

  location: LocationDto = new LocationDto();

  openingHoursList: OpeningHours[] = [];

  weekDays: WeekDays[] = [WeekDays.MONDAY, WeekDays.TUESDAY, WeekDays.WEDNESDAY, WeekDays.THURSDAY, WeekDays.FRIDAY,
    WeekDays.SATURDAY, WeekDays.SUNDAY];

  openingHours: OpeningHours;

  @Output() newPlaceEvent = new EventEmitter<PlaceWithUserModel>();

  submitButtonEnabled: boolean;

  isChecked: boolean[] = [false, false, false, false, false, false, false];

  userRole: string;

  constructor(private modalService: ModalService, private placeService: PlaceService, private categoryService: CategoryService,
              private uService: UserService) {
    this.place = new PlaceWithUserModel();
    this.placeService = placeService;
    this.submitButtonEnabled = true;
  }

  switch(i: number) {
    this.isChecked[i] = !this.isChecked[i];
  }

  onSubmit() {
    this.submitButtonEnabled = false;
    this.place.openingHoursList = this.place.openingHoursList.filter(value => {
        return value.openTime !== undefined && value.closeTime !== undefined;
    });
    console.log(this.place);
    this.placeService.save(this.place)
      .subscribe(result => {
        this.newPlaceEvent.emit(result);
        this.submitButtonEnabled = true;
        this.place.name = "";
        this.place.category = null;
        this.place.location = null;
        this.place.openingHoursList = null;
        alert("Thank you! Wait for approving!")
      }, err => {
        this.submitButtonEnabled = true;
        throw err;
      });
  }

  trackByIdx(i: number, day: any): any {
    return i;
  }

  ngOnInit() {
    this.firstName = window.localStorage.getItem("firstName");
  }

  private signOut() {
    localStorage.clear();
    window.location.href = "/";

    this.weekDays.forEach(obj => {
      this.openingHours = new OpeningHours();
      console.log(this.openingHours);
      this.openingHours.weekdays = obj;
      console.log(this.openingHours.weekdays);
      this.openingHoursList.push(this.openingHours);
      this.place.openingHoursList = this.openingHoursList;
    });

    this.uService.getUserRole().subscribe(data => {
      if (data) {
        this.userRole = data;
      }
    });
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
    console.log(this.place);
  }

  showCat(event: string) {
    console.log(event.toString());
    this.category.name = event.toString();
    this.place.category = this.category;
  }

  showLoc(event: LocationDto) {
    this.location = event;
    this.place.location = this.location;
  }

  // checkValue() {
  //   if (this.isCheckedMon) {
  //     this.openingHours = new OpeningHours();
  //     this.openingHours.openTime = document[0].getElementById('time-mon-start').value;
  //     // this.openingHours.openTime = angular.element(document.querySelector('#time-mon-start')).val();
  //     // this.openingHours.openTime = angular.element(document.querySelector('#time-mon-start')).val();
  //     // console.log('hello');
  //     // console.log(this.openingHours.openTime.valueOf());
  //     this.openingHours.closeTime = document[0].getElementById('time-mon-end').value;
  //     console.log(this.openingHours.openTime);
  //     // this.openingHours.closeTime = document.querySelectorAll('#time-mon-end')[0].value;
  //     this.openingHours.weekdays = WeekDays.MONDAY;
  //     this.openingHoursList.push(this.openingHours);
  //     console.log(this.openingHours.weekdays);
  //   }

}
