import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {OpeningHours} from '../../../model/openingHours.model';
import {PlaceAddDto} from '../../../model/placeAddDto.model';
import {CategoryDto} from '../../../model/category.model';
import {LocationDto} from '../../../model/locationDto.model';
import {WeekDays} from '../../../model/weekDays.model';
import {PlaceWithUserModel} from '../../../model/placeWithUser.model';
import {ModalService} from '../_modal/modal.service';
import {PlaceService} from '../../../service/place.service';
import {CategoryService} from '../../../service/category.service';
import {UserService} from '../../../service/user/user.service';

@Component({
  selector: 'app-propose-cafe',
  templateUrl: './propose-cafe.component.html',
  styleUrls: ['./propose-cafe.component.css']
})
export class ProposeCafeComponent implements OnInit {

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

  constructor(private modalService: ModalService, private placeService: PlaceService, private categoryService: CategoryService,
              private uService: UserService) {
    this.placeService = placeService;
    this.submitButtonEnabled = true;
  }

  ngOnInit() {
    this.weekDays.forEach(obj => {
      this.openingHours = new OpeningHours();
      console.log(this.openingHours);
      this.openingHours.weekDay = obj;
      console.log(this.openingHours.weekDay);
      this.openingHoursList.push(this.openingHours);
      this.place.openingHoursList = this.openingHoursList;
    });
  }

  switch(i: number) {
    this.isChecked[i] = !this.isChecked[i];
  }

  onSubmit() {
    this.submitButtonEnabled = false;
    this.place.openingHoursList = this.place.openingHoursList.filter(value => {
      return value.openTime !== undefined && value.closeTime !== undefined;
    });
    this.placeService.save(this.place);
    console.log(this.place);
    alert('Successful');
  }

  trackByIdx(i: number, day: any): any {
    return i;
  }

  showCat(event: string) {
    this.category.name = event.toString();
    this.place.category = this.category;
  }

  showLoc(event: LocationDto) {
    this.location.lng = event.lng;
    this.location.lat = event.lat;
    this.location.address = event.address;
    this.place.location = this.location;
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }

}
