import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {AdminPlace} from '../../../model/place/admin-place.model';
import {OpenHours} from '../../../model/openHours/open-hours.model';
import {NgFlashMessageService} from 'ng-flash-messages';
import {PlaceService} from '../../../service/place/place.service';
import {ConfirmationDialogService} from '../confirm-modal/confirmation-dialog-service.service';

export interface Status {
  value: string;
  viewValue: string;
}

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
  allStatuses: Status[] = [];
  changeStatuses: Status[];
  selectedPlaces: AdminPlace[];
  isButtonsShows: boolean;
  isCheckAll: boolean;
  isPlacesListEmpty: boolean;

  allColumns = ['Checkbox', 'Category', 'Name', 'Location', 'Working hours', 'Added By', 'Added On', 'Status', 'Delete'];
  displayedColumns: string[];
  displayedButtons: string[];

  defaultStatus = 'proposed';

  constructor(
    private placeService: PlaceService, private titleService: Title, private ngFlashMessageService: NgFlashMessageService,
    private confirmationDialogService: ConfirmationDialogService) {
  }

  ngOnInit() {
    this.titleService.setTitle('Admin - Places');
    this.onGetPlaces();
    this.setStatuses();
  }

  getCurrentPaginationSettings(): string {
    return '?page=' + (this.page - 1) + '&size=' + this.pageSize;
  }

  onGetPlaces() {
    this.placeService.getPlacesByStatus(this.defaultStatus, this.getCurrentPaginationSettings()).subscribe(res => {
      this.places = res.page;
      this.page = res.currentPage;
      this.totalItems = res.totalElements;
      this.isCheckAll = false;
      this.isButtonsShows = false;
      this.isPlacesListEmpty = this.places.length === 0;
      this.setChangeStatuses();
      this.setDisplayedColumns();
      this.setDisplayedButtons();
    });
  }

  changeStatus(status: string) {
    if (this.defaultStatus !== status) {
      this.defaultStatus = status;
      this.onGetPlaces();
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

  changePage(event: any) {
    this.page = event.page;
    this.onGetPlaces();
  }

  updateStatus(placeId: number, placeStatus: string, placeName: string) {
    this.placeService.updatePlaceStatus(placeId, placeStatus).subscribe(
      () => {
        this.showMessage(`"${placeName}" was ${placeStatus}`, 'success');
        this.onGetPlaces();
      },
      error => {
        this.showMessage(`ERROR! "${placeName}" was not ${placeStatus}.Please try again`, 'danger');
      }
    );
  }

  bulkUpdateStatuses(checkedPlaces: AdminPlace[], status: string) {
    if (this.selectedPlaces.length === 1) {
      this.updateStatus(this.selectedPlaces[0].id, status, this.selectedPlaces[0].name);
    } else {
      this.placeService.bulkUpdatePlaceStatuses(checkedPlaces, status).subscribe(
        (data) => {
          this.showMessage(`${data.updatedPlaces} places were ${status}`, 'success');
          this.onGetPlaces();
        }
      );
    }
  }

  setStatuses() {
    this.placeService.getStatuses().subscribe(res => {
      this.allStatuses = res.statuses;
    });
  }

  setChangeStatuses() {
    this.changeStatuses = [...this.allStatuses.filter((status) => {
      if (status.toString() === 'DELETED' && this.defaultStatus !== 'deleted') {
        return false; // skip
      }
      if ((status.toString() === 'PROPOSED' ||  status.toString() === 'DECLINED') && this.defaultStatus === 'deleted') {
        return false; // skip
      }
      return true;
    }).map((column) => column)];
  }

  delete(id: number, placeName: string) {
    this.placeService.delete(id).subscribe(
      () => {
        this.showMessage(`Place "${placeName}" was DELETED!`, 'success');
        this.onGetPlaces();
      }
    );
  }

  bulkDelete(checkedPlaces: AdminPlace[]) {
    this.placeService.bulkDelete(checkedPlaces).subscribe(
      (data) => {
        this.showMessage(`${data.updatedPlaces} places were DELETED!`, 'success');
        this.onGetPlaces();
      }
    );
  }

  isAnyPlaceSelected() {
    this.selectedPlaces = this.places.filter(p => p.isSelected);
    this.isButtonsShows = this.selectedPlaces.length !== 0;
    this.isCheckAll = this.selectedPlaces.length === this.places.length;
  }

  checkAll() {
    this.places.forEach(place => {
      place.isSelected = this.isCheckAll;
    });

    this.isAnyPlaceSelected();
  }

  confirmDelete(id: number, placeName: string) {
    this.confirmationDialogService.confirm('Delete', `Do you really want to delete "${placeName}" ?`)
      .then((confirmed) => {
        if (confirmed) {
          this.delete(id, placeName);
        }
      });
  }

  confirmBulkDelete() {
    if (this.selectedPlaces.length === 1) {
      this.confirmDelete(this.selectedPlaces[0].id, this.selectedPlaces[0].name);
    } else {
      this.confirmationDialogService.confirm('Delete', `Do you really want to delete ${this.selectedPlaces.length} places?`)
        .then((confirmed) => {
          if (confirmed) {
            this.bulkDelete(this.selectedPlaces);
          }
        });
    }
  }

  showMessage(message: string, messageType: string) {
    this.ngFlashMessageService.showFlashMessage({
      messages: [message],
      dismissible: true,
      timeout: 3000,
      type: messageType,
    });
  }

  setDisplayedColumns() {
    this.displayedColumns = [...this.allColumns.filter((column) => {
      if (column === 'Checkbox' && this.places.length === 0) {
        return false; // skip
      }
      if (column === 'Delete' && this.defaultStatus === 'deleted') {
        return false; // skip
      }
      return true;
    }).map((column) => column)];
  }

  setDisplayedButtons() {
    switch (this.defaultStatus) {
      case 'proposed' :
        this.displayedButtons = ['Approve', 'Decline', 'Delete'];
        break;
      case 'approved' :
        this.displayedButtons = ['Decline', 'Propose', 'Delete'];
        break;
      case 'declined' :
        this.displayedButtons = ['Approve', 'Propose', 'Delete'];
        break;
      case 'deleted' :
        this.displayedButtons = ['Approve'];
        break;
    }
  }
}


