import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {AdminPlace} from '../../../model/place/admin-place.model';
import {NgFlashMessageService} from 'ng-flash-messages';
import {PlaceService} from '../../../service/place/place.service';
import {MatTableDataSource} from '@angular/material';
import {PlaceStatus} from '../../../model/placeStatus.model';
import {FilterPlaceDtoModel} from '../../../model/filtering/filter-place-dto.model';
import {ConfirmationDialogService} from '../confirm-modal/confirmation-dialog-service.service';
import {MatDialog} from '@angular/material';
import {PlaceUpdatedDto} from '../../../model/place/placeUpdatedDto.model';
import {UpdateCafeComponent} from '../update-cafe/update-cafe.component';
import {WeekDaysUtils} from "../../../model/weekDaysUtils.model";

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.css']
})

export class PlacesComponent implements OnInit {

  place: PlaceUpdatedDto;
  places: AdminPlace[];
  pageSize = 5;
  page = 1;
  totalItems: number;
  allStatuses: string[] = [];
  changeStatuses: string[];
  selectedPlaces: AdminPlace[];
  isButtonsShows: boolean;
  isCheckAll: boolean;
  isPlacesListEmpty: boolean;
  searchReg: string;
  dataSource = new MatTableDataSource<AdminPlace>();
  flag = true;
  filterDto: FilterPlaceDtoModel;
  status: PlaceStatus;
  sortParam = '&sort=modifiedDate';
  allColumns = ['Checkbox', 'Category', 'Name', 'Location', 'Working hours', 'Added By', 'modifiedDate', 'Status', 'Edit', 'Delete'];
  displayedColumns: string[];
  displayedButtons: string[];
  defaultStatus = 'proposed';

  constructor(public dialog: MatDialog,
              private titleService: Title,
              private placeService: PlaceService,
              public weekDaysUtils: WeekDaysUtils,
              private ngFlashMessageService: NgFlashMessageService,
              private confirmationDialogService: ConfirmationDialogService) {
  }

  ngOnInit() {
    this.titleService.setTitle('Admin - Places');
    this.filterByRegex(this.searchReg);
    this.setAllStatuses();
  }

  getCurrentPaginationSettings(): string {
    return '?page=' + (this.page - 1) + '&size=' + this.pageSize;
  }

  changeStatus(status: string) {
    if (this.defaultStatus !== status) {
      this.defaultStatus = status;
      this.filterByRegex(this.searchReg);
    }
  }

  changePage(event: any) {
    this.page = event.page;
    this.filterByRegex(this.searchReg);
  }

  updateStatus(placeId: number, placeStatus: string, placeName: string) {
    this.placeService.updatePlaceStatus(placeId, placeStatus).subscribe(
      () => {
        this.showMessage(`"<b>${placeName}</b>" was <b>${placeStatus}</b>`, 'success');
        this.filterByRegex(this.searchReg);
      },
      error => {
        this.showMessage(`ERROR! "<b>${placeName}</b>" was not <b>${placeStatus}</b>. Please try again`, 'danger');
      }
    );
  }

  bulkUpdateStatuses(checkedPlaces: AdminPlace[], status: string) {
    if (this.selectedPlaces.length === 1) {
      this.updateStatus(this.selectedPlaces[0].id, status, this.selectedPlaces[0].name);
    } else {
      this.placeService.bulkUpdatePlaceStatuses(checkedPlaces, status).subscribe(
        (data) => {
          this.showMessage(`<b>${data.length}</b> places were <b>${status}</b>`, 'success');
          this.filterByRegex(this.searchReg);
        },
        error => {
          this.showMessage(`ERROR! <b>${checkedPlaces.length}</b> places were not <b>${status}</b>. Please try again`, 'danger');
        }
      );
    }
  }

  setAllStatuses() {
    this.placeService.getStatuses().subscribe(res => {
      this.allStatuses = res;
    });
  }

  setChangeStatuses() {
    this.changeStatuses = [...this.allStatuses.filter((status) => {
      if (status === 'DELETED' && this.defaultStatus !== 'deleted') {
        return false; // skip
      }
      if ((status === 'PROPOSED' || status === 'DECLINED') && this.defaultStatus === 'deleted') {
        return false; // skip
      }
      return true;
    }).map((column) => column)];
  }

  delete(id: number, placeName: string) {
    this.placeService.delete(id).subscribe(
      () => {
        this.showMessage(`Place "<b>${placeName}</b>" was <b>DELETED</b>!`, 'success');
        this.filterByRegex(this.searchReg);
      },
      error => {
        this.showMessage(`ERROR! Place "<b>${placeName}</b>" was not <b>DELETED</b>!. Please try again`, 'danger');
      }
    );
  }

  bulkDelete(checkedPlaces: AdminPlace[]) {
    this.placeService.bulkDelete(checkedPlaces).subscribe(
      (count) => {
        this.showMessage(`<b>${count}</b> places were <b>DELETED</b>!`, 'success');
        this.filterByRegex(this.searchReg);
      },
      error => {
        this.showMessage(`ERROR! <b>${checkedPlaces.length}</b> places were not <b>DELETED</b>!. Please try again`, 'danger');
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
      if (column === 'Delete' && (this.defaultStatus === 'deleted' || this.defaultStatus === 'proposed')) {
        return false; // skip
      }
      return true;
    }).map((column) => column)];
  }

  setDisplayedButtons() {
    switch (this.defaultStatus) {
      case 'proposed' :
        this.displayedButtons = ['Approve', 'Decline'];
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

  filterByRegex(searchReg: string) {
    if ((searchReg === undefined) || (searchReg === '')) {
      this.flag = false;
      searchReg = '%%';
    } else {
      this.flag = true;
      searchReg = `%${this.searchReg}%`;
    }
    this.status = PlaceStatus[this.defaultStatus.toUpperCase()];
    this.filterDto = new FilterPlaceDtoModel(this.status, null, null, null, searchReg, null);
    this.placeService.filterByRegex(this.getCurrentPaginationSettings(), this.filterDto).subscribe(res => {
      this.places = res.page;
      this.page = res.currentPage;
      this.totalItems = res.totalElements;
      this.dataSource.data = this.places;
      this.isCheckAll = false;
      this.isButtonsShows = false;
      this.isPlacesListEmpty = this.places.length === 0;
      this.setChangeStatuses();
      this.setDisplayedColumns();
      this.setDisplayedButtons();
    });
  }

  onKeydown() {
    this.filterByRegex(this.searchReg);
  }

  openDialog(placeId: number): void {
    const dialogRef = this.dialog.open(UpdateCafeComponent, {
      width: '800px',
      data: placeId
    });

    dialogRef.afterClosed().subscribe(result => {
      setTimeout(() => this.filterByRegex(this.searchReg), 1000);
    });
  }
}


