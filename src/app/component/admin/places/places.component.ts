import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {AdminPlace} from '../../../model/place/admin-place.model';
import {OpenHours} from '../../../model/openHours/open-hours.model';
import {NgFlashMessageService} from 'ng-flash-messages';
import {PlaceService} from '../../../service/place/place.service';
import {MatTableDataSource} from '@angular/material';
import {PlaceStatus} from '../../../model/placeStatus.model';
import {FilterPlaceDtoModel} from '../../../model/filtering/filter-place-dto.model';

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
  filterDto: FilterPlaceDtoModel;
  status: PlaceStatus;

  displayedColumns: string[] = ['Category', 'Name', 'Location', 'Working hours', 'Added By', 'Added On', 'Status'];

  defaultStatus = 'proposed';

  constructor(
    private placeService: PlaceService, private titleService: Title, private ngFlashMessageService: NgFlashMessageService) {
  }

  ngOnInit() {
    this.titleService.setTitle('Admin - Places');
    this.filterByRegex(this.searchReg);
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
    this.filterByRegex(this.searchReg);
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
    this.filterByRegex(this.searchReg);
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
        this.filterByRegex(this.searchReg);
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

  filterByRegex(searchReg: string) {
    if ((searchReg === undefined) || (searchReg === '')) {
        this.flag = false;
        searchReg = '%%';
    } else {
      this.flag = true;
      searchReg = `%${this.searchReg}%`;
    }
    this.defaultStatus = this.defaultStatus.toUpperCase();
    this.status = PlaceStatus[this.defaultStatus];
    this.filterDto = new FilterPlaceDtoModel(this.status, null, null, searchReg);
    this.placeService.filterByRegex(this.getCurrentPaginationSettings(), this.filterDto).subscribe(res => {
      this.places = res.page;
      this.page = res.currentPage;
      this.totalItems = res.totalElements;
      this.dataSource.data = this.places;
    });
  }

  onKeydown() {
    this.filterByRegex(this.searchReg);
  }
}


