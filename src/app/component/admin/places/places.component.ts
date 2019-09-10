import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {AdminPlace} from '../../../model/place/admin-place.model';
import {OpenHours} from '../../../model/openHours/open-hours.model';
import {NgFlashMessageService} from 'ng-flash-messages';
import {PlaceService} from '../../../service/place/place.service';
import {FlashMessage} from 'ng-flash-messages/models/flash-message';

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.css']
})

export class PlacesComponent implements OnInit {

  places: AdminPlace[];
  pageSize = 5;
  page = 1;
  totalItems: number;
  private errorMsg: string;
  statuses: string[];

  displayedColumns: string[] = ['Category', 'Name', 'Location', 'Working hours', 'Added By', 'Added On', 'Status'];

  defaultStatus = 'proposed';

  constructor(
    private placeService: PlaceService, private titleService: Title, private ngFlashMessageService: NgFlashMessageService) {
  }

  ngOnInit() {
    this.titleService.setTitle('Admin - Places');
    this.onGetPlaces();
    this.getStatuses();
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
          messages: [placeStatus],
          dismissible: true,
          timeout: 3000,
          type: 'success',
        });
        this.onGetPlaces();
      },
      error => {
        this.errorMsg = 'Error. Item was not ' + placeStatus + '.Please try again';

        this.ngFlashMessageService.showFlashMessage({
          messages: [this.errorMsg],
          dismissible: true,
          timeout: 3000,
          type: 'danger'
        });
      }
    );
  }

  getStatuses() {
    this.statuses = ['APPROVED', 'PROPOSED', 'DECLINED'];
  }
}


