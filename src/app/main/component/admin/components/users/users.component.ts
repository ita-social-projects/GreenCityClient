import { Component, OnInit, ViewChild } from '@angular/core';
import { UserForListDtoModel } from '../../../../model/user/user-for-list-dto.model';
import { UserService } from '../../../../service/user/user.service';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';
import { PaginationComponent } from 'ngx-bootstrap/pagination';
import { JwtService } from '../../../../service/jwt/jwt.service';
import '@angular/material/prebuilt-themes/deeppurple-amber.css';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { MatSort } from '@angular/material/sort';
import { MatIconRegistry } from '@angular/material/icon';

export interface Role {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: UserForListDtoModel[];
  pageSize = 5;
  page = 0;
  totalItems: number;
  dataSource = new MatTableDataSource<UserForListDtoModel>();
  roles: Role[];
  searchReg: string;
  flag = true;
  selectedColumnToSort: string;
  sortColumn = 'email';
  sortDirection = 'asc';
  sortParam = '&sort=' + this.sortColumn + ',' + this.sortDirection;
  userEmail: string;
  displayedColumns: string[] = ['email', 'firstName', 'lastName', 'dateOfRegistration', 'role', 'block', 'deactivate'];
  maxSizePagination = 6;
  sortArrow: string;
  @ViewChild('paginationElement') paginationComponent: PaginationComponent;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private userService: UserService,
    private titleService: Title,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private jwtService: JwtService
  ) {
    this.userEmail = jwtService.getEmailFromAccessToken();
    iconRegistry.addSvgIcon('arrow-up', sanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/arrows/arrow-up-bold.svg'));
    iconRegistry.addSvgIcon('arrow-down', sanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/arrows/arrow-down-bold.svg'));
  }

  ngOnInit() {
    this.getFromLocalStorage();
    this.getRoles();
    this.sortParam = '&sort=' + this.sortColumn + ',' + this.sortDirection;
    this.sortData(this.sortColumn, this.sortDirection);
    this.titleService.setTitle('Admin - Users');
  }

  getCurrentPaginationSettings(sort: string): string {
    return '?page=' + this.page + '&size=' + this.pageSize + '&sort=' + this.sortColumn + ',' + this.sortDirection;
  }

  updateUserStatus(id: number, userStatus: string, email: string) {
    this.userService.updateUserStatus(id, userStatus).subscribe(
      (data) => {
        this.successfulAction(email + ' is ' + data.userStatus);
        this.filterByRegex(this.sortParam);
      },
      (error: HttpErrorResponse) => {
        this.errorMessage(error.error.message);
      }
    );
  }

  getUsersByPage(sort: string) {
    this.userService.getAllUsers(this.getCurrentPaginationSettings(sort)).subscribe((res) => {
      this.users = res.page;
      this.page = res.currentPage;
      this.totalItems = res.totalElements;
      this.dataSource.data = this.users;
    });
  }

  changePage(event: any) {
    this.page = event.page - 1;
    this.filterByRegex(this.sortParam);
  }

  changeRole(id: number, role: string, email: string) {
    this.userService.updateUserRole(id, role).subscribe(
      (data) => {
        this.successfulAction('Role for ' + email + ' is updated to ' + role.substr(5));
      },
      (error: HttpErrorResponse) => {
        this.errorMessage(error.error.message);
        this.sortData(this.sortColumn, this.sortDirection);
      }
    );
  }

  successfulAction(message: string) {
    // TODO: add functionality to this method
  }

  errorMessage(message: string) {
    // TODO: add functionality to this method
  }

  getRoles() {
    this.userService.getRoles().subscribe((res) => {
      this.roles = res.roles;
    });
  }

  selectColumnToSort(s: string) {
    this.selectedColumnToSort = s;
  }

  sortData(columnToSort: string, direction: string) {
    if (columnToSort === 'email' && direction === 'asc') {
      this.selectedColumnToSort = '';
    }
    this.sortParam = '&sort=' + columnToSort + ',' + direction;
    this.sortColumn = columnToSort;
    this.sortDirection = direction;
    this.sortArrow = this.sortDirection === 'asc' ? 'arrow-up' : 'arrow-down';
    this.filterByRegex(this.sortParam);
  }

  filterByRegex(sort: string) {
    this.userService.getByFilter(this.searchReg, this.getCurrentPaginationSettings(sort)).subscribe((res) => {
      this.users = res.page;
      this.page = res.currentPage;
      this.totalItems = res.totalElements;
      this.dataSource.data = this.users;
      this.saveToLocalStorage();
      this.setPaginationPageButtonsToCurrent();
    });
  }

  onKeydown() {
    if (this.searchReg === undefined || this.searchReg === '') {
      if (this.flag) {
        this.flag = false;
        this.sortData(this.sortColumn, this.sortDirection);
      }
    } else {
      this.flag = true;
      this.sortData(this.sortColumn, this.sortDirection);
    }
  }

  saveToLocalStorage() {
    window.localStorage.setItem('usersSortColumn', this.sortColumn);
    window.localStorage.setItem('usersSortDirection', this.sortDirection);
    window.localStorage.setItem('usersPage', String(this.page));
    window.localStorage.setItem('usersTotalItems', String(this.totalItems));
    window.localStorage.setItem('usersPageSize', String(this.pageSize));
  }

  getFromLocalStorage() {
    if (window.localStorage.getItem('usersSortColumn') !== null) {
      this.sortColumn = window.localStorage.getItem('usersSortColumn');
      this.sortDirection = window.localStorage.getItem('usersSortDirection');
      this.page = Number(window.localStorage.getItem('usersPage'));
      this.totalItems = Number(window.localStorage.getItem('usersTotalItems'));
      this.pageSize = Number(window.localStorage.getItem('usersPageSize'));
      if (this.sortColumn !== 'email') {
        this.selectedColumnToSort = this.sortColumn;
      }
    }
  }

  setPaginationPageButtonsToCurrent() {
    this.paginationComponent.selectPage(this.page + 1);
  }
}
