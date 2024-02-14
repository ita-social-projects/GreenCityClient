import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { AdminPlace } from '../../models/admin-place.model';
import { PlaceService } from '../../../../service/place/place.service';
import { PlaceStatus } from '../../../../model/placeStatus.model';
import { FilterPlaceDtoModel } from '../../../../model/filtering/filter-place-dto.model';
import { ConfirmationDialogService } from '../../services/confirmation-dialog-service.service';
import { PlaceUpdatedDto } from '../../models/placeUpdatedDto.model';
import { UpdateCafeComponent } from '../update-cafe/update-cafe.component';
import { WeekDaysUtils } from '../../../../service/weekDaysUtils.service';
import { PaginationComponent } from 'ngx-bootstrap/pagination';
import { TranslateService } from '@ngx-translate/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';

@Component({
  selector: 'app-old-places',
  templateUrl: './old-places.component.html',
  styleUrls: ['./old-places.component.scss']
})
export class OldPlacesComponent implements OnInit {
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
  sortColumn = 'name';
  sortDirection = 'asc';
  selectedColumnToSort = 'name';
  sortArrow: string;
  @ViewChild('paginationElement')
  paginationComponent: PaginationComponent;
  deleteTranslation: string;
  deleteMessageTranslation: string;
  placesTranslation: string;
  public dialog: MatDialog;
  private titleService: Title;
  private placeService: PlaceService;
  public weekDaysUtils: WeekDaysUtils;
  private confirmationDialogService: ConfirmationDialogService;
  private translation: TranslateService;
  public sanitizer: DomSanitizer;
  public iconRegistry: MatIconRegistry;

  constructor(private injector: Injector) {
    this.iconRegistry = injector.get(MatIconRegistry);
    this.sanitizer = injector.get(DomSanitizer);
    this.translation = injector.get(TranslateService);
    this.confirmationDialogService = injector.get(ConfirmationDialogService);
    this.weekDaysUtils = injector.get(WeekDaysUtils);
    this.placeService = injector.get(PlaceService);
    this.titleService = injector.get(Title);
    this.dialog = injector.get(MatDialog);
    this.iconRegistry.addSvgIcon('arrow-up', this.sanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/arrows/arrow-up-bold.svg'));
    this.iconRegistry.addSvgIcon('arrow-down', this.sanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/arrows/arrow-down-bold.svg'));
  }

  ngOnInit() {
    this.getFromLocalStorage();
    this.titleService.setTitle('Admin - Places');
    this.filterByRegex(this.searchReg);
    this.setAllStatuses();

    this.translation.get('feedbacks.delete').subscribe((translation) => (this.deleteTranslation = translation));
    this.translation
      .get('feedbacks.Do-you-really-want-to-delete-comment-of')
      .subscribe((translation) => (this.deleteMessageTranslation = translation));
    this.translation.get('feedbacks.places').subscribe((translation) => (this.placesTranslation = translation));
  }

  getCurrentPaginationSettings(): string {
    return '?page=' + (this.page - 1) + '&size=' + this.pageSize + '&sort=' + this.sortColumn + ',' + this.sortDirection;
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
      (error) => {
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
        (error) => {
          this.showMessage(`ERROR! <b>${checkedPlaces.length}</b> places were not <b>${status}</b>. Please try again`, 'danger');
        }
      );
    }
  }

  setAllStatuses() {
    this.placeService.getStatuses().subscribe((res) => {
      this.allStatuses = res;
      this.setChangeStatuses();
    });
  }

  setChangeStatuses() {
    this.changeStatuses = [
      ...this.allStatuses
        .filter((status) => {
          if (status === 'DELETED' && this.defaultStatus !== 'deleted') {
            return false; // skip
          }
          if ((status === 'PROPOSED' || status === 'DECLINED') && this.defaultStatus === 'deleted') {
            return false; // skip
          }
          return true;
        })
        .map((column) => column)
    ];
  }

  delete(id: number, placeName: string) {
    this.placeService.delete(id).subscribe(
      () => {
        this.showMessage(`Place "<b>${placeName}</b>" was <b>DELETED</b>!`, 'success');
        this.filterByRegex(this.searchReg);
      },
      (error) => {
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
      (error) => {
        this.showMessage(`ERROR! <b>${checkedPlaces.length}</b> places were not <b>DELETED</b>!. Please try again`, 'danger');
      }
    );
  }

  isAnyPlaceSelected() {
    this.selectedPlaces = this.places.filter((p) => p.isSelected);
    this.isButtonsShows = this.selectedPlaces.length !== 0;
    this.isCheckAll = this.selectedPlaces.length === this.places.length;
  }

  checkAll() {
    this.places.forEach((place) => {
      place.isSelected = this.isCheckAll;
    });

    this.isAnyPlaceSelected();
  }

  confirmDelete(id: number, placeName: string) {
    this.confirmationDialogService
      .confirm(this.deleteTranslation, this.deleteMessageTranslation + ' ' + placeName + ' ?')
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
      this.confirmationDialogService
        .confirm(this.deleteTranslation, this.deleteMessageTranslation + ' ' + this.selectedPlaces.length + this.placesTranslation + ' ?')
        .then((confirmed) => {
          if (confirmed) {
            this.bulkDelete(this.selectedPlaces);
          }
        });
    }
  }

  showMessage(message: string, messageType: string) {
    // TODO: add functionality to this method
  }

  setDisplayedColumns() {
    this.displayedColumns = [
      ...this.allColumns
        .filter((column) => {
          if (column === 'Checkbox' && this.places.length === 0) {
            return false; // skip
          }
          if (column === 'Delete' && this.defaultStatus === 'deleted') {
            return false; // skip
          }
          return true;
        })
        .map((column) => column)
    ];
  }

  setDisplayedButtons() {
    switch (this.defaultStatus) {
      case 'proposed':
        this.displayedButtons = ['Approve', 'Decline', 'Delete'];
        break;
      case 'approved':
        this.displayedButtons = ['Decline', 'Propose', 'Delete'];
        break;
      case 'declined':
        this.displayedButtons = ['Approve', 'Propose', 'Delete'];
        break;
      case 'deleted':
        this.displayedButtons = ['Approve'];
        break;
    }
  }

  filterByRegex(searchReg: string) {
    if (searchReg === undefined || searchReg === '') {
      this.flag = false;
      searchReg = '%%';
    } else {
      this.flag = true;
      searchReg = `%${this.searchReg}%`;
    }
    this.status = PlaceStatus[this.defaultStatus.toUpperCase()];
    this.filterDto = new FilterPlaceDtoModel(this.status, null, null, null, searchReg, null);
    this.placeService.filterByRegex(this.getCurrentPaginationSettings(), this.filterDto).subscribe((res) => {
      this.places = res.page;
      this.page = res.currentPage + 1;
      this.totalItems = res.totalElements;
      this.dataSource.data = this.places;
      this.isCheckAll = false;
      this.isButtonsShows = false;
      this.isPlacesListEmpty = this.places.length === 0;
      this.setChangeStatuses();
      this.setDisplayedColumns();
      this.setDisplayedButtons();
      this.saveToLocalStorage();
      this.setPaginationPageButtonsToCurrent();
      this.sortArrow = this.sortDirection === 'asc' ? 'arrow-up' : 'arrow-down';
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

    dialogRef.afterClosed().subscribe((result) => {
      setTimeout(() => this.filterByRegex(this.searchReg), 1000);
    });
  }

  sortData(columnToSort: string, direction: string) {
    if (columnToSort === 'name' && direction === 'asc') {
      this.selectedColumnToSort = '';
    } else {
      this.selectedColumnToSort = columnToSort;
    }
    this.sortColumn = columnToSort;
    this.sortDirection = direction;
    this.filterByRegex(this.searchReg);
  }

  selectColumnToSort(s: string) {
    this.selectedColumnToSort = s;
  }

  saveToLocalStorage() {
    window.localStorage.setItem('placesSortColumn', this.sortColumn);
    window.localStorage.setItem('placesSortDirection', this.sortDirection);
    window.localStorage.setItem('placesPage', String(this.page));
    window.localStorage.setItem('placesTotalItems', String(this.totalItems));
    window.localStorage.setItem('placesPageSize', String(this.pageSize));
    window.localStorage.setItem('placesStatus', String(this.status));
    window.localStorage.setItem('placesDefaultStatus', this.defaultStatus);
  }

  getFromLocalStorage() {
    if (window.localStorage.getItem('placesSortColumn') !== null) {
      this.sortColumn = window.localStorage.getItem('placesSortColumn');
      this.sortDirection = window.localStorage.getItem('placesSortDirection');
      this.page = Number(window.localStorage.getItem('placesPage'));
      this.totalItems = Number(window.localStorage.getItem('placesTotalItems'));
      this.pageSize = Number(window.localStorage.getItem('placesPageSize'));
      this.status = PlaceStatus[window.localStorage.getItem('placesStatus')];
      this.defaultStatus = window.localStorage.getItem('placesDefaultStatus');
    }
  }

  setPaginationPageButtonsToCurrent() {
    this.paginationComponent.selectPage(this.page);
  }
}
