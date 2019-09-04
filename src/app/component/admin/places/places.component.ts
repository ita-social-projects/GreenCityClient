import {Component, OnInit} from '@angular/core';
import {EventManager, Title} from '@angular/platform-browser';
import {AdminPlace} from '../../../model/place/admin-place.model';
import {OpenHours} from '../../../model/openHours/open-hours.model';
import {NgFlashMessageService} from 'ng-flash-messages';
import {PlaceService} from '../../../service/place/place.service';

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.css']
})

export class PlacesComponent implements OnInit {

  viewHeight: number;

  defaultStatus = 'proposed';
  noData = '...';
  places: AdminPlace[];
  pageElements: AdminPlace[];
  elementAmount = 9;
  pageCurrent = 1;
  pageAmount = 1;
  currentLastElement = 0;
  private errorMsg: string;

  constructor(private placeService: PlaceService, private titleService: Title, private ngFlashMessageService: NgFlashMessageService) {
    this.elementAmount = Math.floor(this.getScreenHeight() / 100);
    this.onGetPlace();
  }

  ngOnInit() {
    this.titleService.setTitle('Admin - Places');
  }

  getScreenHeight() {
    return window.innerHeight;
  }

  onGetPlace() {
    this.placeService.getPlacesByStatus(this.defaultStatus)
      .subscribe(
        places => {
          this.places = places as AdminPlace[];
          console.log('whole places' + this.places.length);
          this.pageAmount = Math.ceil(this.places.length / this.elementAmount);
          if (this.places.length > this.elementAmount) {
            this.pageElements = (this.places.slice(0, this.elementAmount));
            this.currentLastElement = Math.round(this.elementAmount);
            console.log('first elements ' + this.currentLastElement);
          } else {
            this.pageElements = this.places;
          }
        });
  }

  onStatusClick() {
    document.getElementById('statusMenu').classList.toggle('show');
  }

  changeStatus(status: string) {
    this.defaultStatus = status;
    this.pageElements = null;
    this.places = null;
    this.onGetPlace();
    console.log(this.defaultStatus);
  }

  onOpenHoursShow() {
    document.getElementById('openHoursMenu').classList.toggle('show');
  }

  onNextClick() {
    if (this.pageCurrent < this.pageAmount) {
      this.pageCurrent++;
      let fromElement = this.currentLastElement;
      let toElement = this.currentLastElement + this.elementAmount;
      this.pageElements = (this.places.slice(fromElement, toElement));
      this.currentLastElement = this.currentLastElement + this.pageElements.length;
      console.log('next elements ' + this.currentLastElement);
    }
  }

  onPrevClick() {
    if (this.pageCurrent > 1) {
      this.pageCurrent--;
      let toElement = this.currentLastElement - this.pageElements.length;
      let fromElement = toElement - this.elementAmount;
      this.currentLastElement = toElement;
      this.pageElements = (this.places.slice(fromElement, toElement));
      console.log('next elements ' + this.currentLastElement);
    }
  }

  convertHoursToShort(openHours: OpenHours[]): any {
    let result = '';
    let prevHours = '';
    let firstDay = '';
    let lastDay = '';
    openHours.forEach(hours => {
      if (prevHours === '') {
        firstDay = `${PlaceService.getWeekDayShortForm(hours.weekDay)}`;
        prevHours = `${hours.openTime}-${hours.closeTime}`;
      } else {
        if (prevHours === `${hours.openTime}-${hours.closeTime}`) {
          lastDay = ` - ${PlaceService.getWeekDayShortForm(hours.weekDay)}`;
        } else {
          result += firstDay + lastDay + ' ' + prevHours + '\n';
          prevHours = `${hours.openTime}-${hours.closeTime}`;
          firstDay = `${PlaceService.getWeekDayShortForm(hours.weekDay)}`;
          lastDay = '';
        }
      }
    });
    return result + firstDay + lastDay + ' ' + prevHours + '\n';
  }

  onResize(event) {
    this.elementAmount = Math.round(event.target.innerHeight / 100);
    this.pageAmount = Math.round(this.places.length / this.elementAmount);
    if (this.places.length > this.elementAmount) {
      this.pageElements = (this.places.slice(0, this.elementAmount));
      this.pageCurrent = 1;
    }
    console.log(this.elementAmount);
  }

  updateStatus(placeId: number, placeStatus: string) {
    this.placeService.updatePlaceStatus(
      {
        id: placeId,
        status: placeStatus
      }
    ).subscribe(
      () => {
        this.ngFlashMessageService.showFlashMessage({
          messages: [placeStatus === 'APPROVED' ? 'Approved' : 'Declined'],
          dismissible: true,
          timeout: 3000,
          type: 'success'
        });
        console.log(placeStatus === 'APPROVED' ? 'Approved' : 'Declined');
        this.onGetPlace();
      },
      error => {
        this.errorMsg = 'Error. Item was not ';
        this.errorMsg += placeStatus === 'APPROVED' ? 'approved' : 'declined';
        this.errorMsg += '.Please try again';

        this.ngFlashMessageService.showFlashMessage({
          messages: [this.errorMsg],
          dismissible: true,
          timeout: 3000,
          type: 'danger'
        });
      }
    );
  }
}


