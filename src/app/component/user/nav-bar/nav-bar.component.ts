import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {PlaceAddDto} from "../../../model/placeAddDto.model";
import {CategoryDto} from "../../../model/category.model";
import {LocationDto} from "../../../model/locationDto.model";
import {OpeningHours} from "../../../model/openingHours.model";
import {WeekDays} from "../../../model/weekDays.model";
import {ModalService} from "../_modal/modal.service";
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

  private userRole: string;

  constructor(private uService: UserService, private modalService: ModalService) {
  }

  ngOnInit() {
    this.firstName = window.localStorage.getItem("firstName");
    this.userRole = this.uService.getUserRole();
  }

  private signOut() {
    localStorage.clear();
    window.location.href = "/";
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

}
