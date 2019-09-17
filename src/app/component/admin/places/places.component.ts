import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {AdminPlace} from '../../../model/place/admin-place.model';
import {OpenHours} from '../../../model/openHours/open-hours.model';
import {NgFlashMessageService} from 'ng-flash-messages';
import {PlaceService} from '../../../service/place/place.service';
import {MatTableDataSource} from '@angular/material';
import {UserForListDtoModel} from '../../../model/user/user-for-list-dto.model';

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
  searchReg: string;
  dataSource = new MatTableDataSource<AdminPlace>();
  flag = true;

  displayedColumns: string[] = ['Category', 'Name', 'Location', 'Working hours', 'Added By', 'Added On', 'Status'];

  defaultStatus = 'proposed';

  constructor(
    private placeService: PlaceService, private titleService: Title, private ngFlashMessageService: NgFlashMessageService) {
  }

  ngOnInit() {
    this.titleService.setTitle('Admin - Places');
    this.filterByRegex();
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
    this.filterByRegex();
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
    this.filterByRegex();
  }

  updateStatus(placeId: number, placeStatus: string, placeName: string) {
    this.placeService.updatePlaceStatus(
      {
        id: placeId,
        status: placeStatus
      }
    ).subscribe(
      () => {
        this.ngFlashMessageService.showFlashMessage({
          messages: ['\"' + placeName + '\"' + ' was ' + placeStatus],
          dismissible: true,
          timeout: 3000,
          type: 'success',
        });
        this.filterByRegex();
      },
      error => {
        this.errorMsg = 'Error.' + '\"' + placeName + '\"' + ' was not ' + placeStatus + '.Please try again';

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

  filterByRegex() {
    this.defaultStatus = this.defaultStatus.toUpperCase();
    this.placeService.filterByRegex(this.defaultStatus, this.searchReg, this.getCurrentPaginationSettings()).subscribe(res => {
      this.places = res.page;
      this.page = res.currentPage;
      this.totalItems = res.totalElements;
      this.dataSource.data = this.places;
    });
  }

  onKeydown() {
    if ((this.searchReg === undefined) || (this.searchReg === '')) {
      if (this.flag) {
        this.flag = false;
        this.filterByRegex();
      }
    } else {
      this.flag = true;
      this.filterByRegex();
    }
  }
}


