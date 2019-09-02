import {Component, OnInit} from '@angular/core';
import {EventManager} from '@angular/platform-browser';
import {AdminPlace} from '../../../model/place/admin-place.model';
import {AdminPlaceService} from '../../../service/admin/admin-place.service';
import {OpenHours} from '../../../model/openHours/open-hours.model';
import {NgFlashMessageService} from 'ng-flash-messages';

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.css']
})

export class PlacesComponent implements OnInit {

  defaultStatus = 'proposed';
  noData = '...';
  places: AdminPlace[];
  pageElements: AdminPlace[];
  elementAmount = 6;
  pageCurrent = 1;
  pageAmount = 1;
  errorMsg: string;

  constructor(private adminPlaceService: AdminPlaceService, private eventManager: EventManager, private ngFlashMessageService: NgFlashMessageService) {
    // this.onGetPlace();
  }

  ngOnInit() {
    this.onGetPlace();
  }


  onGetPlace() {
    this.adminPlaceService.getPlacesByStatus(this.defaultStatus)
      .subscribe(
        places => {
          this.places = places as AdminPlace[];
          console.log(this.places);
          this.pageAmount = Math.round(this.places.length / this.elementAmount);
          if (this.places.length > this.elementAmount) {
            this.pageElements = (this.places.slice(0, this.elementAmount));
          }
        });
  }

  onStatusClick() {
    document.getElementById('statusMenu').classList.toggle('show');
    console.log('status click');
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
      this.pageElements = (this.places.slice(this.pageElements.length - 1, this.pageElements.length + this.elementAmount));
    }
  }

  onPrevClick() {
    if (this.pageCurrent > 1) {
      this.pageCurrent--;
      this.pageElements = (this.places.slice());
    }
  }

  convertHoursToShort(openHours: OpenHours[]): any {
    let result = '';
    let prevHours = '';
    let firstDay = '';
    let lastDay = '';
    openHours.forEach(hours => {
      if (prevHours === '') {
        firstDay = `${AdminPlaceService.getWeekDayShortForm(hours.weekDay)}`;
        prevHours = `${hours.openTime}-${hours.closeTime}`;
      } else {
        if (prevHours === `${hours.openTime}-${hours.closeTime}`) {
          lastDay = ` - ${AdminPlaceService.getWeekDayShortForm(hours.weekDay)}`;
        } else {
          result += firstDay + lastDay + ' ' + prevHours + '\n';
          prevHours = `${hours.openTime}-${hours.closeTime}`;
          firstDay = `${AdminPlaceService.getWeekDayShortForm(hours.weekDay)}`;
          lastDay = '';
        }
      }
    });
    return result + firstDay + lastDay + ' ' + prevHours + '\n';
  }

  convertHoursToNormal(openHours: OpenHours[]): any {
    let result = '';
    openHours.forEach(hours => {
      result += `${AdminPlaceService.getWeekDayShortForm(hours.weekDay)} ${hours.openTime}-${hours.closeTime}\n`;
    });
    return result;
  }

  onResize(event) {
    this.elementAmount = Math.round(event.target.innerHeight / 100);
    this.pageAmount = Math.round(this.places.length / this.elementAmount);
    if (this.places.length > this.elementAmount) {
      this.pageElements = (this.places.slice(0, this.elementAmount));
    }
    console.log(this.elementAmount);
  }

  setPlaceStatus(placeId: number, placeStatus: string) {
    this.adminPlaceService.addPlaceStatus(
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
        console.log(error.error.message);
      }
    );
    this.onGetPlace();
  }
}


