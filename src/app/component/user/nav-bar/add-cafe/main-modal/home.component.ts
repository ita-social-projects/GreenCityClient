import {Component, OnInit} from '@angular/core';
import {ModalService} from '../_modal/modal.service';
import {PlaceAddDto} from "../../../../../model/placeAddDto.model";
import {CategoryDto} from "../../../../../model/category.model";
import {LocationDto} from "../../../../../model/locationDto.model";
import {OpeningHours} from "../../../../../model/openingHours.model";
import {WeekDays} from "../../../../../model/weekDays.model";
import {PlaceService} from "../../../../../service/place.service";
import {CategoryService} from "../../../../../service/category.service";


@Component({
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.css'],
  selector: 'app-home'
})
export class HomeComponent implements OnInit {

  place: PlaceAddDto = new PlaceAddDto();

  category: CategoryDto = new CategoryDto();

  location: LocationDto = new LocationDto();

  openingHoursList: OpeningHours[] = [];

  weekDays: WeekDays[] = [WeekDays.MONDAY, WeekDays.TUESDAY, WeekDays.WEDNESDAY,
    WeekDays.THURSDAY, WeekDays.FRIDAY, WeekDays.SATURDAY, WeekDays.SUNDAY];

  openingHours: OpeningHours;

  isCheckedMon: boolean;

  isCheckedTue: boolean;

  isCheckedWed: boolean;

  isCheckedThur: boolean;

  isCheckedFri: boolean;

  isCheckedSat: boolean;

  isCheckedSun: boolean;

  // isDisable: boolean;

  isChecked: boolean[] = [false, false, false, false, false, false, false];

  isDisable: boolean[] = [true, true, true, true, true, true, true];

  constructor(private modalService: ModalService, private placeService: PlaceService, private categoryService: CategoryService) {
  }

  switch(i: number) {
    this.isChecked[i] = this.isChecked[i];
    // this.weekDays.forEach(obj => {
    //   this.openingHours = new OpeningHours();
    //   console.log(this.openingHours);
    //   if (this.isChecked[i]) {
    //     this.openingHours.weekdays = obj;
    //   }
    //   this.openingHoursList.push(this.openingHours);
    // });
  }

  save() {
    this.placeService.save(this.place)
      .subscribe(data => console.log(data), error => console.log(error));
    this.place = new PlaceAddDto();
  }

  trackByIdx(i: number, day: any): any {
    return i;
  }

  ngOnInit() {
    this.weekDays.forEach(obj => {
      this.openingHours = new OpeningHours();
      console.log(this.openingHours);
      this.openingHours.weekdays = obj;
      this.openingHoursList.push(this.openingHours);
      this.place.openingHoursList = this.openingHoursList;
    });
  }

  // aaa() {
  // }

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    // this.aaa();
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
