import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
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

  places: AdminPlace[];
  pageSize = 2;
  page = 1;
  totalItems: number;
  private errorMsg: string;

  displayedColumns: string[] = ['Category', 'Name', 'Location', 'Working hours', 'Added By', 'Added On', 'Status', 'Action'];

  defaultStatus = 'proposed';

  constructor(
    private placeService: PlaceService, private titleService: Title, private ngFlashMessageService: NgFlashMessageService) {
  }

  ngOnInit() {
    this.titleService.setTitle('Admin - Places');
    this.onGetPlaces();
  }

  getCurrentPaginationSettings(): string {
    return '?page=' + (this.page - 1) + '&size=' + this.pageSize;
  }

  onGetPlaces() {
    this.placeService.getPlacesByStatus(this.defaultStatus, this.getCurrentPaginationSettings()).subscribe(res => {
      this.places = res.page;
      this.page = res.currentPage;
      this.totalItems = res.totalElements;
    });
  }


  changeStatus(status: string) {
    this.defaultStatus = status;
    this.places = null;
    this.onGetPlaces();
    console.log(this.defaultStatus);
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

  changePage(event: any) {
    this.page = event.page;
    this.onGetPlaces();
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
        this.onGetPlaces();
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


