import {Component, OnInit, ViewChild} from '@angular/core';
import '@angular/material/prebuilt-themes/deeppurple-amber.css';
import {UserForListDtoModel} from '../../../model/user/user-for-list-dto.model';
import {UserService} from '../../../service/user/user.service';
import {Title} from '@angular/platform-browser';
import {NgFlashMessageService} from 'ng-flash-messages';
import {MatSort, MatTableDataSource} from '@angular/material';
import {HttpErrorResponse} from '@angular/common/http';
import {AdminService} from '../../../service/admin/admin.service';


export interface Role {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
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
  selectedDirectionToSort: string;

  sortParam = '&sort=' + this.adminService.staticSortColumn + ',' + this.adminService.staticSortDirection;
  userEmail = this.userService.getUserEmail();
  displayedColumns: string[] = ['email', 'firstName', 'lastName', 'dateOfRegistration', 'role', 'block', 'deactivate'];

  constructor(
    private userService: UserService, private titleService: Title, private ngFlashMessageService: NgFlashMessageService,
    private adminService: AdminService) {
  }

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit() {
    this.getRoles();
    console.log('1=' + this.adminService.staticSortColumn + ' 2=' + this.adminService.staticSortDirection);
    console.log('1=' + AdminService.sortColumn + ' 2=' + AdminService.sortDirection);

    this.sortData(this.adminService.staticSortColumn, this.adminService.staticSortDirection);
    this.titleService.setTitle('Admin - Users');
  }

  getCurrentPaginationSettings(sort: string): string {
    return '?page=' + (this.page) + '&size=' + this.pageSize + sort;
  }

  updateUserStatus(id: number, userStatus: string, email: string) {
    this.userService.updateUserStatus(id, userStatus).subscribe((data) => {
      this.successfulAction(email + ' is ' + data.userStatus);
      this.filterByRegex(this.sortParam);
    }, (error: HttpErrorResponse) => {
      this.errorMessage(error.error.message);
    });
  }

  getUsersByPage(sort: string) {
    this.userService.getAllUsers(this.getCurrentPaginationSettings(sort)).subscribe(res => {
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
    this.userService.updateUserRole(id, role).subscribe((data) => {
      this.successfulAction('Role for ' + email + ' is updated to ' + role.substr(5));
    }, (error: HttpErrorResponse) => {
      this.errorMessage(error.error.message);
      this.sortData(this.adminService.staticSortColumn, this.adminService.staticSortDirection);
    });
  }

  successfulAction(message: string) {
    this.ngFlashMessageService.showFlashMessage({
      messages: [message],
      dismissible: true,
      timeout: 3000,
      type: 'success'
    });
  }

  errorMessage(message: string) {
    this.ngFlashMessageService.showFlashMessage({
      messages: [message],
      dismissible: true,
      timeout: 3000,
      type: 'danger'
    });
  }

  getRoles() {
    this.userService.getRoles().subscribe(res => {
      this.roles = res.roles;
    });
  }


  selectColumnToSort(e) {
    this.selectedColumnToSort = e.active;
  }

  sortData(columnToSort: string, direction: string) {
    this.sortParam = '&sort=' + columnToSort + ',' + direction;
    this.selectedColumnToSort = columnToSort;
    this.selectedDirectionToSort = direction;
    this.filterByRegex(this.sortParam);
  }


  filterByRegex(sort: string) {
    console.log('in filterByRegex');
    console.log('sort=' + sort);
    console.log('sortc&d=' + AdminService.sortColumn + ' ' + AdminService.sortDirection);
    this.userService.getByFilter(this.searchReg, this.getCurrentPaginationSettings(sort)).subscribe(res => {
      this.users = res.page;
      this.page = res.currentPage;
      this.totalItems = res.totalElements;
      this.dataSource.data = this.users;
      AdminService.staticSortColumn = this.selectedColumnToSort;
      AdminService.staticSortDirection = this.selectedDirectionToSort;
      AdminService.sortDirection = this.selectedDirectionToSort;
      AdminService.sortColumn = this.selectedColumnToSort;
      console.log('sortc&d=' + AdminService.sortColumn + ' ' + AdminService.sortDirection);

    });
  }

  onKeydown() {
    if ((this.searchReg === undefined) || (this.searchReg === '')) {
      if (this.flag) {
        this.flag = false;
        this.sortData(this.selectedColumnToSort, this.selectedDirectionToSort);
      }
    } else {
      this.flag = true;
      this.sortData(this.selectedColumnToSort, this.selectedDirectionToSort);
    }
  }
}


