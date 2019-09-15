import {Component, OnInit, ViewChild} from '@angular/core';
import '@angular/material/prebuilt-themes/deeppurple-amber.css';
import {UserForListDtoModel} from '../../../model/user/user-for-list-dto.model';
import {UserService} from '../../../service/user/user.service';
import {Title} from '@angular/platform-browser';
import {NgFlashMessageService} from 'ng-flash-messages';
import {MatSort, MatTableDataSource} from '@angular/material';
import {HttpErrorResponse} from '@angular/common/http';

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

  sortParam = '&sort=email';
  userEmail = this.userService.getUserEmail();
  displayedColumns: string[] = ['email', 'first_name', 'last_name', 'date_of_registration', 'role', 'block', 'deactivate'];

  constructor(
    private userService: UserService, private titleService: Title, private ngFlashMessageService: NgFlashMessageService) {
  }

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit() {
    this.getRoles();
    this.filterByRegex(this.sortParam);
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
      this.filterByRegex(this.sortParam);
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

  sortByFirstName(direction: string, active: string) {
    if (direction === 'asc') {
      this.sortParam = '&sort=' + active + ',ASC';
    } else if (direction === 'desc') {
      this.sortParam = '&sort=' + active + ',DESC';
    } else {
      this.sortParam = '&sort=email,ASC';
    }
    this.filterByRegex(this.sortParam);
  }

  sortData(e) {
    this.sortByFirstName(e.direction, e.active);
  }

  filterByRegex(sort: string) {
    this.userService.getByFilter(this.searchReg, this.getCurrentPaginationSettings(sort)).subscribe(res => {
      this.users = res.page;
      this.page = res.currentPage;
      this.totalItems = res.totalElements;
      this.dataSource.data = this.users;
    });
  }

  onKeydown() {
    if ((this.searchReg === undefined) || (this.searchReg === '')) {
      if (this.flag) {
        this.flag = false;
        this.filterByRegex(this.sortParam);
      }
    } else {
      this.flag = true;
      this.filterByRegex(this.sortParam);
    }
  }
}
